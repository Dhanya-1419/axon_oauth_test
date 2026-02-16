import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const { testType = "basic" } = await request.json().catch(() => ({}));
    
    const apiKey = process.env.JOTFORM_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing JOTFORM_API_KEY in environment variables" },
        { status: 401 }
      );
    }

    const results = {};

    switch (testType) {
      case "basic":
        // Test basic API access - get user info
        const userResponse = await fetch(`https://api.jotform.com/user?apiKey=${apiKey}`);
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          results.user = {
            success: true,
            data: {
              username: userData.content?.username,
              email: userData.content?.email,
              name: userData.content?.name,
              account_type: userData.content?.account_type,
              usage: userData.content?.usage,
            },
          };
        } else {
          results.user = {
            success: false,
            error: await userResponse.text(),
          };
        }
        break;

      case "forms":
        // Test getting forms
        const formsResponse = await fetch(`https://api.jotform.com/user/forms?apiKey=${apiKey}&limit=5`);
        
        if (formsResponse.ok) {
          const formsData = await formsResponse.json();
          results.forms = {
            success: true,
            count: formsData.content?.length || 0,
            forms: formsData.content?.slice(0, 5).map(form => ({
              id: form.id,
              title: form.title,
              status: form.status,
              created_at: form.created_at,
              submissions: form.submissions,
            })) || [],
          };
        } else {
          results.forms = {
            success: false,
            error: await formsResponse.text(),
          };
        }
        break;

      case "submissions":
        // Test getting submissions
        const submissionsResponse = await fetch(`https://api.jotform.com/user/submissions?apiKey=${apiKey}&limit=5`);
        
        if (submissionsResponse.ok) {
          const submissionsData = await submissionsResponse.json();
          results.submissions = {
            success: true,
            count: submissionsData.content?.length || 0,
            submissions: submissionsData.content?.slice(0, 5).map(submission => ({
              id: submission.id,
              form_id: submission.form_id,
              created_at: submission.created_at,
              status: submission.status,
              ip: submission.ip,
            })) || [],
          };
        } else {
          results.submissions = {
            success: false,
            error: await submissionsResponse.text(),
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
    console.error("Jotform test error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
