import { NextResponse } from "next/server";
import { getToken } from "../../oauth/tokens/route.js";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { testType = "basic" } = await request.json().catch(() => ({}));
    
    const token = getToken("asana");
    if (!token) {
      return NextResponse.json(
        { error: "No Asana token found. Please authenticate first." },
        { status: 401 }
      );
    }

    const results = {};

    switch (testType) {
      case "basic":
        // Test basic API access - get user info
        const userResponse = await fetch("https://app.asana.com/api/1.0/users/me", {
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
              gid: userData.data.gid,
              name: userData.data.name,
              email: userData.data.email,
              photo: userData.data.photo,
            },
          };
        } else {
          results.user = {
            success: false,
            error: await userResponse.text(),
          };
        }
        break;

      case "workspaces":
        // Test getting workspaces
        const workspacesResponse = await fetch("https://app.asana.com/api/1.0/workspaces", {
          headers: {
            "Authorization": `Bearer ${token.access_token}`,
            "Content-Type": "application/json",
          },
        });

        if (workspacesResponse.ok) {
          const workspacesData = await workspacesResponse.json();
          results.workspaces = {
            success: true,
            count: workspacesData.data?.length || 0,
            workspaces: workspacesData.data?.slice(0, 5).map(ws => ({
              gid: ws.gid,
              name: ws.name,
              is_organization: ws.is_organization,
            })) || [],
          };
        } else {
          results.workspaces = {
            success: false,
            error: await workspacesResponse.text(),
          };
        }
        break;

      case "projects":
        // Test getting projects (from first workspace)
        const projectsResponse = await fetch("https://app.asana.com/api/1.0/projects", {
          headers: {
            "Authorization": `Bearer ${token.access_token}`,
            "Content-Type": "application/json",
          },
        });

        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          results.projects = {
            success: true,
            count: projectsData.data?.length || 0,
            projects: projectsData.data?.slice(0, 5).map(project => ({
              gid: project.gid,
              name: project.name,
              due_date: project.due_date,
              start_on: project.start_on,
              created_at: project.created_at,
            })) || [],
          };
        } else {
          results.projects = {
            success: false,
            error: await projectsResponse.text(),
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
    console.error("Asana test error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
