import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state");

  if (error) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=missing_code`);
  }

  // Validate state
  if (!state || !global.gitlabOAuthState?.[state]) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=invalid_state`);
  }

  // Clean up state
  delete global.gitlabOAuthState[state];

  try {
    const clientId = process.env.GITLAB_CLIENT_ID;
    const clientSecret = process.env.GITLAB_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/oauth/callback/gitlab`;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=gitlab_credentials_missing`);
    }

    // Exchange code for access token
    const tokenResponse = await fetch("https://gitlab.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("GitLab token exchange error:", errorData);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=token_exchange_failed`);
    }

    const tokenData = await tokenResponse.json();

    // Get user info using access token
    const userResponse = await fetch("https://gitlab.com/api/v4/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    let userData = null;
    if (userResponse.ok) {
      userData = await userResponse.json();
    }

    // Store tokens in memory (in production, use secure storage)
    global.gitlabTokens = global.gitlabTokens || {};
    const tokenKey = userData?.id || Date.now().toString();
    global.gitlabTokens[tokenKey] = {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: Date.now() + (tokenData.expires_in * 1000),
      user: userData,
    };

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?success=gitlab&user=${encodeURIComponent(userData?.name || userData?.username || 'GitLab User')}`);

  } catch (error) {
    console.error("GitLab OAuth error:", error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=oauth_failed`);
  }
}
