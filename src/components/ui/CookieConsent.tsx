'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'

const COOKIE_KEY = 'ca-cookies-accepted'

export function CookieConsent() {
  const [show, setShow] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const accepted = localStorage.getItem(COOKIE_KEY)
    if (!accepted) setShow(true)
  }, [])

  useEffect(() => {
    if (show) {
      document.documentElement.dataset.caCookieBanner = 'visible'
      const updateHeight = () => {
        const height = panelRef.current?.getBoundingClientRect().height || 0
        document.documentElement.style.setProperty('--ca-cookie-banner-height', `${Math.ceil(height)}px`)
      }
      updateHeight()

      const observer = new ResizeObserver(updateHeight)
      if (panelRef.current) observer.observe(panelRef.current)
      window.addEventListener('resize', updateHeight)

      return () => {
        delete document.documentElement.dataset.caCookieBanner
        document.documentElement.style.removeProperty('--ca-cookie-banner-height')
        window.removeEventListener('resize', updateHeight)
        observer.disconnect()
      }
    }

    delete document.documentElement.dataset.caCookieBanner
    document.documentElement.style.removeProperty('--ca-cookie-banner-height')
    return undefined
  }, [show])

  function accept() {
    localStorage.setItem(COOKIE_KEY, 'true')
    setShow(false)
  }

  if (!show) return null

  return (
    <div ref={panelRef} className="ca-cookie-consent fixed bottom-0 left-0 right-0 z-40 p-4 sm:p-6">
      <div className="ca-cookie-consent__panel max-w-3xl mx-auto bg-brand-navy/95 backdrop-blur-md border border-brand-silver/10 rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-2xl">
        <p className="text-brand-silver/70 font-body text-sm flex-1">
          Utilizamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa{' '}
          <a href="/privacidade" className="text-brand-gold-dark underline">
            Política de Privacidade
          </a>{' '}
          conforme a LGPD.
        </p>
        <div className="flex gap-3 shrink-0">
          <button onClick={accept} className="btn-primary !py-2 !px-6 !text-xs">
            Aceitar
          </button>
          <button
            onClick={accept}
            className="text-brand-silver/40 hover:text-brand-silver transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
