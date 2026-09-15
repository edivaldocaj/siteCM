import { NextRequest, NextResponse } from 'next/server'

const phone = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985').replace(/\D/g, '')
const defaultMessage = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || 'Olá! Gostaria de falar com o escritório.'

/** Centralized, safe redirect for first-party WhatsApp CTAs. */
export function GET(request: NextRequest) {
  const origin = request.nextUrl.searchParams.get('o') || 'site'
  const campaign = request.nextUrl.searchParams.get('c') || ''
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
