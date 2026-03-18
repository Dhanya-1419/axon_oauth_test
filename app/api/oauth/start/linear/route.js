import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.LINEAR_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/oauth/callback/linear`;

  if (!clientId) {
    return NextResponse.json({ error: "Linear client ID not configured" }, { status: 500 });
  }

  // Generate a random state for security
  const state = Math.random().toString(36).substring(2, 15);
  
  // Store state temporarily (in production, use Redis or database)
  global.linearOAuthState = global.linearOAuthState || {};
  global.linearOAuthState[state] = Date.now();

  const linearAuthUrl = new URL("https://linear.app/oauth/authorize");
  linearAuthUrl.searchParams.append("client_id", clientId);
  linearAuthUrl.searchParams.append("redirect_uri", redirectUri);
  linearAuthUrl.searchParams.append("response_type", "code");
  linearAuthUrl.searchParams.append("scope", "read,write");
  linearAuthUrl.searchParams.append("state", state);
  linearAuthUrl.searchParams.append("actor", "application");

  return NextResponse.redirect(linearAuthUrl.toString());
}
