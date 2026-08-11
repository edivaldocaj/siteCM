const { spawn } = require('child_process')
const { Client } = require('pg')

const lockKey = 82417031
const runSchemaPush = process.env.RUN_SCHEMA_PUSH_ON_START === 'true'
const runMigrations = process.env.SKIP_MIGRATIONS_ON_START !== 'true'
const runBootstrap = process.env.BOOTSTRAP_NEW_DB_ON_START === 'true'
const runDemoSeed = process.env.SEED_DEMO_CONTENT_ON_START === 'true'

const payloadJobsTaskSlugColumns = [
  { table: 'payload_jobs', column: 'task_slug' },
  { table: 'payload_jobs_log', column: 'task_slug' },
  { table: 'payload_jobs_log', column: 'parent_task_slug' },
]

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

async function repairPayloadJobsTaskSlugColumns() {
  if (!process.env.DATABASE_URL) return

  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS "payload_kv" (
        "id" serial PRIMARY KEY NOT NULL,
        "key" varchar NOT NULL,
        "data" jsonb NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "payload_jobs" (
        "id" serial PRIMARY KEY NOT NULL,
        "input" jsonb,
        "completed_at" timestamp(3) with time zone,
        "total_tried" numeric DEFAULT 0,
        "has_error" boolean DEFAULT false,
        "error" jsonb,
        "task_slug" varchar,
        "queue" varchar DEFAULT 'default',
        "wait_until" timestamp(3) with time zone,
        "processing" boolean DEFAULT false,
        "meta" jsonb,
        "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
        "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS "payload_jobs_log" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "id" varchar PRIMARY KEY NOT NULL,
        "executed_at" timestamp(3) with time zone NOT NULL,
        "completed_at" timestamp(3) with time zone NOT NULL,
        "task_slug" varchar NOT NULL,
        "task_i_d" varchar NOT NULL,
        "input" jsonb,
        "output" jsonb,
        "state" varchar NOT NULL,
        "error" jsonb,
        "parent_task_slug" varchar,
        "parent_task_i_d" varchar
      );

      CREATE TABLE IF NOT EXISTS "payload_jobs_stats" (
        "id" serial PRIMARY KEY NOT NULL,
        "stats" jsonb,
        "updated_at" timestamp(3) with time zone,
        "created_at" timestamp(3) with time zone
      );

      DO $$ BEGIN
        ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
      EXCEPTION WHEN duplicate_object THEN null;
      END $$;

      CREATE UNIQUE INDEX IF NOT EXISTS "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
      CREATE INDEX IF NOT EXISTS "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
      CREATE INDEX IF NOT EXISTS "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
      CREATE INDEX IF NOT EXISTS "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
      CREATE INDEX IF NOT EXISTS "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
      CREATE INDEX IF NOT EXISTS "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
      CREATE INDEX IF NOT EXISTS "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
      CREATE INDEX IF NOT EXISTS "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
      CREATE INDEX IF NOT EXISTS "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
      CREATE INDEX IF NOT EXISTS "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
      CREATE INDEX IF NOT EXISTS "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
      CREATE INDEX IF NOT EXISTS "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
    `)

    for (const { table, column } of payloadJobsTaskSlugColumns) {
      const result = await client.query(
        `select data_type
         from information_schema.columns
         where table_schema = 'public'
           and table_name = $1
           and column_name = $2`,
        [table, column],
      )

      const dataType = result.rows[0]?.data_type
      if (!dataType || dataType === 'character varying') continue

      await client.query(`ALTER TABLE "${table}" ALTER COLUMN "${column}" TYPE varchar USING "${column}"::text`)
      console.log(`[db:startup] ${table}.${column} convertido de ${dataType} para varchar.`)
    }
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
  if (!runSchemaPush && !runMigrations && !runBootstrap && !runDemoSeed) {
    console.log('[db:startup] Nenhuma tarefa de banco habilitada.')
    return
  }

  console.log('[db:startup] Preparacao do banco iniciada.')
  await run('node', ['scripts/wait-for-db.cjs'])

  await withDatabaseLock(async () => {
    if (runSchemaPush || runBootstrap || runDemoSeed) {
      console.log('[db:startup] Inicializando schema quando necessario...')
      await run('npm', ['run', 'schema:init'])
    }

    if (runMigrations) {
      await ensurePayloadMigrationsTable()
      await repairPayloadJobsTaskSlugColumns()
      console.log('[db:startup] Aplicando migrations do Payload...')
      await run('npm', ['run', 'migrate'])
    }

    if (runBootstrap) {
      console.log('[db:startup] Executando bootstrap do banco novo...')
      await run('npm', ['run', 'bootstrap:new-db'])
    }

    if (runDemoSeed) {
      console.log('[db:startup] Executando seed demonstrativo...')
      await run('npm', ['run', 'seed:demo-content'])
    }
  })

  console.log('[db:startup] Preparacao do banco concluida.')
}

main().catch((error) => {
  console.error('[db:startup] Falha no preparo do banco:', error)
  process.exit(1)
})
