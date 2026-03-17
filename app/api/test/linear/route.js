import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Get first available Linear token
    const linearTokens = global.linearTokens || {};
    const tokenEntries = Object.values(linearTokens);
    
    if (tokenEntries.length === 0) {
      return NextResponse.json({ 
        error: "No Linear tokens available. Please authenticate with Linear first." 
      }, { status: 401 });
    }

    const token = tokenEntries[0];

    // Test user info
    const userResponse = await fetch("https://api.linear.app/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token.access_token,
      },
      body: JSON.stringify({
        query: "{ viewer { id name email avatarUrl } }"
      }),
    });

    if (!userResponse.ok) {
      return NextResponse.json({ 
        error: "Linear API request failed",
        status: userResponse.status,
        statusText: userResponse.statusText
      }, { status: userResponse.status });
    }

    const userData = await userResponse.json();
    const user = userData.data?.viewer;

    // Test teams endpoint
    const teamsResponse = await fetch("https://api.linear.app/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token.access_token,
      },
      body: JSON.stringify({
        query: "{ teams(first: 5) { nodes { id name icon } } }"
      }),
    });

    let teams = [];
    if (teamsResponse.ok) {
      const teamsData = await teamsResponse.json();
      teams = teamsData.data?.teams?.nodes || [];
    }

    // Test projects endpoint
    const projectsResponse = await fetch("https://api.linear.app/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token.access_token,
      },
      body: JSON.stringify({
        query: "{ projects(first: 5) { nodes { id name description color } } }"
      }),
    });

    let projects = [];
    if (projectsResponse.ok) {
      const projectsData = await projectsResponse.json();
      projects = projectsData.data?.projects?.nodes || [];
    }

    // Test issues endpoint
    const issuesResponse = await fetch("https://api.linear.app/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token.access_token,
      },
      body: JSON.stringify({
        query: "{ issues(first: 5) { nodes { id title description state { name } } } }"
      }),
    });

    let issues = [];
    if (issuesResponse.ok) {
      const issuesData = await issuesResponse.json();
      issues = issuesData.data?.issues?.nodes || [];
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_url: user.avatarUrl,
      },
      teams_summary: {
        total_count: teams.length,
        teams: teams.slice(0, 3).map(team => ({
          id: team.id,
          name: team.name,
          icon: team.icon,
        })),
      },
      projects_summary: {
        total_count: projects.length,
        recent_projects: projects.slice(0, 3).map(project => ({
          id: project.id,
          name: project.name,
          description: project.description,
          color: project.color,
        })),
      },
      issues_summary: {
        total_count: issues.length,
        recent_issues: issues.slice(0, 3).map(issue => ({
          id: issue.id,
          title: issue.title,
          state: issue.state?.name,
        })),
      },
      token_info: {
        expires_at: new Date(token.expires_at).toISOString(),
        has_refresh_token: !!token.refresh_token,
      }
    });

  } catch (error) {
    console.error("Linear test error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error.message 
    }, { status: 500 });
  }
}
