import { NextResponse } from "next/server";
import { getOAuthConfig, getBaseUrl } from "../../utils";
import { setToken } from "../../tokens/route.js";

export const runtime = "nodejs";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL || getBaseUrl(req)}?error=${encodeURIComponent(error)}`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL || getBaseUrl(req)}?error=missing_code`
    );
  }

  try {
    const { clientId, clientSecret, redirectUri } = await getOAuthConfig("clickup", new URLSearchParams(), req);

    if (!clientId || !clientSecret) {
      throw new Error("Missing CLICKUP_CLIENT_ID or CLICKUP_CLIENT_SECRET");
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://api.clickup.com/api/v2/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      throw new Error(`Token exchange failed: ${errorData}`);
    }

    const tokenData = await tokenResponse.json();
    
    // Store the token
    await setToken("clickup", {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: tokenData.expires_in ? Date.now() + (tokenData.expires_in * 1000) : null,
      scope: tokenData.scope,
      team_id: tokenData.team_id,
    });

    // Redirect back to main page with success
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL || getBaseUrl(req)}?oauth_success=clickup`
    );

  } catch (error) {
    console.error("ClickUp OAuth callback error:", error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL || getBaseUrl(req)}?error=clickup_oauth_failed`
    );
  }
}
