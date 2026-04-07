import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

/**
 * POST /api/webhook/lead-created
 * Chamado pelo hook afterCreate da collection Leads
 * Dispara webhook para n8n para iniciar fluxo de nutrição
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { leadId, event } = body

    if (!leadId) {
      return NextResponse.json({ error: 'leadId obrigatório' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })
    const lead = await (payload as any).findByID({
      collection: 'leads',
      id: leadId,
    })

    if (!lead) {
      return NextResponse.json({ error: 'Lead não encontrado' }, { status: 404 })
    }

    // Webhook para n8n (se configurado)
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL
    if (n8nWebhookUrl) {
      try {
        await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: event || 'lead_created',
            lead: {
              id: lead.id,
              name: lead.name,
              phone: lead.phone,
              email: lead.email,
              campaignSlug: lead.campaignSlug,
              source: lead.source,
              score: lead.score,
              urgency: lead.urgency,
              status: lead.status,
              caseDescription: lead.caseDescription,
              estimatedValue: lead.estimatedValue,
              qualificationAnswers: lead.qualificationAnswers,
              assignedTo: lead.assignedTo,
              createdAt: lead.createdAt,
            },
            timestamp: new Date().toISOString(),
          }),
        })
      } catch (webhookError) {
        console.error('[Webhook n8n] Erro:', webhookError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[Webhook] Error:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
