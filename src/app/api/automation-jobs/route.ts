import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { requireAdminRole } from '@/lib/admin-auth'
import { automationQueue } from '@/jobs/automationTasks'

const allowedTasks = new Set(['sync-news-feed', 'send-deadline-alerts'])

export async function GET(req: NextRequest) {
  const denied = await requireAdminRole(req, ['admin', 'editor', 'staff'])
  if (denied) return denied

  try {
    const payload = await getPayload({ config: configPromise })
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
  const denied = await requireAdminRole(req, ['admin', 'editor', 'staff'])
  if (denied) return denied

  try {
    const body = await req.json().catch(() => ({}))
    const task = typeof body.task === 'string' ? body.task : ''
    const runNow = body.runNow !== false

    if (!allowedTasks.has(task)) {
      return NextResponse.json({ error: 'Task invalida.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })
    const job = await payload.jobs.queue({
      input: {},
      meta: {
        queuedBy: 'payload-dashboard',
        source: 'manual',
      },
      queue: automationQueue,
      task: task as any,
    } as any)

    const runResult = runNow
      ? await payload.jobs.run({
          limit: 5,
          queue: automationQueue,
          sequential: true,
        })
      : null

    return NextResponse.json({
      job,
      queued: true,
      runResult,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno.'
    console.error('[Automation Jobs API] Error:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
