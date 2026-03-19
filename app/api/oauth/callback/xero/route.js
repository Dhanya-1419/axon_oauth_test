import { NextResponse } from "next/server";
import { getOAuthConfig, getBaseUrl, encodeBasicAuth } from "../../utils";
import { logActivity } from "../../db.js";
import { setToken } from "../../tokens/route.js";

export const runtime = "nodejs";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const baseUrl = getBaseUrl(req);

  if (error) {
    await logActivity("xero", "ERROR", error);
    return NextResponse.redirect(`${baseUrl}?oauth_error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    await logActivity("xero", "ERROR", "Missing code from provider");
    return NextResponse.redirect(`${baseUrl}?oauth_error=missing_code`);
  }

  try {
    const { clientId, clientSecret, redirectUri } = await getOAuthConfig("xero", new URLSearchParams(), req);

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(`${baseUrl}?oauth_error=xero_credentials_missing`);
    }

    // Exchange code for access token (Xero requires URL-encoded Basic Auth)
    const basicAuth = encodeBasicAuth(clientId, clientSecret);

    const tokenResponse = await fetch("https://identity.xero.com/connect/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      throw new Error(tokenData.error_description || tokenData.error || "Xero token exchange failed");
    }

    // Get user info using the access token
    const userResponse = await fetch("https://api.xero.com/api.xro/2.0/Organisation", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Xero-tenant-id": tokenData.tenant_ids?.[0] || "",
      },
    });

    let orgData = null;
    if (userResponse.ok) {
      const orgInfo = await userResponse.json();
      orgData = orgInfo.Organisations?.[0] || null;
    }

    // Store tokens
    await setToken("xero", {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: Date.now() + (tokenData.expires_in * 1000),
      tenant_ids: tokenData.tenant_ids || [],
      organisation: orgData,
    });

    await logActivity("xero", "SUCCESS", "Connected successfully");
    return NextResponse.redirect(`${baseUrl}?oauth_success=xero`);

  } catch (e) {
    await logActivity("xero", "ERROR", e.message || "Unknown error");
    return NextResponse.redirect(`${baseUrl}?oauth_error=${encodeURIComponent(e.message)}`);
  }
}
