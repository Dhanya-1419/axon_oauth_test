import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.EVENTBRITE_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/oauth/callback/eventbrite`;
  const scopes = process.env.EVENTBRITE_SCOPES || "event_read";

  if (!clientId) {
    return NextResponse.json({ error: "Missing EVENTBRITE_CLIENT_ID" }, { status: 500 });
  }

  // Eventbrite OAuth authorization endpoint
  const authUrl = new URL("https://www.eventbrite.com/oauth/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");

  return NextResponse.redirect(authUrl.toString());
}
