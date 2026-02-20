import { NextResponse } from "next/server";
import { getOAuthConfig } from "../../utils";

export const runtime = "nodejs";

export async function GET(req) {
  const searchParams = new URL(req.url).searchParams;
  const { clientId, redirectUri, scopes } = await getOAuthConfig("airtable", searchParams, req);

  if (!clientId) {
    return NextResponse.json({ error: "Missing AIRTABLE_CLIENT_ID or manual config" }, { status: 500 });
  }

  const authUrl = new URL("https://airtable.com/oauth2/v1/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  if (scopes) authUrl.searchParams.set("scope", scopes);
  
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  authUrl.searchParams.set("state", Math.random().toString(36).substring(7));

  return NextResponse.redirect(authUrl.toString());
}
