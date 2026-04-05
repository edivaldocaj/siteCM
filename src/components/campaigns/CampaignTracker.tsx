'use client'

import { useEffect, useRef } from 'react'

interface CampaignTrackerProps {
  campaignSlug: string
}

function getUtmParams() {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  return {
    utmSource: params.get('utm_source') || undefined,
    utmMedium: params.get('utm_medium') || undefined,
    utmCampaign: params.get('utm_campaign') || undefined,
    referrer: document.referrer || undefined,
  }
}

async function trackEvent(campaignSlug: string, eventType: string, metadata?: any) {
  try {
    await fetch('/api/campaign-track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        campaignSlug,
        eventType,
        ...getUtmParams(),
        metadata,
      }),
    })
  } catch {
    // Silent fail — tracking should never break the page
  }
}

export function CampaignTracker({ campaignSlug }: CampaignTrackerProps) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true

    // Track page view
    trackEvent(campaignSlug, 'page_view')

    // Track scroll completion
    let scrollTracked = false
    function onScroll() {
      if (scrollTracked) return
      const scrollPercent = (window.scrollY + window.innerHeight) / document.body.scrollHeight
      if (scrollPercent > 0.85) {
        scrollTracked = true
        trackEvent(campaignSlug, 'scroll_complete')
        window.removeEventListener('scroll', onScroll)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Intercept WhatsApp clicks
    function onWhatsAppClick(e: MouseEvent) {
      const target = e.target as HTMLElement
      const link = target.closest('a[href*="wa.me"]')
      if (link) {
        trackEvent(campaignSlug, 'whatsapp_click')
      }
    }
    document.addEventListener('click', onWhatsAppClick)

    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('click', onWhatsAppClick)
    }
  }, [campaignSlug])

  return null // Invisible tracking component
}

// Export for use in other components (e.g., share bar, form)
export { trackEvent }
