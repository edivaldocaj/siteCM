type SendResendEmailInput = {
  from?: string
  html: string
  subject: string
  to?: string | string[]
}

const fallbackFrom = 'Site Cavalcante Albuquerque <onboarding@resend.dev>'

export function getNotificationRecipients(fallback?: string) {
  const value = process.env.RESEND_TO_EMAIL || process.env.CONTACT_EMAIL || fallback || ''

  return value
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean)
}

export function getResendFrom() {
  return process.env.RESEND_FROM_EMAIL || fallbackFrom
}

export async function sendResendEmail({ from, html, subject, to }: SendResendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY
  const recipients = Array.isArray(to)
    ? to.filter(Boolean)
    : to
      ? [to]
      : getNotificationRecipients()

  if (!apiKey) {
    console.warn('[Resend] RESEND_API_KEY não configurada; notificação por e-mail ignorada.')
    return { ok: false, skipped: true, reason: 'missing-api-key' }
  }

  if (!recipients.length) {
    console.warn('[Resend] Nenhum destinatário configurado; notificação por e-mail ignorada.')
    return { ok: false, skipped: true, reason: 'missing-recipient' }
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: from || getResendFrom(),
        to: recipients,
        subject,
        html,
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      console.error('[Resend] Falha ao enviar e-mail:', errorText)
      return { ok: false, error: errorText, status: res.status }
    }

    return { ok: true }
  } catch (error) {
    console.error('[Resend] Erro ao enviar e-mail:', error)
    return { ok: false, error }
  }
}
