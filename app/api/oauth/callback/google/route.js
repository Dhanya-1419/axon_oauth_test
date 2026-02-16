import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req) {
  const searchParams = new URL(req.url).searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}?oauth_error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}?oauth_error=missing_code`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/oauth/callback/google`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}?oauth_error=missing_client`);
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
    console.log("DEBUG GOOGLE CALLBACK TOKEN DATA:", JSON.stringify(tokenData, null, 2));
    if (!tokenRes.ok) {
      throw new Error(tokenData.error_description || tokenData.error);
    }

    // Store token for dev (in production, use DB/encrypted session)
    const { setToken } = await import("../../tokens/route.js");
    setToken("google", {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: Date.now() + (tokenData.expires_in * 1000),
    });

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}?oauth_success=google`);
  } catch (e) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}?oauth_error=${encodeURIComponent(e.message)}`);
  }
}
