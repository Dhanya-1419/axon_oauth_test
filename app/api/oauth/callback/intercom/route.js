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
  if (!state || !global.intercomOAuthState?.[state]) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=invalid_state`);
  }

  // Clean up state
  delete global.intercomOAuthState[state];

  try {
    const clientId = process.env.INTERCOM_CLIENT_ID;
    const clientSecret = process.env.INTERCOM_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/oauth/callback/intercom`;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=intercom_credentials_missing`);
    }

    // Exchange code for access token
    const tokenResponse = await fetch("https://api.intercom.io/auth/eagle/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        code: code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Intercom token exchange error:", errorData);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=token_exchange_failed`);
    }

    const tokenData = await tokenResponse.json();

    // Get admin info using the access token
    const adminResponse = await fetch("https://api.intercom.io/me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Accept": "application/json",
        "Intercom-Version": "2.10",
      },
    });

    let adminData = null;
    if (adminResponse.ok) {
      const adminInfo = await adminResponse.json();
      adminData = adminInfo.admin;
    }

    // Store tokens in memory (in production, use secure storage)
    global.intercomTokens = global.intercomTokens || {};
    const tokenKey = adminData?.id || Date.now().toString();
    global.intercomTokens[tokenKey] = {
      access_token: tokenData.access_token,
      expires_at: Date.now() + (tokenData.expires_in * 1000),
      user: adminData,
    };

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?success=intercom&user=${encodeURIComponent(adminData?.name || adminData?.email || 'Intercom Admin')}`);

  } catch (error) {
    console.error("Intercom OAuth error:", error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=oauth_failed`);
  }
}
