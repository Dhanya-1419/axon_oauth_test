import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.MONDAY_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/oauth/callback/monday`;

  if (!clientId) {
    return NextResponse.json({ error: "Monday client ID not configured" }, { status: 500 });
  }

  // Generate a random state for security
  const state = Math.random().toString(36).substring(2, 15);

  const mondayAuthUrl = new URL("https://auth.monday.com/oauth2/authorize");
  mondayAuthUrl.searchParams.append("client_id", clientId);
  mondayAuthUrl.searchParams.append("redirect_uri", redirectUri);
  mondayAuthUrl.searchParams.append("response_type", "code");
  mondayAuthUrl.searchParams.append("scope", "boards:read boards:write updates:read teams:read users:read account:read");
  mondayAuthUrl.searchParams.append("state", state);

  return NextResponse.redirect(mondayAuthUrl.toString());
}
