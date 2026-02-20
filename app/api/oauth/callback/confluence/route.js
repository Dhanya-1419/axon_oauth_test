import { NextResponse } from "next/server";
import { getOAuthConfig, getBaseUrl } from "../../utils";

export const runtime = "nodejs";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");

  // Debug logging
  console.log('🔍 Confluence Callback Debug:');
  console.log('Code:', code);
  console.log('Error:', error);
  console.log('State:', state);

  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL || getBaseUrl(req)}?oauth_error=${encodeURIComponent(error)}&provider=confluence`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL || getBaseUrl(req)}?oauth_error=missing_code&provider=confluence`
    );
  }

  try {
    const { clientId, clientSecret, redirectUri } = await getOAuthConfig("confluence", new URLSearchParams(), req);

    // Debug logging
    console.log('🔍 Confluence Token Exchange Debug:');
    console.log('Client ID:', clientId);
    console.log('Client Secret exists:', !!clientSecret);
    console.log('Redirect URI:', redirectUri);

    if (!clientId || !clientSecret) {
      throw new Error("Missing CONFLUENCE_CLIENT_ID or CONFLUENCE_CLIENT_SECRET");
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://auth.atlassian.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new Error(`Token exchange failed: ${errorText}`);
    }

    const tokenData = await tokenResponse.json();

    // Store the token
    const { setToken } = await import("../../tokens/route.js");
    await setToken("confluence", {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
      scope: tokenData.scope,
      token_type: tokenData.token_type,
      obtained_at: new Date().toISOString(),
    });

    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL || getBaseUrl(req)}?oauth_success=true&provider=confluence`
    );

  } catch (error) {
    console.error("Confluence OAuth callback error:", error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL || getBaseUrl(req)}?oauth_error=${encodeURIComponent(error.message)}&provider=confluence`
    );
  }
}
