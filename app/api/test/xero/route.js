import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Get the first available Xero token
    const xeroTokens = global.xeroTokens || {};
    const tokenEntries = Object.values(xeroTokens);
    
    if (tokenEntries.length === 0) {
      return NextResponse.json({ 
        error: "No Xero tokens available. Please authenticate with Xero first." 
      }, { status: 401 });
    }

    const token = tokenEntries[0];
    const tenantId = token.tenant_ids?.[0];

    if (!tenantId) {
      return NextResponse.json({ 
        error: "No Xero tenant ID available. Please ensure you have access to at least one Xero organization." 
      }, { status: 400 });
    }

    // Test organisation info
    const orgResponse = await fetch("https://api.xero.com/api.xro/2.0/Organisation", {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Xero-tenant-id": tenantId,
      },
    });

    if (!orgResponse.ok) {
      return NextResponse.json({ 
        error: "Xero API request failed",
        status: orgResponse.status,
        statusText: orgResponse.statusText
      }, { status: orgResponse.status });
    }

    const orgData = await orgResponse.json();
    const organisation = orgData.Organisations?.[0] || {};

    // Test contacts endpoint
    const contactsResponse = await fetch("https://api.xero.com/api.xro/2.0/Contacts?summaryOnly=true", {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Xero-tenant-id": tenantId,
      },
    });

    let contactsCount = 0;
    if (contactsResponse.ok) {
      const contactsData = await contactsResponse.json();
      contactsCount = contactsData.Contacts?.length || 0;
    }

    // Test invoices endpoint
    const invoicesResponse = await fetch("https://api.xero.com/api.xro/2.0/Invoices?summaryOnly=true", {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Xero-tenant-id": tenantId,
      },
    });

    let invoicesCount = 0;
    if (invoicesResponse.ok) {
      const invoicesData = await invoicesResponse.json();
      invoicesCount = invoicesData.Invoices?.length || 0;
    }

    return NextResponse.json({
      success: true,
      organisation: {
        name: organisation.Name,
        organisation_id: organisation.OrganisationID,
        country: organisation.CountryCode,
        timezone: organisation.Timezone,
        financial_year_end: organisation.FinancialYearEndDay + "/" + organisation.FinancialYearEndMonth,
      },
      user: {
        user_id: token.user?.userId,
        first_name: token.user?.firstName,
        last_name: token.user?.lastName,
        email: token.user?.emailAddress,
      },
      data_summary: {
        contacts_count: contactsCount,
        invoices_count: invoicesCount,
        tenant_id: tenantId,
      },
      token_info: {
        expires_at: new Date(token.expires_at).toISOString(),
        has_refresh_token: !!token.refresh_token,
        tenant_ids: token.tenant_ids,
      }
    });

  } catch (error) {
    console.error("Xero test error:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      message: error.message 
    }, { status: 500 });
  }
}
