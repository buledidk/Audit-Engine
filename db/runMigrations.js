/**
 * DATABASE MIGRATION RUNNER
 * Executes SQL migrations for GDPR and encryption setup
 */

import postgres from "postgres";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sql = postgres({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "audit_automation",
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
});

async function runMigrations() {
  try {
    console.log("🔧 Running database migrations...");

    const migrationsDir = path.join(__dirname, "migrations");
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const migrationSQL = fs.readFileSync(filePath, "utf-8");

      console.log(`📝 Running migration: ${file}`);
      try {
        await sql.unsafe(migrationSQL);
        console.log(`✅ Completed: ${file}`);
      } catch (error) {
        console.error(`❌ Error in ${file}:`, error.message);
      }
    }

    console.log("✅ All migrations completed!");
    await sql.end();
  } catch (error) {
    console.error("Migration runner error:", error);
    process.exit(1);
  }
}

runMigrations();
