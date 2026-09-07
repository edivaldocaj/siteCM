import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { requireAdminRole } from '@/lib/admin-auth'
import { getClientIp, checkRateLimit } from '@/lib/rate-limit'
import { isLikelyBotSubmission } from '@/lib/public-form-security'
import { submitLead } from '@/lib/integration/submitLead'

/* ── Lead Score Calculator ── */
function calculateScore(data: any): number {
  let score = 0

  if (data.phone) score += 10
  if (data.email) score += 10
  if (data.caseDescription) score += 10

  if (data.qualificationAnswers?.length) {
    score += Math.min(data.qualificationAnswers.length * 5, 20)
  }

  if (data.estimatedValue) {
    if (data.estimatedValue >= 50000) score += 20
    else if (data.estimatedValue >= 20000) score += 15
    else if (data.estimatedValue >= 5000) score += 10
    else score += 5
  }

  if (data.urgency === 'urgent') score += 20
  else if (data.urgency === 'high') score += 15
  else if (data.urgency === 'medium') score += 10
  else score += 5

  if (data.campaignSlug) score += 5

  return Math.min(score, 100)
}

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

    const score = calculateScore(body)
    const responses = [
      ...(caseDescription ? [{ pergunta: 'Descrição do caso', resposta: String(caseDescription) }] : []),
      ...(qualificationAnswers || []).map((qa: any) => ({ pergunta: String(qa.question), resposta: String(qa.answer) })),
      ...(urgency ? [{ pergunta: 'Urgência', resposta: String(urgencyLabels[urgency] || urgency) }] : []),
      ...(estimatedValue ? [{ pergunta: 'Valor estimado', resposta: String(estimatedValue) }] : []),
    ]
    const delivery = await submitLead({
      idempotencia: typeof body.idempotencia === 'string' ? body.idempotencia : undefined,
      nome: String(name), telefone: String(phone), email, campanha: campaignSlug || utmCampaign || 'ORGANICO',
      origem: 'landing', consentIp: clientIp, respostas: responses,
      utm: { source: utmSource, medium: utmMedium, campaign: utmCampaign, content: utmContent }, referrer: referrerUrl,
    })

    return NextResponse.json({
      success: true,
      leadId: delivery.leadId,
      idempotencia: delivery.idempotencia,
      score,
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







