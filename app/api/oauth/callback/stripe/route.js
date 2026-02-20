import { NextResponse } from "next/server";
import { getOAuthConfig, getBaseUrl } from "../../utils";
import { logActivity } from "../../db.js";
import { setToken } from "../../tokens/route.js";

export const runtime = "nodejs";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const baseUrl = getBaseUrl(req);

  if (error) {
    await logActivity("stripe", "ERROR", error);
    return NextResponse.redirect(`${baseUrl}?oauth_error=${encodeURIComponent(error)}`);
  }

  if (!code) {
    await logActivity("stripe", "ERROR", "Missing code from provider");
    return NextResponse.redirect(`${baseUrl}?oauth_error=missing_code`);
  }

  try {
    const { clientId, clientSecret } = await getOAuthConfig("stripe", new URLSearchParams(), req);

    if (!clientId || !clientSecret) {
      throw new Error("Missing STRIPE_CLIENT_ID or STRIPE_CLIENT_SECRET");
    }

    // Stripe OAuth token exchange
    const tokenResponse = await fetch("https://connect.stripe.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      throw new Error(errorData.error_description || errorData.error || "Stripe token exchange failed");
    }

    const tokenData = await tokenResponse.json();
    
    // Store the token
    await setToken("stripe", {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      stripe_user_id: tokenData.stripe_user_id,
      stripe_publishable_key: tokenData.stripe_publishable_key,
      scope: tokenData.scope,
      expires_at: null, // Stripe connect tokens don't expire
    });

    await logActivity("stripe", "SUCCESS", `Connected successfully to Stripe account: ${tokenData.stripe_user_id}`);
    return NextResponse.redirect(`${baseUrl}?oauth_success=stripe`);

  } catch (error) {
    console.error("Stripe OAuth callback error:", error);
    await logActivity("stripe", "ERROR", error.message);
    return NextResponse.redirect(`${baseUrl}?oauth_error=${encodeURIComponent(error.message)}`);
  }
}
