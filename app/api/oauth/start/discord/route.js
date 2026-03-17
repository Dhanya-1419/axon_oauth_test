import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/oauth/callback/discord`;

  if (!clientId) {
    return NextResponse.json({ error: "Discord client ID not configured" }, { status: 500 });
  }

  const discordAuthUrl = new URL("https://discord.com/api/oauth2/authorize");
  discordAuthUrl.searchParams.append("client_id", clientId);
  discordAuthUrl.searchParams.append("redirect_uri", redirectUri);
  discordAuthUrl.searchParams.append("response_type", "code");
  discordAuthUrl.searchParams.append("scope", "identify email guilds");

  return NextResponse.redirect(discordAuthUrl.toString());
}
