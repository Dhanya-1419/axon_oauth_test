import { NextResponse } from "next/server";
import { getOAuthConfig, generatePKCE } from "../../utils";

export const runtime = "nodejs";

export async function GET(req) {
  const searchParams = new URL(req.url).searchParams;
  const { clientId, redirectUri, scopes } = await getOAuthConfig("calendly", searchParams, req);

  if (!clientId) {
    return NextResponse.json({ error: "Missing CALENDLY_CLIENT_ID or manual config" }, { status: 500 });
  }

  const { verifier, challenge } = generatePKCE();

  const authUrl = new URL("https://auth.calendly.com/oauth/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", scopes || "default");
  authUrl.searchParams.set("code_challenge", challenge);
  authUrl.searchParams.set("code_challenge_method", "S256");
  
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  authUrl.searchParams.set("state", Math.random().toString(36).substring(7));

  const response = NextResponse.redirect(authUrl.toString());
  
  // Store verifier in a cookie for 10 minutes
  response.cookies.set("calendly_code_verifier", verifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  return response;
}
