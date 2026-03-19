import { NextResponse } from "next/server";
import { getOAuthConfig, generatePKCE } from "../../utils";

export const runtime = "nodejs";

export async function GET(req) {
  const searchParams = new URL(req.url).searchParams;
  const { clientId, redirectUri, scopes } = await getOAuthConfig("airtable", searchParams, req);

  if (!clientId) {
    return NextResponse.json({ error: "Missing AIRTABLE_CLIENT_ID or manual config" }, { status: 500 });
  }

  // Airtable REQUIRES PKCE
  const { verifier, challenge } = generatePKCE();
  console.log("Airtable Start: verifier =", verifier, "challenge =", challenge);
  
  const authUrl = new URL("https://airtable.com/oauth2/v1/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", scopes || "data.records:read data.records:write schema.bases:read");
  authUrl.searchParams.set("code_challenge", challenge);
  authUrl.searchParams.set("code_challenge_method", "S256");
  authUrl.searchParams.set("state", Math.random().toString(36).substring(7));
  authUrl.searchParams.set("prompt", "consent");

  const response = NextResponse.redirect(authUrl.toString());

  // Store verifier in a cookie for 10 minutes
  response.cookies.set("airtable_code_verifier", verifier, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  return response;
}
