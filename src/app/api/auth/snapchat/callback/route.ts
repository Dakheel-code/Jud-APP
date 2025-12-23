import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, getAdAccounts } from '@/lib/snapchat';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code || !state) {
    return NextResponse.redirect(
      new URL('/?error=missing_parameters', request.url)
    );
  }

  try {
    // فك تشفير بيانات المتجر من state
    const storeData = JSON.parse(Buffer.from(state, 'base64').toString('utf8'));
    const { storeName, storeUrl } = storeData;

    // تبديل code بـ access token
    const tokenData = await exchangeCodeForToken(code);

    // الحصول على Ad Accounts
    const adAccounts = await getAdAccounts(tokenData.access_token);

    if (!adAccounts || adAccounts.length === 0) {
      return NextResponse.redirect(
        new URL('/?error=no_ad_accounts', request.url)
      );
    }

    // إنشاء بيانات الجلسة مع جميع الحسابات الإعلانية
    const sessionData = {
      storeName,
      storeUrl,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      adAccounts: adAccounts.map(acc => ({
        id: acc.id,
        name: acc.name,
        status: acc.status
      })),
      selectedAdAccountId: adAccounts[0].id, // الحساب الافتراضي
      expiresAt: new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
    };

    // تشفير البيانات وإرسالها كـ query parameter مع UTF-8
    const encodedSession = Buffer.from(JSON.stringify(sessionData), 'utf8').toString('base64');

    // التوجيه إلى صفحة اختيار الحساب الإعلاني
    return NextResponse.redirect(
      new URL(`/select-account?session=${encodedSession}`, request.url)
    );
  } catch (error) {
    console.error('Snapchat OAuth error:', error);
    return NextResponse.redirect(
      new URL('/?error=connection_failed&details=' + encodeURIComponent(String(error)), request.url)
    );
  }
}
