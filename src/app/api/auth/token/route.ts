import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: '授权码是必需的' },
        { status: 400 }
      );
    }

    const clientId = process.env.ZOHO_CLIENT_ID;
    const clientSecret = process.env.ZOHO_CLIENT_SECRET;
    const redirectUri = 'http://localhost:3000/api/auth/callback';

    const response = await fetch(
      'https://accounts.zoho.com/oauth/v2/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          code,
          client_id: clientId!,
          client_secret: clientSecret!,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      }
    );

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    return NextResponse.json({
      refresh_token: data.refresh_token,
      access_token: data.access_token,
    });
  } catch (error) {
    console.error('Token error:', error);
    return NextResponse.json(
      { error: '获取令牌失败' },
      { status: 500 }
    );
  }
}
