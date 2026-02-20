import { NextResponse } from "next/server";
import { getOAuthConfig } from "../../utils";

export const runtime = "nodejs";

export async function GET(req) {
  const searchParams = new URL(req.url).searchParams;
  const { clientId, redirectUri, scopes } = await getOAuthConfig("google", searchParams);

  if (!clientId) {
    return NextResponse.json({ error: "Missing GOOGLE_CLIENT_ID" }, { status: 500 });
  }

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", scopes || "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile");
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");

  return NextResponse.redirect(authUrl.toString());
}
