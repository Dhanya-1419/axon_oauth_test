import { NextResponse } from "next/server";
import { getOAuthConfig, getBaseUrl } from "../../utils";

export const runtime = "nodejs";

export async function GET(req) {
  const searchParams = new URL(req.url).searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const baseUrl = getBaseUrl(req);

  if (error) {
    return NextResponse.redirect(`${baseUrl}?oauth_error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}?oauth_error=missing_code`);
  }

  const { clientId, clientSecret, redirectUri } = await getOAuthConfig("eventbrite", new URLSearchParams(), req);

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${baseUrl}?oauth_error=missing_client`);
  }

  try {
    const tokenRes = await fetch("https://www.eventbrite.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
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
      throw new Error(tokenData.error_description || tokenData.error || "Eventbrite token exchange failed");
    }

    const { setToken } = await import("../../tokens/route.js");
    await setToken("eventbrite", {
      access_token: tokenData.access_token,
      expires_at: Date.now() + (tokenData.expires_in ? tokenData.expires_in * 1000 : 365 * 24 * 60 * 60 * 1000), // Eventbrite tokens often don't expire
    });

    return NextResponse.redirect(`${baseUrl}?oauth_success=eventbrite`);
  } catch (e) {
    return NextResponse.redirect(`${baseUrl}?oauth_error=${encodeURIComponent(e.message)}`);
  }
}
