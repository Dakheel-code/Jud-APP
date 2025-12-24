import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForToken, getLongLivedToken, getAdAccounts } from '@/lib/meta';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      console.error('Meta OAuth error:', error);
      return NextResponse.redirect(
        new URL(`/?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL('/?error=missing_code_or_state', request.url)
      );
    }

    const stateData = JSON.parse(Buffer.from(state, 'base64').toString('utf8'));
    const { storeName, storeUrl } = stateData;

    const tokenResponse = await exchangeCodeForToken(code);
    const longLivedToken = await getLongLivedToken(tokenResponse.access_token);
    
    const adAccounts = await getAdAccounts(longLivedToken.access_token);

    if (adAccounts.length === 0) {
      return NextResponse.redirect(
        new URL('/?error=no_ad_accounts', request.url)
      );
    }

    const sessionData = {
      storeName,
      storeUrl,
      accessToken: longLivedToken.access_token,
      adAccounts: adAccounts.map((acc) => ({
        id: acc.id,
        name: acc.name,
        account_id: acc.account_id,
        status: acc.account_status === 1 ? 'ACTIVE' : 'INACTIVE',
        currency: acc.currency,
      })),
      selectedAdAccountId: adAccounts[0].id,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
    };

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
            background: linear-gradient(135deg, #1877f2 0%, #0a66c2 100%);
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
          <p>جاري تحميل حساباتك الإعلانية من Meta...</p>
        </div>
        <script>
          const sessionData = ${JSON.stringify(sessionData)};
          localStorage.setItem('meta_session', JSON.stringify(sessionData));
          window.location.href = '/select-account?platform=meta';
        </script>
      </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error: any) {
    console.error('Error in Meta callback:', error);
    return NextResponse.redirect(
      new URL(`/?error=connection_failed&details=${encodeURIComponent(error.message)}`, request.url)
    );
  }
}
