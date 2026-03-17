import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { testType = "basic" } = await request.json().catch(() => ({}));
    
    const apiKey = process.env.AIRTABLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing AIRTABLE_API_KEY in environment variables" },
        { status: 401 }
      );
    }

    const results = {};

    switch (testType) {
      case "basic":
        // Test basic API access - get user info
        const userResponse = await fetch("https://api.airtable.com/v0/meta/whoami", {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          results.user = {
            success: true,
            data: {
              id: userData.id,
              email: userData.email,
              name: userData.name,
              collaboration_url: userData.collaborationUrl,
            },
          };
        } else {
          results.user = {
            success: false,
            error: await userResponse.text(),
          };
        }
        break;

      case "bases":
        // Test getting bases
        const basesResponse = await fetch("https://api.airtable.com/v0/meta/bases", {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        });
        
        if (basesResponse.ok) {
          const basesData = await basesResponse.json();
          results.bases = {
            success: true,
            count: basesData.bases?.length || 0,
            bases: basesData.bases?.slice(0, 5).map(base => ({
              id: base.id,
              name: base.name,
              permission_level: base.permissionLevel,
              created_time: base.createdTime,
              web_url: base.webUrl,
            })) || [],
          };
        } else {
          results.bases = {
            success: false,
            error: await basesResponse.text(),
          };
        }
        break;

      case "tables":
        // Test getting tables (requires a base ID, so we'll get first base's tables)
        const basesForTablesResponse = await fetch("https://api.airtable.com/v0/meta/bases", {
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        });
        
        if (basesForTablesResponse.ok) {
          const basesData = await basesForTablesResponse.json();
          const firstBase = basesData.bases?.[0];
          
          if (firstBase) {
            const tablesResponse = await fetch(`https://api.airtable.com/v0/meta/bases/${firstBase.id}/tables`, {
              headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
              },
            });
            
            if (tablesResponse.ok) {
              const tablesData = await tablesResponse.json();
              results.tables = {
                success: true,
                base_name: firstBase.name,
                count: tablesData.tables?.length || 0,
                tables: tablesData.tables?.slice(0, 5).map(table => ({
                  id: table.id,
                  name: table.name,
                  primary_field_id: table.primaryFieldId,
                  created_time: table.createdTime,
                })) || [],
              };
            } else {
              results.tables = {
                success: false,
                error: await tablesResponse.text(),
              };
            }
          } else {
            results.tables = {
              success: false,
              error: "No bases found to retrieve tables from",
            };
          }
        } else {
          results.tables = {
            success: false,
            error: await basesForTablesResponse.text(),
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
    console.error("Airtable test error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
