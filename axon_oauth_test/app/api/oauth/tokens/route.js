import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const TOKENS_FILE = path.join(process.cwd(), "tokens.json");

function readTokens() {
  try {
    if (!fs.existsSync(TOKENS_FILE)) return {};
    const data = fs.readFileSync(TOKENS_FILE, "utf8");
    return JSON.parse(data);
  } catch (e) {
    console.error("Error reading tokens file:", e);
    return {};
  }
}

function writeTokens(tokens) {
  try {
    console.log("DEBUG WRITING TOKENS TO FILE:", TOKENS_FILE, JSON.stringify(tokens));
    fs.writeFileSync(TOKENS_FILE, JSON.stringify(tokens, null, 2), "utf8");
  } catch (e) {
    console.error("Error writing tokens file:", e);
  }
}

export async function GET() {
  const tokens = readTokens();
  // Filter out expired tokens
  const now = Date.now();
  const validProviders = Object.keys(tokens).filter(provider => {
    const token = tokens[provider];
    return !token.expires_at || now < token.expires_at;
  });
  
  return NextResponse.json({ providers: validProviders });
}

export async function DELETE(req) {
  const { provider } = await req.json().catch(() => ({}));
  if (provider) {
    const tokens = readTokens();
    delete tokens[provider];
    writeTokens(tokens);
    return NextResponse.json({ disconnected: provider });
  }
  
  writeTokens({});
  return NextResponse.json({ cleared: true });
}

// Helper to set/get tokens (used by callbacks)
export function setToken(provider, tokenData) {
  const tokens = readTokens();
  tokens[provider] = tokenData;
  writeTokens(tokens);
}

export function getToken(provider) {
  const tokens = readTokens();
  const token = tokens[provider];
  if (!token) return null;
  
  // Basic expiry check
  if (token.expires_at && Date.now() > token.expires_at) {
    delete tokens[provider];
    writeTokens(tokens);
    return null;
  }
  
  return token;
}
