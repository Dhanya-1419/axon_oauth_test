import { NextResponse } from "next/server";
import { getOAuthConfig, getBaseUrl } from "../../utils";
import { logActivity } from "../../db.js";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET(req) {
  const searchParams = new URL(req.url).searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const baseUrl = getBaseUrl(req);

  if (error) {
    await logActivity("airtable", "ERROR", error);
    return NextResponse.redirect(`${baseUrl}?oauth_error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    await logActivity("airtable", "ERROR", "Missing code from provider");
    return NextResponse.redirect(`${baseUrl}?oauth_error=missing_code`);
  }

  const { clientId, clientSecret, redirectUri } = await getOAuthConfig("airtable", new URLSearchParams(), req);

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${baseUrl}?oauth_error=missing_client`);
  }

  try {
    // Airtable requires Basic auth for token exchange (URL-encoded per RFC 6749)
    const { encodeBasicAuth } = await import("../../utils");
    const basicAuth = encodeBasicAuth(clientId, clientSecret);
    
    // Retrieve and clear code_verifier for PKCE
    const codeVerifier = req.cookies.get("airtable_code_verifier")?.value;
    if (!codeVerifier) {
      throw new Error("Missing PKCE code_verifier cookie. Check if cookies are enabled and try again.");
    }

    const tokenRes = await fetch("https://airtable.com/oauth2/v1/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      throw new Error(tokenData.error_description || tokenData.error || "Airtable token exchange failed");
    }

    const { setToken } = await import("../../tokens/route.js");
    await setToken("airtable", {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: Date.now() + (tokenData.expires_in * 1000),
    });

    await logActivity("airtable", "SUCCESS", "Connected successfully");
    const res = NextResponse.redirect(`${baseUrl}?oauth_success=airtable`);
    res.cookies.delete("airtable_code_verifier");
    return res;
  } catch (e) {
    await logActivity("airtable", "ERROR", e.message || "Unknown error");
    const res = NextResponse.redirect(`${baseUrl}?oauth_error=${encodeURIComponent(e.message)}`);
    // Also clear cookie on error to avoid stale state
    // Note: next/headers cookies() deletion might not work in all redirect scenarios, 
    // but setting it on the response object is standard for App Router.
    return res;
  }
}
