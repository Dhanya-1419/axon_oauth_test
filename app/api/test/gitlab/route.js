import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Get first available GitLab token
    const gitlabTokens = global.gitlabTokens || {};
    const tokenEntries = Object.values(gitlabTokens);
    
    if (tokenEntries.length === 0) {
      return NextResponse.json({ 
        error: "No GitLab tokens available. Please authenticate with GitLab first." 
      }, { status: 401 });
    }

    const token = tokenEntries[0];

    // Test user info
    const userResponse = await fetch("https://gitlab.com/api/v4/user", {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ 
        error: "GitLab API request failed",
        status: userResponse.status,
        statusText: userResponse.statusText
      }, { status: userResponse.status });
    }

    const userData = await userResponse.json();

    // Test projects endpoint
    const projectsResponse = await fetch("https://gitlab.com/api/v4/projects?membership=true&per_page=5", {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });

    let projects = [];
    if (projectsResponse.ok) {
      projects = await projectsResponse.json();
    }

    // Test repositories endpoint (same as projects)
    const reposResponse = await fetch("https://gitlab.com/api/v4/projects?owned=true&per_page=5", {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });

    let repos = [];
    if (reposResponse.ok) {
      repos = await reposResponse.json();
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        username: userData.username,
        name: userData.name,
        email: userData.email,
        avatar_url: userData.avatar_url,
        web_url: userData.web_url,
        created_at: userData.created_at,
      },
      projects_summary: {
        total_count: projects.length,
        recent_projects: projects.slice(0, 3).map(project => ({
          id: project.id,
          name: project.name,
          description: project.description,
          web_url: project.web_url,
          created_at: project.created_at,
          last_activity_at: project.last_activity_at,
        })),
      },
      repositories_summary: {
        total_count: repos.length,
        owned_repos: repos.slice(0, 3).map(repo => ({
          id: repo.id,
          name: repo.name,
          description: repo.description,
          web_url: repo.web_url,
          star_count: repo.star_count,
          forks_count: repo.forks_count,
        })),
      },
      token_info: {
        expires_at: new Date(token.expires_at).toISOString(),
        has_refresh_token: !!token.refresh_token,
      }
    });

  } catch (error) {
    console.error("GitLab test error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error.message 
    }, { status: 500 });
  }
}
