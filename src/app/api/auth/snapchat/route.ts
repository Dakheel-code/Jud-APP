import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { stores } from '@/db/schema';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const storeName = searchParams.get('storeName');
  const storeUrl = searchParams.get('storeUrl');

  if (!storeName) {
    return NextResponse.redirect(new URL('/?error=missing_store_info', request.url));
  }

  try {
    const [store] = await db.insert(stores).values({
      storeName: storeName,
      storeUrl: storeUrl || null,
    }).returning();

    const snapchatAuthUrl = new URL('https://accounts.snapchat.com/login/oauth2/authorize');
    snapchatAuthUrl.searchParams.set('client_id', process.env.SNAPCHAT_CLIENT_ID!);
    snapchatAuthUrl.searchParams.set('redirect_uri', process.env.SNAPCHAT_REDIRECT_URI!);
    snapchatAuthUrl.searchParams.set('response_type', 'code');
    snapchatAuthUrl.searchParams.set('scope', 'snapchat-marketing-api');
    snapchatAuthUrl.searchParams.set('state', store.id);

    return NextResponse.redirect(snapchatAuthUrl.toString());
  } catch (error) {
    console.error('Error creating store:', error);
    return NextResponse.redirect(new URL('/?error=store_creation_failed', request.url));
  }
}
