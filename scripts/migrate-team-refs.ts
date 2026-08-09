import { getPayload } from 'payload'
import config from '../src/payload.config'

type CollectionSummary = {
  read: number
  skipped: number
  unmapped: Array<{ id: string | number; value: unknown }>
  written: number
}

type LegacyValue = 'edivaldo' | 'gabrielly' | 'escritorio' | 'both'

type TeamIds = Record<'edivaldo' | 'gabrielly', string | number>

const batchSize = 100
const commit = process.argv.includes('--commit')

const emptySummary = (): CollectionSummary => ({ read: 0, skipped: 0, unmapped: [], written: 0 })

const normalizeLegacyValue = (value: unknown): LegacyValue | null => {
  if (value === 'edivaldo' || value === 'gabrielly' || value === 'escritorio' || value === 'both') return value
  if (value === undefined || value === null || value === '') return null
  return null
}

const resolveTeamRef = (value: LegacyValue, teamIds: TeamIds) => {
  if (value === 'edivaldo') return { ref: teamIds.edivaldo, byFirm: false }
  if (value === 'gabrielly') return { ref: teamIds.gabrielly, byFirm: false }
  return { ref: null, byFirm: true }
}

async function getTeamIds(payload: Awaited<ReturnType<typeof getPayload>>): Promise<TeamIds> {
  const [edivaldo, gabrielly] = await Promise.all([
    payload.find({ collection: 'team', where: { slug: { equals: 'edivaldo-cavalcante-albuquerque' } }, limit: 1 }),
    payload.find({ collection: 'team', where: { slug: { equals: 'gabrielly-melo' } }, limit: 1 }),
  ])

  const edivaldoDoc = edivaldo.docs[0]
  const gabriellyDoc = gabrielly.docs[0]

  if (!edivaldoDoc || !gabriellyDoc) {
    throw new Error('Registros obrigatórios em team não encontrados. Rode a migration/seed de Team antes do backfill.')
  }

  return { edivaldo: edivaldoDoc.id, gabrielly: gabriellyDoc.id }
}

async function migrateSimpleCollection(args: {
  collection: 'posts' | 'leads' | 'practice-areas' | 'deadlines' | 'nps-responses'
  legacyField: string
  refField: string
  byFirmField?: string
  teamIds: TeamIds
}) {
  const payload = await getPayload({ config })
  const summary = emptySummary()
  let page = 1

  while (true) {
    const result = await payload.find({ collection: args.collection, depth: 0, limit: batchSize, page })
    summary.read += result.docs.length

    for (const doc of result.docs as any[]) {
      const legacyValue = normalizeLegacyValue(doc[args.legacyField])
      if (!legacyValue) {
        summary.skipped += 1
        continue
      }

      const resolved = resolveTeamRef(legacyValue, args.teamIds)
      const currentRef = typeof doc[args.refField] === 'object' ? doc[args.refField]?.id : doc[args.refField]
      const alreadyMapped = currentRef === resolved.ref && (!args.byFirmField || doc[args.byFirmField] === resolved.byFirm)
      if (alreadyMapped) {
        summary.skipped += 1
        continue
      }

      if (resolved.ref === null && legacyValue !== 'escritorio' && legacyValue !== 'both') {
        summary.unmapped.push({ id: doc.id, value: legacyValue })
        continue
      }

      if (commit) {
        await payload.update({
          collection: args.collection,
          id: doc.id,
          data: {
            [args.refField]: resolved.ref,
            ...(args.byFirmField ? { [args.byFirmField]: resolved.byFirm } : {}),
          },
        } as any)
      }

      summary.written += 1
    }

    console.log(`${args.collection}: página ${page}/${result.totalPages} processada`)
    if (!result.hasNextPage) break
    page += 1
  }

  return summary
}

async function migrateClientProcesses(teamIds: TeamIds) {
  const payload = await getPayload({ config })
  const summary = emptySummary()
  let page = 1

  while (true) {
    const result = await payload.find({ collection: 'clients', depth: 0, limit: batchSize, page })
    summary.read += result.docs.length

    for (const client of result.docs as any[]) {
      const processes = Array.isArray(client.processes) ? client.processes : []
      let changed = false
      const nextProcesses = processes.map((process: any) => {
        const legacyValue = normalizeLegacyValue(process.attorney)
        if (!legacyValue) return process

        const resolved = resolveTeamRef(legacyValue, teamIds)
        const currentRef = typeof process.attorneyRef === 'object' ? process.attorneyRef?.id : process.attorneyRef
        if (currentRef === resolved.ref) return process

        changed = true
        return { ...process, attorneyRef: resolved.ref }
      })

      if (!changed) {
        summary.skipped += 1
        continue
      }

      if (commit) {
        await payload.update({
          collection: 'clients',
          id: client.id,
          data: { processes: nextProcesses },
        } as any)
      }

      summary.written += 1
    }

    console.log(`clients: página ${page}/${result.totalPages} processada`)
    if (!result.hasNextPage) break
    page += 1
  }

  return summary
}

async function main() {
  const payload = await getPayload({ config })
  const teamIds = await getTeamIds(payload)

  console.log(commit ? 'Modo COMMIT: alterações serão gravadas.' : 'Modo DRY-RUN: nenhuma alteração será gravada.')

  const results: Record<string, CollectionSummary> = {
    posts: await migrateSimpleCollection({ collection: 'posts', legacyField: 'author', refField: 'authorRef', byFirmField: 'byFirm', teamIds }),
    'practice-areas': await migrateSimpleCollection({ collection: 'practice-areas', legacyField: 'attorney', refField: 'responsibleRef', byFirmField: 'byFirm', teamIds }),
    leads: await migrateSimpleCollection({ collection: 'leads', legacyField: 'assignedTo', refField: 'assignedToRef', byFirmField: 'byFirm', teamIds }),
    clients: await migrateClientProcesses(teamIds),
    deadlines: await migrateSimpleCollection({ collection: 'deadlines', legacyField: 'attorney', refField: 'attorneyRef', teamIds }),
    'nps-responses': await migrateSimpleCollection({ collection: 'nps-responses', legacyField: 'attorney', refField: 'attorneyRef', teamIds }),
  }

  console.log('\nResumo')
  for (const [collection, summary] of Object.entries(results)) {
    console.log(`${collection}: lidos=${summary.read} escritos=${summary.written} pulados=${summary.skipped} naoMapeados=${summary.unmapped.length}`)
    for (const item of summary.unmapped) {
      console.log(`  naoMapeado id=${item.id} value=${String(item.value)}`)
    }
  }

  if (!commit) {
    console.log('\nExecute novamente com --commit somente após backup verificado e dry-run sem não mapeados.')
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
