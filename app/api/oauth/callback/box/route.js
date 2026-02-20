import { NextResponse } from "next/server";
import { getOAuthConfig, getBaseUrl } from "../../utils";
import { logActivity } from "../../db.js";
import { setToken } from "../../tokens/route.js";

export const runtime = "nodejs";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    await logActivity("box", "ERROR", error);
    await logActivity("box", "SUCCESS", "Connected successfully");
    return NextResponse.redirect(
      `${getBaseUrl(req)}?error=${encodeURIComponent(error)}`
    );
  }

  if (!code) {
    await logActivity("box", "ERROR", "Missing code from provider");
    return NextResponse.redirect(
      `${getBaseUrl(req)}?error=missing_code`
    );
  }

  try {
    const { clientId, clientSecret, redirectUri } = await getOAuthConfig("box", new URLSearchParams(), req);

    if (!clientId || !clientSecret) {
      throw new Error("Missing BOX_CLIENT_ID or BOX_CLIENT_SECRET");
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://api.box.com/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
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
    await setToken("box", {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: tokenData.expires_in ? Date.now() + (tokenData.expires_in * 1000) : null,
      scope: tokenData.scope,
      token_type: tokenData.token_type,
    });

    // Redirect back to main page with success
    return NextResponse.redirect(
      `${getBaseUrl(req)}?oauth_success=box`
    );

  } catch (error) {
    await logActivity("box", "ERROR", error.message || "Unknown error");
    console.error("Box OAuth callback error:", error);
    return NextResponse.redirect(
      `${getBaseUrl(req)}?error=box_oauth_failed`
    );
  }
}
