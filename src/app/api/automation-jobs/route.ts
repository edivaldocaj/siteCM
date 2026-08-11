import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { Client } from 'pg'
import configPromise from '@payload-config'
import { getUserRoles } from '@/lib/admin-auth'
import { automationQueue } from '@/jobs/automationTasks'

const allowedTasks = new Set(['sync-news-feed', 'send-deadline-alerts'])
const taskEndpointMap: Record<string, string> = {
  'send-deadline-alerts': '/api/deadlines',
  'sync-news-feed': '/api/news-feed',
}
const payloadJobsRepairLockKey = 82417032
const payloadJobsTaskSlugColumns = [
  { table: 'payload_jobs', column: 'task_slug' },
  { table: 'payload_jobs_log', column: 'task_slug' },
  { table: 'payload_jobs_log', column: 'parent_task_slug' },
]

function unauthorized(message = 'Nao autenticado.') {
  return NextResponse.json({ error: message }, { status: message === 'Acesso negado.' ? 403 : 401 })
}

async function getAuthorizedPayload(req: NextRequest) {
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: req.headers })

  if (!user) return { denied: unauthorized(), payload: null }

  const roles = getUserRoles(user as any)
  if (!roles.some((role) => ['admin', 'editor', 'staff'].includes(role))) {
    return { denied: unauthorized('Acesso negado.'), payload: null }
  }

  return { denied: null, payload }
}

function getBaseURL(req: NextRequest) {
  return (
    process.env.PAYLOAD_JOBS_BASE_URL ||
    process.env.INTERNAL_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    req.nextUrl.origin
  )
}

function getErrorMessage(error: unknown) {
  if (!(error instanceof Error)) return 'Erro desconhecido.'

  const details = [error.message]
  const root = error as Error & {
    code?: unknown
    constraint?: unknown
    detail?: unknown
    routine?: unknown
    table?: unknown
    where?: unknown
  }
  const cause = error.cause as
    | {
        code?: unknown
        constraint?: unknown
        detail?: unknown
        message?: unknown
        routine?: unknown
        table?: unknown
        where?: unknown
      }
    | undefined

  if (root.code) details.push(`code: ${String(root.code)}`)
  if (root.detail) details.push(`detail: ${String(root.detail)}`)
  if (root.where) details.push(`where: ${String(root.where)}`)
  if (root.table) details.push(`table: ${String(root.table)}`)
  if (root.constraint) details.push(`constraint: ${String(root.constraint)}`)
  if (root.routine) details.push(`routine: ${String(root.routine)}`)
  if (cause?.message && cause.message !== error.message) details.push(`cause: ${String(cause.message)}`)
  if (cause?.code) details.push(`code: ${String(cause.code)}`)
  if (cause?.detail) details.push(`detail: ${String(cause.detail)}`)
  if (cause?.where) details.push(`where: ${String(cause.where)}`)
  if (cause?.table) details.push(`table: ${String(cause.table)}`)
  if (cause?.constraint) details.push(`constraint: ${String(cause.constraint)}`)
  if (cause?.routine) details.push(`routine: ${String(cause.routine)}`)

  return details.join(' | ')
}

async function repairNativeJobsQueueSchema() {
  if (!process.env.DATABASE_URL) return { changed: [], skipped: 'DATABASE_URL ausente.' }

  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()

  const changed: string[] = []

  try {
    const lock = await client.query('select pg_try_advisory_lock($1) as locked', [payloadJobsRepairLockKey])
    if (!lock.rows[0]?.locked) {
      return { changed, skipped: 'Outro processo ja esta reparando a fila nativa.' }
    }

    try {
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
        changed.push(`${table}.${column}: ${dataType} -> varchar`)
      }
    } finally {
      await client.query('select pg_advisory_unlock($1)', [payloadJobsRepairLockKey])
    }
  } finally {
    await client.end()
  }

  return { changed }
}

async function runTaskDirectly(task: string, req: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    throw new Error('CRON_SECRET nao configurado para fallback direto da automacao.')
  }

  const endpoint = taskEndpointMap[task]
  if (!endpoint) {
    throw new Error('Task sem endpoint de fallback configurado.')
  }

  const response = await fetch(new URL(endpoint, getBaseURL(req)), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secret}`,
    },
    signal: AbortSignal.timeout(120000),
  })

  const text = await response.text()
  let body: unknown = text

  if (text) {
    try {
      body = JSON.parse(text)
    } catch {
      body = text
    }
  }

  if (!response.ok) {
    const message =
      typeof body === 'object' && body && 'error' in body
        ? String((body as { error?: unknown }).error)
        : text || `Falha HTTP ${response.status}`
    throw new Error(message)
  }

  return body
}

export async function GET(req: NextRequest) {
  const { denied, payload } = await getAuthorizedPayload(req)
  if (denied) return denied

  try {
    const [queued, failed, latest] = await Promise.all([
      (payload as any).find({
        collection: 'payload-jobs',
        limit: 0,
        where: {
          completedAt: { exists: false },
          hasError: { not_equals: true },
          queue: { equals: automationQueue },
        },
      }),
      (payload as any).find({
        collection: 'payload-jobs',
        limit: 0,
        where: {
          hasError: { equals: true },
          queue: { equals: automationQueue },
        },
      }),
      (payload as any).find({
        collection: 'payload-jobs',
        depth: 0,
        limit: 8,
        sort: '-createdAt',
        where: {
          queue: { equals: automationQueue },
        },
      }),
    ])

    return NextResponse.json({
      failed: failed.totalDocs,
      latest: latest.docs,
      queued: queued.totalDocs,
    })
  } catch (error) {
    console.error('[Automation Jobs API] Error:', error)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { denied, payload } = await getAuthorizedPayload(req)
  if (denied) return denied

  try {
    const body = await req.json().catch(() => ({}))
    const task = typeof body.task === 'string' ? body.task : ''
    const runNow = body.runNow !== false

    if (!allowedTasks.has(task)) {
      return NextResponse.json({ error: 'Task invalida.' }, { status: 400 })
    }

    let schemaRepair: Awaited<ReturnType<typeof repairNativeJobsQueueSchema>> | null = null
    let schemaRepairError: string | null = null

    try {
      schemaRepair = await repairNativeJobsQueueSchema()
    } catch (error) {
      schemaRepairError = getErrorMessage(error)
    }

    let job: unknown = null
    let queueError: string | null = null

    try {
      job = await payload.jobs.queue({
        input: {},
        meta: {
          queuedBy: 'payload-dashboard',
          source: 'manual',
        },
        queue: automationQueue,
        task: task as any,
      } as any)
    } catch (error) {
      queueError = getErrorMessage(error)

      try {
        schemaRepair = await repairNativeJobsQueueSchema()
        job = await payload.jobs.queue({
          input: {},
          meta: {
            queuedBy: 'payload-dashboard',
            source: 'manual-retry',
          },
          queue: automationQueue,
          task: task as any,
        } as any)
        queueError = null
      } catch (retryError) {
        queueError = `${queueError} | retry after schema repair: ${getErrorMessage(retryError)}`
      }

      if (schemaRepairError) {
        queueError = `${queueError} | schema repair before queue: ${schemaRepairError}`
      }
    }

    let runError: string | null = null
    let runResult: unknown = null

    if (job && runNow) {
      try {
        runResult = await payload.jobs.run({
          limit: 5,
          queue: automationQueue,
          sequential: true,
        })
      } catch (error) {
        runError = error instanceof Error ? error.message : 'Job enfileirado, mas a execucao imediata falhou.'
      }
    }

    if (!job && runNow) {
      try {
        runResult = await runTaskDirectly(task, req)
      } catch (error) {
        runError = error instanceof Error ? error.message : 'Fallback direto da automacao falhou.'
      }
    }

    return NextResponse.json({
      directFallback: !job && Boolean(runResult),
      job,
      queueError,
      queued: Boolean(job),
      runError,
      runResult,
      schemaRepair,
      schemaRepairError,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno.'
    console.error('[Automation Jobs API] Error:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
