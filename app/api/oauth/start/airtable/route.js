import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.AIRTABLE_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/oauth/callback/airtable`;
  const scopes = process.env.AIRTABLE_SCOPES || "data.records:read data.records:write";

  if (!clientId) {
    return NextResponse.json({ error: "Missing AIRTABLE_CLIENT_ID" }, { status: 500 });
  }

  // Airtable OAuth authorization endpoint
  const authUrl = new URL("https://airtable.com/oauth2/v1/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", scopes);

  return NextResponse.redirect(authUrl.toString());
}
