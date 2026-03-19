import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";

// Manually parse .env
const env = fs.readFileSync(".env", "utf8");
let dbUrl = "";
env.split("\n").forEach(line => {
  if (line.startsWith("DATABASE_URL=")) {
    dbUrl = line.split("=")[1].trim().replace(/'/g, "");
  }
});

if (!dbUrl) {
  console.error("DATABASE_URL not found");
  process.exit(1);
}

const sql = neon(dbUrl);

async function main() {
  const logs = await sql`
    SELECT id, provider, status, message, created_at
    FROM oauth_logs
    ORDER BY created_at DESC
    LIMIT 20
  `;
  console.log(JSON.stringify(logs, null, 2));
}

main().catch(console.error);
