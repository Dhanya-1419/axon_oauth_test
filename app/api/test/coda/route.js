import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const apiKey = process.env.CODA_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ 
        error: "Coda API key not configured. Please set CODA_API_KEY environment variable." 
      }, { status: 401 });
    }

    // Test docs endpoint
    const docsResponse = await fetch("https://coda.io/apis/v1/docs", {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!docsResponse.ok) {
      return NextResponse.json({ 
        error: "Coda API request failed",
        status: docsResponse.status,
        statusText: docsResponse.statusText
      }, { status: docsResponse.status });
    }

    const docsData = await docsResponse.json();

    // Test user info endpoint
    const userResponse = await fetch("https://coda.io/apis/v1/whoami", {
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    let userData = null;
    if (userResponse.ok) {
      userData = await userResponse.json();
    }

    // Test recent docs details
    let recentDocsDetails = [];
    if (docsData.items && docsData.items.length > 0) {
      const recentDocIds = docsData.items.slice(0, 3).map(doc => doc.id);
      
      for (const docId of recentDocIds) {
        try {
          const docResponse = await fetch(`https://coda.io/apis/v1/docs/${docId}`, {
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
          });

          if (docResponse.ok) {
            const docData = await docResponse.json();
            recentDocsDetails.push({
              id: docData.id,
              name: docData.name,
              browserLink: docData.browserLink,
              createdAt: docData.createdAt,
              updatedAt: docData.updatedAt,
              owner: docData.owner,
              workspace: docData.workspace,
            });
          }
        } catch (error) {
          console.error(`Error fetching doc ${docId}:`, error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      user: userData ? {
        name: userData.name,
        email: userData.email,
        login: userData.login,
        profileImageLink: userData.profileImageLink,
      } : null,
      docs_summary: {
        total_count: docsData.items?.length || 0,
        recent_docs: recentDocsDetails,
      },
      api_info: {
        provider: "Coda",
        api_version: "v1",
        api_key_available: !!apiKey,
      }
    });

  } catch (error) {
    console.error("Coda test error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error.message 
    }, { status: 500 });
  }
}
