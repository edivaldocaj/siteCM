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
