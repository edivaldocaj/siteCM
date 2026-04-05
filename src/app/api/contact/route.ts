import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, subject, message } = body

    if (!name || !phone || !subject) {
      return NextResponse.json({ error: 'Campos obrigatórios não preenchidos.' }, { status: 400 })
    }

    // ── 1. Salvar como Lead no CMS ──
    try {
      const payload = await getPayload({ config: configPromise })
      await (payload as any).create({
        collection: 'leads',
        data: {
          name,
          phone,
          source: 'contact-form',
          status: 'new',
          urgency: 'medium',
          caseDescription: `[${subject}] ${message || ''}`.trim(),
          qualificationAnswers: [
            { question: 'Assunto informado', answer: subject },
          ],
          notes: [
            {
              text: `Lead captado via formulário de contato. Assunto: ${subject}.${message ? ` Mensagem: ${message}` : ''}`,
              author: 'system',
              date: new Date().toISOString(),
            },
          ],
        },
      })
    } catch (leadError) {
      console.error('[Contact] Erro ao salvar lead no CMS:', leadError)
    }

    // ── 2. Enviar e-mail via Resend ──
    if (process.env.RESEND_API_KEY) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Site Cavalcante & Melo <onboarding@resend.dev>',
          to: [process.env.CONTACT_EMAIL || 'contato@cavalcantemelo.adv.br'],
          subject: `Novo Lead: ${subject} — ${name}`,
          html: `
            <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #152138; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: #f1eae2; font-size: 20px; margin: 0;">Novo Contato pelo Site</h1>
              </div>
              <div style="background: #ffffff; padding: 24px; border: 1px solid #e5e5e5;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr><td style="padding: 8px; color: #999; font-size: 13px; width: 100px;">Nome</td><td style="padding: 8px; font-weight: 600;">${name}</td></tr>
                  <tr><td style="padding: 8px; color: #999; font-size: 13px;">Telefone</td><td style="padding: 8px;"><a href="https://wa.me/55${phone.replace(/\D/g, '')}" style="color: #25D366; font-weight: 600;">${phone}</a></td></tr>
                  <tr><td style="padding: 8px; color: #999; font-size: 13px;">Assunto</td><td style="padding: 8px; color: #c4a96a; font-weight: 600;">${subject}</td></tr>
                </table>
                ${message ? `<div style="margin-top: 16px; padding: 16px; background: #f8f8f8; border-radius: 6px;"><p style="color: #999; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">Mensagem</p><p style="color: #333; font-size: 14px; line-height: 1.6;">${message}</p></div>` : ''}
              </div>
              <div style="background: #152138; padding: 12px; text-align: center; border-radius: 0 0 8px 8px;">
                <p style="color: #b8bfc8; font-size: 11px; margin: 0;">Salvo automaticamente em Leads no CMS</p>
              </div>
            </div>
          `,
        }),
      })

      if (!res.ok) {
        console.error('Erro no Resend:', await res.text())
        return NextResponse.json({ error: 'Falha ao enviar o e-mail.' }, { status: 500 })
      }
    } else {
      console.error('Falta a variável RESEND_API_KEY')
      return NextResponse.json({ error: 'Serviço de e-mail não configurado no servidor.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
