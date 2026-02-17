import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.QUICKBOOKS_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/oauth/callback/quickbooks`;
  const scopes = process.env.QUICKBOOKS_SCOPES || "com.intuit.quickbooks.accounting";

  if (!clientId) {
    return NextResponse.json({ error: "Missing QUICKBOOKS_CLIENT_ID" }, { status: 500 });
  }

  // QuickBooks/Intuit OAuth authorization endpoint
  const authUrl = new URL("https://appcenter.intuit.com/connect/oauth2");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", scopes);

  return NextResponse.redirect(authUrl.toString());
}
