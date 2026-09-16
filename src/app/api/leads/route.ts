import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { requireAdminRole } from '@/lib/admin-auth'
import { getClientIp, checkRateLimit } from '@/lib/rate-limit'
import { isLikelyBotSubmission } from '@/lib/public-form-security'
import { submitLead } from '@/lib/integration/submitLead'

/* ── Urgency label for email ── */
const urgencyLabels: Record<string, string> = {
  low: '🟢 Baixa',
  medium: '🟡 Média',
  high: '🟠 Alta',
  urgent: '🔴 Urgente',
}

/* ── POST: Create a new lead ── */
export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req.headers)
    if (!checkRateLimit(`leads:${clientIp}`)) {
      return NextResponse.json({ error: 'Muitas tentativas. Tente novamente em alguns minutos.' }, { status: 429 })
    }

    const body = await req.json()
    if (isLikelyBotSubmission(body)) {
      return NextResponse.json({ error: 'Envio inválido.' }, { status: 400 })
    }
    const {
      name,
      phone,
      email,
      source,
      campaignSlug,
      caseDescription,
      estimatedValue,
      urgency,
      qualificationAnswers,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      referrerUrl,
      consentAccepted,
    } = body

    // Validation
    if (!consentAccepted) {
      return NextResponse.json({ error: 'Consentimento obrigatório.' }, { status: 400 })
    }

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Nome e telefone são obrigatórios.' },
        { status: 400 }
      )
    }

    // Resolve campaign attribution on the server. Unknown slugs remain
    // unattributed instead of becoming a fabricated commercial campaign.
    let campaignCode: string | null = null
    if (typeof campaignSlug === 'string' && campaignSlug.trim()) {
      const payload = await getPayload({ config: configPromise })
      const campaignResult = await (payload as any).find({
        collection: 'campaigns',
        overrideAccess: true,
        limit: 1,
        where: {
          and: [
            { slug: { equals: campaignSlug.trim() } },
            { status: { equals: 'active' } },
          ],
        },
      })
      const resolved = campaignResult.docs?.[0]?.campaignCode
      campaignCode = typeof resolved === 'string' && resolved.trim() ? resolved.trim().toUpperCase() : null
    }
    const responses = [
      ...(caseDescription ? [{ pergunta: 'Descrição do caso', resposta: String(caseDescription) }] : []),
      ...(qualificationAnswers || []).map((qa: any) => ({ pergunta: String(qa.question), resposta: String(qa.answer) })),
      ...(urgency ? [{ pergunta: 'Urgência', resposta: String(urgencyLabels[urgency] || urgency) }] : []),
      ...(estimatedValue ? [{ pergunta: 'Valor estimado', resposta: String(estimatedValue) }] : []),
    ]
    const delivery = await submitLead({
      idempotencia: typeof body.idempotencia === 'string' ? body.idempotencia : undefined,
      nome: String(name), telefone: String(phone), email, campanha: campaignCode,
      origem: 'landing', consentIp: clientIp, respostas: responses,
      utm: { source: utmSource, medium: utmMedium, campaign: utmCampaign, content: utmContent }, referrer: referrerUrl,
    })

    return NextResponse.json({
      success: true,
      leadId: delivery.leadId,
      idempotencia: delivery.idempotencia,
    })
  } catch (error) {
    console.error('[Leads API] Error:', error)
    return NextResponse.json({ error: 'Erro interno ao salvar lead.' }, { status: 500 })
  }
}

/* ── GET: List leads (admin only, protected by secret) ── */
export async function GET(req: NextRequest) {
  const denied = await requireAdminRole(req, ['admin', 'staff'])
  if (denied) return denied

  try {
    const payload = await getPayload({ config: configPromise })
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const campaignSlug = searchParams.get('campaign')

    const where: any = {}
    if (status) where.status = { equals: status }
    if (campaignSlug) where.campaignSlug = { equals: campaignSlug }

    const leads = await (payload as any).find({
      collection: 'leads',
      where,
      sort: '-createdAt',
      limit: 50,
    })

    return NextResponse.json({
      total: leads.totalDocs,
      leads: leads.docs,
    })
  } catch (error) {
    console.error('[Leads API] GET Error:', error)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

/* ── PATCH: Update lead status (Kanban) ── */
export async function PATCH(req: NextRequest) {
  const denied = await requireAdminRole(req, ['admin', 'staff'])
  if (denied) return denied

  try {
    const body = await req.json()
    const { id, status, assignedTo, notes } = body

    if (!id) {
      return NextResponse.json({ error: 'ID do lead obrigatório.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    const updateData: any = {}
    if (status) updateData.status = status
    if (assignedTo) updateData.assignedTo = assignedTo

    // Se convertido, registrar data
    if (status === 'converted') {
      updateData.conversionDate = new Date().toISOString()
    }

    const updated = await (payload as any).update({
      collection: 'leads',
      id,
      data: updateData,
    })

    return NextResponse.json({ success: true, lead: updated })
  } catch (error) {
    console.error('[Leads API] PATCH Error:', error)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}







