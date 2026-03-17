import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Get first available SignNow token
    const signNowTokens = global.signNowTokens || {};
    const tokenEntries = Object.values(signNowTokens);
    
    if (tokenEntries.length === 0) {
      return NextResponse.json({ 
        error: "No SignNow tokens available. Please authenticate with SignNow first." 
      }, { status: 401 });
    }

    const token = tokenEntries[0];

    // Test user info
    const userResponse = await fetch("https://c-api.signnow.com/user", {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.json({ 
        error: "SignNow API request failed",
        status: userResponse.status,
        statusText: userResponse.statusText
      }, { status: userResponse.status });
    }

    const userData = await userResponse.json();

    // Test documents endpoint
    const documentsResponse = await fetch("https://c-api.signnow.com/document", {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });

    let documents = [];
    if (documentsResponse.ok) {
      const documentsData = await documentsResponse.json();
      documents = documentsData.documents || [];
    }

    // Test templates endpoint
    const templatesResponse = await fetch("https://c-api.signnow.com/template", {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
      },
    });

    let templates = [];
    if (templatesResponse.ok) {
      const templatesData = await templatesResponse.json();
      templates = templatesData.templates || [];
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        first_name: userData.first_name,
        last_name: userData.last_name,
        email: userData.email,
        role: userData.role,
        created: userData.created,
        last_login: userData.last_login,
      },
      documents_summary: {
        total_count: documents.length,
        recent_documents: documents.slice(0, 3).map(doc => ({
          id: doc.id,
          document_name: doc.document_name,
          created: doc.created,
          status: doc.status,
          owner: doc.owner,
        })),
      },
      templates_summary: {
        total_count: templates.length,
        recent_templates: templates.slice(0, 3).map(template => ({
          id: template.id,
          template_name: template.template_name,
          created: template.created,
          owner: template.owner,
        })),
      },
      token_info: {
        expires_at: new Date(token.expires_at).toISOString(),
        has_refresh_token: !!token.refresh_token,
      }
    });

  } catch (error) {
    console.error("SignNow test error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error.message 
    }, { status: 500 });
  }
}
