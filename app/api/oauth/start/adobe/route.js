import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.ADOBE_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/oauth/callback/adobe`;

  if (!clientId) {
    return NextResponse.json({ error: "Adobe client ID not configured" }, { status: 500 });
  }

  // Generate a random state for security
  const state = Math.random().toString(36).substring(2, 15);
  
  // Store state temporarily (in production, use Redis or database)
  global.adobeOAuthState = global.adobeOAuthState || {};
  global.adobeOAuthState[state] = Date.now();

  const adobeAuthUrl = new URL("https://ims-na1.adobelogin.com/ims/authorize");
  adobeAuthUrl.searchParams.append("client_id", clientId);
  adobeAuthUrl.searchParams.append("redirect_uri", redirectUri);
  adobeAuthUrl.searchParams.append("response_type", "code");
  adobeAuthUrl.searchParams.append("scope", "openid,creative_sdk,read_organizations,additional_info.projectedProductContext");
  adobeAuthUrl.searchParams.append("state", state);
  adobeAuthUrl.searchParams.append("locale", "en_US");

  return NextResponse.redirect(adobeAuthUrl.toString());
}
