import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.ZOHO_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/oauth/callback/zoho`;

  if (!clientId) {
    return NextResponse.json({ error: "Zoho client ID not configured" }, { status: 500 });
  }

  const zohoAuthUrl = new URL("https://accounts.zoho.com/oauth/v2/auth");
  zohoAuthUrl.searchParams.append("client_id", clientId);
  zohoAuthUrl.searchParams.append("redirect_uri", redirectUri);
  zohoAuthUrl.searchParams.append("response_type", "code");
  zohoAuthUrl.searchParams.append("scope", "ZohoCRM.modules.all,ZohoCRM.settings.all,ZohoCRM.users.all");
  zohoAuthUrl.searchParams.append("access_type", "offline");

  return NextResponse.redirect(zohoAuthUrl.toString());
}
