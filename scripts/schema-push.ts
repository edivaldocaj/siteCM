import { Client } from 'pg'
import { getPayload } from 'payload'
import config from '@payload-config'

const requiredTables = [
  'users',
  'media',
  'site_config',
  'homepage',
  'navigation',
  'posts',
  'practice_areas',
  'campaigns',
  'testimonials',
  'team',
  'news_articles',
]

async function verifyRequiredTables() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL ausente')

  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()

  try {
    const result = await client.query(
      `select table_name
       from information_schema.tables
       where table_schema = 'public'
         and table_name = any($1::text[])`,
      [requiredTables],
    )
    const existing = new Set(result.rows.map((row) => row.table_name))
    const missing = requiredTables.filter((table) => !existing.has(table))

    if (missing.length > 0) {
      throw new Error(`schema push nao criou tabelas obrigatorias: ${missing.join(', ')}`)
    }
  } finally {
    await client.end()
  }
}

try {
  process.env.PAYLOAD_DB_PUSH = 'true'
  process.env.PAYLOAD_FORCE_DRIZZLE_PUSH = 'true'

  const payload = await getPayload({ config })
  await payload.destroy?.()
  await verifyRequiredTables()

  console.log('[schema:push] Schema inicial sincronizado e verificado.')
  process.exit(0)
} catch (error) {
  console.error('[schema:push] Falha ao sincronizar schema inicial:', error)
  process.exit(1)
}
