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
    await logActivity("linear", "ERROR", error);
    return NextResponse.redirect(`${baseUrl}?oauth_error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    await logActivity("linear", "ERROR", "Missing code from provider");
    return NextResponse.redirect(`${baseUrl}?oauth_error=missing_code`);
  }

  try {
    const { clientId, clientSecret, redirectUri } = await getOAuthConfig("linear", new URLSearchParams(), req);

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(`${baseUrl}?oauth_error=linear_credentials_missing`);
    }

    const tokenResponse = await fetch("https://api.linear.app/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      throw new Error(tokenData.error_description || tokenData.error || "Linear token exchange failed");
    }

    // Get user info using access token
    const userRes = await fetch("https://api.linear.app/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": tokenData.access_token,
      },
      body: JSON.stringify({
        query: "{ viewer { id name email avatarUrl } }"
      }),
    });

    let userData = null;
    if (userRes.ok) {
      const userInfo = await userRes.json();
      userData = userInfo.data?.viewer;
    }

    await setToken("linear", {
      access_token: tokenData.access_token,
      expires_at: tokenData.expires_in ? Date.now() + (tokenData.expires_in * 1000) : null,
      user: userData,
    });

    await logActivity("linear", "SUCCESS", "Connected successfully");
    return NextResponse.redirect(`${baseUrl}?oauth_success=linear`);
  } catch (e) {
    await logActivity("linear", "ERROR", e.message || "Unknown error");
    return NextResponse.redirect(`${baseUrl}?oauth_error=${encodeURIComponent(e.message)}`);
  }
}
