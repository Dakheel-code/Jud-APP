import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { snapConnections } from '@/db/schema';
import { getSession } from '@/lib/auth';
import { exchangeCodeForToken, getAdAccounts } from '@/lib/snapchat';
import { encrypt } from '@/lib/encryption';

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code || state !== session.storeId) {
    return NextResponse.redirect(
      new URL('/dashboard?error=invalid_callback', request.url)
    );
  }

  try {
    const tokenData = await exchangeCodeForToken(code);
    const adAccounts = await getAdAccounts(tokenData.access_token);

    if (adAccounts.length === 0) {
      return NextResponse.redirect(
        new URL('/dashboard?error=no_ad_accounts', request.url)
      );
    }

    const primaryAdAccount = adAccounts[0];

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + tokenData.expires_in);

    await db.insert(snapConnections).values({
      storeId: session.storeId,
      adAccountId: primaryAdAccount.id,
      accessToken: encrypt(tokenData.access_token),
      refreshToken: encrypt(tokenData.refresh_token),
      tokenExpiresAt: expiresAt,
      isActive: true,
    });

    return NextResponse.redirect(
      new URL('/dashboard?success=snapchat_connected', request.url)
    );
  } catch (error) {
    console.error('Snapchat OAuth error:', error);
    return NextResponse.redirect(
      new URL('/dashboard?error=connection_failed', request.url)
    );
  }
}
