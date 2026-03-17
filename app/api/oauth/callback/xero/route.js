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
  if (!state || !global.xeroOAuthState?.[state]) {
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=invalid_state`);
  }

  // Clean up state
  delete global.xeroOAuthState[state];

  try {
    const clientId = process.env.XERO_CLIENT_ID;
    const clientSecret = process.env.XERO_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/oauth/callback/xero`;

    if (!clientId || !clientSecret) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=xero_credentials_missing`);
    }

    // Exchange code for access token
    const tokenResponse = await fetch("https://identity.xero.com/connect/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Xero token exchange error:", errorData);
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=token_exchange_failed`);
    }

    const tokenData = await tokenResponse.json();

    // Get user info using the access token
    const userResponse = await fetch("https://api.xero.com/api.xro/2.0/Organisation", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Xero-tenant-id": tokenData.tenant_ids?.[0] || "",
      },
    });

    let orgData = null;
    if (userResponse.ok) {
      const orgInfo = await userResponse.json();
      orgData = orgInfo.Organisations?.[0] || null;
    }

    // Get user identity
    const identityResponse = await fetch("https://profile.xero.com/api/profile", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    let userData = null;
    if (identityResponse.ok) {
      userData = await identityResponse.json();
    }

    // Store tokens in memory (in production, use secure storage)
    global.xeroTokens = global.xeroTokens || {};
    const tokenKey = userData?.userId || orgData?.OrganisationID || Date.now().toString();
    global.xeroTokens[tokenKey] = {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: Date.now() + (tokenData.expires_in * 1000),
      tenant_ids: tokenData.tenant_ids || [],
      user: userData,
      organisation: orgData,
    };

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?success=xero&user=${encodeURIComponent(userData?.firstName || orgData?.Name || 'Xero User')}`);

  } catch (error) {
    console.error("Xero OAuth error:", error);
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}?error=oauth_failed`);
  }
}
