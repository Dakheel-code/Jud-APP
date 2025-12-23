import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const clientId = process.env.SNAPCHAT_CLIENT_ID;
  const redirectUri = process.env.SNAPCHAT_REDIRECT_URI;
  const scope = 'snapchat-marketing-api';

  const authUrl = `https://accounts.snapchat.com/login/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri!
  )}&response_type=code&scope=${scope}&state=${session.storeId}`;

  return NextResponse.redirect(authUrl);
}
