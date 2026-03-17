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
  if (!state || !global.zendeskOAuthState?.[state]) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=invalid_state`);
  }

  // Clean up state
  delete global.zendeskOAuthState[state];

  try {
    const clientId = process.env.ZENDESK_CLIENT_ID;
    const clientSecret = process.env.ZENDESK_CLIENT_SECRET;
    const subdomain = process.env.ZENDESK_SUBDOMAIN;
    const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/oauth/callback/zendesk`;

    if (!clientId || !clientSecret || !subdomain) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=zendesk_credentials_missing`);
    }

    // Exchange code for access token
    const tokenResponse = await fetch(`https://${subdomain}.zendesk.com/oauth/tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        scope: "read write",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Zendesk token exchange error:", errorData);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=token_exchange_failed`);
    }

    const tokenData = await tokenResponse.json();

    // Get user info using the access token
    const userResponse = await fetch(`https://${subdomain}.zendesk.com/api/v2/users/me`, {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    let userData = null;
    if (userResponse.ok) {
      const userInfo = await userResponse.json();
      userData = userInfo.user;
    }

    // Store tokens in memory (in production, use secure storage)
    global.zendeskTokens = global.zendeskTokens || {};
    const tokenKey = userData?.id || Date.now().toString();
    global.zendeskTokens[tokenKey] = {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: Date.now() + (tokenData.expires_in * 1000),
      subdomain: subdomain,
      user: userData,
    };

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?success=zendesk&user=${encodeURIComponent(userData?.name || userData?.email || 'Zendesk User')}`);

  } catch (error) {
    console.error("Zendesk OAuth error:", error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=oauth_failed`);
  }
}
