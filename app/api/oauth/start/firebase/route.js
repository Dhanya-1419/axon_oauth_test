import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const clientId = process.env.FIREBASE_CLIENT_ID;

    if (!clientId) {
      return NextResponse.json({ 
        error: "Firebase client ID not configured" 
      }, { status: 400 });
    }

    const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/oauth/callback/firebase`;
    
    // Generate state parameter for security
    const state = Math.random().toString(36).substring(2, 15);
    
    // Store state in memory (in production, use Redis or database)
    if (!global.firebaseStates) {
      global.firebaseStates = {};
    }
    global.firebaseStates[state] = {
      timestamp: Date.now(),
      redirectUri
    };

    // Firebase OAuth endpoints
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid email profile');
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('prompt', 'consent');

    return NextResponse.redirect(authUrl.toString());

  } catch (error) {
    console.error('Firebase OAuth start error:', error);
    return NextResponse.json({ 
      error: "Internal server error" 
    }, { status: 500 });
  }
}
