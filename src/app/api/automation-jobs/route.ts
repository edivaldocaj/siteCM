import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { sql } from '@payloadcms/db-postgres'
import configPromise from '@payload-config'
import { getUserRoles } from '@/lib/admin-auth'
import { automationQueue } from '@/jobs/automationTasks'

const allowedTasks = new Set(['sync-news-feed', 'send-deadline-alerts'])
let enumRepairPromise: Promise<void> | null = null

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

async function ensurePayloadJobTaskEnums(payload: NonNullable<Awaited<ReturnType<typeof getAuthorizedPayload>>['payload']>) {
  enumRepairPromise =
    enumRepairPromise ||
    (async () => {
      const db = (payload as any).db?.drizzle
      if (!db?.execute) return

      await db.execute(sql`ALTER TYPE "public"."enum_payload_jobs_task_slug" ADD VALUE IF NOT EXISTS 'sync-news-feed'`)
      await db.execute(sql`ALTER TYPE "public"."enum_payload_jobs_task_slug" ADD VALUE IF NOT EXISTS 'send-deadline-alerts'`)
      await db.execute(sql`ALTER TYPE "public"."enum_payload_jobs_log_task_slug" ADD VALUE IF NOT EXISTS 'sync-news-feed'`)
      await db.execute(sql`ALTER TYPE "public"."enum_payload_jobs_log_task_slug" ADD VALUE IF NOT EXISTS 'send-deadline-alerts'`)
      await db.execute(sql`ALTER TYPE "public"."enum_payload_jobs_log_parent_task_slug" ADD VALUE IF NOT EXISTS 'sync-news-feed'`)
      await db.execute(sql`ALTER TYPE "public"."enum_payload_jobs_log_parent_task_slug" ADD VALUE IF NOT EXISTS 'send-deadline-alerts'`)
    })()

  await enumRepairPromise
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

    await ensurePayloadJobTaskEnums(payload)

    const job = await payload.jobs.queue({
      input: {},
      meta: {
        queuedBy: 'payload-dashboard',
        source: 'manual',
      },
      queue: automationQueue,
      task: task as any,
    } as any)

    let runError: string | null = null
    let runResult: unknown = null

    if (runNow) {
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

    return NextResponse.json({
      job,
      queued: true,
      runError,
      runResult,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno.'
    console.error('[Automation Jobs API] Error:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
