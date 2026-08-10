#!/usr/bin/env sh
set -eu

echo 'Deploy marker: schema-push-env-v18'

if [ "${RUN_PREFLIGHT_ON_START:-false}" = "true" ]; then
  echo "Running production preflight..."
  npm run preflight:production || echo "Preflight failed; continuing so the app can expose diagnostics."
fi

if [ "${RUN_SCHEMA_PUSH_ON_START:-false}" = "true" ] || [ "${RUN_MIGRATIONS_ON_START:-false}" = "true" ] || [ "${BOOTSTRAP_NEW_DB_ON_START:-false}" = "true" ] || [ "${SEED_DEMO_CONTENT_ON_START:-false}" = "true" ]; then
  echo "Preparing database before starting app..."
  node scripts/db-startup.cjs
fi

exec npm run start
