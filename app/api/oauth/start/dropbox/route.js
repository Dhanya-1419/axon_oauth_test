import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.DROPBOX_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/oauth/callback/dropbox`;
  
  // Dropbox OAuth scopes for API access
  const scopes = process.env.DROPBOX_SCOPES || "account_info.read";

  if (!clientId) {
    return NextResponse.json({ error: "Missing DROPBOX_CLIENT_ID" }, { status: 500 });
  }

  const authUrl = new URL("https://www.dropbox.com/oauth2/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("token_access_type", "offline");
  
  if (scopes) {
    authUrl.searchParams.set("scope", scopes);
  }

  return NextResponse.redirect(authUrl.toString());
}
