import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

/* POST: Criar resposta NPS */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { clientToken, score, feedback, processNumber } = body

    if (score === undefined || score === null || !clientToken) {
      return NextResponse.json({ error: 'Token e score obrigatórios.' }, { status: 400 })
    }

    if (score < 0 || score > 10) {
      return NextResponse.json({ error: 'Score deve ser entre 0 e 10.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    // Buscar cliente pelo token
    const clientRes = await (payload as any).find({
      collection: 'clients',
      where: { accessToken: { equals: clientToken }, active: { equals: true } },
      limit: 1,
    })

    if (!clientRes.docs.length) {
      return NextResponse.json({ error: 'Token inválido.' }, { status: 401 })
    }

    const client = clientRes.docs[0]

    // Encontrar advogado do processo
    let attorney = ''
    if (processNumber && client.processes?.length) {
      const proc = client.processes.find((p: any) => p.processNumber === processNumber)
      if (proc) attorney = proc.attorney || ''
    }

    const nps = await (payload as any).create({
      collection: 'nps-responses',
      data: {
        client: client.id,
        clientName: client.name,
        score: Number(score),
        feedback: feedback || '',
        processNumber: processNumber || '',
        attorney,
        status: 'pending',
      },
    })

    // Se score >= 9, sinalizar para depoimento
    const promptTestimonial = score >= 9

    // Notificar escritório por email se score <= 6 (detrator)
    if (score <= 6 && process.env.RESEND_API_KEY) {
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
            subject: `⚠️ NPS Detrator (${score}/10) — ${client.name}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: #152138; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h2 style="color: #f1eae2; margin: 0;">Alerta NPS — Detrator</h2>
                </div>
                <div style="background: #fff; padding: 24px; border: 1px solid #e5e5e5;">
                  <p><strong>Cliente:</strong> ${client.name}</p>
                  <p><strong>Score:</strong> <span style="color: #dc2626; font-size: 24px; font-weight: bold;">${score}/10</span></p>
                  ${processNumber ? `<p><strong>Processo:</strong> ${processNumber}</p>` : ''}
                  ${feedback ? `<p><strong>Comentário:</strong> "${feedback}"</p>` : ''}
                  <p style="color: #999; font-size: 13px; margin-top: 16px;">Ação recomendada: entrar em contato com o cliente para entender a insatisfação.</p>
                </div>
              </div>
            `,
          }),
        })
      } catch { /* silent */ }
    }

    return NextResponse.json({
      success: true,
      npsId: nps.id,
      promptTestimonial,
    })
  } catch (error) {
    console.error('[NPS API] Error:', error)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

/* POST testimonial after NPS */
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { npsId, testimonialText, clientToken } = body

    if (!npsId || !testimonialText || !clientToken) {
      return NextResponse.json({ error: 'Dados incompletos.' }, { status: 400 })
    }

    const payload = await getPayload({ config: configPromise })

    // Verificar token
    const clientRes = await (payload as any).find({
      collection: 'clients',
      where: { accessToken: { equals: clientToken } },
      limit: 1,
    })
    if (!clientRes.docs.length) {
      return NextResponse.json({ error: 'Token inválido.' }, { status: 401 })
    }

    await (payload as any).update({
      collection: 'nps-responses',
      id: npsId,
      data: {
        testimonialText,
        status: 'testimonial-approved',
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[NPS Testimonial] Error:', error)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
