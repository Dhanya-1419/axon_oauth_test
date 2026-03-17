import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Get the first available Zoho token
    const zohoTokens = global.zohoTokens || {};
    const tokenEntries = Object.values(zohoTokens);
    
    if (tokenEntries.length === 0) {
      return NextResponse.json({ 
        error: "No Zoho tokens available. Please authenticate with Zoho CRM first." 
      }, { status: 401 });
    }

    const token = tokenEntries[0];
    
    // Test user info
    const userResponse = await fetch("https://www.zohoapis.com/crm/v2/users?type=CurrentUser", {
      headers: {
        Authorization: `Zoho-oauthtoken ${token.access_token}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ 
        error: "Zoho CRM API request failed",
        status: userResponse.status,
        statusText: userResponse.statusText
      }, { status: userResponse.status });
    }

    const userData = await userResponse.json();
    const user = userData.users?.[0] || {};

    // Test modules endpoint
    const modulesResponse = await fetch("https://www.zohoapis.com/crm/v2/settings/modules", {
      headers: {
        Authorization: `Zoho-oauthtoken ${token.access_token}`,
      },
    });

    let modules = [];
    if (modulesResponse.ok) {
      const modulesData = await modulesResponse.json();
      modules = modulesData.modules || [];
    }

    // Test leads endpoint
    const leadsResponse = await fetch("https://www.zohoapis.com/crm/v2/Leads?fields=Full_Name,Email,Company", {
      headers: {
        Authorization: `Zoho-oauthtoken ${token.access_token}`,
      },
    });

    let leadsCount = 0;
    if (leadsResponse.ok) {
      const leadsData = await leadsResponse.json();
      leadsCount = leadsData.data?.length || 0;
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        profile: user.profile?.name,
      },
      modules_count: modules.length,
      modules: modules.slice(0, 5).map(module => ({
        api_name: module.api_name,
        module_name: module.module_name,
        singular_label: module.singular_label,
      })),
      leads_count: leadsCount,
      token_info: {
        expires_at: new Date(token.expires_at).toISOString(),
        has_refresh_token: !!token.refresh_token,
        api_domain: token.api_domain,
      }
    });

  } catch (error) {
    console.error("Zoho test error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error.message 
    }, { status: 500 });
  }
}
