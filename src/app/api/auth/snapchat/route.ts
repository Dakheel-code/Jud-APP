import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const storeName = searchParams.get('storeName');
  const storeUrl = searchParams.get('storeUrl');

  if (!storeName) {
    return NextResponse.redirect(new URL('/?error=missing_store_info', request.url));
  }

  // حفظ بيانات المتجر في state parameter (مشفرة)
  const stateData = JSON.stringify({ storeName, storeUrl });
  const state = Buffer.from(stateData).toString('base64');

  const snapchatAuthUrl = new URL('https://accounts.snapchat.com/login/oauth2/authorize');
  snapchatAuthUrl.searchParams.set('client_id', process.env.SNAPCHAT_CLIENT_ID!);
  snapchatAuthUrl.searchParams.set('redirect_uri', process.env.SNAPCHAT_REDIRECT_URI!);
  snapchatAuthUrl.searchParams.set('response_type', 'code');
  snapchatAuthUrl.searchParams.set('scope', 'snapchat-marketing-api');
  snapchatAuthUrl.searchParams.set('state', state);

  return NextResponse.redirect(snapchatAuthUrl.toString());
}
