import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Get the first available Discord token
    const discordTokens = global.discordTokens || {};
    const tokenEntries = Object.values(discordTokens);
    
    if (tokenEntries.length === 0) {
      return NextResponse.json({ 
        error: "No Discord tokens available. Please authenticate with Discord first." 
      }, { status: 401 });
    }

    const token = tokenEntries[0];
    
    // Test basic user info
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ 
        error: "Discord API request failed",
        status: userResponse.status,
        statusText: userResponse.statusText
      }, { status: userResponse.status });
    }

    const userData = await userResponse.json();

    // Test guilds endpoint
    const guildsResponse = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });

    let guilds = [];
    if (guildsResponse.ok) {
      guilds = await guildsResponse.json();
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        username: `${userData.username}#${userData.discriminator}`,
        email: userData.email,
        verified: userData.verified,
        avatar: userData.avatar,
      },
      guilds_count: guilds.length,
      guilds: guilds.slice(0, 5).map(guild => ({
        id: guild.id,
        name: guild.name,
        owner: guild.owner,
        permissions: guild.permissions,
      })),
      token_info: {
        expires_at: new Date(token.expires_at).toISOString(),
        has_refresh_token: !!token.refresh_token,
      }
    });

  } catch (error) {
    console.error("Discord test error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error.message 
    }, { status: 500 });
  }
}
