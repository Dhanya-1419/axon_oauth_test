import { NextResponse } from "next/server";
import { getOAuthConfig, getBaseUrl } from "../../utils";
import { logActivity } from "../../db.js";
import { setToken } from "../../tokens/route.js";

export const runtime = "nodejs";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const baseUrl = getBaseUrl(req);

  if (error) {
    await logActivity("mailchimp", "ERROR", error);
    return NextResponse.redirect(`${baseUrl}?oauth_error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    await logActivity("mailchimp", "ERROR", "Missing code from provider");
    return NextResponse.redirect(`${baseUrl}?oauth_error=missing_code`);
  }

  try {
    const { clientId, clientSecret, redirectUri } = await getOAuthConfig("mailchimp", new URLSearchParams(), req);

    if (!clientId || !clientSecret) {
      throw new Error("Missing MAILCHIMP_CLIENT_ID or MAILCHIMP_CLIENT_SECRET");
    }

    // 1. Exchange authorization code for access token
    const tokenResponse = await fetch("https://login.mailchimp.com/oauth2/token", {
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
    const accessToken = tokenData.access_token;

    // 2. Fetch metadata to get the data center (dc)
    const metadataResponse = await fetch("https://login.mailchimp.com/oauth2/metadata", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!metadataResponse.ok) {
        throw new Error("Failed to fetch Mailchimp metadata");
    }

    const metadata = await metadataResponse.json();
    const dc = metadata.dc; // e.g., us19

    // Store the token with metadata
    await setToken("mailchimp", {
      access_token: accessToken,
      dc: dc,
      account_name: metadata.accountname,
      api_endpoint: metadata.api_endpoint,
      expires_at: null, // Mailchimp tokens don't expire
    });

    await logActivity("mailchimp", "SUCCESS", `Connected successfully to account: ${metadata.accountname} (${dc})`);
    return NextResponse.redirect(`${baseUrl}?oauth_success=mailchimp`);

  } catch (error) {
    console.error("Mailchimp OAuth callback error:", error);
    await logActivity("mailchimp", "ERROR", error.message);
    return NextResponse.redirect(`${baseUrl}?oauth_error=${encodeURIComponent(error.message)}`);
  }
}
