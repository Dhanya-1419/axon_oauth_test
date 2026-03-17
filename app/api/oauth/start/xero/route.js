import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.XERO_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/oauth/callback/xero`;

  if (!clientId) {
    return NextResponse.json({ error: "Xero client ID not configured" }, { status: 500 });
  }

  // Generate a random state for security
  const state = Math.random().toString(36).substring(2, 15);
  
  // Store state temporarily (in production, use Redis or database)
  global.xeroOAuthState = global.xeroOAuthState || {};
  global.xeroOAuthState[state] = Date.now();

  const xeroAuthUrl = new URL("https://login.xero.com/identity/connect/authorize");
  xeroAuthUrl.searchParams.append("client_id", clientId);
  xeroAuthUrl.searchParams.append("redirect_uri", redirectUri);
  xeroAuthUrl.searchParams.append("response_type", "code");
  xeroAuthUrl.searchParams.append("scope", "openid profile email accounting.transactions accounting.settings accounting.reports.read accounting.contacts accounting.journals.read offline_access");
  xeroAuthUrl.searchParams.append("state", state);

  return NextResponse.redirect(xeroAuthUrl.toString());
}
