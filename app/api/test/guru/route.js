import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const userToken = process.env.GURU_USER_TOKEN;

    if (!userToken) {
      return NextResponse.json({ 
        error: "Guru user token not configured. Please set GURU_USER_TOKEN environment variable." 
      }, { status: 401 });
    }

    // Test user info endpoint
    const userResponse = await fetch("https://api.getguru.com/api/v1/users/me", {
      headers: {
        "Authorization": `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ 
        error: "Guru API request failed",
        status: userResponse.status,
        statusText: userResponse.statusText
      }, { status: userResponse.status });
    }

    const userData = await userResponse.json();

    // Test cards endpoint
    const cardsResponse = await fetch("https://api.getguru.com/api/v1/cards?limit=10", {
      headers: {
        "Authorization": `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    });

    let cards = [];
    if (cardsResponse.ok) {
      const cardsData = await cardsResponse.json();
      cards = cardsData.results || [];
    }

    // Test collections endpoint
    const collectionsResponse = await fetch("https://api.getguru.com/api/v1/collections", {
      headers: {
        "Authorization": `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    });

    let collections = [];
    if (collectionsResponse.ok) {
      const collectionsData = await collectionsResponse.json();
      collections = collectionsData.results || [];
    }

    // Test teams endpoint
    const teamsResponse = await fetch("https://api.getguru.com/api/v1/teams", {
      headers: {
        "Authorization": `Bearer ${userToken}`,
        "Content-Type": "application/json",
      },
    });

    let teams = [];
    if (teamsResponse.ok) {
      const teamsData = await teamsResponse.json();
      teams = teamsData.results || [];
    }

    return NextResponse.json({
      success: true,
      user: {
        email: userData.email,
        name: userData.name,
        first_name: userData.first_name,
        last_name: userData.last_name,
        title: userData.title,
        photo_url: userData.photo_url,
        created: userData.created,
        last_login: userData.last_login,
      },
      cards_summary: {
        total_count: cards.length,
        recent_cards: cards.slice(0, 3).map(card => ({
          id: card.id,
          title: card.title,
          content_preview: card.content_preview,
          author: card.author,
          created: card.created,
          last_modified: card.last_modified,
          verified: card.verified,
        })),
      },
      collections_summary: {
        total_count: collections.length,
        recent_collections: collections.slice(0, 3).map(collection => ({
          id: collection.id,
          name: collection.name,
          description: collection.description,
          created: collection.created,
          member_count: collection.member_count,
        })),
      },
      teams_summary: {
        total_count: teams.length,
        recent_teams: teams.slice(0, 3).map(team => ({
          id: team.id,
          name: team.name,
          description: team.description,
          created: team.created,
          member_count: team.member_count,
        })),
      },
      api_info: {
        provider: "Guru",
        api_version: "v1",
        user_token_available: !!userToken,
      }
    });

  } catch (error) {
    console.error("Guru test error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error.message 
    }, { status: 500 });
  }
}
