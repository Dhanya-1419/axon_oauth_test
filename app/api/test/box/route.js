import { NextResponse } from "next/server";
import { getToken } from "../../oauth/tokens/route.js";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { testType = "basic" } = await request.json().catch(() => ({}));
    
    const token = getToken("box");
    if (!token) {
      return NextResponse.json(
        { error: "No Box token found. Please authenticate first." },
        { status: 401 }
      );
    }

    const results = {};

    switch (testType) {
      case "basic":
        // Test basic API access - get user info
        const userResponse = await fetch("https://api.box.com/2.0/users/me", {
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
              id: userData.id,
              name: userData.name,
              login: userData.login,
              email: userData.email,
              created_at: userData.created_at,
              language: userData.language,
            },
          };
        } else {
          results.user = {
            success: false,
            error: await userResponse.text(),
          };
        }
        break;

      case "folders":
        // Test getting folders
        const foldersResponse = await fetch("https://api.box.com/2.0/folders/0/items", {
          headers: {
            "Authorization": `Bearer ${token.access_token}`,
            "Content-Type": "application/json",
          },
        });

        if (foldersResponse.ok) {
          const foldersData = await foldersResponse.json();
          results.folders = {
            success: true,
            count: foldersData.entries?.length || 0,
            items: foldersData.entries?.slice(0, 5).map(item => ({
              id: item.id,
              name: item.name,
              type: item.type,
              created_at: item.created_at,
              modified_at: item.modified_at,
            })) || [],
          };
        } else {
          results.folders = {
            success: false,
            error: await foldersResponse.text(),
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
    console.error("Box test error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
