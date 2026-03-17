import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Get first available Adobe token
    const adobeTokens = global.adobeTokens || {};
    const tokenEntries = Object.values(adobeTokens);
    
    if (tokenEntries.length === 0) {
      return NextResponse.json({ 
        error: "No Adobe tokens available. Please authenticate with Adobe first." 
      }, { status: 401 });
    }

    const token = tokenEntries[0];

    // Test user info
    const userResponse = await fetch("https://ims-na1.adobelogin.com/ims/userinfo", {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ 
        error: "Adobe API request failed",
        status: userResponse.status,
        statusText: userResponse.statusText
      }, { status: userResponse.status });
    }

    const userData = await userResponse.json();

    // Test organizations endpoint
    const orgsResponse = await fetch("https://usermanagement.adobe.io/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "x-api-key": process.env.ADOBE_CLIENT_ID,
      },
    });

    let organizations = [];
    if (orgsResponse.ok) {
      const orgsData = await orgsResponse.json();
      organizations = orgsData.orgs || [];
    }

    // Test projects endpoint (if available)
    let projects = [];
    if (organizations.length > 0) {
      const firstOrgId = organizations[0].org_id;
      const projectsResponse = await fetch(`https://cc-api.adobe.io/api/v1/projects?org_id=${firstOrgId}`, {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
          "x-api-key": process.env.ADOBE_CLIENT_ID,
        },
      });

      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        projects = projectsData.projects || [];
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        user_id: userData.user_id,
        display_name: userData.display_name,
        email: userData.email,
        account_type: userData.account_type,
        country: userData.country,
        locale: userData.locale,
      },
      organizations_summary: {
        total_count: organizations.length,
        organizations: organizations.slice(0, 3).map(org => ({
          org_id: org.org_id,
          org_name: org.org_name,
          org_type: org.org_type,
          is_primary: org.is_primary,
        })),
      },
      projects_summary: {
        total_count: projects.length,
        projects: projects.slice(0, 3).map(project => ({
          id: project.id,
          name: project.name,
          description: project.description,
          created_at: project.created_at,
          updated_at: project.updated_at,
        })),
      },
      token_info: {
        expires_at: new Date(token.expires_at).toISOString(),
        has_refresh_token: !!token.refresh_token,
      }
    });

  } catch (error) {
    console.error("Adobe test error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error.message 
    }, { status: 500 });
  }
}
