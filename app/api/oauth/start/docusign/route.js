import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.DOCUSIGN_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/oauth/callback/docusign`;
  const scopes = process.env.DOCUSIGN_SCOPES || "signature";

  if (!clientId) {
    return NextResponse.json({ error: "Missing DOCUSIGN_CLIENT_ID" }, { status: 500 });
  }

  // DocuSign uses account.docusign.com for OAuth
  const authUrl = new URL("https://account.docusign.com/oauth/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", scopes);

  return NextResponse.redirect(authUrl.toString());
}
