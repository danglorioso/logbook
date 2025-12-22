-- Fix: Add 'user' table that BetterAuth expects and migrate from 'users'
-- Run this in your Neon SQL editor if you already have the 'users' table

-- Step 1: Create user table (BetterAuth expects 'user' not 'users')
CREATE TABLE IF NOT EXISTS "user" (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step 2: Copy any existing data from 'users' to 'user' (if users table exists)
INSERT INTO "user" (id, email, name, email_verified, created_at, updated_at)
SELECT id, email, name, email_verified, created_at, updated_at
FROM users
ON CONFLICT (id) DO NOTHING;

-- Step 3: Update foreign key constraints to point to 'user' table
-- Drop old constraints if they exist
ALTER TABLE session DROP CONSTRAINT IF EXISTS session_user_id_fkey;
ALTER TABLE flights DROP CONSTRAINT IF EXISTS flights_user_id_fkey;

-- Add new constraints pointing to 'user' table
ALTER TABLE session 
  ADD CONSTRAINT session_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE;

ALTER TABLE flights 
  ADD CONSTRAINT flights_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE;

-- Step 4: Drop the old 'users' table (only after confirming data was migrated)
-- Uncomment the line below after verifying the migration worked:
-- DROP TABLE IF EXISTS users;

