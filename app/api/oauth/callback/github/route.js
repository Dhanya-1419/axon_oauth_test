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

  const clientId = process.env.GITHUB_ID;
  const clientSecret = process.env.GITHUB_SECRET;
  const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/oauth/callback/github`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}?oauth_error=missing_client`);
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
    if (!tokenRes.ok) {
      throw new Error(tokenData.error_description || tokenData.error);
    }

    const { setToken } = await import("../../tokens/route.js");
    setToken("github", {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: Date.now() + (tokenData.expires_in * 1000),
    });

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}?oauth_success=github`);
  } catch (e) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}?oauth_error=${encodeURIComponent(e.message)}`);
  }
}
