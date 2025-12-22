-- Final step: Drop the old 'users' table
-- ONLY run this after:
-- 1. You've run fix-user-table.sql
-- 2. You've verified all data was copied to 'user' table
-- 3. You've tested that the app works with the 'user' table

-- Verify data was migrated first:
-- SELECT COUNT(*) FROM "user";
-- SELECT COUNT(*) FROM users;
-- (These should match if migration was successful)

DROP TABLE IF EXISTS users;

