import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: {},
    issues: []
  };

  // Check environment variables
  const clientId = process.env.ATLASSIAN_CLIENT_ID;
  const clientSecret = process.env.ATLASSIAN_CLIENT_SECRET;
  const nextauthUrl = process.env.NEXTAUTH_URL;

  diagnostics.environment = {
    ATLASSIAN_CLIENT_ID: clientId ? 'SET' : 'MISSING',
    ATLASSIAN_CLIENT_SECRET: clientSecret ? 'SET' : 'MISSING',
    NEXTAUTH_URL: nextauthUrl || 'DEFAULTING to http://localhost:3000',
    JIRA_SCOPES: process.env.JIRA_SCOPES || 'DEFAULTING to read:jira-work read:jira-user read:account read:me'
  };

  // Check for issues
  if (!clientId) {
    diagnostics.issues.push('ATLASSIAN_CLIENT_ID is not set in environment variables');
  }
  
  if (!clientSecret) {
    diagnostics.issues.push('ATLASSIAN_CLIENT_SECRET is not set in environment variables');
  }

  // Test OAuth URL construction
  if (clientId) {
    try {
      const redirectUri = `${nextauthUrl || "http://localhost:3000"}/api/oauth/callback/jira`;
      const authUrl = new URL("https://auth.atlassian.com/authorize");
      authUrl.searchParams.set("audience", "api.atlassian.com");
      authUrl.searchParams.set("client_id", clientId);
      authUrl.searchParams.set("scope", process.env.JIRA_SCOPES || "read:jira-work read:jira-user read:account read:me");
      authUrl.searchParams.set("redirect_uri", redirectUri);
      authUrl.searchParams.set("response_type", "code");
      authUrl.searchParams.set("prompt", "consent");

      diagnostics.oauth_url = authUrl.toString();
      diagnostics.redirect_uri = redirectUri;
    } catch (error) {
      diagnostics.issues.push(`Failed to construct OAuth URL: ${error.message}`);
    }
  }

  return NextResponse.json(diagnostics);
}
