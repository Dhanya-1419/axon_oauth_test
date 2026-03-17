import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.TRELLO_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/oauth/callback/trello`;

  if (!clientId) {
    return NextResponse.json({ error: "Trello client ID not configured" }, { status: 500 });
  }

  // Generate a random state for security
  const state = Math.random().toString(36).substring(2, 15);
  
  // Store state temporarily (in production, use Redis or database)
  global.trelloOAuthState = global.trelloOAuthState || {};
  global.trelloOAuthState[state] = Date.now();

  const trelloAuthUrl = new URL("https://trello.com/1/authorize");
  trelloAuthUrl.searchParams.append("client_id", clientId);
  trelloAuthUrl.searchParams.append("redirect_uri", redirectUri);
  trelloAuthUrl.searchParams.append("response_type", "code");
  trelloAuthUrl.searchParams.append("scope", "read,write");
  trelloAuthUrl.searchParams.append("state", state);
  trelloAuthUrl.searchParams.append("expiration", "1hour");
  trelloAuthUrl.searchParams.append("name", "Axon OAuth Tester");
  trelloAuthUrl.searchParams.append("key", clientId);

  return NextResponse.redirect(trelloAuthUrl.toString());
}
