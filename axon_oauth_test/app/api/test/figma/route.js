import { NextResponse } from "next/server";
import { getToken } from "../../oauth/tokens/route.js";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { testType = "basic" } = await request.json().catch(() => ({}));
    
    const token = getToken("figma");
    if (!token) {
      return NextResponse.json(
        { error: "No Figma token found. Please authenticate first." },
        { status: 401 }
      );
    }

    const results = {};

    switch (testType) {
      case "basic":
        // Test basic API access - get user info
        const userResponse = await fetch("https://api.figma.com/v1/me", {
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
              email: userData.email,
              handle: userData.handle,
              img_url: userData.img_url,
            },
          };
        } else {
          results.user = {
            success: false,
            error: await userResponse.text(),
          };
        }
        break;

      case "files":
        // Test getting files
        const filesResponse = await fetch("https://api.figma.com/v1/files", {
          headers: {
            "Authorization": `Bearer ${token.access_token}`,
            "Content-Type": "application/json",
          },
        });

        if (filesResponse.ok) {
          const filesData = await filesResponse.json();
          results.files = {
            success: true,
            count: filesData.files?.length || 0,
            files: filesData.files?.slice(0, 5).map(file => ({
              id: file.id,
              name: file.name,
              type: file.type,
              created_at: file.created_at,
              modified_at: file.modified_at,
            })) || [],
          };
        } else {
          results.files = {
            success: false,
            error: await filesResponse.text(),
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
    console.error("Figma test error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
