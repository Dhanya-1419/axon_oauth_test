import { NextResponse } from "next/server";
import { getStoredToken, initDb } from "../../db.js";

export const runtime = "nodejs";

// Initialize DB on first load
let dbinited = false;
async function ensureDb() {
  if (!dbinited) {
    try {
      await initDb();
      dbinited = true;
    } catch (e) {
      console.error("DB Init failed:", e);
    }
  }
}

export async function GET(req) {
  await ensureDb();

  const url = new URL(req.url);
  const provider = url.searchParams.get('provider');

  if (!provider) {
    return NextResponse.json({ error: "Provider parameter required" }, { status: 400 });
  }

  try {
    const tokenData = await getStoredToken(provider);

    if (!tokenData) {
      return NextResponse.json({ error: "Token not found for provider" }, { status: 404 });
    }

    // Check if token is expired
    const now = Date.now();
    if (tokenData.expires_at && now > tokenData.expires_at) {
      return NextResponse.json({ error: "Token has expired" }, { status: 410 });
    }

    // Return token details with access token (masked for security)
    const response = {
      provider,
      access_token: tokenData.access_token,
      token_type: tokenData.token_type || 'Bearer',
      expires_at: tokenData.expires_at,
      expires_in: tokenData.expires_in,
      scope: tokenData.scope,
      has_refresh_token: Boolean(tokenData.refresh_token),
      created_at: tokenData.created_at || null,
      // Don't expose refresh token in the response for security
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Error fetching token details:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}