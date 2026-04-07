import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

/* ── Lead Score Calculator ── */
function calculateScore(data: any): number {
  let score = 0

  if (data.phone) score += 10
  if (data.email) score += 10
  if (data.cpf) score += 5
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
    const body = await req.json()
    const {
      name,
      phone,
      email,
      cpf,
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
    } = body

    // Validation
    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Nome e telefone são obrigatórios.' },
        { status: 400 }
      )
    }

    const score = calculateScore(body)

    const payload = await getPayload({ config: configPromise })

    // Create lead in Payload CMS
    const lead = await (payload as any).create({
      collection: 'leads',
      data: {
        name,
        phone,
        email: email || undefined,
        cpf: cpf || undefined,
        source: source || 'campaign-form',
        campaignSlug: campaignSlug || undefined,
        caseDescription: caseDescription || undefined,
        estimatedValue: estimatedValue ? Number(estimatedValue) : undefined,
        urgency: urgency || 'medium',
        qualificationAnswers: qualificationAnswers || [],
        utmSource: utmSource || undefined,
        utmMedium: utmMedium || undefined,
        utmCampaign: utmCampaign || undefined,
        utmContent: utmContent || undefined,
        referrerUrl: referrerUrl || undefined,
        status: 'new',
        score,
        notes: [
          {
            text: `Lead captado via ${source || 'campaign-form'}${campaignSlug ? ` — Campanha: ${campaignSlug}` : ''}. Score: ${score}/100.`,
            author: 'system',
            date: new Date().toISOString(),
          },
        ],
      },
    })

    // Send email notification to attorneys
    if (process.env.RESEND_API_KEY) {
      const qualAnswersHtml = qualificationAnswers?.length
        ? qualificationAnswers
            .map((qa: any) => `<p><strong>${qa.question}:</strong> ${qa.answer}</p>`)
            .join('')
        : ''

      const scoreColor = score >= 60 ? '#25D366' : score >= 30 ? '#c4a96a' : '#b8bfc8'
      const scoreEmoji = score >= 60 ? '🔥' : score >= 30 ? '⭐' : '📋'

      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Site Cavalcante & Melo <onboarding@resend.dev>',
            to: [process.env.CONTACT_EMAIL || 'contato@cavalcantemelo.adv.br'],
            subject: `${scoreEmoji} Novo Lead (Score ${score}) — ${name}${campaignSlug ? ` [${campaignSlug}]` : ''}`,
            html: `
              <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #152138; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="color: #f1eae2; font-size: 22px; margin: 0;">Novo Lead Captado</h1>
                  <p style="color: #b8bfc8; font-size: 14px; margin-top: 4px;">cavalcantemelo.adv.br</p>
                </div>
                
                <div style="background: #ffffff; padding: 24px; border: 1px solid #e5e5e5;">
                  <!-- Score Badge -->
                  <div style="text-align: center; margin-bottom: 24px;">
                    <span style="display: inline-block; background: ${scoreColor}; color: #fff; font-size: 28px; font-weight: bold; width: 64px; height: 64px; line-height: 64px; border-radius: 50%;">
                      ${score}
                    </span>
                    <p style="color: #666; font-size: 12px; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.1em;">Score de Qualificação</p>
                  </div>

                  <!-- Lead info -->
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px; color: #999; font-size: 13px; width: 120px;">Nome</td><td style="padding: 8px; font-weight: 600;">${name}</td></tr>
                    <tr><td style="padding: 8px; color: #999; font-size: 13px;">Telefone</td><td style="padding: 8px;"><a href="https://wa.me/55${phone.replace(/\D/g, '')}" style="color: #25D366; font-weight: 600;">${phone}</a></td></tr>
                    ${email ? `<tr><td style="padding: 8px; color: #999; font-size: 13px;">E-mail</td><td style="padding: 8px;">${email}</td></tr>` : ''}
                    ${cpf ? `<tr><td style="padding: 8px; color: #999; font-size: 13px;">CPF</td><td style="padding: 8px;">${cpf}</td></tr>` : ''}
                    ${campaignSlug ? `<tr><td style="padding: 8px; color: #999; font-size: 13px;">Campanha</td><td style="padding: 8px; color: #c4a96a; font-weight: 600;">${campaignSlug}</td></tr>` : ''}
                    <tr><td style="padding: 8px; color: #999; font-size: 13px;">Urgência</td><td style="padding: 8px;">${urgencyLabels[urgency] || urgency || 'Média'}</td></tr>
                    ${estimatedValue ? `<tr><td style="padding: 8px; color: #999; font-size: 13px;">Valor Estimado</td><td style="padding: 8px; font-weight: 600;">R$ ${Number(estimatedValue).toLocaleString('pt-BR')}</td></tr>` : ''}
                  </table>

                  ${caseDescription ? `<div style="margin-top: 16px; padding: 16px; background: #f8f8f8; border-radius: 6px;"><p style="color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Descrição do Caso</p><p style="color: #333; font-size: 14px; line-height: 1.6;">${caseDescription}</p></div>` : ''}

                  ${qualAnswersHtml ? `<div style="margin-top: 16px; padding: 16px; background: rgba(196,169,106,0.06); border-radius: 6px; border-left: 3px solid #c4a96a;"><p style="color: #c4a96a; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Respostas de Qualificação</p>${qualAnswersHtml}</div>` : ''}

                  ${utmSource ? `<div style="margin-top: 16px; padding: 12px; background: #f8f8f8; border-radius: 6px;"><p style="color: #999; font-size: 11px; margin-bottom: 4px;">Origem: ${utmSource}${utmMedium ? ` / ${utmMedium}` : ''}${utmCampaign ? ` / ${utmCampaign}` : ''}</p></div>` : ''}
                </div>

                <div style="background: #152138; padding: 16px; text-align: center; border-radius: 0 0 8px 8px;">
                  <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://cavalcantemelo.adv.br'}/admin/collections/leads/${lead.id}" 
                     style="color: #c4a96a; text-decoration: none; font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em;">
                    Ver no CMS →
                  </a>
                </div>
              </div>
            `,
          }),
        })
      } catch (emailError) {
        console.error('[Leads API] Erro ao enviar e-mail:', emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      leadId: lead.id,
      score,
    })
  } catch (error) {
    console.error('[Leads API] Error:', error)
    return NextResponse.json({ error: 'Erro interno ao salvar lead.' }, { status: 500 })
  }
}

/* ── GET: List leads (admin only, protected by secret) ── */
export async function GET(req: NextRequest) {
  const secret = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (secret !== process.env.NEWS_REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

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
  const secret = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (secret !== process.env.NEWS_REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

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
