import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.INTERCOM_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/oauth/callback/intercom`;

  if (!clientId) {
    return NextResponse.json({ error: "Intercom client ID not configured" }, { status: 500 });
  }

  // Generate a random state for security
  const state = Math.random().toString(36).substring(2, 15);
  
  // Store state temporarily (in production, use Redis or database)
  global.intercomOAuthState = global.intercomOAuthState || {};
  global.intercomOAuthState[state] = Date.now();

  const intercomAuthUrl = new URL("https://app.intercom.com/oauth");
  intercomAuthUrl.searchParams.append("client_id", clientId);
  intercomAuthUrl.searchParams.append("redirect_uri", redirectUri);
  intercomAuthUrl.searchParams.append("response_type", "code");
  intercomAuthUrl.searchParams.append("scope", "users.read admins.read conversations.read conversations.write");
  intercomAuthUrl.searchParams.append("state", state);

  return NextResponse.redirect(intercomAuthUrl.toString());
}
