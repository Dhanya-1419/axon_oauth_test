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
    await logActivity("notion", "ERROR", error);
    return NextResponse.redirect(
      `${getBaseUrl(req)}?error=${encodeURIComponent(error)}`
    );
  }

  if (!code) {
    await logActivity("notion", "ERROR", "Missing code from provider");
    return NextResponse.redirect(
      `${getBaseUrl(req)}?error=missing_code`
    );
  }

  try {
    const { clientId, clientSecret, redirectUri } = await getOAuthConfig("notion", new URLSearchParams(), req);

    if (!clientId || !clientSecret) {
      throw new Error("Missing NOTION_CLIENT_ID or NOTION_CLIENT_SECRET");
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://api.notion.com/v1/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      },
      body: JSON.stringify({
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
    await setToken("notion", {
      access_token: tokenData.access_token,
      workspace_id: tokenData.workspace_id,
      workspace_name: tokenData.workspace_name,
      workspace_icon: tokenData.workspace_icon,
      bot_id: tokenData.bot_id,
      owner: tokenData.owner,
      // Notion tokens don't expire, but we'll store the creation date
      created_at: Date.now(),
    });

    // Redirect back to main page with success
    return NextResponse.redirect(
      `${getBaseUrl(req)}?oauth_success=notion`
    );

  } catch (error) {
    await logActivity("notion", "ERROR", error.message || "Unknown error");
    console.error("Notion OAuth callback error:", error);
    return NextResponse.redirect(
      `${getBaseUrl(req)}?error=notion_oauth_failed`
    );
  }
}
