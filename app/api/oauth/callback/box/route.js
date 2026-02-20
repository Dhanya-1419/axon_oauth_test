import { NextResponse } from "next/server";
import { setToken } from "../../tokens/route.js";

export const runtime = "nodejs";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}?error=${encodeURIComponent(error)}`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}?error=missing_code`
    );
  }

  try {
    const clientId = process.env.BOX_CLIENT_ID;
    const clientSecret = process.env.BOX_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/oauth/callback/box`;

    if (!clientId || !clientSecret) {
      throw new Error("Missing BOX_CLIENT_ID or BOX_CLIENT_SECRET");
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://api.box.com/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      throw new Error(`Token exchange failed: ${errorData}`);
    }

    const tokenData = await tokenResponse.json();
    
    // Store the token
    await setToken("box", {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: tokenData.expires_in ? Date.now() + (tokenData.expires_in * 1000) : null,
      scope: tokenData.scope,
      token_type: tokenData.token_type,
    });

    // Redirect back to main page with success
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}?oauth_success=box`
    );

  } catch (error) {
    console.error("Box OAuth callback error:", error);
    return NextResponse.redirect(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}?error=box_oauth_failed`
    );
  }
}
