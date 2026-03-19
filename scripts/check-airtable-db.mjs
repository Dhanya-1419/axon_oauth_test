import { neon } from "@neondatabase/serverless";
import fs from "fs";

// Manually parse .env
const env = fs.readFileSync(".env", "utf8");
let dbUrl = "";
env.split("\n").forEach(line => {
  if (line.startsWith("DATABASE_URL=")) {
    dbUrl = line.split("=")[1].trim().replace(/'/g, "");
  }
});

const sql = neon(dbUrl);

async function main() {
  const config = await sql`
    SELECT provider, client_id, client_secret 
    FROM oauth_configs 
    WHERE provider = 'airtable'
  `;
  console.log("Airtable DB Config:", JSON.stringify(config, null, 2));
}

main().catch(console.error);
