const { Client } = require('pg')
const { spawnSync } = require('child_process')

const requiredTables = [
  'users',
  'media',
  'leads',
  'nps_responses',
  'posts',
  'practice_areas',
]

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('[schema:init] DATABASE_URL ausente')
    process.exit(1)
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()

  let missingTables = []
  try {
    const result = await client.query(
      `select table_name
       from information_schema.tables
       where table_schema = 'public'
         and table_name = any($1::text[])`,
      [requiredTables],
    )
    const existing = new Set(result.rows.map((row) => row.table_name))
    missingTables = requiredTables.filter((table) => !existing.has(table))
    if (missingTables.length === 0) {
      console.log('[schema:init] Schema base existente detectado; pulando push inicial.')
      return
    }
  } finally {
    await client.end()
  }

  console.log(`[schema:init] Schema incompleto; tabelas ausentes: ${missingTables.join(', ')}. Sincronizando schema inicial do Payload...`)
  const result = spawnSync('npm', ['run', 'schema:push'], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, NODE_ENV: 'development', PAYLOAD_DB_PUSH: 'true', PAYLOAD_FORCE_DRIZZLE_PUSH: 'true' },
  })

  if (result.status !== 0) {
    process.exit(result.status || 1)
  }
}

main().catch((error) => {
  console.error('[schema:init] Falha ao inicializar schema:', error)
  process.exit(1)
})
