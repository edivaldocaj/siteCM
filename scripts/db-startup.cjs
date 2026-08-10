const { spawn } = require('child_process')
const { Client } = require('pg')

const lockKey = 82417031
const runMigrations = process.env.RUN_MIGRATIONS_ON_START === 'true'
const runBootstrap = process.env.BOOTSTRAP_NEW_DB_ON_START === 'true'

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: process.platform === 'win32',
      env: process.env,
      ...options,
    })

    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`${command} ${args.join(' ')} exited with ${code}`))
    })
  })
}

async function ensurePayloadMigrationsTable() {
  if (!process.env.DATABASE_URL) return

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
    console.log('[db:startup] Tabela payload_migrations pronta.')
  } finally {
    await client.end()
  }
}

async function withDatabaseLock(fn) {
  if (!process.env.DATABASE_URL) {
    console.error('[db:startup] DATABASE_URL ausente; pulando preparo do banco.')
    return
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()

  try {
    const lock = await client.query('select pg_try_advisory_lock($1) as locked', [lockKey])
    if (!lock.rows[0]?.locked) {
      console.log('[db:startup] Outro processo ja esta preparando o banco; pulando nesta instancia.')
      return
    }

    try {
      await fn()
    } finally {
      await client.query('select pg_advisory_unlock($1)', [lockKey])
    }
  } finally {
    await client.end()
  }
}

async function main() {
  if (!runMigrations && !runBootstrap) {
    console.log('[db:startup] Nenhuma tarefa de banco habilitada.')
    return
  }

  console.log('[db:startup] Preparacao do banco iniciada em background.')
  await run('node', ['scripts/wait-for-db.cjs'])

  await withDatabaseLock(async () => {
    console.log('[db:startup] Inicializando schema quando necessario...')
    await run('npm', ['run', 'schema:init'])

    if (runMigrations) {
      await ensurePayloadMigrationsTable()
      console.log('[db:startup] Aplicando migrations do Payload...')
      await run('npm', ['run', 'migrate'])
    }

    if (runBootstrap) {
      console.log('[db:startup] Executando bootstrap do banco novo...')
      await run('npm', ['run', 'bootstrap:new-db'])
    }
  })

  console.log('[db:startup] Preparacao do banco concluida.')
}

main().catch((error) => {
  console.error('[db:startup] Falha no preparo do banco:', error)
  process.exit(1)
})
