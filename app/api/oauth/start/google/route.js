import { NextResponse } from "next/server";
import { getOAuthConfig } from "../../utils";

export const runtime = "nodejs";

export async function GET(req) {
  const searchParams = new URL(req.url).searchParams;
  const { clientId, redirectUri, scopes } = await getOAuthConfig("google", searchParams, req);

  if (!clientId) {
    return NextResponse.json({ error: "Missing GOOGLE_CLIENT_ID or manual config" }, { status: 500 });
  }

  // Default scopes for requested Google access
  const defaultScopes = "https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/documents https://www.googleapis.com/auth/contacts";
  
  // If custom scopes are provided, use them, otherwise use default safe scopes
  const finalScopes = scopes || defaultScopes;
  
  // Check for sensitive/restricted scopes and add warnings
  const sensitiveScopes = [
    'gmail.readonly', 'gmail.modify', 'gmail.compose', 'gmail.settings.basic', 'gmail.labels',
    'drive.readonly', 'drive.file', 'drive.metadata.readonly',
    'contacts', 'documents', 'calendar.readonly'
  ];
  
  const hasSensitiveScopes = sensitiveScopes.some(scope => finalScopes.includes(scope));
  
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", finalScopes);
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");

  // Add warning for sensitive scopes
  if (hasSensitiveScopes) {
    console.warn("⚠️  Using sensitive Google OAuth scopes. Your app may require Google's verification for production use.");
  }

  return NextResponse.redirect(authUrl.toString());
}
