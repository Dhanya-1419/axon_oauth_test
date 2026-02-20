import { NextResponse } from "next/server";
import { getOAuthConfig, getBaseUrl } from "../../utils";

export const runtime = "nodejs";

export async function GET(req) {
  const searchParams = new URL(req.url).searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || getBaseUrl(req)}?oauth_error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || getBaseUrl(req)}?oauth_error=missing_code`);
  }

  const { clientId, clientSecret, redirectUri } = await getOAuthConfig("hubspot", new URLSearchParams(), req);

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || getBaseUrl(req)}?oauth_error=missing_client`);
  }

  try {
    const tokenRes = await fetch("https://api.hubapi.com/oauth/v1/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      throw new Error(tokenData.error_description || tokenData.error || "HubSpot token exchange failed");
    }

    const { setToken } = await import("../../tokens/route.js");
    await setToken("hubspot", {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: Date.now() + (tokenData.expires_in * 1000),
    });

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || getBaseUrl(req)}?oauth_success=hubspot`);
  } catch (e) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || getBaseUrl(req)}?oauth_error=${encodeURIComponent(e.message)}`);
  }
}
