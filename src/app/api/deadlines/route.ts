import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { requireAdminRole } from '@/lib/admin-auth'
import { getBearerToken, getRequiredSecret, safeCompare } from '@/lib/secrets'
import { sendResendEmail } from '@/lib/resend'

const getAttorneyEmails = (): Record<string, string | undefined> => ({
  edivaldo: process.env.CONTACT_EMAIL,
  gabrielly: process.env.CONTACT_EMAIL_2 || process.env.CONTACT_EMAIL,
})

const deadlineTypeLabels: Record<string, string> = {
  contestation: 'Contestação',
  appeal: 'Recurso',
  manifestation: 'Manifestação',
  hearing: 'Audiência',
  expertise: 'Perícia',
  'sentence-compliance': 'Cumprimento de Sentença',
  other: 'Outro',
}

async function createAutomationRun(payload: any, task: string) {
  try {
    return await payload.create({
      collection: 'automation-runs',
      data: {
        task,
        status: 'running',
        startedAt: new Date().toISOString(),
      },
    })
  } catch {
    return null
  }
}

async function finishAutomationRun(payload: any, runId: string | number | undefined, data: Record<string, unknown>) {
  if (!runId) return
  try {
    await payload.update({
      collection: 'automation-runs',
      id: runId,
      data: {
        ...data,
        finishedAt: new Date().toISOString(),
      },
    })
  } catch {}
}

/* GET: Listar prazos próximos (protegido) */
export async function GET(req: NextRequest) {
  const denied = await requireAdminRole(req, ['admin', 'staff'])
  if (denied) return denied
  try {
    const payload = await getPayload({ config: configPromise })
    const { searchParams } = new URL(req.url)
    const days = parseInt(searchParams.get('days') || '30')
    const attorney = searchParams.get('attorney')

    const now = new Date()
    const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)

    const where: any = {
      deadlineDate: { greater_than_equal: now.toISOString(), less_than_equal: futureDate.toISOString() },
      status: { not_equals: 'completed' },
    }
    if (attorney) where.attorney = { equals: attorney }

    const deadlines = await (payload as any).find({
      collection: 'deadlines',
      where,
      sort: 'deadlineDate',
      limit: 100,
    })

    // Categorizar por urgência
    const categorized = deadlines.docs.map((d: any) => {
      const daysUntil = Math.ceil((new Date(d.deadlineDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      let alertLevel = 'normal'
      if (daysUntil <= 1) alertLevel = 'critical'
      else if (daysUntil <= 3) alertLevel = 'urgent'
      else if (daysUntil <= 7) alertLevel = 'attention'

      return { ...d, daysUntil, alertLevel }
    })

    return NextResponse.json({
      total: deadlines.totalDocs,
      deadlines: categorized,
      summary: {
        critical: categorized.filter((d: any) => d.alertLevel === 'critical').length,
        urgent: categorized.filter((d: any) => d.alertLevel === 'urgent').length,
        attention: categorized.filter((d: any) => d.alertLevel === 'attention').length,
        normal: categorized.filter((d: any) => d.alertLevel === 'normal').length,
      },
    })
  } catch (error) {
    console.error('[Deadlines API] Error:', error)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

/* POST: Verificar e enviar alertas de prazos (chamado por cron/n8n) */
export async function POST(req: NextRequest) {
  const secret = getRequiredSecret('CRON_SECRET')
  if (!secret) {
    return NextResponse.json({ error: 'CRON_SECRET não configurado.' }, { status: 503 })
  }

  if (!safeCompare(getBearerToken(req.headers), secret)) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  let payload: any = null
  let run: any = null

  try {
    payload = await getPayload({ config: configPromise })
    run = await createAutomationRun(payload, 'deadline-alerts')

    const now = new Date()
    const alerts: any[] = []

    // Buscar prazos pendentes nos próximos 8 dias
    const futureDate = new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000)
    const deadlines = await (payload as any).find({
      collection: 'deadlines',
      where: {
        deadlineDate: { greater_than_equal: now.toISOString(), less_than_equal: futureDate.toISOString() },
        status: { in: ['pending', 'in-progress'] },
      },
      limit: 200,
    })

    for (const deadline of deadlines.docs) {
      const daysUntil = Math.ceil((new Date(deadline.deadlineDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      let shouldAlert = false
      let alertType = ''
      let updateField = ''

      if (daysUntil <= 1 && !deadline.alertSent1d) {
        shouldAlert = true
        alertType = '🔴 CRÍTICO — Amanhã'
        updateField = 'alertSent1d'
      } else if (daysUntil <= 3 && !deadline.alertSent3d) {
        shouldAlert = true
        alertType = '🟠 URGENTE — 3 dias'
        updateField = 'alertSent3d'
      } else if (daysUntil <= 7 && !deadline.alertSent7d) {
        shouldAlert = true
        alertType = '🟡 Atenção — 7 dias'
        updateField = 'alertSent7d'
      }

      if (shouldAlert && process.env.RESEND_API_KEY) {
        const attorneyEmails = getAttorneyEmails()
        const toEmail = attorneyEmails[deadline.attorney] || process.env.CONTACT_EMAIL
        if (!toEmail) continue
        const typeLabel = deadlineTypeLabels[deadline.deadlineType] || deadline.deadlineType

        try {
          const emailResult = await sendResendEmail({
            to: toEmail,
            subject: `${alertType} — Prazo: ${deadline.title}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                  <div style="background: ${daysUntil <= 1 ? '#dc2626' : daysUntil <= 3 ? '#ea580c' : 'var(--color-ca-navy-950)'}; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h2 style="color: #fff; margin: 0;">${alertType}</h2>
                  </div>
                  <div style="background: #fff; padding: 24px; border: 1px solid #e5e5e5;">
                    <h3 style="margin-top: 0;">${deadline.title}</h3>
                    <table style="width: 100%; font-size: 14px;">
                      <tr><td style="padding: 8px; color: #999;">Tipo</td><td style="padding: 8px;">${typeLabel}</td></tr>
                      <tr><td style="padding: 8px; color: #999;">Data</td><td style="padding: 8px; font-weight: bold;">${new Date(deadline.deadlineDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td></tr>
                      <tr><td style="padding: 8px; color: #999;">Dias restantes</td><td style="padding: 8px; font-weight: bold; color: ${daysUntil <= 1 ? '#dc2626' : daysUntil <= 3 ? '#ea580c' : 'var(--color-ca-steel-500)'};">${daysUntil} dia(s)</td></tr>
                      ${deadline.clientName ? `<tr><td style="padding: 8px; color: #999;">Cliente</td><td style="padding: 8px;">${deadline.clientName}</td></tr>` : ''}
                      ${deadline.processNumber ? `<tr><td style="padding: 8px; color: #999;">Processo</td><td style="padding: 8px;">${deadline.processNumber}</td></tr>` : ''}
                    </table>
                    ${deadline.notes ? `<p style="background: #f8f8f8; padding: 12px; border-radius: 4px; font-size: 13px; color: #666;">${deadline.notes}</p>` : ''}
                  </div>
                </div>
              `,
          })

          if (!emailResult.ok) continue

          // Marcar alerta como enviado
          await (payload as any).update({
            collection: 'deadlines',
            id: deadline.id,
            data: { [updateField]: true },
          })

          alerts.push({ id: deadline.id, title: deadline.title, alertType, daysUntil })
        } catch (emailErr) {
          console.error('[Deadline Alert] Email error:', emailErr)
        }
      }
    }

    await finishAutomationRun(payload, run?.id, {
      status: 'success',
      itemsIn: deadlines.totalDocs,
      itemsOut: alerts.length,
      payload: { alertsSent: alerts.length, checked: deadlines.totalDocs },
    })

    return NextResponse.json({ success: true, alertsSent: alerts.length, alerts })
  } catch (error) {
    if (payload) {
      await finishAutomationRun(payload, run?.id, {
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'Erro interno.',
      })
    }
    console.error('[Deadlines Alert] Error:', error)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}




