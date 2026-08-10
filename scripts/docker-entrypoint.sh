#!/usr/bin/env sh
set -eu

echo 'Deploy marker: nonblocking-db-startup-v6'

if [ "${RUN_PREFLIGHT_ON_START:-false}" = "true" ]; then
  echo "Running production preflight..."
  npm run preflight:production || echo "Preflight failed; continuing so the app can expose diagnostics."
fi

if [ "${RUN_MIGRATIONS_ON_START:-false}" = "true" ] || [ "${BOOTSTRAP_NEW_DB_ON_START:-false}" = "true" ]; then
  echo "Starting database preparation in background..."
  node scripts/db-startup.cjs &
fi

exec npm run start
