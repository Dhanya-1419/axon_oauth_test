import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Get Ticketbud API key from environment
    const apiKey = process.env.TICKETBUD_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: "Ticketbud API key not configured. Please set TICKETBUD_API_KEY environment variable." 
      }, { status: 401 });
    }

    // Test user info endpoint
    const userResponse = await fetch("https://api.ticketbud.com/v1/users/me", {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ 
        error: "Ticketbud API request failed",
        status: userResponse.status,
        statusText: userResponse.statusText
      }, { status: userResponse.status });
    }

    const userData = await userResponse.json();

    // Test events endpoint
    const eventsResponse = await fetch("https://api.ticketbud.com/v1/events?limit=5", {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    let events = [];
    let eventsCount = 0;
    if (eventsResponse.ok) {
      const eventsData = await eventsResponse.json();
      events = eventsData.events || [];
      eventsCount = eventsData.total_count || events.length;
    }

    // Test tickets endpoint
    const ticketsResponse = await fetch("https://api.ticketbud.com/v1/tickets?limit=5", {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    let tickets = [];
    let ticketsCount = 0;
    if (ticketsResponse.ok) {
      const ticketsData = await ticketsResponse.json();
      tickets = ticketsData.tickets || [];
      ticketsCount = ticketsData.total_count || tickets.length;
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        company: userData.company,
        created_at: userData.created_at,
      },
      events_summary: {
        total_count: eventsCount,
        recent_events: events.slice(0, 3).map(event => ({
          id: event.id,
          name: event.name,
          description: event.description,
          start_time: event.start_time,
          end_time: event.end_time,
          status: event.status,
        })),
      },
      tickets_summary: {
        total_count: ticketsCount,
        recent_tickets: tickets.slice(0, 3).map(ticket => ({
          id: ticket.id,
          subject: ticket.subject,
          description: ticket.description,
          status: ticket.status,
          priority: ticket.priority,
          created_at: ticket.created_at,
        })),
      },
      api_info: {
        provider: "Ticketbud",
        api_key_available: !!apiKey,
        api_version: "v1",
      }
    });

  } catch (error) {
    console.error("Ticketbud test error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error.message 
    }, { status: 500 });
  }
}
