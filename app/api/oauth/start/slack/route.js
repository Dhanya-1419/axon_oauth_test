import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.SLACK_CLIENT_ID;
  const redirectUri = `http://localhost:3000/api/oauth/callback/slack`;
  const scopes = process.env.SLACK_SCOPES || "users:read";

  if (!clientId) {
    return NextResponse.json({ error: "Missing SLACK_CLIENT_ID" }, { status: 500 });
  }

  const authUrl = new URL("https://slack.com/oauth/v2/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", scopes);
  authUrl.searchParams.set("response_type", "code");

  return NextResponse.redirect(authUrl.toString());
}
