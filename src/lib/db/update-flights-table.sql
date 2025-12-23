-- Migration to update flights table schema
-- Run this to sync the database with the current code

-- Add airframe column (if it doesn't exist)
ALTER TABLE flights 
ADD COLUMN IF NOT EXISTS airframe TEXT;

-- Add air_time column (if it doesn't exist)
ALTER TABLE flights 
ADD COLUMN IF NOT EXISTS air_time TEXT;

-- Add block_time column (if it doesn't exist)
ALTER TABLE flights 
ADD COLUMN IF NOT EXISTS block_time TEXT;

-- Change land_rate from NUMERIC to TEXT to support enum values
-- First, convert existing numeric values to text (if any)
-- Then alter the column type
ALTER TABLE flights 
ALTER COLUMN land_rate TYPE TEXT USING 
  CASE 
    WHEN land_rate IS NULL THEN NULL
    ELSE land_rate::TEXT
  END;

-- Remove the CHECK constraint on time_of_day since we now support multiple values (comma-separated)
ALTER TABLE flights 
DROP CONSTRAINT IF EXISTS flights_time_of_day_check;

-- Note: We're keeping total_duration column for now to avoid data loss
-- You can drop it later if you want:
-- ALTER TABLE flights DROP COLUMN IF EXISTS total_duration;

