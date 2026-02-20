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

export function getBaseUrl(req) {
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL;
  if (!req) return "http://localhost:3000";
  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
}
export async function getOAuthConfig(provider, searchParams, baseUrlOrReq = null) {
  // 1. Check inline query params (optional one-time override)
  let clientId     = searchParams?.get("clientId")     || null;
  let clientSecret = searchParams?.get("clientSecret") || null;
  let scopes       = searchParams?.get("scopes")       || null;

  // 2. Load from DB (persisted credentials)
  if (!clientId || !clientSecret) {
    const stored = await getStoredConfig(provider);
    if (stored) {
      clientId     = clientId     || stored.clientId;
      clientSecret = clientSecret || stored.clientSecret;
    }
  }

  // 3. Final env fallback
  const envPrefix = provider.toUpperCase();
  clientId     = clientId     || process.env[`${envPrefix}_ID`]            || process.env[`${envPrefix}_CLIENT_ID`];
  clientSecret = clientSecret || process.env[`${envPrefix}_SECRET`]        || process.env[`${envPrefix}_CLIENT_SECRET`];
  scopes       = scopes       || process.env[`${envPrefix}_SCOPES`]        || null;

  // 4. Dynamic Redirect URI (Env based with dynamic host fallback)
  const baseUrl = (typeof baseUrlOrReq === 'string') 
    ? baseUrlOrReq 
    : getBaseUrl(baseUrlOrReq);

  const redirectUri = `${baseUrl}/api/oauth/callback/${provider}`;

  return { clientId, clientSecret, redirectUri, scopes };
}
