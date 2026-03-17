import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Get the first available Zendesk token
    const zendeskTokens = global.zendeskTokens || {};
    const tokenEntries = Object.values(zendeskTokens);
    
    if (tokenEntries.length === 0) {
      return NextResponse.json({ 
        error: "No Zendesk tokens available. Please authenticate with Zendesk first." 
      }, { status: 401 });
    }

    const token = tokenEntries[0];
    const subdomain = token.subdomain;

    if (!subdomain) {
      return NextResponse.json({ 
        error: "No Zendesk subdomain available." 
      }, { status: 400 });
    }

    // Test user info
    const userResponse = await fetch(`https://${subdomain}.zendesk.com/api/v2/users/me`, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ 
        error: "Zendesk API request failed",
        status: userResponse.status,
        statusText: userResponse.statusText
      }, { status: userResponse.status });
    }

    const userData = await userResponse.json();
    const user = userData.user;

    // Test tickets endpoint
    const ticketsResponse = await fetch(`https://${subdomain}.zendesk.com/api/v2/tickets?page[size]=5`, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });

    let tickets = [];
    let ticketsCount = 0;
    if (ticketsResponse.ok) {
      const ticketsData = await ticketsResponse.json();
      tickets = ticketsData.tickets || [];
      ticketsCount = ticketsData.count || 0;
    }

    // Test groups endpoint
    const groupsResponse = await fetch(`https://${subdomain}.zendesk.com/api/v2/groups`, {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });

    let groups = [];
    if (groupsResponse.ok) {
      const groupsData = await groupsResponse.json();
      groups = groupsData.groups || [];
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        locale: user.locale,
        time_zone: user.time_zone,
        created_at: user.created_at,
      },
      tickets_summary: {
        total_count: ticketsCount,
        recent_tickets: tickets.slice(0, 3).map(ticket => ({
          id: ticket.id,
          subject: ticket.subject,
          status: ticket.status,
          priority: ticket.priority,
          created_at: ticket.created_at,
        })),
      },
      groups_count: groups.length,
      groups: groups.slice(0, 3).map(group => ({
        id: group.id,
        name: group.name,
        created_at: group.created_at,
      })),
      instance: {
        subdomain: subdomain,
        url: `https://${subdomain}.zendesk.com`,
      },
      token_info: {
        expires_at: new Date(token.expires_at).toISOString(),
        has_refresh_token: !!token.refresh_token,
      }
    });

  } catch (error) {
    console.error("Zendesk test error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error.message 
    }, { status: 500 });
  }
}
