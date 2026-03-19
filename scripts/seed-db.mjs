/**
 * seed-db.mjs
 * ─────────────────────────────────────────────────────────────────────
 * Reads all OAuth provider credentials from .env.local and seeds the
 * `oauth_configs` table in the Neon PostgreSQL database.
 *
 * Run: node scripts/seed-db.mjs
 * ─────────────────────────────────────────────────────────────────────
 */

import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { neon } from "@neondatabase/serverless";

// ── Load .env.local manually ─────────────────────────────────────────
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = existsSync(path.resolve(__dirname, "../.env.local")) ? path.resolve(__dirname, "../.env.local") : path.resolve(__dirname, "../.env");

const envRaw = readFileSync(envPath, "utf8");
const env = {};

for (const line of envRaw.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const eqIdx = trimmed.indexOf("=");
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx).trim();
  let value = trimmed.slice(eqIdx + 1).trim();
  // Strip surrounding quotes
  if ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1);
  }
  env[key] = value;
}

const DATABASE_URL = env["DATABASE_URL"];
if (!DATABASE_URL) {
  console.error("❌  DATABASE_URL not found in .env.local");
  process.exit(1);
}

const BASE_URL = env["NEXTAUTH_URL"] || "http://localhost:3000";

// ── Provider Definitions ──────────────────────────────────────────────
// Each entry: { provider, clientId, clientSecret, redirectUri?, scopes? }
const providers = [
  {
    provider: "google",
    clientId:     env["GOOGLE_CLIENT_ID"],
    clientSecret: env["GOOGLE_CLIENT_SECRET"],
    scopes:       env["GOOGLE_SCOPES"],
  },
  {
    provider: "github",
    clientId:     env["GITHUB_ID"],
    clientSecret: env["GITHUB_SECRET"],
  },
  {
    provider: "microsoft",
    clientId:     env["MICROSOFT_CLIENT_ID"],
    clientSecret: env["MICROSOFT_CLIENT_SECRET"],
    // Use last value — OneDrive scopes (the file had two MICROSOFT_SCOPES lines)
    scopes: "https://graph.microsoft.com/Files.ReadWrite.All offline_access",
  },
  {
    provider: "salesforce",
    clientId:     env["SALESFORCE_CLIENT_ID"],
    clientSecret: env["SALESFORCE_CLIENT_SECRET"],
  },
  {
    provider: "slack",
    clientId:     env["SLACK_CLIENT_ID"],
    clientSecret: env["SLACK_CLIENT_SECRET"],
  },
  {
    provider: "atlassian",
    clientId:     env["ATLASSIAN_CLIENT_ID"],
    clientSecret: env["ATLASSIAN_CLIENT_SECRET"],
  },
  {
    provider: "confluence",
    clientId:     env["CONFLUENCE_CLIENT_ID"],
    clientSecret: env["CONFLUENCE_CLIENT_SECRET"],
  },
  {
    provider: "asana",
    clientId:     env["ASANA_CLIENT_ID"],
    clientSecret: env["ASANA_CLIENT_SECRET"],
  },
  {
    provider: "clickup",
    clientId:     env["CLICKUP_CLIENT_ID"],
    clientSecret: env["CLICKUP_CLIENT_SECRET"],
  },
  {
    provider: "notion",
    clientId:     env["NOTION_CLIENT_ID"],
    clientSecret: env["NOTION_CLIENT_SECRET"],
  },
  {
    provider: "zoom",
    clientId:     env["ZOOM_CLIENT_ID"],
    clientSecret: env["ZOOM_CLIENT_SECRET"],
  },
  {
    provider: "figma",
    clientId:     env["FIGMA_CLIENT_ID"],
    clientSecret: env["FIGMA_CLIENT_SECRET"],
  },
  {
    provider: "docusign",
    clientId:     env["DOCUSIGN_CLIENT_ID"],
    clientSecret: env["DOCUSIGN_CLIENT_SECRET"],
  },
  {
    provider: "eventbrite",
    clientId:     env["EVENTBRITE_CLIENT_ID"],
    clientSecret: env["EVENTBRITE_CLIENT_SECRET"],
  },
  {
    provider: "calendly",
    clientId:     env["CALENDLY_CLIENT_ID"],
    clientSecret: env["CALENDLY_CLIENT_SECRET"],
  },
  {
    provider: "quickbooks",
    clientId:     env["QUICKBOOKS_CLIENT_ID"],
    clientSecret: env["QUICKBOOKS_CLIENT_SECRET"],
  },
  {
    provider: "dropbox",
    clientId:     env["DROPBOX_CLIENT_ID"],
    clientSecret: env["DROPBOX_CLIENT_SECRET"],
  },
  {
    provider: "box",
    clientId:     env["BOX_CLIENT_ID"],
    clientSecret: env["BOX_CLIENT_SECRET"],
  },
  {
    provider: "hubspot",
    clientId:     env["HUBSPOT_CLIENT_ID"],
    clientSecret: env["HUBSPOT_CLIENT_SECRET"] || env["HUBSPOT_SECRET"],
  },
  {
    provider: "calendly",
    clientId:     env["CALENDLY_CLIENT_ID"],
    clientSecret: env["CALENDLY_CLIENT_SECRET"],
  },
  {
    provider: "airtable",
    clientId:     env["AIRTABLE_CLIENT_ID"] || env["AIRTABLE_API_KEY"],
    clientSecret: env["AIRTABLE_CLIENT_SECRET"],
  },
  {
    provider: "mailchimp",
    clientId:     env["MAILCHIMP_API_KEY"],
    clientSecret: null,
    scopes:       env["MAILCHIMP_SERVER_PREFIX"],
  },
  {
    provider: "jotform",
    clientId:     env["JOTFORM_API_KEY"],
    clientSecret: null,
  },
  {
    provider: "stripe",
    clientId:     env["STRIPE_API_KEY"],
    clientSecret: env["STRIPE_WEBHOOK_SECRET"],
  },
  {
    provider: "ticketbud",
    clientId:     env["TICKETBUD_API_KEY"],
    clientSecret: null,
  },
  {
    provider: "snowflake",
    clientId:     env["SNOWFLAKE_CLIENT_ID"],
    clientSecret: null,
  },
  {
    provider: "digisign",
    clientId:     env["DIGISIGN_API_KEY"],
    clientSecret: null,
  },
  {
    provider: "discord",
    clientId:     env["DISCORD_CLIENT_ID"],
    clientSecret: env["DISCORD_CLIENT_SECRET"],
  },
  {
    provider: "zoho",
    clientId:     env["ZOHO_CLIENT_ID"],
    clientSecret: env["ZOHO_CLIENT_SECRET"],
  },
  {
    provider: "xero",
    clientId:     env["XERO_CLIENT_ID"],
    clientSecret: env["XERO_CLIENT_SECRET"],
  },
  {
    provider: "zendesk",
    clientId:     env["ZENDESK_CLIENT_ID"],
    clientSecret: env["ZENDESK_CLIENT_SECRET"],
  },
  {
    provider: "intercom",
    clientId:     env["INTERCOM_CLIENT_ID"],
    clientSecret: env["INTERCOM_CLIENT_SECRET"],
  },
  {
    provider: "monday",
    clientId:     env["MONDAY_CLIENT_ID"],
    clientSecret: env["MONDAY_CLIENT_SECRET"],
  },
  {
    provider: "linear",
    clientId:     env["LINEAR_CLIENT_ID"],
    clientSecret: env["LINEAR_CLIENT_SECRET"],
  },
  {
    provider: "trello",
    clientId:     env["TRELLO_CLIENT_ID"],
    clientSecret: env["TRELLO_CLIENT_SECRET"],
  },
  {
    provider: "gitlab",
    clientId:     env["GITLAB_CLIENT_ID"],
    clientSecret: env["GITLAB_CLIENT_SECRET"],
  },
  {
    provider: "bitbucket",
    clientId:     env["BITBUCKET_CLIENT_ID"],
    clientSecret: env["BITBUCKET_CLIENT_SECRET"],
  },
  {
    provider: "signnow",
    clientId:     env["SIGNNOW_CLIENT_ID"],
    clientSecret: env["SIGNNOW_CLIENT_SECRET"],
  },
  {
    provider: "adobe",
    clientId:     env["ADOBE_CLIENT_ID"],
    clientSecret: env["ADOBE_CLIENT_SECRET"],
  },
  {
    provider: "databricks",
    clientId:     env["DATABRICKS_API_KEY"],
    clientSecret: null,
  },
  {
    provider: "supabase",
    clientId:     env["SUPABASE_CLIENT_ID"],
    clientSecret: env["SUPABASE_CLIENT_SECRET"],
  },
  {
    provider: "coda",
    clientId:     env["CODA_API_KEY"],
    clientSecret: null,
  },
  {
    provider: "guru",
    clientId:     env["GURU_USER_TOKEN"],
    clientSecret: null,
  },
  {
    provider: "firebase",
    clientId:     env["FIREBASE_CLIENT_ID"],
    clientSecret: env["FIREBASE_CLIENT_SECRET"],
  },
];

// ── DB Init ───────────────────────────────────────────────────────────
const sql = neon(DATABASE_URL);

async function initTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS oauth_tokens (
      provider    TEXT PRIMARY KEY,
      token_data  JSONB NOT NULL,
      updated_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS oauth_configs (
      provider      TEXT PRIMARY KEY,
      client_id     TEXT,
      client_secret TEXT,
      redirect_uri  TEXT,
      scopes        TEXT,
      updated_at    TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log("✅  Tables ensured (oauth_tokens, oauth_configs)\n");
}

// ── Seed ──────────────────────────────────────────────────────────────
async function seed() {
  console.log("🌱  Seeding oauth_configs from .env.local...\n");

  let seeded = 0;
  let skipped = 0;

  for (const p of providers) {
    const redirectUri = `${BASE_URL}/api/oauth/callback/${p.provider}`;

    if (!p.clientId) {
      console.log(`  ⚠️   ${p.provider.padEnd(15)} — no clientId found, skipping`);
      skipped++;
      continue;
    }

    await sql`
      INSERT INTO oauth_configs (provider, client_id, client_secret, redirect_uri, scopes, updated_at)
      VALUES (
        ${p.provider},
        ${p.clientId   ?? null},
        ${p.clientSecret ?? null},
        ${p.redirectUri ?? redirectUri},
        ${p.scopes     ?? null},
        CURRENT_TIMESTAMP
      )
      ON CONFLICT (provider)
      DO UPDATE SET
        client_id     = COALESCE(EXCLUDED.client_id,     oauth_configs.client_id),
        client_secret = COALESCE(EXCLUDED.client_secret, oauth_configs.client_secret),
        redirect_uri  = COALESCE(EXCLUDED.redirect_uri,  oauth_configs.redirect_uri),
        scopes        = COALESCE(EXCLUDED.scopes,        oauth_configs.scopes),
        updated_at    = CURRENT_TIMESTAMP;
    `;

    console.log(`  ✅  ${p.provider.padEnd(15)} — seeded  (clientId: ${p.clientId?.slice(0, 12)}...)`);
    seeded++;
  }

  console.log(`\n🎉  Done! ${seeded} providers seeded, ${skipped} skipped.\n`);

  // ── Print current DB state ─────────────────────────────────────────
  console.log("📋  Current oauth_configs in DB:");
  const rows = await sql`
    SELECT provider, client_id, redirect_uri, updated_at
    FROM oauth_configs
    ORDER BY provider;
  `;
  console.table(rows.map(r => ({
    provider:    r.provider,
    client_id:   r.client_id?.slice(0, 16) + "...",
    redirect_uri: r.redirect_uri,
    updated_at:  r.updated_at,
  })));
}

// ── Run ───────────────────────────────────────────────────────────────
try {
  await initTables();
  await seed();
} catch (err) {
  console.error("❌  Seed failed:", err.message);
  process.exit(1);
}
