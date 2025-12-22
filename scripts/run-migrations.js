#!/usr/bin/env node

/**
 * Run database migrations using Neon serverless driver
 * Usage: node scripts/run-migrations.js
 */

import { neon } from "@neondatabase/serverless";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("Error: DATABASE_URL environment variable is not set");
  console.error("Please set it in your .env file or export it:");
  console.error("export DATABASE_URL='postgresql://user:password@host:5432/database'");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function runMigrations() {
  try {
    console.log("Reading migration file...");
    const migrationPath = join(__dirname, "../src/lib/db/migrations.sql");
    const migrationSQL = readFileSync(migrationPath, "utf-8");

    // Split by semicolons and execute each statement
    const statements = migrationSQL
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith("--"));

    console.log(`Executing ${statements.length} migration statements...`);

    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await sql(statement);
        } catch (error) {
          // Ignore "already exists" errors for IF NOT EXISTS statements
          if (error.message && error.message.includes("already exists")) {
            console.log("  ⚠️  Table/index already exists, skipping...");
          } else {
            throw error;
          }
        }
      }
    }

    console.log("✅ Migrations completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

runMigrations();

