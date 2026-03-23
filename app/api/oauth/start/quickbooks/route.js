import { NextResponse } from "next/server";
import { getOAuthConfig } from "../../utils";

export const runtime = "nodejs";

export async function GET(req) {
  const searchParams = new URL(req.url).searchParams;
  const { clientId, redirectUri, scopes } = await getOAuthConfig("quickbooks", searchParams, req);

  if (!clientId) {
    return NextResponse.json({ error: "Missing QUICKBOOKS_CLIENT_ID or manual config" }, { status: 500 });
  }

  const authUrl = new URL("https://appcenter.intuit.com/connect/oauth2");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  
  // QuickBooks often requires openid for OIDC flows to work correctly with some apps
  const defaultScopes = "com.intuit.quickbooks.accounting openid profile email";
  authUrl.searchParams.set("scope", scopes || defaultScopes);

  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  authUrl.searchParams.set("state", Math.random().toString(36).substring(7));

  console.log(`[QuickBooks] Redirecting to: ${authUrl.toString()}`);

  return NextResponse.redirect(authUrl.toString());
}
