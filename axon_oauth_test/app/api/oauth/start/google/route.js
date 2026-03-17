import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID || "762559894490-9u7b25pohvvjehie23islu8oq2gma744.apps.googleusercontent.com";
  const redirectUri = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/oauth/callback/google`;
  const scopes = "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile";

  console.log("DEBUG GOOGLE_CLIENT_ID:", JSON.stringify(clientId));
  console.log("DEBUG REDIRECT_URI:", redirectUri);

  if (!clientId) {
    return NextResponse.json({ error: "Missing GOOGLE_CLIENT_ID", debug: { clientId, envKeys: Object.keys(process.env).filter(k => k.includes("GOOGLE")) } }, { status: 500 });
  }

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", scopes);
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");

  return NextResponse.redirect(authUrl.toString());
}
