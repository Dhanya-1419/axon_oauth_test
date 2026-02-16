import { NextResponse } from "next/server";
import { getToken } from "../../oauth/tokens/route.js";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { testType = "basic" } = await request.json().catch(() => ({}));
    
    const token = getToken("notion");
    if (!token) {
      return NextResponse.json(
        { error: "No Notion token found. Please authenticate first." },
        { status: 401 }
      );
    }

    const results = {};

    switch (testType) {
      case "basic":
        // Test basic API access - get user info
        const userResponse = await fetch("https://api.notion.com/v1/users/me", {
          headers: {
            "Authorization": `Bearer ${token.access_token}`,
            "Notion-Version": "2022-06-28",
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
              avatar_url: userData.avatar_url,
              type: userData.type,
              person: userData.person,
            },
          };
        } else {
          results.user = {
            success: false,
            error: await userResponse.text(),
          };
        }
        break;

      case "databases":
        // Test getting databases
        const databasesResponse = await fetch("https://api.notion.com/v1/search", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token.access_token}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filter: {
              property: "object",
              value: "database"
            }
          }),
        });

        if (databasesResponse.ok) {
          const databasesData = await databasesResponse.json();
          results.databases = {
            success: true,
            count: databasesData.results?.length || 0,
            databases: databasesData.results?.slice(0, 5).map(db => ({
              id: db.id,
              title: db.title?.[0]?.plain_text || "Untitled",
              created_time: db.created_time,
              last_edited_time: db.last_edited_time,
            })) || [],
          };
        } else {
          results.databases = {
            success: false,
            error: await databasesResponse.text(),
          };
        }
        break;

      case "pages":
        // Test getting pages
        const pagesResponse = await fetch("https://api.notion.com/v1/search", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token.access_token}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filter: {
              property: "object",
              value: "page"
            },
            page_size: 5,
          }),
        });

        if (pagesResponse.ok) {
          const pagesData = await pagesResponse.json();
          results.pages = {
            success: true,
            count: pagesData.results?.length || 0,
            pages: pagesData.results?.map(page => ({
              id: page.id,
              title: page.properties?.title?.title?.[0]?.plain_text || 
                     page.properties?.Name?.title?.[0]?.plain_text || 
                     "Untitled",
              created_time: page.created_time,
              last_edited_time: page.last_edited_time,
              url: page.url,
            })) || [],
          };
        } else {
          results.pages = {
            success: false,
            error: await pagesResponse.text(),
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
    console.error("Notion test error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
