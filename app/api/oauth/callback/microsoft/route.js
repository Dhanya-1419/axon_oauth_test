import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req) {
  const searchParams = new URL(req.url).searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(`https://localhost:3000?oauth_error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return NextResponse.redirect(`https://localhost:3000?oauth_error=missing_code`);
  }

  const clientId = process.env.MICROSOFT_CLIENT_ID;
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
  const redirectUri = `https://localhost:3000/api/oauth/callback/microsoft`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`https://localhost:3000?oauth_error=missing_client`);
  }

  try {
    const tokenRes = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        scope: process.env.MICROSOFT_SCOPES || "https://graph.microsoft.com/User.Read offline_access",
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok) {
      throw new Error(tokenData.error_description || tokenData.error);
    }

    const { setToken } = await import("../../tokens/route.js");
    setToken("microsoft", {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: Date.now() + (tokenData.expires_in * 1000),
    });

    return NextResponse.redirect(`https://localhost:3000?oauth_success=microsoft`);
  } catch (e) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}?oauth_error=${encodeURIComponent(e.message)}`);
  }
}
