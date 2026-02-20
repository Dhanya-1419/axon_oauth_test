import { NextResponse } from "next/server";
import { getOAuthConfig, getBaseUrl } from "../../utils";
import { logActivity } from "../../db.js";
import { setToken } from "../../tokens/route.js";

export const runtime = "nodejs";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const codeVerifier = req.cookies.get("calendly_code_verifier")?.value;

  if (error) {
    await logActivity("calendly", "ERROR", error);
    return NextResponse.redirect(
      `${getBaseUrl(req)}?error=${encodeURIComponent(error)}`
    );
  }

  if (!code) {
    await logActivity("calendly", "ERROR", "Missing code from provider");
    return NextResponse.redirect(
      `${getBaseUrl(req)}?error=missing_code`
    );
  }

  try {
    const { clientId, clientSecret, redirectUri } = await getOAuthConfig("calendly", new URLSearchParams(), req);

    if (!clientId || !clientSecret) {
      throw new Error("Missing CALENDLY_CLIENT_ID or CALENDLY_CLIENT_SECRET");
    }

    // Exchange authorization code for access token
    // Standard Basic Auth: encode components first per RFC 6749
    const basicAuth = Buffer.from(`${encodeURIComponent(clientId)}:${encodeURIComponent(clientSecret)}`).toString("base64");
    
    const tokenResponse = await fetch("https://auth.calendly.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        client_id: clientId, // Some servers like it in both places
        redirect_uri: redirectUri,
        code_verifier: codeVerifier || "",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      throw new Error(`Token exchange failed: ${errorData}`);
    }

    const tokenData = await tokenResponse.json();
    
    // Store the token
    await setToken("calendly", {
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_at: tokenData.expires_in ? Date.now() + (tokenData.expires_in * 1000) : null,
      scope: tokenData.scope,
    });

    // Redirect back to main page with success
    const res = NextResponse.redirect(
      `${getBaseUrl(req)}?oauth_success=calendly`
    );
    
    // Clear the verifier cookie
    res.cookies.delete("calendly_code_verifier");
    return res;

  } catch (error) {
    await logActivity("calendly", "ERROR", error.message || "Unknown error");
    console.error("Calendly OAuth callback error:", error);
    return NextResponse.redirect(
      `${getBaseUrl(req)}?error=calendly_oauth_failed`
    );
  }
}
