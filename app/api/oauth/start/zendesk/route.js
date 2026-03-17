import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.ZENDESK_CLIENT_ID;
  const subdomain = process.env.ZENDESK_SUBDOMAIN;
  const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/oauth/callback/zendesk`;

  if (!clientId || !subdomain) {
    return NextResponse.json({ error: "Zendesk client ID or subdomain not configured" }, { status: 500 });
  }

  // Generate a random state for security
  const state = Math.random().toString(36).substring(2, 15);
  
  // Store state temporarily (in production, use Redis or database)
  global.zendeskOAuthState = global.zendeskOAuthState || {};
  global.zendeskOAuthState[state] = Date.now();

  const zendeskAuthUrl = new URL(`https://${subdomain}.zendesk.com/oauth/authorizations/new`);
  zendeskAuthUrl.searchParams.append("client_id", clientId);
  zendeskAuthUrl.searchParams.append("redirect_uri", redirectUri);
  zendeskAuthUrl.searchParams.append("response_type", "code");
  zendeskAuthUrl.searchParams.append("scope", "read write");
  zendeskAuthUrl.searchParams.append("state", state);

  return NextResponse.redirect(zendeskAuthUrl.toString());
}
