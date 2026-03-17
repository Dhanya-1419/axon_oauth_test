import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.CLICKUP_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/oauth/callback/clickup`;
  
  // ClickUp OAuth scopes for API access
  const scopes = process.env.CLICKUP_SCOPES || "team:read task:read";

  if (!clientId) {
    return NextResponse.json({ error: "Missing CLICKUP_CLIENT_ID" }, { status: 500 });
  }

  const authUrl = new URL("https://app.clickup.com/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", scopes);

  return NextResponse.redirect(authUrl.toString());
}
