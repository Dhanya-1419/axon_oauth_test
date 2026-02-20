import { NextResponse } from "next/server";
import { getOAuthConfig, getBaseUrl } from "../../utils";
import { logActivity } from "../../db.js";
import { setToken } from "../../tokens/route.js";

export const runtime = "nodejs";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");

  if (error) {
    await logActivity("figma", "ERROR", error);
    await logActivity("figma", "SUCCESS", "Connected successfully");
    return NextResponse.redirect(
      `${getBaseUrl(req)}?error=${encodeURIComponent(error)}`
    );
  }

  if (!code) {
    await logActivity("figma", "ERROR", "Missing code from provider");
    return NextResponse.redirect(
      `${getBaseUrl(req)}?error=missing_code`
    );
  }

  try {
    const { clientId, clientSecret, redirectUri } = await getOAuthConfig("figma", new URLSearchParams(), req);

    if (!clientId || !clientSecret) {
      throw new Error("Missing FIGMA_CLIENT_ID or FIGMA_CLIENT_SECRET");
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://www.figma.com/api/oauth/token", {
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
    await setToken("figma", {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: tokenData.expires_in ? Date.now() + (tokenData.expires_in * 1000) : null,
      scope: tokenData.scope,
    });

    // Redirect back to main page with success
    return NextResponse.redirect(
      `${getBaseUrl(req)}?oauth_success=figma`
    );

  } catch (error) {
    await logActivity("figma", "ERROR", error.message || "Unknown error");
    console.error("Figma OAuth callback error:", error);
    return NextResponse.redirect(
      `${getBaseUrl(req)}?error=figma_oauth_failed`
    );
  }
}
