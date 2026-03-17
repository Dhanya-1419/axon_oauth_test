import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {},
    issues: []
  };

  // Check environment variables
  const clientId = process.env.NOTION_CLIENT_ID;
  const clientSecret = process.env.NOTION_CLIENT_SECRET;
  const nextauthUrl = process.env.NEXTAUTH_URL;

  diagnostics.environment = {
    NOTION_CLIENT_ID: clientId ? 'SET' : 'MISSING',
    NOTION_CLIENT_SECRET: clientSecret ? 'SET' : 'MISSING',
    NOTION_AUTH_URL: process.env.NOTION_AUTH_URL || 'DEFAULTING to https://api.notion.com/v1/oauth/authorize',
    NEXTAUTH_URL: nextauthUrl || 'DEFAULTING to http://localhost:3000',
    NOTION_SCOPES: process.env.NOTION_SCOPES || 'DEFAULTING to no scopes (Notion uses implicit permissions)'
  };

  // Check for issues
  if (!clientId) {
    diagnostics.issues.push('NOTION_CLIENT_ID is not set in environment variables');
  }
  
  if (!clientSecret) {
    diagnostics.issues.push('NOTION_CLIENT_SECRET is not set in environment variables');
  }

  // Test OAuth URL construction
  if (clientId) {
    try {
      const redirectUri = `${nextauthUrl || "http://localhost:3000"}/api/oauth/callback/notion`;
      const authUrl = new URL(process.env.NOTION_AUTH_URL || "https://api.notion.com/v1/oauth/authorize");
      authUrl.searchParams.set("client_id", clientId);
      authUrl.searchParams.set("response_type", "code");
      authUrl.searchParams.set("redirect_uri", redirectUri);
      authUrl.searchParams.set("owner", "user");

      diagnostics.oauth_url = authUrl.toString();
      diagnostics.redirect_uri = redirectUri;
    } catch (error) {
      diagnostics.issues.push(`Failed to construct OAuth URL: ${error.message}`);
    }
  }

  return NextResponse.json(diagnostics);
}
