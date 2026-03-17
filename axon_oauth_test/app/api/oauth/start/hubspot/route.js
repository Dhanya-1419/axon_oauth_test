import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.HUBSPOT_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/oauth/callback/hubspot`;
  const scopes = process.env.HUBSPOT_SCOPES || "crm.objects.contacts.read crm.objects.companies.read crm.objects.deals.read crm.objects.tickets.read";

  if (!clientId) {
    return NextResponse.json({ error: "Missing HUBSPOT_CLIENT_ID" }, { status: 500 });
  }

  const authUrl = new URL("https://app.hubspot.com/oauth/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", scopes);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("user_type", "hapikey");

  return NextResponse.redirect(authUrl.toString());
}
