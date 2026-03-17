import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Get the first available Firebase token
    const firebaseTokens = global.firebaseTokens || {};
    const tokenEntries = Object.values(firebaseTokens);
    
    if (tokenEntries.length === 0) {
      return NextResponse.json({ 
        error: "No Firebase tokens available. Please authenticate with Firebase first." 
      }, { status: 401 });
    }

    const token = tokenEntries[0];
    
    // Test user info
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        "Authorization": `Bearer ${token.access_token}`
      }
    });

    if (!userResponse.ok) {
      return NextResponse.json({ 
        error: "Failed to fetch Firebase user info",
        status: userResponse.status 
      }, { status: userResponse.status });
    }

    const userData = await userResponse.json();

    // Test Firebase project info (using Google API)
    const projectResponse = await fetch("https://firebase.googleapis.com/v1beta/projects", {
      headers: {
        "Authorization": `Bearer ${token.access_token}`,
        "Content-Type": "application/json"
      }
    });

    let projects = [];
    if (projectResponse.ok) {
      const projectData = await projectResponse.json();
      projects = projectData.projects || [];
    }

    // Test Firebase Auth users (if available)
    const authResponse = await fetch("https://identitytoolkit.googleapis.com/v2/projects", {
      headers: {
        "Authorization": `Bearer ${token.access_token}`,
        "Content-Type": "application/json"
      }
    });

    let authProjects = [];
    if (authResponse.ok) {
      const authData = await authResponse.json();
      authProjects = authData.projects || [];
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        verified_email: userData.verified_email,
        locale: userData.locale
      },
      projects_summary: {
        total_count: projects.length,
        recent_projects: projects.slice(0, 3).map(project => ({
          project_id: project.projectId,
          display_name: project.displayName,
          state: project.state,
          create_time: project.createTime
        }))
      },
      auth_summary: {
        total_count: authProjects.length,
        recent_auth_projects: authProjects.slice(0, 3).map(project => ({
          project_id: project.projectId,
          display_name: project.displayName,
          state: project.state
        }))
      },
      token_info: {
        provider: "Firebase",
        expires_at: token.expires_at,
        created_at: token.created_at,
        has_refresh_token: !!token.refresh_token
      }
    });

  } catch (error) {
    console.error("Firebase test error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error.message 
    }, { status: 500 });
  }
}
