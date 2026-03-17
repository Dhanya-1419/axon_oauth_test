import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl) {
      return NextResponse.json({ 
        error: "Supabase URL not configured. Please set SUPABASE_URL environment variable." 
      }, { status: 401 });
    }

    if (!supabaseKey) {
      return NextResponse.json({ 
        error: "Supabase API key not configured. Please set SUPABASE_ANON_KEY environment variable." 
      }, { status: 401 });
    }

    // Test projects endpoint
    const projectsResponse = await fetch(`${supabaseUrl}/rest/v1/projects`, {
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!projectsResponse.ok && projectsResponse.status !== 404) {
      return NextResponse.json({ 
        error: "Supabase API request failed",
        status: projectsResponse.status,
        statusText: projectsResponse.statusText
      }, { status: projectsResponse.status });
    }

    let projects = [];
    if (projectsResponse.ok) {
      projects = await projectsResponse.json();
    }

    // Test tables endpoint
    const tablesResponse = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });

    let tables = [];
    if (tablesResponse.ok) {
      const tablesData = await tablesResponse.json();
      tables = tablesData.definitions || [];
    }

    // Test functions endpoint
    const functionsResponse = await fetch(`${supabaseUrl}/functions/v1/`, {
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
    });

    let functions = [];
    if (functionsResponse.ok) {
      const functionsData = await functionsResponse.json();
      functions = functionsData.functions || [];
    }

    // Test auth endpoint
    const authResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
    });

    let authUser = null;
    if (authResponse.ok) {
      authUser = await authResponse.json();
    }

    return NextResponse.json({
      success: true,
      project: {
        url: supabaseUrl,
        api_key_available: !!supabaseKey,
      },
      projects_summary: {
        total_count: projects.length,
        recent_projects: projects.slice(0, 3).map(project => ({
          id: project.id,
          name: project.name,
          status: project.status,
          organization_id: project.organization_id,
        })),
      },
      tables_summary: {
        total_count: tables.length,
        recent_tables: tables.slice(0, 3).map(table => ({
          name: table.name,
          schema: table.schema,
          description: table.description,
        })),
      },
      functions_summary: {
        total_count: functions.length,
        recent_functions: functions.slice(0, 3).map(func => ({
          name: func.name,
          status: func.status,
          verify_jwt: func.verify_jwt,
        })),
      },
      auth_summary: {
        user_available: !!authUser,
        user: authUser ? {
          id: authUser.id,
          email: authUser.email,
          aud: authUser.aud,
          role: authUser.role,
        } : null,
      },
      api_info: {
        provider: "Supabase",
        api_version: "rest/v1",
        project_url: supabaseUrl,
      }
    });

  } catch (error) {
    console.error("Supabase test error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error.message 
    }, { status: 500 });
  }
}
