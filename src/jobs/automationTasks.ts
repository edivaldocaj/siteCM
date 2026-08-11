import type { Field, TaskConfig } from 'payload'

const AUTOMATION_QUEUE = 'automation'

type AutomationTaskOutput = {
  message: string
  response?: unknown
  status: number
  success: boolean
}

type BeforeScheduleArgs = Parameters<NonNullable<NonNullable<NonNullable<TaskConfig['schedule']>[number]['hooks']>['beforeSchedule']>>[0]

const taskOutputSchema: Field[] = [
  { name: 'success', type: 'checkbox', required: true },
  { name: 'status', type: 'number', required: true },
  { name: 'message', type: 'textarea', required: true },
  { name: 'response', type: 'json' },
]

function getAutomationBaseURL() {
  return (
    process.env.PAYLOAD_JOBS_BASE_URL ||
    process.env.INTERNAL_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    `http://127.0.0.1:${process.env.PORT || 3000}`
  )
}

async function callAutomationEndpoint(pathname: string): Promise<AutomationTaskOutput> {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    throw new Error('CRON_SECRET nao configurado para executar automacoes nativas.')
  }

  const url = new URL(pathname, getAutomationBaseURL())
  const response = await fetch(url, {
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

  const message =
    typeof body === 'object' && body && 'error' in body
      ? String((body as { error?: unknown }).error)
      : response.ok
        ? 'Automacao executada com sucesso.'
        : text.slice(0, 500) || `Falha HTTP ${response.status}`

  if (!response.ok) {
    throw new Error(message)
  }

  return {
    message,
    response: body,
    status: response.status,
    success: true,
  }
}

function parseHour(value: string | undefined, fallback: number) {
  const hour = Number(value)
  if (!Number.isFinite(hour) || hour < 0 || hour > 23) return fallback
  return Math.floor(hour)
}

function createDailyCron(hour: number) {
  return `0 ${hour} * * *`
}

function getNewsCron() {
  return process.env.PAYLOAD_JOBS_NEWS_CRON || '0 */6 * * *'
}

function getDeadlineCron() {
  return process.env.PAYLOAD_JOBS_DEADLINES_CRON || createDailyCron(parseHour(process.env.PAYLOAD_JOBS_DEADLINE_HOUR, 8))
}

function createEnabledSchedule(field: 'deadlineAlertsEnabled' | 'newsEnabled') {
  return async ({ defaultBeforeSchedule, jobStats, queueable, req }: BeforeScheduleArgs) => {
    const defaultResult = await defaultBeforeSchedule({ defaultBeforeSchedule, jobStats, queueable, req })
    if (!defaultResult.shouldSchedule) return defaultResult

    const automationConfig = await req.payload.findGlobal({
      slug: 'automation-config',
    })

    return {
      ...defaultResult,
      shouldSchedule: Boolean(automationConfig?.[field]),
    }
  }
}

export const automationQueue = AUTOMATION_QUEUE

export const automationTasks: TaskConfig[] = [
  {
    slug: 'sync-news-feed',
    label: 'Ingestao de noticias juridicas',
    outputSchema: taskOutputSchema,
    retries: {
      attempts: 2,
      backoff: { delay: 60000, type: 'exponential' },
    },
    schedule: [
      {
        cron: getNewsCron(),
        hooks: {
          beforeSchedule: createEnabledSchedule('newsEnabled'),
        },
        queue: AUTOMATION_QUEUE,
      },
    ],
    handler: async () => ({
      output: await callAutomationEndpoint('/api/news-feed'),
    }),
  },
  {
    slug: 'send-deadline-alerts',
    label: 'Alertas de prazos',
    outputSchema: taskOutputSchema,
    retries: {
      attempts: 2,
      backoff: { delay: 60000, type: 'exponential' },
    },
    schedule: [
      {
        cron: getDeadlineCron(),
        hooks: {
          beforeSchedule: createEnabledSchedule('deadlineAlertsEnabled'),
        },
        queue: AUTOMATION_QUEUE,
      },
    ],
    handler: async () => ({
      output: await callAutomationEndpoint('/api/deadlines'),
    }),
  },
]
