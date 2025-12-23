import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { stores, snapConnections } from '@/db/schema';
import { exchangeCodeForToken, getAdAccounts } from '@/lib/snapchat';
import { encrypt } from '@/lib/encryption';
import { sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code || !state) {
    return NextResponse.redirect(
      new URL('/?error=invalid_callback', request.url)
    );
  }

  try {
    // فك تشفير بيانات المتجر من state
    const stateData = JSON.parse(Buffer.from(state, 'base64').toString());
    const { storeName, storeUrl } = stateData;

    const tokenData = await exchangeCodeForToken(code);
    const adAccounts = await getAdAccounts(tokenData.access_token);

    if (adAccounts.length === 0) {
      return NextResponse.redirect(
        new URL('/?error=no_ad_accounts', request.url)
      );
    }

    const primaryAdAccount = adAccounts[0];

    // إنشاء المتجر في قاعدة البيانات
    const [store] = await db.execute(sql`
      INSERT INTO stores (store_name, store_url)
      VALUES (${storeName}, ${storeUrl || null})
      RETURNING id
    `);

    const storeId = (store as any).id;

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in);

    // حفظ اتصال Snapchat
    await db.execute(sql`
      INSERT INTO snap_connections (store_id, ad_account_id, access_token, refresh_token, token_expires_at, is_active)
      VALUES (${storeId}, ${primaryAdAccount.id}, ${encrypt(tokenData.access_token)}, ${encrypt(tokenData.refresh_token)}, ${expiresAt}, ${true})
    `);

    return NextResponse.redirect(
      new URL(`/dashboard/${storeId}?success=snapchat_connected`, request.url)
    );
  } catch (error) {
    console.error('Snapchat OAuth error:', error);
    return NextResponse.redirect(
      new URL('/?error=connection_failed', request.url)
    );
  }
}
