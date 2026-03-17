import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.CONFLUENCE_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/oauth/callback/confluence`;
  
  // Debug logging
  console.log('🔍 Confluence OAuth Debug:');
  console.log('Client ID:', clientId);
  console.log('Redirect URI:', redirectUri);
  console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
  
  if (!clientId) {
    return NextResponse.json(
      { error: "Missing CONFLUENCE_CLIENT_ID in environment variables" },
      { status: 500 }
    );
  }

  // Confluence OAuth scopes for read access (user-confirmed working scopes)
  const scopes = "read:content:confluence read:content-details:confluence read:page:confluence read:user:confluence read:content.permission:confluence read:app-data:confluence";

  const authUrl = new URL("https://auth.atlassian.com/authorize");
  authUrl.searchParams.set("audience", "api.atlassian.com");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("scope", scopes);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("prompt", "consent");
  authUrl.searchParams.set("state", Math.random().toString(36).substring(7));

  return NextResponse.redirect(authUrl.toString());
}
