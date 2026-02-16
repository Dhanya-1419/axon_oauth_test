import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { testType = "basic", baseUrl } = await request.json().catch(() => ({}));
    
    const apiKey = process.env.DIGISIGN_API_KEY;
    const defaultBaseUrl = process.env.DIGISIGN_BASE_URL || baseUrl || "https://api.digisign.com";
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing DIGISIGN_API_KEY in environment variables" },
        { status: 401 }
      );
    }

    const results = {};

    switch (testType) {
      case "basic":
        // Test basic API access - health check or user info
        try {
          const healthResponse = await fetch(`${defaultBaseUrl}/`, {
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
          });
          
          if (healthResponse.ok) {
            const healthData = await healthResponse.text();
            results.health = {
              success: true,
              data: {
                response: healthData.substring(0, 200), // Limit response length
                status: healthResponse.status,
              },
            };
          } else {
            results.health = {
              success: false,
              error: await healthResponse.text(),
              status: healthResponse.status,
            };
          }
        } catch (error) {
          results.health = {
            success: false,
            error: error.message,
          };
        }
        break;

      case "user":
        // Test getting user info (common endpoint pattern)
        try {
          const userResponse = await fetch(`${defaultBaseUrl}/user`, {
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
          });
          
          if (userResponse.ok) {
            const userData = await userResponse.json();
            results.user = {
              success: true,
              data: userData,
            };
          } else {
            results.user = {
              success: false,
              error: await userResponse.text(),
              status: userResponse.status,
            };
          }
        } catch (error) {
          results.user = {
            success: false,
            error: error.message,
          };
        }
        break;

      case "documents":
        // Test getting documents (common endpoint pattern)
        try {
          const documentsResponse = await fetch(`${defaultBaseUrl}/documents`, {
            headers: {
              "Authorization": `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
          });
          
          if (documentsResponse.ok) {
            const documentsData = await documentsResponse.json();
            results.documents = {
              success: true,
              count: Array.isArray(documentsData) ? documentsData.length : (documentsData.documents?.length || 0),
              data: Array.isArray(documentsData) ? documentsData.slice(0, 5) : (documentsData.documents?.slice(0, 5) || documentsData),
            };
          } else {
            results.documents = {
              success: false,
              error: await documentsResponse.text(),
              status: documentsResponse.status,
            };
          }
        } catch (error) {
          results.documents = {
            success: false,
            error: error.message,
          };
        }
        break;

      default:
        return NextResponse.json({ error: "Invalid test type" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      testType,
      baseUrl: defaultBaseUrl,
      timestamp: new Date().toISOString(),
      results,
    });

  } catch (error) {
    console.error("Digisign test error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
