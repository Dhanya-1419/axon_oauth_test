import { NextResponse } from "next/server";
import { upsertToken, getStoredToken, listStoredProviders, deleteStoredToken, initDb } from "../db.js";

export const runtime = "nodejs";

// Initialize DB on first load (simple approach)
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

export async function GET() {
  await ensureDb();
  const rows = await listStoredProviders();
  const now = Date.now();
  
  // Filter out expired tokens
  const valid = rows.filter(row => !row.token_data?.expires_at || now < row.token_data.expires_at);
  
  const validProviders = valid.map(row => row.provider);
  const details = valid.map(row => ({
    provider:   row.provider,
    expires_at: row.token_data?.expires_at ?? null,
    has_refresh: Boolean(row.token_data?.refresh_token),
  }));

  return NextResponse.json({ providers: validProviders, details });
}

export async function DELETE(req) {
  await ensureDb();
  const { provider } = await req.json().catch(() => ({}));
  if (provider) {
    await deleteStoredToken(provider);
    return NextResponse.json({ disconnected: provider });
  }
  
  await deleteStoredToken();
  return NextResponse.json({ cleared: true });
}

// Helper to set/get tokens (used by callbacks)
export async function setToken(provider, tokenData) {
  await ensureDb();
  await upsertToken(provider, tokenData);
}

export async function getToken(provider) {
  await ensureDb();
  const token = await getStoredToken(provider);
  if (!token) return null;
  
  // Basic expiry check
  if (token.expires_at && Date.now() > token.expires_at) {
    await deleteStoredToken(provider);
    return null;
  }
  
  return token;
}
