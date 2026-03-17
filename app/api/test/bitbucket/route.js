import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Get first available Bitbucket token
    const bitbucketTokens = global.bitbucketTokens || {};
    const tokenEntries = Object.values(bitbucketTokens);
    
    if (tokenEntries.length === 0) {
      return NextResponse.json({ 
        error: "No Bitbucket tokens available. Please authenticate with Bitbucket first." 
      }, { status: 401 });
    }

    const token = tokenEntries[0];

    // Test user info
    const userResponse = await fetch("https://api.bitbucket.org/2.0/user", {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ 
        error: "Bitbucket API request failed",
        status: userResponse.status,
        statusText: userResponse.statusText
      }, { status: userResponse.status });
    }

    const userData = await userResponse.json();

    // Test repositories endpoint
    const reposResponse = await fetch("https://api.bitbucket.org/2.0/repositories?role=owner&pagelen=5", {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });

    let repos = [];
    if (reposResponse.ok) {
      const reposData = await reposResponse.json();
      repos = reposData.values || [];
    }

    // Test workspaces endpoint
    const workspacesResponse = await fetch("https://api.bitbucket.org/2.0/workspaces?pagelen=5", {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });

    let workspaces = [];
    if (workspacesResponse.ok) {
      const workspacesData = await workspacesResponse.json();
      workspaces = workspacesData.values || [];
    }

    return NextResponse.json({
      success: true,
      user: {
        uuid: userData.uuid,
        username: userData.username,
        display_name: userData.display_name,
        email: userData.email,
        avatar: userData.links?.avatar?.href,
        created_on: userData.created_on,
        is_team: userData.is_team,
      },
      repositories_summary: {
        total_count: repos.length,
        recent_repos: repos.slice(0, 3).map(repo => ({
          uuid: repo.uuid,
          name: repo.name,
          full_name: repo.full_name,
          description: repo.description,
          is_private: repo.is_private,
          language: repo.language,
          created_on: repo.created_on,
          updated_on: repo.updated_on,
        })),
      },
      workspaces_summary: {
        total_count: workspaces.length,
        recent_workspaces: workspaces.slice(0, 3).map(workspace => ({
          uuid: workspace.uuid,
          name: workspace.name,
          slug: workspace.slug,
          is_private: workspace.is_private,
          created_on: workspace.created_on,
        })),
      },
      token_info: {
        expires_at: new Date(token.expires_at).toISOString(),
        has_refresh_token: !!token.refresh_token,
      }
    });

  } catch (error) {
    console.error("Bitbucket test error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error.message 
    }, { status: 500 });
  }
}
