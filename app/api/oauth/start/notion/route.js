import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.NOTION_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/oauth/callback/notion`;
  
  // Notion OAuth scopes for API access
  const scopes = process.env.NOTION_SCOPES || "";

  if (!clientId) {
    return NextResponse.json({ error: "Missing NOTION_CLIENT_ID" }, { status: 500 });
  }

  const authUrl = new URL(process.env.NOTION_AUTH_URL || "https://api.notion.com/v1/oauth/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("owner", "user");
  
  if (scopes) {
    authUrl.searchParams.set("scope", scopes);
  }

  return NextResponse.redirect(authUrl.toString());
}
