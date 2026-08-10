const { Client } = require('pg')
const { spawnSync } = require('child_process')

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('[schema:init] DATABASE_URL ausente')
    process.exit(1)
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()

  try {
    const result = await client.query("select to_regclass('public.users') as users_table")
    if (result.rows[0]?.users_table) {
      console.log('[schema:init] Schema existente detectado; pulando push inicial.')
      return
    }
  } finally {
    await client.end()
  }

  console.log('[schema:init] Banco sem tabela users; criando schema inicial do Payload...')
  const result = spawnSync('npm', ['run', 'schema:push'], {
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env: { ...process.env, PAYLOAD_DB_PUSH: 'true' },
  })

  if (result.status !== 0) {
    process.exit(result.status || 1)
  }
}

main().catch((error) => {
  console.error('[schema:init] Falha ao inicializar schema:', error)
  process.exit(1)
})
