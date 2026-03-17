import { NextResponse } from "next/server";
import { getToken } from "../../oauth/tokens/route.js";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { testType = "basic" } = await request.json().catch(() => ({}));
    
    const token = getToken("jira");
    if (!token) {
      return NextResponse.json(
        { error: "No Jira token found. Please authenticate first." },
        { status: 401 }
      );
    }

    const results = {};

    switch (testType) {
      case "basic":
        // Test basic API access - get user info
        const userResponse = await fetch("https://api.atlassian.com/me", {
          headers: {
            "Authorization": `Bearer ${token.access_token}`,
            "Accept": "application/json",
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          results.user = {
            success: true,
            data: {
              account_id: userData.account_id,
              email: userData.email,
              name: userData.name,
              picture: userData.picture,
            },
          };
        } else {
          results.user = {
            success: false,
            error: await userResponse.text(),
          };
        }
        break;

      case "projects":
        // Test getting accessible projects
        const projectsResponse = await fetch("https://api.atlassian.com/ex/jira/rest/api/3/project/search", {
          headers: {
            "Authorization": `Bearer ${token.access_token}`,
            "Accept": "application/json",
          },
        });

        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json();
          results.projects = {
            success: true,
            count: projectsData.total || 0,
            projects: projectsData.values?.slice(0, 5).map(p => ({
              id: p.id,
              key: p.key,
              name: p.name,
              projectTypeKey: p.projectTypeKey,
            })) || [],
          };
        } else {
          results.projects = {
            success: false,
            error: await projectsResponse.text(),
          };
        }
        break;

      case "issues":
        // Test getting recent issues
        const issuesResponse = await fetch("https://api.atlassian.com/ex/jira/rest/api/3/search?orderBy=created&fields=id,key,summary,status&maxResults=5", {
          headers: {
            "Authorization": `Bearer ${token.access_token}`,
            "Accept": "application/json",
          },
        });

        if (issuesResponse.ok) {
          const issuesData = await issuesResponse.json();
          results.issues = {
            success: true,
            count: issuesData.total || 0,
            issues: issuesData.issues?.map(i => ({
              id: i.id,
              key: i.key,
              summary: i.fields.summary,
              status: i.fields.status.name,
            })) || [],
          };
        } else {
          results.issues = {
            success: false,
            error: await issuesResponse.text(),
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
    console.error("Jira test error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
