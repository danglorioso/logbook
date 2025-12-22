-- Create user table (BetterAuth expects 'user' not 'users')
CREATE TABLE IF NOT EXISTS "user" (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Also create users table for our app (with a view for compatibility)
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BetterAuth required tables
CREATE TABLE IF NOT EXISTS session (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  expires_at TIMESTAMP NOT NULL,
  token TEXT UNIQUE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS verification (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_session_user_id ON session(user_id);
CREATE INDEX IF NOT EXISTS idx_session_token ON session(token);
CREATE INDEX IF NOT EXISTS idx_verification_identifier ON verification(identifier);

-- Create flights table
CREATE TABLE IF NOT EXISTS flights (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  
  -- General
  aircraft TEXT,
  callsign TEXT,
  departure TEXT,
  arrival TEXT,
  cruise_altitude TEXT,
  block_fuel NUMERIC,
  route TEXT,
  
  -- Takeoff
  takeoff_runway TEXT,
  sid TEXT,
  v1 TEXT,
  vr TEXT,
  v2 TEXT,
  toga BOOLEAN DEFAULT false,
  flaps TEXT,
  
  -- Landing
  landing_runway TEXT,
  star TEXT,
  brake TEXT CHECK (brake IN ('LOW', 'MED')),
  vapp TEXT,
  
  -- Post Flight
  total_duration TEXT,
  land_rate NUMERIC,
  time_of_day TEXT CHECK (time_of_day IN ('MORNING', 'MID-DAY', 'EVENING', 'NIGHT')),
  passengers INTEGER,
  cargo NUMERIC,
  
  -- Metadata
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_flights_user_id ON flights(user_id);
CREATE INDEX IF NOT EXISTS idx_flights_date ON flights(date DESC);
CREATE INDEX IF NOT EXISTS idx_flights_public ON flights(is_public) WHERE is_public = true;

