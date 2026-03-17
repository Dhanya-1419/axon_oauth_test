import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Get the first available Intercom token
    const intercomTokens = global.intercomTokens || {};
    const tokenEntries = Object.values(intercomTokens);
    
    if (tokenEntries.length === 0) {
      return NextResponse.json({ 
        error: "No Intercom tokens available. Please authenticate with Intercom first." 
      }, { status: 401 });
    }

    const token = tokenEntries[0];

    // Test admin info
    const adminResponse = await fetch("https://api.intercom.io/me", {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Accept": "application/json",
        "Intercom-Version": "2.10",
      },
    });

    if (!adminResponse.ok) {
      return NextResponse.json({ 
        error: "Intercom API request failed",
        status: adminResponse.status,
        statusText: adminResponse.statusText
      }, { status: adminResponse.status });
    }

    const adminData = await adminResponse.json();
    const admin = adminData.admin;

    // Test conversations endpoint
    const conversationsResponse = await fetch("https://api.intercom.io/conversations?per_page=5", {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Accept": "application/json",
        "Intercom-Version": "2.10",
      },
    });

    let conversations = [];
    let conversationsCount = 0;
    if (conversationsResponse.ok) {
      const conversationsData = await conversationsResponse.json();
      conversations = conversationsData.conversations || [];
      conversationsCount = conversationsData.total_count || 0;
    }

    // Test users endpoint
    const usersResponse = await fetch("https://api.intercom.io/users?per_page=5", {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Accept": "application/json",
        "Intercom-Version": "2.10",
      },
    });

    let users = [];
    let usersCount = 0;
    if (usersResponse.ok) {
      const usersData = await usersResponse.json();
      users = usersData.users || [];
      usersCount = usersData.total_count || 0;
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        app_id: admin.app_id,
        created_at: admin.created_at,
        last_seen_at: admin.last_seen_at,
      },
      conversations_summary: {
        total_count: conversationsCount,
        recent_conversations: conversations.slice(0, 3).map(conv => ({
          id: conv.id,
          title: conv.title,
          state: conv.state,
          created_at: conv.created_at,
          updated_at: conv.updated_at,
        })),
      },
      users_summary: {
        total_count: usersCount,
        recent_users: users.slice(0, 3).map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at,
        })),
      },
      token_info: {
        expires_at: new Date(token.expires_at).toISOString(),
        has_refresh_token: !!token.refresh_token,
      }
    });

  } catch (error) {
    console.error("Intercom test error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error.message 
    }, { status: 500 });
  }
}
