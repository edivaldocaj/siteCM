import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

/**
 * First-party CTA entry point. Attribution is registered by the campaign
 * tracker before navigation; this page only performs the safe fixed redirect.
 */
export default function WhatsAppRedirectPage() {
  const phone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985').replace(/\D/g, '')
  const message = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || 'Olá! Gostaria de falar com o escritório.'
  redirect(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`)
}
