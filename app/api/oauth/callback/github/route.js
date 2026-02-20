import { NextResponse } from "next/server";
import { getOAuthConfig, getBaseUrl } from "../../utils";
import { logActivity } from "../../db.js";

export const runtime = "nodejs";

export async function GET(req) {
  const searchParams = new URL(req.url).searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const { getBaseUrl } = await import("../../utils");
  const baseUrl = getBaseUrl(req);

  if (error) {
    await logActivity("github", "ERROR", error);
    return NextResponse.redirect(`${baseUrl}?oauth_error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    await logActivity("github", "ERROR", "Missing code from provider");
    return NextResponse.redirect(`${baseUrl}?oauth_error=missing_code`);
  }

  // Pass empty searchParams to getOAuthConfig to trigger loading from cookies
  const { clientId, clientSecret, redirectUri } = await getOAuthConfig("github", new URLSearchParams(), req);

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${baseUrl}?oauth_error=missing_client_credentials`);
  }

  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || tokenData.error) {
      throw new Error(tokenData.error_description || tokenData.error || "Token exchange failed");
    }

    const { setToken } = await import("../../tokens/route.js");
    await setToken("github", {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: tokenData.expires_in ? Date.now() + (tokenData.expires_in * 1000) : null,
    });

    await logActivity("github", "SUCCESS", "Connected successfully");
    return NextResponse.redirect(`${baseUrl}?oauth_success=github`);
  } catch (e) {
    await logActivity("github", "ERROR", e.message || "Unknown error");
    return NextResponse.redirect(`${baseUrl}?oauth_error=${encodeURIComponent(e.message)}`);
  }
}
