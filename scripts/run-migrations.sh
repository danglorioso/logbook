#!/bin/bash

# Run database migrations
# Usage: ./scripts/run-migrations.sh

if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL environment variable is not set"
  echo "Please set it in your .env file or export it:"
  echo "export DATABASE_URL='postgresql://user:password@host:5432/database'"
  exit 1
fi

echo "Running migrations..."
psql "$DATABASE_URL" -f src/lib/db/migrations.sql

if [ $? -eq 0 ]; then
  echo "✅ Migrations completed successfully!"
else
  echo "❌ Migration failed. Please check the error above."
  exit 1
fi


