import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { getPayload } from 'payload'
import type { Config } from '../src/payload-types'
import configPromise from '../src/payload.config'

const outRoot = process.argv.includes('--out')
  ? process.argv[process.argv.indexOf('--out') + 1]
  : 'db-exports'

const includeUsers = process.argv.includes('--include-users')

const collections = [
  'media',
  'team',
  'pages',
  'posts',
  'campaigns',
  'testimonials',
  'practice-areas',
  'news-articles',
  'clients',
  'leads',
  'campaign-events',
  'client-documents',
  'nps-responses',
  'deadlines',
  'jurisprudence',
  'faqs',
  'automation-runs',
  'audit-log',
]

const globals: (keyof Config['globals'])[] = ['homepage', 'site-config', 'brand-config', 'navigation', 'automation-config']

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-').replace('T', '_').slice(0, 19)
}

async function findAll(payload: any, collection: string) {
  const docs = []
  let page = 1

  while (true) {
    const result = await payload.find({
      collection,
      page,
      limit: 200,
      depth: 0,
      overrideAccess: true,
    })

    docs.push(...(result.docs || []))
    if (!result.hasNextPage) break
    page += 1
  }

  return docs
}

async function main() {
  const target = path.join(outRoot, timestamp())
  await fs.mkdir(target, { recursive: true })

  const payload = await getPayload({ config: configPromise })
  const exportCollections = includeUsers ? ['users', ...collections] : collections
  const summary: Record<string, number | string> = {}

  for (const collection of exportCollections) {
    try {
      const docs = await findAll(payload, collection)
      await fs.writeFile(path.join(target, `${collection}.json`), JSON.stringify(docs, null, 2), 'utf8')
      summary[collection] = docs.length
    } catch (error) {
      summary[collection] = `ERROR: ${error instanceof Error ? error.message : String(error)}`
    }
  }

  for (const globalSlug of globals) {
    try {
      const doc = await payload.findGlobal({ slug: globalSlug, depth: 0, overrideAccess: true })
      await fs.writeFile(path.join(target, `global-${globalSlug}.json`), JSON.stringify(doc, null, 2), 'utf8')
      summary[`global:${globalSlug}`] = doc ? 1 : 0
    } catch (error) {
      summary[`global:${globalSlug}`] = `ERROR: ${error instanceof Error ? error.message : String(error)}`
    }
  }

  await fs.writeFile(path.join(target, 'summary.json'), JSON.stringify(summary, null, 2), 'utf8')
  await fs.writeFile(
    path.join(target, 'README.txt'),
    [
      'Export JSON via Payload Local API.',
      'Por padrao users NAO sao exportados para evitar vazar hash/sessoes.',
      'Se precisar preservar usuarios administrativos, rode novamente com --include-users e trate o arquivo como segredo.',
      `Gerado em ${new Date().toISOString()}`,
      '',
    ].join('\n'),
    'utf8',
  )

  console.log(`Export concluido: ${target}`)
  console.log('Me envie a pasta compactada junto com full.dump/data-only.sql se você também rodar export-current-db.ps1.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})