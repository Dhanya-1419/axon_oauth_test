import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?oauth_error=${encodeURIComponent(error)}`);
    }

    if (!code || !state) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?oauth_error=missing_parameters`);
    }

    // Verify state
    if (!global.firebaseStates || !global.firebaseStates[state]) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?oauth_error=invalid_state`);
    }

    const clientId = process.env.FIREBASE_CLIENT_ID;
    const clientSecret = process.env.FIREBASE_CLIENT_SECRET;
    const redirectUri = global.firebaseStates[state].redirectUri;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?oauth_error=firebase_client_credentials_missing`);
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Firebase token exchange error:', tokenData);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?oauth_error=token_exchange_failed`);
    }

    // Get user info from Google
    const userResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (!userResponse.ok) {
      console.error('Firebase user info error:', userData);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?oauth_error=user_info_failed`);
    }

    // Store tokens in memory (in production, use database)
    if (!global.firebaseTokens) {
      global.firebaseTokens = {};
    }

    const userId = userData.id || userData.email;
    global.firebaseTokens[userId] = {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: Date.now() + (tokenData.expires_in * 1000),
      user: userData,
      created_at: Date.now()
    };

    // Clean up state
    delete global.firebaseStates[state];

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?oauth_success=firebase`);

  } catch (error) {
    console.error('Firebase OAuth callback error:', error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?oauth_error=server_error`);
  }
}
