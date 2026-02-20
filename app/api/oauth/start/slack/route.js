import { NextResponse } from "next/server";
import { getOAuthConfig } from "../../utils";

export const runtime = "nodejs";

export async function GET(req) {
  const searchParams = new URL(req.url).searchParams;
  const { clientId, redirectUri, scopes } = await getOAuthConfig("slack", searchParams);

  if (!clientId) {
    return NextResponse.json({ error: "Missing SLACK_CLIENT_ID" }, { status: 500 });
  }

  const authUrl = new URL("https://slack.com/oauth/v2/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", scopes || "users:read");
  authUrl.searchParams.set("response_type", "code");

  return NextResponse.redirect(authUrl.toString());
}
