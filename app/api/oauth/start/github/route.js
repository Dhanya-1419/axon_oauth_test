import { NextResponse } from "next/server";
import { getOAuthConfig } from "../../utils";

export const runtime = "nodejs";

export async function GET(req) {
  const searchParams = new URL(req.url).searchParams;
  const { clientId, redirectUri, scopes } = await getOAuthConfig("github", searchParams, req);

  if (!clientId) {
    return NextResponse.json({ error: "Missing GITHUB_CLIENT_ID or manual config" }, { status: 500 });
  }

  const authUrl = new URL("https://github.com/login/oauth/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  if (scopes) authUrl.searchParams.set("scope", scopes);
  
  
  
  

  return NextResponse.redirect(authUrl.toString());
}
