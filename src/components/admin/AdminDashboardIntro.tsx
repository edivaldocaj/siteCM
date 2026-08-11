import { getPayload } from 'payload'
import configPromise from '@payload-config'
import AdminAutomationActions from './AdminAutomationActions'

const primaryActions = [
  { label: 'Novo lead', href: '/admin/collections/leads/create' },
  { label: 'Nova campanha', href: '/admin/collections/campaigns/create' },
  { label: 'Novo artigo', href: '/admin/collections/posts/create' },
]

const quickLinks = [
  { eyebrow: 'Relacionamento', title: 'Leads', href: '/admin/collections/leads', text: 'Acompanhe contatos captados pelo site e campanhas.' },
  { eyebrow: 'Marketing', title: 'Campanhas', href: '/admin/collections/campaigns', text: 'Edite landing pages, provas sociais, FAQs e CTAs.' },
  { eyebrow: 'Editorial', title: 'Blog', href: '/admin/collections/posts', text: 'Publique artigos e vincule conteudos as campanhas.' },
  { eyebrow: 'Automacoes', title: 'Jobs nativos', href: '/admin/collections/payload-jobs', text: 'Veja fila, tentativas, erros e execucoes programadas pelo Payload.' },
  { eyebrow: 'Operacao', title: 'Prazos', href: '/admin/collections/deadlines', text: 'Controle prazos processuais e alertas enviados automaticamente.' },
  { eyebrow: 'Institucional', title: 'Identidade', href: '/admin/globals/brand-config', text: 'Atualize marca, contatos, redes sociais e avisos juridicos.' },
]

const taskLabels: Record<string, string> = {
  'deadline-alerts': 'Alertas de prazos',
  'news-feed': 'Ingestao de noticias',
  'send-deadline-alerts': 'Alertas de prazos',
  'sync-news-feed': 'Ingestao de noticias',
}

const statusLabels: Record<string, string> = {
  error: 'falhou',
  failed: 'falhou',
  pending: 'pendente',
  running: 'rodando',
  success: 'ok',
  succeeded: 'ok',
}

type MetricCard = {
  detail: string
  href: string
  label: string
  tone: 'attention' | 'danger' | 'neutral' | 'success'
  value: number | string
}

type SignalCard = {
  detail: string
  label: string
  tone: 'attention' | 'danger' | 'neutral' | 'success'
}

async function count(payload: any, collection: string, where?: Record<string, unknown>) {
  try {
    const result = await payload.find({
      collection,
      limit: 0,
      where,
    })
    return Number(result.totalDocs || 0)
  } catch {
    return 0
  }
}

async function findLatest(payload: any, collection: string, limit = 5) {
  try {
    const result = await payload.find({
      collection,
      depth: 0,
      limit,
      sort: '-createdAt',
    })
    return result.docs || []
  } catch {
    return []
  }
}

function formatDate(value: unknown) {
  if (!value || typeof value !== 'string') return 'sem data'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'sem data'

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: '2-digit',
  }).format(date)
}

function formatTask(value: unknown) {
  if (typeof value !== 'string' || !value) return 'Automacao'
  return taskLabels[value] || value
}

function normalizeStatus(value: unknown) {
  if (typeof value !== 'string' || !value) return 'pending'
  return value
}

function formatStatus(value: unknown) {
  const status = normalizeStatus(value)
  return statusLabels[status] || status
}

function formatDuration(startedAt: unknown, finishedAt: unknown) {
  if (typeof startedAt !== 'string' || typeof finishedAt !== 'string') return null

  const started = new Date(startedAt).getTime()
  const finished = new Date(finishedAt).getTime()
  if (!Number.isFinite(started) || !Number.isFinite(finished) || finished < started) return null

  const seconds = Math.max(1, Math.round((finished - started) / 1000))
  if (seconds < 60) return `${seconds}s`

  const minutes = Math.floor(seconds / 60)
  const rest = seconds % 60
  return rest ? `${minutes}min ${rest}s` : `${minutes}min`
}

function truncate(value: unknown, max = 86) {
  if (typeof value !== 'string' || !value) return ''
  return value.length > max ? `${value.slice(0, max - 1)}...` : value
}

function buildRunDetail(run: any) {
  const pieces = [
    formatDate(run.startedAt),
    `${Number(run.itemsIn || 0)} lidos`,
    `${Number(run.itemsOut || 0)} gerados`,
  ]
  const duration = formatDuration(run.startedAt, run.finishedAt)
  if (duration) pieces.push(duration)
  if (run.errorMessage) pieces.push(truncate(run.errorMessage))
  return pieces.filter(Boolean).join(' | ')
}

function buildJobDetail(job: any) {
  const pieces = [
    job.queue || 'default',
    formatDate(job.createdAt),
  ]
  if (job.totalTried) pieces.push(`${Number(job.totalTried)} tentativa(s)`)
  if (job.completedAt) pieces.push(`finalizado ${formatDate(job.completedAt)}`)
  return pieces.filter(Boolean).join(' | ')
}

function getJobStatus(job: any) {
  if (job.hasError) return 'failed'
  if (job.completedAt) return 'succeeded'
  if (job.processing) return 'running'
  return 'pending'
}

function findLastRun(runs: any[], tasks: string[]) {
  return runs.find((run) => typeof run?.task === 'string' && tasks.includes(run.task))
}

function formatAge(value: unknown) {
  if (typeof value !== 'string') return 'sem registro'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'sem registro'

  const minutes = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000))
  if (minutes < 60) return `ha ${minutes || 1}min`

  const hours = Math.round(minutes / 60)
  if (hours < 48) return `ha ${hours}h`

  return `ha ${Math.round(hours / 24)}d`
}

function buildSignals({
  autorunEnabled,
  deadlinesEnabled,
  failedJobs,
  newsEnabled,
  queuedJobs,
  runs,
}: {
  autorunEnabled: boolean
  deadlinesEnabled: boolean
  failedJobs: number
  newsEnabled: boolean
  queuedJobs: number
  runs: any[]
}): SignalCard[] {
  const newsRun = findLastRun(runs, ['news-feed', 'sync-news-feed'])
  const deadlineRun = findLastRun(runs, ['deadline-alerts', 'send-deadline-alerts'])

  return [
    {
      detail: autorunEnabled ? 'Agenda ativa nesta instancia' : 'Execucao manual disponivel',
      label: 'Runner Payload',
      tone: autorunEnabled ? 'success' : 'attention',
    },
    {
      detail: failedJobs > 0 ? `${failedJobs} job(s) exigem revisao` : queuedJobs > 0 ? `${queuedJobs} job(s) aguardando fila` : 'Fila sem pendencias',
      label: 'Fila nativa',
      tone: failedJobs > 0 ? 'danger' : queuedJobs > 0 ? 'attention' : 'success',
    },
    {
      detail: newsEnabled ? `Ultima execucao ${formatAge(newsRun?.finishedAt || newsRun?.startedAt)}` : 'Ingestao desligada no CMS',
      label: 'Noticias',
      tone: newsEnabled ? (newsRun?.status === 'error' ? 'danger' : newsRun ? 'success' : 'attention') : 'neutral',
    },
    {
      detail: deadlinesEnabled ? `Ultima execucao ${formatAge(deadlineRun?.finishedAt || deadlineRun?.startedAt)}` : 'Alertas desligados no CMS',
      label: 'Prazos',
      tone: deadlinesEnabled ? (deadlineRun?.status === 'error' ? 'danger' : deadlineRun ? 'success' : 'attention') : 'neutral',
    },
  ]
}

async function getDashboardData() {
  try {
    const payload = await getPayload({ config: configPromise })
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

    const [newLeads, pendingNews, upcomingDeadlines, criticalDeadlines, failedJobs, queuedJobs, automationRuns, jobs, automationConfig] =
      await Promise.all([
        count(payload, 'leads', { status: { equals: 'new' } }),
        count(payload, 'news-articles', { status: { equals: 'pending' } }),
        count(payload, 'deadlines', {
          deadlineDate: { greater_than_equal: now.toISOString(), less_than_equal: weekAhead.toISOString() },
          status: { in: ['pending', 'in-progress'] },
        }),
        count(payload, 'deadlines', {
          deadlineDate: { greater_than_equal: now.toISOString(), less_than_equal: tomorrow.toISOString() },
          status: { in: ['pending', 'in-progress'] },
        }),
        count(payload, 'payload-jobs', { hasError: { equals: true } }),
        count(payload, 'payload-jobs', {
          completedAt: { exists: false },
          hasError: { not_equals: true },
        }),
        findLatest(payload, 'automation-runs', 8),
        findLatest(payload, 'payload-jobs', 6),
        payload.findGlobal({ slug: 'automation-config' }).catch(() => null),
      ])

    const metrics: MetricCard[] = [
      {
        detail: 'Leads aguardando primeiro atendimento',
        href: '/admin/collections/leads',
        label: 'Novos leads',
        tone: newLeads > 0 ? 'attention' : 'success',
        value: newLeads,
      },
      {
        detail: 'Noticias importadas aguardando curadoria',
        href: '/admin/collections/news-articles',
        label: 'Noticias pendentes',
        tone: pendingNews > 0 ? 'attention' : 'neutral',
        value: pendingNews,
      },
      {
        detail: `${criticalDeadlines} critico(s) nas proximas 24h`,
        href: '/admin/collections/deadlines',
        label: 'Prazos em 7 dias',
        tone: criticalDeadlines > 0 ? 'danger' : upcomingDeadlines > 0 ? 'attention' : 'success',
        value: upcomingDeadlines,
      },
      {
        detail: `${queuedJobs} pendente(s) ou em processamento`,
        href: '/admin/collections/payload-jobs',
        label: 'Jobs com erro',
        tone: failedJobs > 0 ? 'danger' : 'success',
        value: failedJobs,
      },
    ]

    return {
      automationConfig,
      failedJobs,
      automationRuns,
      jobs,
      metrics,
      ok: true,
      queuedJobs,
    }
  } catch {
    return {
      automationConfig: null,
      failedJobs: 0,
      automationRuns: [],
      jobs: [],
      metrics: [],
      ok: false,
      queuedJobs: 0,
    }
  }
}

export default async function AdminDashboardIntro() {
  const data = await getDashboardData()
  const newsEnabled = Boolean(data.automationConfig?.newsEnabled)
  const deadlinesEnabled = Boolean(data.automationConfig?.deadlineAlertsEnabled)
  const autorunEnabled = process.env.PAYLOAD_JOBS_AUTORUN === 'true'
  const signals = buildSignals({
    autorunEnabled,
    deadlinesEnabled,
    failedJobs: data.failedJobs,
    newsEnabled,
    queuedJobs: data.queuedJobs,
    runs: data.automationRuns,
  })

  return (
    <section className="ca-admin-dashboard" aria-labelledby="ca-admin-dashboard-title">
      <div className="ca-admin-dashboard__hero">
        <div>
          <span className="ca-admin-eyebrow">Painel editorial</span>
          <h1 id="ca-admin-dashboard-title">Cavalcante Albuquerque CMS</h1>
          <p>
            Central de gestao do site, campanhas, leads, prazos e automacoes nativas do Payload.
            Comece pelos indicadores criticos ou pelos atalhos principais.
          </p>
        </div>
        <div className="ca-admin-dashboard__actions" aria-label="Acoes rapidas">
          {primaryActions.map((action) => (
            <a key={action.href} href={action.href}>
              {action.label}
            </a>
          ))}
        </div>
      </div>

      {!data.ok && (
        <div className="ca-admin-dashboard__notice">
          Nao foi possivel carregar os indicadores agora. O CMS continua disponivel e tentara novamente no proximo acesso.
        </div>
      )}

      <div className="ca-admin-dashboard__metrics" aria-label="Indicadores operacionais">
        {data.metrics.map((metric) => (
          <a key={metric.label} href={metric.href} className={`ca-admin-dashboard__metric ca-admin-dashboard__metric--${metric.tone}`}>
            <span>{metric.label}</span>
            <strong>{metric.value}</strong>
            <p>{metric.detail}</p>
          </a>
        ))}
      </div>

      <div className="ca-admin-dashboard__signals" aria-label="Sinais das automacoes">
        {signals.map((signal) => (
          <div key={signal.label} className={`ca-admin-dashboard__signal ca-admin-dashboard__signal--${signal.tone}`}>
            <span />
            <div>
              <strong>{signal.label}</strong>
              <p>{signal.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="ca-admin-dashboard__ops">
        <div className="ca-admin-dashboard__panel">
          <div className="ca-admin-dashboard__panel-head">
            <span className="ca-admin-eyebrow">Automacoes nativas</span>
            <a href="/admin/globals/automation-config">Configurar</a>
          </div>
          <div className="ca-admin-dashboard__status-list">
            <StatusRow label="Runner Payload" active={autorunEnabled} detail={autorunEnabled ? 'Autorun ativo nesta instancia' : 'Aguardando PAYLOAD_JOBS_AUTORUN=true'} />
            <StatusRow label="Ingestao de noticias" active={newsEnabled} detail={newsEnabled ? 'Agendada pela fila automation' : 'Desligada no CMS'} />
            <StatusRow label="Alertas de prazos" active={deadlinesEnabled} detail={deadlinesEnabled ? 'Agendados pela fila automation' : 'Desligados no CMS'} />
          </div>
          <AdminAutomationActions />
        </div>

        <div className="ca-admin-dashboard__panel">
          <div className="ca-admin-dashboard__panel-head">
            <span className="ca-admin-eyebrow">Ultimas execucoes</span>
            <a href="/admin/collections/automation-runs">Ver logs</a>
          </div>
          <div className="ca-admin-dashboard__activity">
            {data.automationRuns.length > 0 ? (
              data.automationRuns.map((run: any) => (
                <ActivityRow
                  key={run.id}
                  detail={buildRunDetail(run)}
                  status={normalizeStatus(run.status)}
                  title={formatTask(run.task)}
                />
              ))
            ) : (
              <p>Nenhuma automacao registrada ainda.</p>
            )}
          </div>
        </div>

        <div className="ca-admin-dashboard__panel">
          <div className="ca-admin-dashboard__panel-head">
            <span className="ca-admin-eyebrow">Fila Payload</span>
            <a href="/admin/collections/payload-jobs">Ver jobs</a>
          </div>
          <div className="ca-admin-dashboard__activity">
            {data.jobs.length > 0 ? (
              data.jobs.map((job: any) => (
                <ActivityRow
                  key={job.id}
                  detail={buildJobDetail(job)}
                  status={getJobStatus(job)}
                  title={formatTask(job.taskSlug || job.workflowSlug)}
                />
              ))
            ) : (
              <p>Nenhum job criado ainda.</p>
            )}
          </div>
        </div>
      </div>

      <div className="ca-admin-dashboard__grid">
        {quickLinks.map((link) => (
          <a key={link.href} href={link.href} className="ca-admin-dashboard__card">
            <span>{link.eyebrow}</span>
            <strong>{link.title}</strong>
            <p>{link.text}</p>
          </a>
        ))}
      </div>
    </section>
  )
}

function StatusRow({ active, detail, label }: { active: boolean; detail: string; label: string }) {
  return (
    <div className="ca-admin-dashboard__status-row">
      <span className={active ? 'is-active' : ''} />
      <div>
        <strong>{label}</strong>
        <p>{detail}</p>
      </div>
    </div>
  )
}

function ActivityRow({ detail, status, title }: { detail: string; status: string; title: string }) {
  return (
    <div className="ca-admin-dashboard__activity-row">
      <div>
        <strong>{title}</strong>
        <p>{detail}</p>
      </div>
      <span className={`ca-admin-dashboard__badge ca-admin-dashboard__badge--${status}`}>{formatStatus(status)}</span>
    </div>
  )
}
