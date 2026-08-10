const fs = require('fs')
const path = require('path')
const { Client } = require('pg')

const migrationsDir = path.resolve(process.cwd(), 'src', 'migrations')

function migrationNames() {
  return fs
    .readdirSync(migrationsDir)
    .filter((file) => /^\d+_.*\.ts$/.test(file))
    .map((file) => file.replace(/\.ts$/, ''))
    .sort()
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('[migrations:mark] DATABASE_URL ausente')
    process.exit(1)
  }

  const names = migrationNames()
  if (names.length === 0) {
    console.log('[migrations:mark] Nenhuma migration encontrada.')
    return
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS "payload_migrations" (
        "id" serial PRIMARY KEY NOT NULL,
        "name" varchar,
        "batch" numeric,
        "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
        "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
      );
    `)
    await client.query('CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");')
    await client.query('CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");')

    const batchResult = await client.query('select coalesce(max("batch"), 0) + 1 as batch from "payload_migrations"')
    const batch = String(batchResult.rows[0]?.batch || 1)

    let inserted = 0
    for (const name of names) {
      const existing = await client.query(
        'select 1 from "payload_migrations" where "name" = $1::varchar limit 1',
        [name],
      )

      if (existing.rowCount && existing.rowCount > 0) continue

      const result = await client.query(
        `insert into "payload_migrations" ("name", "batch", "updated_at", "created_at")
         values ($1::varchar, $2::numeric, now(), now())`,
        [name, batch],
      )
      inserted += result.rowCount || 0
    }

    console.log(`[migrations:mark] ${inserted} migration(s) registradas como aplicadas; ${names.length - inserted} ja existiam.`)
  } finally {
    await client.end()
  }
}

main().catch((error) => {
  console.error('[migrations:mark] Falha ao registrar migrations:', error)
  process.exit(1)
})
