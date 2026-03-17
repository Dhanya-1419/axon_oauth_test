import { NextResponse } from "next/server";
import { getToken } from "../../oauth/tokens/route.js";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { testType = "basic" } = await request.json().catch(() => ({}));
    
    const token = getToken("clickup");
    if (!token) {
      return NextResponse.json(
        { error: "No ClickUp token found. Please authenticate first." },
        { status: 401 }
      );
    }

    const results = {};

    switch (testType) {
      case "basic":
        // Test basic API access - get user info
        const userResponse = await fetch("https://api.clickup.com/api/v2/user", {
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
              id: userData.user.id,
              username: userData.user.username,
              email: userData.user.email,
              color: userData.user.color,
              profilePicture: userData.user.profilePicture,
            },
          };
        } else {
          results.user = {
            success: false,
            error: await userResponse.text(),
          };
        }
        break;

      case "teams":
        // Test getting teams
        const teamsResponse = await fetch("https://api.clickup.com/api/v2/team", {
          headers: {
            "Authorization": `Bearer ${token.access_token}`,
            "Content-Type": "application/json",
          },
        });

        if (teamsResponse.ok) {
          const teamsData = await teamsResponse.json();
          results.teams = {
            success: true,
            count: teamsData.teams?.length || 0,
            teams: teamsData.teams?.slice(0, 5).map(team => ({
              id: team.id,
              name: team.name,
              color: team.color,
              avatar: team.avatar,
            })) || [],
          };
        } else {
          results.teams = {
            success: false,
            error: await teamsResponse.text(),
          };
        }
        break;

      case "tasks":
        // Test getting tasks
        const tasksResponse = await fetch(`https://api.clickup.com/api/v2/team/${token.team_id}/task?limit=5`, {
          headers: {
            "Authorization": `Bearer ${token.access_token}`,
            "Content-Type": "application/json",
          },
        });

        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json();
          results.tasks = {
            success: true,
            count: tasksData.tasks?.length || 0,
            tasks: tasksData.tasks?.map(task => ({
              id: task.id,
              name: task.name,
              status: task.status?.status,
              priority: task.priority,
              due_date: task.due_date,
            })) || [],
          };
        } else {
          results.tasks = {
            success: false,
            error: await tasksResponse.text(),
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
    console.error("ClickUp test error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
