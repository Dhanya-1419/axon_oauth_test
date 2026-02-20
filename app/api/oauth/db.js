import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

let dbInited = false;

/**
 * Initializes the database tables if they don't exist.
 */
export async function initDb() {
  if (dbInited) return;
  await sql`
    CREATE TABLE IF NOT EXISTS oauth_tokens (
      provider TEXT PRIMARY KEY,
      token_data JSONB NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS oauth_configs (
      provider   TEXT PRIMARY KEY,
      client_id  TEXT,
      client_secret TEXT,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS oauth_logs (
      id         SERIAL PRIMARY KEY,
      provider   TEXT NOT NULL,
      status     TEXT NOT NULL,
      message    TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  dbInited = true;
}

/* ─────────────────────── TOKENS ─────────────────────── */

export async function upsertToken(provider, tokenData) {
  await initDb();
  await sql`
    INSERT INTO oauth_tokens (provider, token_data, updated_at)
    VALUES (${provider}, ${JSON.stringify(tokenData)}, CURRENT_TIMESTAMP)
    ON CONFLICT (provider)
    DO UPDATE SET
      token_data = EXCLUDED.token_data,
      updated_at = CURRENT_TIMESTAMP;
  `;
}

export async function getStoredToken(provider) {
  await initDb();
  const result = await sql`
    SELECT token_data FROM oauth_tokens WHERE provider = ${provider};
  `;
  return result.length > 0 ? result[0].token_data : null;
}

export async function listStoredProviders() {
  await initDb();
  const result = await sql`
    SELECT provider, token_data FROM oauth_tokens;
  `;
  return result;
}

export async function deleteStoredToken(provider) {
  await initDb();
  if (!provider) {
    await sql`DELETE FROM oauth_tokens;`;
  } else {
    await sql`DELETE FROM oauth_tokens WHERE provider = ${provider};`;
  }
}

/* ─────────────────────── CONFIGS (client creds) ─────────────────────── */

export async function upsertConfig(provider, { clientId, clientSecret }) {
  await initDb();
  await sql`
    INSERT INTO oauth_configs (provider, client_id, client_secret, updated_at)
    VALUES (${provider}, ${clientId ?? null}, ${clientSecret ?? null}, CURRENT_TIMESTAMP)
    ON CONFLICT (provider)
    DO UPDATE SET
      client_id     = COALESCE(EXCLUDED.client_id,     oauth_configs.client_id),
      client_secret = COALESCE(EXCLUDED.client_secret, oauth_configs.client_secret),
      updated_at    = CURRENT_TIMESTAMP;
  `;
}

/**
 * Get stored credentials for a provider.
 */
export async function getStoredConfig(provider) {
  await initDb();
  const result = await sql`
    SELECT client_id, client_secret
    FROM oauth_configs WHERE provider = ${provider};
  `;
  if (result.length === 0) return null;
  return {
    clientId:     result[0].client_id,
    clientSecret: result[0].client_secret,
  };
}

/**
 * List all stored configs (client IDs only, no secrets).
 */
export async function listStoredConfigs() {
  await initDb();
  const result = await sql`
    SELECT provider, client_id FROM oauth_configs;
  `;
  return result;
}

/**
 * Delete config for a provider.
 */
export async function deleteStoredConfig(provider) {
  await initDb();
  await sql`DELETE FROM oauth_configs WHERE provider = ${provider};`;
}

/* ─────────────────────── LOGS ─────────────────────── */

export async function logActivity(provider, status, message = null) {
  try {
    await initDb();
    await sql`
      INSERT INTO oauth_logs (provider, status, message)
      VALUES (${provider}, ${status}, ${message})
    `;
  } catch (e) {
    console.error("Failed to log activity:", e);
  }
}

export async function listLogs(limit = 50) {
  await initDb();
  return await sql`
    SELECT id, provider, status, message, created_at
    FROM oauth_logs
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
}

export async function clearLogs() {
  await initDb();
  await sql`DELETE FROM oauth_logs`;
}
