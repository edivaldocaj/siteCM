import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getUserRoles } from '@/lib/admin-auth'
import { automationQueue } from '@/jobs/automationTasks'

const allowedTasks = new Set(['sync-news-feed', 'send-deadline-alerts'])
const taskEndpointMap: Record<string, string> = {
  'send-deadline-alerts': '/api/deadlines',
  'sync-news-feed': '/api/news-feed',
}

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
      queueError = error instanceof Error ? error.message : 'Nao foi possivel enfileirar o job nativo.'
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
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno.'
    console.error('[Automation Jobs API] Error:', error)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
