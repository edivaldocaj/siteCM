import { NextRequest, NextResponse } from 'next/server'
import { getClientIp, checkRateLimit } from '@/lib/rate-limit'
import { isLikelyBotSubmission } from '@/lib/public-form-security'
import { submitLead } from '@/lib/integration/submitLead'

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req.headers)
    if (!checkRateLimit(`contact:${clientIp}`)) {
      return NextResponse.json({ error: 'Muitas tentativas. Tente novamente em alguns minutos.' }, { status: 429 })
    }

    const body = await req.json()
    if (isLikelyBotSubmission(body)) {
      return NextResponse.json({ error: 'Envio inválido.' }, { status: 400 })
    }

    const { name, phone, subject, message, consentAccepted } = body

    if (!consentAccepted) {
      return NextResponse.json({ error: 'Consentimento obrigatório.' }, { status: 400 })
    }

    if (!name || !phone || !subject) {
      return NextResponse.json({ error: 'Campos obrigatórios não preenchidos.' }, { status: 400 })
    }

    const delivery = await submitLead({
      idempotencia: typeof body.idempotencia === 'string' ? body.idempotencia : undefined,
      nome: String(name), telefone: String(phone), origem: 'contato', consentIp: clientIp,
      respostas: [
        { pergunta: 'Assunto informado', resposta: String(subject) },
        ...(message ? [{ pergunta: 'Mensagem', resposta: String(message) }] : []),
      ],
      utm: { source: body.utmSource, medium: body.utmMedium, campaign: body.utmCampaign, content: body.utmContent },
      referrer: body.referrerUrl,
    })

    return NextResponse.json({ success: true, idempotencia: delivery.idempotencia, leadId: delivery.leadId })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}


