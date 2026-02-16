import { NextResponse } from "next/server";
import { getToken } from "../../oauth/tokens/route.js";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { testType = "basic" } = await request.json().catch(() => ({}));
    
    const token = getToken("calendly");
    if (!token) {
      return NextResponse.json(
        { error: "No Calendly token found. Please authenticate first." },
        { status: 401 }
      );
    }

    const results = {};

    switch (testType) {
      case "basic":
        // Test basic API access - get user info
        const userResponse = await fetch("https://api.calendly.com/users/me", {
          headers: {
            "Authorization": `Bearer ${token.access_token}`,
            "Content-Type": "application/json",
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          results.user = {
            success: true,
            data: {
              id: userData.resource.id,
              name: userData.resource.name,
              email: userData.resource.email,
              avatar: userData.resource.avatar_url,
              timezone: userData.resource.timezone,
            },
          };
        } else {
          results.user = {
            success: false,
            error: await userResponse.text(),
          };
        }
        break;

      case "events":
        // Test getting events
        const eventsResponse = await fetch("https://api.calendly.com/scheduled_events", {
          headers: {
            "Authorization": `Bearer ${token.access_token}`,
            "Content-Type": "application/json",
          },
        });

        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          results.events = {
            success: true,
            count: eventsData.collection?.length || 0,
            events: eventsData.collection?.slice(0, 5).map(event => ({
              id: event.id,
              name: event.name,
              start: event.start,
              end: event.end,
              status: event.status,
            })) || [],
          };
        } else {
          results.events = {
            success: false,
            error: await eventsResponse.text(),
          };
        }
        break;

      default:
        return NextResponse.json({ error: "Invalid test type" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      testType,
      timestamp: new Date().toISOString(),
      results,
    });

  } catch (error) {
    console.error("Calendly test error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
