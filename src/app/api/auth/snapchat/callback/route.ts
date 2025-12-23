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
    let stateData;
    try {
      stateData = JSON.parse(Buffer.from(state, 'base64').toString());
    } catch (e) {
      console.error('Failed to decode state:', e);
      return NextResponse.redirect(
        new URL('/?error=invalid_state', request.url)
      );
    }

    const { storeName, storeUrl } = stateData;

    // الحصول على access token من Snapchat
    let tokenData;
    try {
      tokenData = await exchangeCodeForToken(code);
    } catch (e) {
      console.error('Failed to exchange code for token:', e);
      return NextResponse.redirect(
        new URL('/?error=token_exchange_failed', request.url)
      );
    }

    // الحصول على Ad Accounts
    let adAccounts;
    try {
      adAccounts = await getAdAccounts(tokenData.access_token);
    } catch (e) {
      console.error('Failed to get ad accounts:', e);
      // حتى لو فشل، نكمل بدون ad account
      adAccounts = [];
    }

    const primaryAdAccount = adAccounts.length > 0 ? adAccounts[0] : null;

    // إنشاء المتجر في قاعدة البيانات
    const storeResult = await db.execute(sql`
      INSERT INTO stores (store_name, store_url)
      VALUES (${storeName}, ${storeUrl || null})
      RETURNING id
    `);

    const storeId = (storeResult.rows[0] as any).id;

    // حفظ اتصال Snapchat إذا كان هناك ad account
    if (primaryAdAccount) {
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in);

      await db.execute(sql`
        INSERT INTO snap_connections (store_id, ad_account_id, access_token, refresh_token, token_expires_at, is_active)
        VALUES (${storeId}, ${primaryAdAccount.id}, ${encrypt(tokenData.access_token)}, ${encrypt(tokenData.refresh_token)}, ${expiresAt}, ${true})
      `);
    }

    // التوجيه إلى صفحة نجاح بسيطة
    return NextResponse.redirect(
      new URL(`/success?store=${encodeURIComponent(storeName)}`, request.url)
    );
  } catch (error) {
    console.error('Snapchat OAuth error:', error);
    return NextResponse.redirect(
      new URL('/?error=connection_failed&details=' + encodeURIComponent(String(error)), request.url)
    );
  }
}
