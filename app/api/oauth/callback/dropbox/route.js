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
    const { clientId, clientSecret, redirectUri } = await getOAuthConfig("dropbox", new URLSearchParams(), req);

    if (!clientId || !clientSecret) {
      throw new Error("Missing DROPBOX_CLIENT_ID or DROPBOX_CLIENT_SECRET");
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://api.dropboxapi.com/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      throw new Error(`Token exchange failed: ${errorData}`);
    }

    const tokenData = await tokenResponse.json();
    
    // Store the token
    await setToken("dropbox", {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: tokenData.expires_in ? Date.now() + (tokenData.expires_in * 1000) : null,
      scope: tokenData.scope,
      account_id: tokenData.account_id,
    });

    // Redirect back to main page with success
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL || getBaseUrl(req)}?oauth_success=dropbox`
    );

  } catch (error) {
    console.error("Dropbox OAuth callback error:", error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL || getBaseUrl(req)}?error=dropbox_oauth_failed`
    );
  }
}
