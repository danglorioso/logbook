-- Add the 'user' table that BetterAuth expects
-- This should be run if you already have a 'users' table

-- Create user table (BetterAuth expects 'user' not 'users')
CREATE TABLE IF NOT EXISTS "user" (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Update session table to reference 'user' instead of 'users'
-- First, drop the foreign key constraint if it exists
ALTER TABLE session DROP CONSTRAINT IF EXISTS session_user_id_fkey;

-- Add new foreign key to 'user' table
ALTER TABLE session 
  ADD CONSTRAINT session_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE;

-- Update flights table to reference 'user' instead of 'users'  
ALTER TABLE flights DROP CONSTRAINT IF EXISTS flights_user_id_fkey;

ALTER TABLE flights 
  ADD CONSTRAINT flights_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE;

-- Copy any existing data from users to user table
INSERT INTO "user" (id, email, name, email_verified, created_at, updated_at)
SELECT id, email, name, email_verified, created_at, updated_at
FROM users
ON CONFLICT (id) DO NOTHING;


