import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { testType = "basic" } = await request.json().catch(() => ({}));
    
    // Get OAuth token from storage
    const { getToken } = await import("../../oauth/tokens/route.js");
    const tokenData = getToken("confluence");
    
    if (!tokenData || !tokenData.access_token) {
      return NextResponse.json(
        { error: "No Confluence OAuth token found. Please authenticate first." },
        { status: 401 }
      );
    }

    const results = {};

    switch (testType) {
      case "basic":
        // Test basic user info
        const userResponse = await fetch("https://api.atlassian.com/me", {
          headers: {
            "Authorization": `Bearer ${tokenData.access_token}`,
            "Accept": "application/json",
          },
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          results.user = {
            success: true,
            data: {
              account_id: userData.account_id,
              account_type: userData.account_type,
              email: userData.email,
              name: userData.name,
              picture: userData.picture,
              account_status: userData.account_status,
            },
          };
        } else {
          results.user = {
            success: false,
            error: await userResponse.text(),
          };
        }
        break;

      case "spaces":
        // Test getting Confluence spaces
        const spacesResponse = await fetch("https://api.atlassian.com/ex/confluence/rest/api/space", {
          headers: {
            "Authorization": `Bearer ${tokenData.access_token}`,
            "Accept": "application/json",
          },
        });
        
        if (spacesResponse.ok) {
          const spacesData = await spacesResponse.json();
          results.spaces = {
            success: true,
            count: spacesData.size || 0,
            spaces: spacesData.results?.slice(0, 5).map(space => ({
              id: space.id,
              key: space.key,
              name: space.name,
              type: space.type,
              status: space.status,
            })) || [],
          };
        } else {
          results.spaces = {
            success: false,
            error: await spacesResponse.text(),
          };
        }
        break;

      case "content":
        // Test getting recent content
        const contentResponse = await fetch("https://api.atlassian.com/ex/confluence/rest/api/content/search?cql=type=page&limit=5", {
          headers: {
            "Authorization": `Bearer ${tokenData.access_token}`,
            "Accept": "application/json",
          },
        });
        
        if (contentResponse.ok) {
          const contentData = await contentResponse.json();
          results.content = {
            success: true,
            count: contentData.size || 0,
            results: contentData.results?.map(page => ({
              id: page.id,
              title: page.title,
              type: page.type,
              status: page.status,
              space: page.space?.name,
              created: page.created,
            })) || [],
          };
        } else {
          results.content = {
            success: false,
            error: await contentResponse.text(),
          };
        }
        break;

      case "token_info":
        // Test token information
        results.token_info = {
          success: true,
          data: {
            access_token: tokenData.access_token?.substring(0, 20) + "...",
            refresh_token: tokenData.refresh_token ? tokenData.refresh_token.substring(0, 20) + "..." : null,
            expires_in: tokenData.expires_in,
            scope: tokenData.scope,
            token_type: tokenData.token_type,
            obtained_at: tokenData.obtained_at,
          },
        };
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
    console.error("Confluence OAuth test error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
