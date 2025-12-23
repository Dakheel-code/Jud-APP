import { NextRequest, NextResponse } from 'next/server';
import { exchangeTikTokCodeForToken, getTikTokAdvertisers } from '@/lib/tiktok';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('auth_code');
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
    const tokenData = await exchangeTikTokCodeForToken(code);

    // الحصول على Advertisers (Ad Accounts)
    const advertisers = await getTikTokAdvertisers(tokenData.access_token);

    if (!advertisers || advertisers.length === 0) {
      return NextResponse.redirect(
        new URL('/?error=no_ad_accounts', request.url)
      );
    }

    // إنشاء بيانات الجلسة مع جميع الحسابات الإعلانية
    const sessionData = {
      storeName,
      storeUrl,
      accessToken: tokenData.access_token,
      adAccounts: advertisers.map((acc: any) => ({
        id: acc.advertiser_id,
        name: acc.advertiser_name,
        status: 'ACTIVE'
      })),
      selectedAdAccountId: advertisers[0].advertiser_id,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };

    // حفظ البيانات في HTML response مع script لحفظها في localStorage
    const html = `
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>جاري التحميل...</title>
        <style>
          body {
            font-family: 'Cairo', sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
          }
          .loader {
            text-align: center;
          }
          .spinner {
            border: 4px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top: 4px solid white;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="loader">
          <div class="spinner"></div>
          <p>جاري تحميل حساباتك الإعلانية من TikTok...</p>
        </div>
        <script>
          const sessionData = ${JSON.stringify(sessionData)};
          localStorage.setItem('tiktok_session', JSON.stringify(sessionData));
          window.location.href = '/select-account?platform=tiktok';
        </script>
      </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('TikTok OAuth error:', error);
    return NextResponse.redirect(
      new URL('/?error=connection_failed&details=' + encodeURIComponent(String(error)), request.url)
    );
  }
}
