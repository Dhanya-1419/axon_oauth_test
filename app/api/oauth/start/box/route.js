import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.BOX_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/oauth/callback/box`;
  
  // Box OAuth scopes for API access
  const scopes = process.env.BOX_SCOPES || "root_readwrite";

  if (!clientId) {
    return NextResponse.json({ error: "Missing BOX_CLIENT_ID" }, { status: 500 });
  }

  const authUrl = new URL("https://account.box.com/api/oauth2/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("response_mode", "query");
  
  if (scopes) {
    authUrl.searchParams.set("scope", scopes);
  }

  return NextResponse.redirect(authUrl.toString());
}
