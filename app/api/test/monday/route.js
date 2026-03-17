import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Get first available Monday token
    const mondayTokens = global.mondayTokens || {};
    const tokenEntries = Object.values(mondayTokens);
    
    if (tokenEntries.length === 0) {
      return NextResponse.json({ 
        error: "No Monday tokens available. Please authenticate with Monday.com first." 
      }, { status: 401 });
    }

    const token = tokenEntries[0];

    // Test user info
    const userResponse = await fetch("https://api.monday.com/v2/users/me", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token.access_token,
      },
      body: JSON.stringify({
        query: "{ me { id name email created_at photo_url } }"
      }),
    });

    if (!userResponse.ok) {
      return NextResponse.json({ 
        error: "Monday API request failed",
        status: userResponse.status,
        statusText: userResponse.statusText
      }, { status: userResponse.status });
    }

    const userData = await userResponse.json();
    const user = userData.data?.me;

    // Test boards endpoint
    const boardsResponse = await fetch("https://api.monday.com/v2/boards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token.access_token,
      },
      body: JSON.stringify({
        query: "{ boards(limit: 5) { id name state created_at updated_at } }"
      }),
    });

    let boards = [];
    let boardsCount = 0;
    if (boardsResponse.ok) {
      const boardsData = await boardsResponse.json();
      boards = boardsData.data?.boards || [];
      boardsCount = boards.length;
    }

    // Test teams endpoint
    const teamsResponse = await fetch("https://api.monday.com/v2/teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token.access_token,
      },
      body: JSON.stringify({
        query: "{ teams { id name picture_url } }"
      }),
    });

    let teams = [];
    if (teamsResponse.ok) {
      const teamsData = await teamsResponse.json();
      teams = teamsData.data?.teams || [];
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        photo_url: user.photo_url,
        created_at: user.created_at,
      },
      boards_summary: {
        total_count: boardsCount,
        recent_boards: boards.slice(0, 3).map(board => ({
          id: board.id,
          name: board.name,
          state: board.state,
          created_at: board.created_at,
          updated_at: board.updated_at,
        })),
      },
      teams_count: teams.length,
      teams: teams.slice(0, 3).map(team => ({
        id: team.id,
        name: team.name,
        picture_url: team.picture_url,
      })),
      token_info: {
        expires_at: new Date(token.expires_at).toISOString(),
        has_refresh_token: !!token.refresh_token,
      }
    });

  } catch (error) {
    console.error("Monday test error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error.message 
    }, { status: 500 });
  }
}
