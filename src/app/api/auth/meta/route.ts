import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const storeName = searchParams.get('storeName');
  const storeUrl = searchParams.get('storeUrl');

  if (!storeName) {
    return NextResponse.redirect(new URL('/?error=missing_store_info', request.url));
  }

  const stateData = JSON.stringify({ storeName, storeUrl });
  const state = Buffer.from(stateData).toString('base64');

  const metaAuthUrl = new URL('https://www.facebook.com/v18.0/dialog/oauth');
  metaAuthUrl.searchParams.set('client_id', process.env.META_APP_ID!);
  metaAuthUrl.searchParams.set('redirect_uri', process.env.META_REDIRECT_URI!);
  metaAuthUrl.searchParams.set('state', state);
  metaAuthUrl.searchParams.set('scope', 'public_profile,email');
  metaAuthUrl.searchParams.set('response_type', 'code');

  return NextResponse.redirect(metaAuthUrl.toString());
}
