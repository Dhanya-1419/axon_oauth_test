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

  const clientId = process.env.SALESFORCE_CLIENT_ID;
  const clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
  const redirectUri = `${baseUrl}/api/oauth/callback/salesforce`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${baseUrl}?oauth_error=missing_client`);
  }

  try {
    const tokenRes = await fetch("https://login.salesforce.com/services/oauth2/token", {
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
      throw new Error(tokenData.error_description || tokenData.error || "Salesforce token exchange failed");
    }

    const { setToken } = await import("../../tokens/route.js");
    await setToken("salesforce", {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      instance_url: tokenData.instance_url,
      expires_at: Date.now() + (tokenData.expires_in ? tokenData.expires_in * 1000 : 3600 * 1000),
    });

    return NextResponse.redirect(`${baseUrl}?oauth_success=salesforce`);
  } catch (e) {
    return NextResponse.redirect(`${baseUrl}?oauth_error=${encodeURIComponent(e.message)}`);
  }
}
