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

  const tiktokAuthUrl = new URL('https://business-api.tiktok.com/portal/auth');
  tiktokAuthUrl.searchParams.set('app_id', process.env.TIKTOK_CLIENT_KEY!);
  tiktokAuthUrl.searchParams.set('redirect_uri', process.env.TIKTOK_REDIRECT_URI!);
  tiktokAuthUrl.searchParams.set('state', state);

  return NextResponse.redirect(tiktokAuthUrl.toString());
}
