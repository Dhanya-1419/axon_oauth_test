import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req) {
  const searchParams = new URL(req.url).searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(`http://localhost:3000?oauth_error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return NextResponse.redirect(`http://localhost:3000?oauth_error=missing_code`);
  }

  const clientId = process.env.SLACK_CLIENT_ID;
  const clientSecret = process.env.SLACK_CLIENT_SECRET;
  const redirectUri = `http://localhost:3000/api/oauth/callback/slack`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`http://localhost:3000?oauth_error=missing_client`);
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
    setToken("slack", {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: Date.now() + (tokenData.expires_in * 1000),
    });

    return NextResponse.redirect(`http://localhost:3000?oauth_success=slack`);
  } catch (e) {
    return NextResponse.redirect(`http://localhost:3000?oauth_error=${encodeURIComponent(e.message)}`);
  }
}
