import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.SALESFORCE_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/oauth/callback/salesforce`;
  const scopes = process.env.SALESFORCE_SCOPES || "api refresh_token";

  if (!clientId) {
    return NextResponse.json({ error: "Missing SALESFORCE_CLIENT_ID" }, { status: 500 });
  }

  // Salesforce OAuth authorization endpoint
  const authUrl = new URL("https://login.salesforce.com/services/oauth2/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", scopes);

  return NextResponse.redirect(authUrl.toString());
}
