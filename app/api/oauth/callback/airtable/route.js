import { NextResponse } from "next/server";

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

  const clientId = process.env.AIRTABLE_CLIENT_ID;
  const clientSecret = process.env.AIRTABLE_CLIENT_SECRET;
  const redirectUri = `${baseUrl}/api/oauth/callback/airtable`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${baseUrl}?oauth_error=missing_client`);
  }

  try {
    // Airtable requires Basic auth for token exchange
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const tokenRes = await fetch("https://airtable.com/oauth2/v1/token", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
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

    return NextResponse.redirect(`${baseUrl}?oauth_success=airtable`);
  } catch (e) {
    return NextResponse.redirect(`${baseUrl}?oauth_error=${encodeURIComponent(e.message)}`);
  }
}
