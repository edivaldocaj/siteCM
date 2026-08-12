'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Phone, X } from 'lucide-react'

type NavItem = { href: string; label: string; highlight?: boolean | null }

type HeaderProps = {
  items?: NavItem[]
  variant?: 'over-hero' | 'solid-light'
  whatsappNumber?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
}

const fallbackNavLinks: NavItem[] = [
  { href: '/', label: 'Início' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/areas-de-atuacao', label: 'Áreas de atuação' },
  { href: '/campanhas', label: 'Campanhas' },
  { href: '/blog', label: 'Blog' },
  { href: '/contato', label: 'Contato' },
]

function normalizeWhatsApp(value?: string | null) {
  const digits = value?.replace(/\D/g, '')
  return digits && digits.length >= 10 ? digits : '5584991243985'
}

export function Header({
  items = fallbackNavLinks,
  variant = 'over-hero',
  whatsappNumber,
  ctaLabel,
  ctaHref,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(variant === 'solid-light')
  const panelRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const isLight = variant === 'solid-light'
  const solid = isLight || scrolled
  const whatsApp = normalizeWhatsApp(whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER)
  const resolvedCtaHref = ctaHref || `https://wa.me/${whatsApp}`
  const resolvedCtaLabel = ctaLabel || 'Fale com um advogado'
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname?.startsWith(href))

  useEffect(() => {
    if (isLight) return
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [isLight])

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
        menuButtonRef.current?.focus()
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) return
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>('a, button'))
      if (!focusable.length) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    panelRef.current?.querySelector<HTMLElement>('a')?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen])

  return (
    <header className={`ca-header ${solid ? 'ca-header--solid' : ''} ${isLight ? 'ca-header--light' : ''}`}>
      <div className="ca-header__inner">
        <Link href="/" className="ca-header__brand" aria-label="Cavalcante Albuquerque">
          <Image
            src="/brand/brand-symbol-transparent.webp"
            alt=""
            width={58}
            height={58}
            priority
            className="ca-header__symbol"
          />
          <span className="ca-header__brand-text" aria-hidden="true">
            <strong>Cavalcante Albuquerque</strong>
            <span>Advocacia e Consultoria</span>
          </span>
        </Link>

        <nav className="ca-header__nav" aria-label="Navegação principal">
          {items.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              className={`ca-header__link ${isActive(link.href) ? 'ca-header__link--active' : ''} ${link.highlight ? 'ca-header__link--highlight' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <a href={resolvedCtaHref} target="_blank" rel="noopener noreferrer" className="ca-header__cta">
          <Phone aria-hidden="true" />
          {resolvedCtaLabel}
        </a>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          className="ca-header__toggle"
          aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      <div id="mobile-navigation" ref={panelRef} className={`ca-header__mobile ${isOpen ? 'ca-header__mobile--open' : ''}`}>
        <nav aria-label="Navegação mobile">
          {items.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? 'page' : undefined}
              onClick={() => setIsOpen(false)}
              className={`ca-header__mobile-link ${isActive(link.href) ? 'ca-header__mobile-link--active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <a href={resolvedCtaHref} target="_blank" rel="noopener noreferrer" className="ca-header__mobile-cta">
          <Phone aria-hidden="true" />
          {resolvedCtaLabel}
        </a>
      </div>
    </header>
  )
}
