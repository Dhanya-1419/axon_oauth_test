import { NextResponse } from "next/server";
import { getToken } from "../../oauth/tokens/route.js";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { testType = "basic" } = await request.json().catch(() => ({}));
    
    const token = getToken("dropbox");
    if (!token) {
      return NextResponse.json(
        { error: "No Dropbox token found. Please authenticate first." },
        { status: 401 }
      );
    }

    const results = {};

    switch (testType) {
      case "basic":
        // Test basic API access - get user info
        const userResponse = await fetch("https://api.dropboxapi.com/2/users/get_current_account", {
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
              account_id: userData.account_id,
              name: userData.name.display_name,
              email: userData.email,
              country: userData.country,
              locale: userData.locale,
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
        const filesResponse = await fetch("https://api.dropboxapi.com/2/files/list_folder", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token.access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: "",
            recursive: false,
            include_media_info: false,
            include_deleted: false,
            include_has_explicit_shared_members: false,
            include_mounted_folders: true,
            limit: 10,
          }),
        });

        if (filesResponse.ok) {
          const filesData = await filesResponse.json();
          results.files = {
            success: true,
            count: filesData.entries?.length || 0,
            files: filesData.entries?.slice(0, 5).map(file => ({
              name: file.name,
              type: file[".tag"],
              size: file.size,
              path_display: file.path_display,
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
    console.error("Dropbox test error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
