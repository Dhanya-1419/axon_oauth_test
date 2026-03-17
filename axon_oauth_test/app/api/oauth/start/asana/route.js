import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.ASANA_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/oauth/callback/asana`;
  
  // Asana OAuth scopes for API access
  const scopes = process.env.ASANA_SCOPES || "default";

  if (!clientId) {
    return NextResponse.json({ error: "Missing ASANA_CLIENT_ID" }, { status: 500 });
  }

  const authUrl = new URL("https://app.asana.com/-/oauth_authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", scopes);
  authUrl.searchParams.set("state", Math.random().toString(36).substring(7)); // Random state for security

  return NextResponse.redirect(authUrl.toString());
}
