import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.SIGNNOW_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/oauth/callback/signnow`;

  if (!clientId) {
    return NextResponse.json({ error: "SignNow client ID not configured" }, { status: 500 });
  }

  // Generate a random state for security
  const state = Math.random().toString(36).substring(2, 15);
  
  // Store state temporarily (in production, use Redis or database)
  global.signNowOAuthState = global.signNowOAuthState || {};
  global.signNowOAuthState[state] = Date.now();

  const signNowAuthUrl = new URL("https://c-api.signnow.com/oauth2/authorize");
  signNowAuthUrl.searchParams.append("client_id", clientId);
  signNowAuthUrl.searchParams.append("redirect_uri", redirectUri);
  signNowAuthUrl.searchParams.append("response_type", "code");
  signNowAuthUrl.searchParams.append("scope", "user user:document user:template user:group user:invite");
  signNowAuthUrl.searchParams.append("state", state);

  return NextResponse.redirect(signNowAuthUrl.toString());
}
