import { NextResponse } from "next/server";
import { getOAuthConfig } from "../../utils";

export const runtime = "nodejs";

export async function GET(req) {
  const searchParams = new URL(req.url).searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  if (error) {
    return NextResponse.redirect(`${baseUrl}?oauth_error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}?oauth_error=missing_code`);
  }

  const { clientId, clientSecret, redirectUri } = await getOAuthConfig("slack", new URLSearchParams());

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${baseUrl}?oauth_error=missing_client`);
  }

  try {
    const tokenRes = await fetch("https://slack.com/api/oauth.v2.access", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.ok) {
      throw new Error(tokenData.error || "Slack token exchange failed");
    }

    const { setToken } = await import("../../tokens/route.js");
    await setToken("slack", {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: tokenData.expires_in ? Date.now() + (tokenData.expires_in * 1000) : null,
    });

    return NextResponse.redirect(`${baseUrl}?oauth_success=slack`);
  } catch (e) {
    return NextResponse.redirect(`${baseUrl}?oauth_error=${encodeURIComponent(e.message)}`);
  }
}
