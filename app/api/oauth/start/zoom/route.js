import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.ZOOM_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/oauth/callback/zoom`;
  const scopes = process.env.ZOOM_SCOPES || "meeting:read user:read";

  if (!clientId) {
    return NextResponse.json({ error: "Missing ZOOM_CLIENT_ID" }, { status: 500 });
  }

  const authUrl = new URL("https://zoom.us/oauth/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", scopes);

  return NextResponse.redirect(authUrl.toString());
}
