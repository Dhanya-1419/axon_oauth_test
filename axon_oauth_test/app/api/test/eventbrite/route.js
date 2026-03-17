import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { testType = "basic" } = await request.json().catch(() => ({}));
    
    const clientId = process.env.EVENTBRITE_CLIENT_ID;
    const clientSecret = process.env.EVENTBRITE_CLIENT_SECRET;
    const privateToken = process.env.EVENTBRITE_PRIVATE_TOKEN;
    const publicToken = process.env.EVENTBRITE_PUBLIC_TOKEN;
    
    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { error: "Missing EVENTBRITE_CLIENT_ID or EVENTBRITE_CLIENT_SECRET in environment variables" },
        { status: 401 }
      );
    }

    const results = {};

    switch (testType) {
      case "basic":
        // Test basic API access - get user info using OAuth token
        const userResponse = await fetch("https://www.eventbriteapi.com/v3/users/me/", {
          headers: {
            "Authorization": `Bearer ${privateToken || publicToken}`,
            "Content-Type": "application/json",
          },
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          results.user = {
            success: true,
            data: {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              created: userData.created,
              image_id: userData.image_id,
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
        const eventsResponse = await fetch("https://www.eventbriteapi.com/v3/users/me/events/", {
          headers: {
            "Authorization": `Bearer ${privateToken || publicToken}`,
            "Content-Type": "application/json",
          },
        });
        
        if (eventsResponse.ok) {
          const eventsData = await eventsResponse.json();
          results.events = {
            success: true,
            count: eventsData.events?.length || 0,
            events: eventsData.events?.slice(0, 5).map(event => ({
              id: event.id,
              name: event.name?.text,
              start: event.start?.local,
              end: event.end?.local,
              status: event.status,
              currency: event.currency,
            })) || [],
          };
        } else {
          results.events = {
            success: false,
            error: await eventsResponse.text(),
          };
        }
        break;

      case "venues":
        // Test getting venues
        const venuesResponse = await fetch("https://www.eventbriteapi.com/v3/users/me/venues/", {
          headers: {
            "Authorization": `Bearer ${privateToken || publicToken}`,
            "Content-Type": "application/json",
          },
        });
        
        if (venuesResponse.ok) {
          const venuesData = await venuesResponse.json();
          results.venues = {
            success: true,
            count: venuesData.venues?.length || 0,
            venues: venuesData.venues?.slice(0, 5).map(venue => ({
              id: venue.id,
              name: venue.name,
              address: venue.address,
              capacity: venue.capacity,
            })) || [],
          };
        } else {
          results.venues = {
            success: false,
            error: await venuesResponse.text(),
          };
        }
        break;

      case "oauth_test":
        // Test OAuth credentials by getting token
        try {
          const tokenResponse = await fetch("https://www.eventbrite.com/oauth/token", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              grant_type: "client_credentials",
              client_id: clientId,
              client_secret: clientSecret,
            }),
          });

          if (tokenResponse.ok) {
            const tokenData = await tokenResponse.json();
            results.oauth = {
              success: true,
              data: {
                access_token: tokenData.access_token?.substring(0, 20) + "...",
                token_type: tokenData.token_type,
                expires_in: tokenData.expires_in,
              },
            };
          } else {
            results.oauth = {
              success: false,
              error: await tokenResponse.text(),
            };
          }
        } catch (error) {
          results.oauth = {
            success: false,
            error: error.message,
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
      credentials: {
        client_id: clientId?.substring(0, 10) + "...",
        has_private_token: !!privateToken,
        has_public_token: !!publicToken,
      },
      results,
    });

  } catch (error) {
    console.error("Eventbrite test error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
