import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.GITLAB_CLIENT_ID;
  const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/oauth/callback/gitlab`;

  if (!clientId) {
    return NextResponse.json({ error: "GitLab client ID not configured" }, { status: 500 });
  }

  // Generate a random state for security
  const state = Math.random().toString(36).substring(2, 15);
  
  // Store state temporarily (in production, use Redis or database)
  global.gitlabOAuthState = global.gitlabOAuthState || {};
  global.gitlabOAuthState[state] = Date.now();

  const gitlabAuthUrl = new URL("https://gitlab.com/oauth/authorize");
  gitlabAuthUrl.searchParams.append("client_id", clientId);
  gitlabAuthUrl.searchParams.append("redirect_uri", redirectUri);
  gitlabAuthUrl.searchParams.append("response_type", "code");
  gitlabAuthUrl.searchParams.append("scope", "read_user read_repository write_repository api");
  gitlabAuthUrl.searchParams.append("state", state);

  return NextResponse.redirect(gitlabAuthUrl.toString());
}
