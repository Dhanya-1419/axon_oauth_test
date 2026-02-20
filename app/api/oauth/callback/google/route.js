import { NextResponse } from "next/server";
import { getOAuthConfig, getBaseUrl } from "../../utils";

export const runtime = "nodejs";

export async function GET(req) {
  const searchParams = new URL(req.url).searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const { getBaseUrl } = await import("../../utils");
  const baseUrl = getBaseUrl(req);

  if (error) {
    return NextResponse.redirect(`${baseUrl}?oauth_error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return NextResponse.redirect(`${baseUrl}?oauth_error=missing_code`);
  }

  const { clientId, clientSecret, redirectUri } = await getOAuthConfig("google", new URLSearchParams(), req);

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${baseUrl}?oauth_error=missing_client`);
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
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
      throw new Error(tokenData.error_description || tokenData.error);
    }

    const { setToken } = await import("../../tokens/route.js");
    await setToken("google", {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: tokenData.expires_in ? Date.now() + (tokenData.expires_in * 1000) : null,
    });

    return NextResponse.redirect(`${baseUrl}?oauth_success=google`);
  } catch (e) {
    return NextResponse.redirect(`${baseUrl}?oauth_error=${encodeURIComponent(e.message)}`);
  }
}
