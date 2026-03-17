import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Get first available Trello token
    const trelloTokens = global.trelloTokens || {};
    const tokenEntries = Object.values(trelloTokens);
    
    if (tokenEntries.length === 0) {
      return NextResponse.json({ 
        error: "No Trello tokens available. Please authenticate with Trello first." 
      }, { status: 401 });
    }

    const token = tokenEntries[0];

    // Test user info
    const userResponse = await fetch(`https://api.trello.com/1/members/me`, {
      headers: {
        Authorization: `OAuth ${token.access_token}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ 
        error: "Trello API request failed",
        status: userResponse.status,
        statusText: userResponse.statusText
      }, { status: userResponse.status });
    }

    const userData = await userResponse.json();

    // Test boards endpoint
    const boardsResponse = await fetch(`https://api.trello.com/1/members/me/boards`, {
      headers: {
        Authorization: `OAuth ${token.access_token}`,
      },
    });

    let boards = [];
    if (boardsResponse.ok) {
      boards = await boardsResponse.json();
    }

    // Test cards endpoint (recent cards)
    const cardsResponse = await fetch(`https://api.trello.com/1/members/me/cards`, {
      headers: {
        Authorization: `OAuth ${token.access_token}`,
      },
    });

    let cards = [];
    if (cardsResponse.ok) {
      cards = await cardsResponse.json();
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        username: userData.username,
        fullName: userData.fullName,
        email: userData.email,
        avatarUrl: userData.avatarUrl,
        bio: userData.bio,
      },
      boards_summary: {
        total_count: boards.length,
        recent_boards: boards.slice(0, 3).map(board => ({
          id: board.id,
          name: board.name,
          desc: board.desc,
          closed: board.closed,
          url: board.url,
        })),
      },
      cards_summary: {
        total_count: cards.length,
        recent_cards: cards.slice(0, 3).map(card => ({
          id: card.id,
          name: card.name,
          desc: card.desc,
          closed: card.closed,
          due: card.due,
        })),
      },
      token_info: {
        expires_at: new Date(token.expires_at).toISOString(),
        has_refresh_token: !!token.refresh_token,
      }
    });

  } catch (error) {
    console.error("Trello test error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error.message 
    }, { status: 500 });
  }
}
