import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/oauth/callback/paypal`;
  const scopes = process.env.PAYPAL_SCOPES || "openid profile email";

  if (!clientId) {
    return NextResponse.json({ error: "Missing PAYPAL_CLIENT_ID" }, { status: 500 });
  }

  // PayPal OAuth authorization endpoint (sandbox vs live)
  const isSandbox = process.env.PAYPAL_SANDBOX !== "false";
  const authBaseUrl = isSandbox
    ? "https://www.sandbox.paypal.com"
    : "https://www.paypal.com";

  const authUrl = new URL(`${authBaseUrl}/signin/authorize`);
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", scopes);

  return NextResponse.redirect(authUrl.toString());
}
