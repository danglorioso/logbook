#!/usr/bin/env node

/**
 * Test database connection and verify tables exist
 */

import { neon } from "@neondatabase/serverless";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
dotenv.config({ path: join(__dirname, "../.env") });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in .env");
  process.exit(1);
}

const sql = neon(DATABASE_URL);

async function testConnection() {
  try {
    console.log("Testing database connection...");
    
    // Test basic connection
    const result = await sql`SELECT 1 as test`;
    console.log("✅ Database connection successful");

    // Check if tables exist
    console.log("\nChecking tables...");
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    const tableNames = tables.map((t) => t.table_name);
    console.log("Found tables:", tableNames.join(", ") || "none");

    const requiredTables = ["users", "session", "verification", "flights"];
    const missingTables = requiredTables.filter((t) => !tableNames.includes(t));

    if (missingTables.length > 0) {
      console.log("\n⚠️  Missing tables:", missingTables.join(", "));
      console.log("Please run the migrations from src/lib/db/migrations.sql");
    } else {
      console.log("\n✅ All required tables exist");
    }

    // Test a simple query on users table
    if (tableNames.includes("users")) {
      const userCount = await sql`SELECT COUNT(*) as count FROM users`;
      console.log(`\nUsers table: ${userCount[0]?.count || 0} users`);
    }
  } catch (error) {
    console.error("❌ Database error:", error.message);
    process.exit(1);
  }
}

testConnection();

