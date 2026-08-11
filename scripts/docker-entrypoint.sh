#!/usr/bin/env sh
set -eu

echo 'Deploy marker: startup-resilience-v23'

if [ "${RUN_PREFLIGHT_ON_START:-false}" = "true" ]; then
  echo "Running production preflight..."
  npm run preflight:production || echo "Preflight failed; continuing so the app can expose diagnostics."
fi

if [ "${SKIP_MIGRATIONS_ON_START:-false}" != "true" ] || [ "${RUN_SCHEMA_PUSH_ON_START:-false}" = "true" ] || [ "${BOOTSTRAP_NEW_DB_ON_START:-false}" = "true" ] || [ "${SEED_DEMO_CONTENT_ON_START:-false}" = "true" ]; then
  echo "Preparing database before starting app..."
  if node scripts/db-startup.cjs; then
    echo "Database preparation finished."
  else
    status="$?"
    echo "Database preparation failed with exit code $status."
    if [ "${DB_STARTUP_STRICT:-false}" = "true" ]; then
      echo "DB_STARTUP_STRICT=true; aborting container startup."
      exit "$status"
    fi
    echo "Continuing startup so /api/live and /api/health can expose diagnostics."
  fi
fi

exec npm run start
