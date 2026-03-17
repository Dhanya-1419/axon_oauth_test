import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.BITBUCKET_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/oauth/callback/bitbucket`;

  if (!clientId) {
    return NextResponse.json({ error: "Bitbucket client ID not configured" }, { status: 500 });
  }

  // Generate a random state for security
  const state = Math.random().toString(36).substring(2, 15);
  
  // Store state temporarily (in production, use Redis or database)
  global.bitbucketOAuthState = global.bitbucketOAuthState || {};
  global.bitbucketOAuthState[state] = Date.now();

  const bitbucketAuthUrl = new URL("https://bitbucket.org/site/oauth2/authorize");
  bitbucketAuthUrl.searchParams.append("client_id", clientId);
  bitbucketAuthUrl.searchParams.append("redirect_uri", redirectUri);
  bitbucketAuthUrl.searchParams.append("response_type", "code");
  bitbucketAuthUrl.searchParams.append("scope", "repository:write repository:admin pullrequest:write team:write account:write");
  bitbucketAuthUrl.searchParams.append("state", state);

  return NextResponse.redirect(bitbucketAuthUrl.toString());
}
