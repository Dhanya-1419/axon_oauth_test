import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.MICROSOFT_CLIENT_ID || "0c141f87-c932-4cba-ab34-0f50e1df3be6";
  const redirectUri = `https://localhost:3000/api/oauth/callback/microsoft`;
  const scopes = process.env.MICROSOFT_SCOPES || "https://graph.microsoft.com/User.Read https://graph.microsoft.com/Mail.Read https://graph.microsoft.com/Mail.ReadWrite https://graph.microsoft.com/Mail.Send https://graph.microsoft.com/Contacts.Read https://graph.microsoft.com/Contacts.ReadWrite https://graph.microsoft.com/Calendars.ReadWrite https://graph.microsoft.com/Files.ReadWrite.All https://graph.microsoft.com/Sites.ReadWrite.All https://graph.microsoft.com/Notes.ReadWrite.All https://graph.microsoft.com/Chat.ReadWrite https://graph.microsoft.com/Team.ReadBasic.All https://graph.microsoft.com/Channel.ReadBasic.All offline_access";

  if (!clientId) {
    return NextResponse.json({ error: "Missing MICROSOFT_CLIENT_ID" }, { status: 500 });
  }

  const authUrl = new URL("https://login.microsoftonline.com/common/oauth2/v2.0/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", scopes);
  authUrl.searchParams.set("response_mode", "query");

  return NextResponse.redirect(authUrl.toString());
}
