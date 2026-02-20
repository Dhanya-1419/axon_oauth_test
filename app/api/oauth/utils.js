import { getStoredConfig } from "./db.js";

/**
 * Returns OAuth credentials for a provider.
 * Priority: DB stored config → process.env fallback
 *
 * searchParams is still accepted so an inline override
 * (e.g. ?clientId=xxx during start) can be used on the fly,
 * but those values are NOT saved automatically here — saving
 * is done explicitly via POST /api/oauth/configs.
 */
export async function getOAuthConfig(provider, searchParams) {
  // 1. Check inline query params (optional one-time override)
  let clientId     = searchParams?.get("clientId")     || null;
  let clientSecret = searchParams?.get("clientSecret") || null;
  let redirectUri  = searchParams?.get("redirectUri")  || null;
  let scopes       = searchParams?.get("scopes")       || null;

  // 2. Load from DB (persisted credentials)
  if (!clientId || !clientSecret) {
    const stored = await getStoredConfig(provider);
    if (stored) {
      clientId     = clientId     || stored.clientId;
      clientSecret = clientSecret || stored.clientSecret;
      redirectUri  = redirectUri  || stored.redirectUri;
      scopes       = scopes       || stored.scopes;
    }
  }

  // 3. Final env fallback
  const envPrefix = provider.toUpperCase();
  clientId     = clientId     || process.env[`${envPrefix}_ID`]            || process.env[`${envPrefix}_CLIENT_ID`];
  clientSecret = clientSecret || process.env[`${envPrefix}_SECRET`]        || process.env[`${envPrefix}_CLIENT_SECRET`];

  if (!redirectUri) {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    redirectUri = `${baseUrl}/api/oauth/callback/${provider}`;
  }

  return { clientId, clientSecret, redirectUri, scopes };
}
