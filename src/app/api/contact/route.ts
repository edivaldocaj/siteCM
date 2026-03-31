import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, phone, subject, message } = body

    if (!name || !phone || !subject) {
      return NextResponse.json({ error: 'Campos obrigatórios não preenchidos.' }, { status: 400 })
    }

    if (process.env.RESEND_API_KEY) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Site Cavalcante & Melo <onboarding@resend.dev>',
          to: [process.env.CONTACT_EMAIL || 'seu-email-pessoal@gmail.com'], // O e-mail que VAI RECEBER as mensagens
          subject: `Novo Lead: ${subject} — ${name}`,
          html: `
            <h2>Novo contato pelo site</h2>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Telefone:</strong> ${phone}</p>
            <p><strong>Assunto:</strong> ${subject}</p>
            <p><strong>Mensagem:</strong> ${message || 'Não informada'}</p>
            <hr />
            <p><em>Enviado pelo formulário do site cavalcantemelo.adv.br</em></p>
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