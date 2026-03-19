import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
dotenv.config();

const sql = neon(process.env.DATABASE_URL);

async function main() {
  const logs = await sql`
    SELECT id, provider, status, message, created_at
    FROM oauth_logs
    ORDER BY created_at DESC
    LIMIT 10
  `;
  console.table(logs);
}

main().catch(console.error);
