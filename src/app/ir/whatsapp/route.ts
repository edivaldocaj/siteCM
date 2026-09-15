import { NextRequest, NextResponse } from 'next/server'

const phone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985').replace(/\D/g, '')
const defaultMessage = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || 'Olá! Gostaria de falar com o escritório.'

/**
 * Centralized outbound entry point for internal WhatsApp CTAs.  It never
 * accepts a destination URL, which prevents this route becoming an open
 * redirect. Campaign attribution is collected by the page tracker before the
 * browser leaves the site.
 */
export function GET(request: NextRequest) {
  const origin = request.nextUrl.searchParams.get('o') || 'site'
  const campaign = request.nextUrl.searchParams.get('c') || ''

  // Bound untrusted query strings before they can reach response headers.
  const safeOrigin = /^[a-z0-9_-]{1,48}$/i.test(origin) ? origin : 'site'
  const safeCampaign = /^[a-z0-9_-]{0,80}$/i.test(campaign) ? campaign : ''
  const destination = new URL(`https://wa.me/${phone}`)
  destination.searchParams.set('text', defaultMessage)

  const response = NextResponse.redirect(destination, { status: 307 })
  response.headers.set('Cache-Control', 'no-store')
  response.headers.set('X-Attribution-Origin', safeOrigin)
  if (safeCampaign) response.headers.set('X-Campaign-Reference', safeCampaign)
  return response
}
