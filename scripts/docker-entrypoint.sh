#!/usr/bin/env sh
set -eu

echo 'Deploy marker: schema-init-entrypoint-v2'

if [ "${RUN_PREFLIGHT_ON_START:-false}" = "true" ]; then
  echo "Running production preflight..."
  npm run preflight:production
fi

if [ "${RUN_MIGRATIONS_ON_START:-false}" = "true" ] || [ "${BOOTSTRAP_NEW_DB_ON_START:-false}" = "true" ]; then
  echo "Waiting for database..."
  node scripts/wait-for-db.cjs

  echo "Initializing Payload schema if database is empty..."
  npm run schema:init
fi

if [ "${RUN_MIGRATIONS_ON_START:-false}" = "true" ]; then
  echo "Applying Payload migrations..."
  npm run migrate
fi

if [ "${BOOTSTRAP_NEW_DB_ON_START:-false}" = "true" ]; then
  echo "Running new database bootstrap..."
  npm run bootstrap:new-db
fi

exec npm run start
