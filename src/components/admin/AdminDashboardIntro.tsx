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

type MetricCard = {
  detail: string
  href: string
  label: string
  tone: 'attention' | 'danger' | 'neutral' | 'success'
  value: number | string
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
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    month: '2-digit',
  }).format(new Date(value))
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
        findLatest(payload, 'automation-runs', 4),
        findLatest(payload, 'payload-jobs', 4),
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
      automationRuns,
      jobs,
      metrics,
      ok: true,
    }
  } catch {
    return {
      automationConfig: null,
      automationRuns: [],
      jobs: [],
      metrics: [],
      ok: false,
    }
  }
}

export default async function AdminDashboardIntro() {
  const data = await getDashboardData()
  const newsEnabled = Boolean(data.automationConfig?.newsEnabled)
  const deadlinesEnabled = Boolean(data.automationConfig?.deadlineAlertsEnabled)
  const autorunEnabled = process.env.PAYLOAD_JOBS_AUTORUN === 'true'

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
                  detail={`${formatDate(run.startedAt)} | ${Number(run.itemsOut || 0)} item(ns)`}
                  status={run.status || 'pending'}
                  title={run.task || 'automacao'}
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
                  detail={`${job.queue || 'default'} | ${formatDate(job.createdAt)}`}
                  status={job.hasError ? 'error' : job.completedAt ? 'success' : 'pending'}
                  title={job.taskSlug || job.workflowSlug || 'job'}
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
      <span className={`ca-admin-dashboard__badge ca-admin-dashboard__badge--${status}`}>{status}</span>
    </div>
  )
}
