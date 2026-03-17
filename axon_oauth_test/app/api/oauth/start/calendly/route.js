import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.CALENDLY_CLIENT_ID;
  const redirectUri = `https://localhost:3000/api/oauth/callback/calendly`;
  
  // Calendly OAuth scopes for API access
  const scopes = process.env.CALENDLY_SCOPES || "default";

  if (!clientId) {
    return NextResponse.json({ error: "Missing CALENDLY_CLIENT_ID" }, { status: 500 });
  }

  const authUrl = new URL("https://auth.calendly.com/oauth/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  
  if (scopes) {
    authUrl.searchParams.set("scope", scopes);
  }

  return NextResponse.redirect(authUrl.toString());
}
