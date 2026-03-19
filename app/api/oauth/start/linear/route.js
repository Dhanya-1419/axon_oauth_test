import { NextResponse } from "next/server";
import { getOAuthConfig } from "../../utils";

export const runtime = "nodejs";

export async function GET(req) {
  const searchParams = new URL(req.url).searchParams;
  const { clientId, redirectUri, scopes } = await getOAuthConfig("linear", searchParams, req);

  if (!clientId) {
    return NextResponse.json({ error: "Linear client ID not configured" }, { status: 500 });
  }

  const authUrl = new URL("https://linear.app/oauth/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", scopes || "read,write");
  authUrl.searchParams.set("state", Math.random().toString(36).substring(7));
  authUrl.searchParams.set("actor", "application");

  return NextResponse.redirect(authUrl.toString());
}
