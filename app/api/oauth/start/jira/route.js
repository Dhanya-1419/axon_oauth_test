import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.ATLASSIAN_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/oauth/callback/jira`;
  
  // Jira OAuth 2.0 scopes for API access
  const scopes = process.env.JIRA_SCOPES || "read:jira-work read:jira-user read:account read:me";

  if (!clientId) {
    return NextResponse.json({ error: "Missing ATLASSIAN_CLIENT_ID" }, { status: 500 });
  }

  const authUrl = new URL("https://auth.atlassian.com/authorize");
  authUrl.searchParams.set("audience", "api.atlassian.com");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("scope", scopes);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("prompt", "consent");

  return NextResponse.redirect(authUrl.toString());
}
