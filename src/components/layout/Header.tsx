'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Phone } from 'lucide-react'

const navLinks = [
  { href: '/', label: 'Início' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/areas-de-atuacao', label: 'Áreas de Atuação' },
  { href: '/campanhas', label: 'Campanhas' },
  { href: '/blog', label: 'Blog' },
  { href: '/contato', label: 'Contato' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        transition: 'all 0.5s',
        background: scrolled ? 'rgba(21,33,56,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.3)' : 'none',
        padding: scrolled ? '12px 0' : '20px 0',
      }}
    >
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}>
          <div style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b8bfc8', fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 'bold' }}>
            CM
          </div>
          <div>
            <div style={{ color: '#d4d8de', fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 600, letterSpacing: '0.025em', lineHeight: 1.2 }}>
              Cavalcante & Melo
            </div>
            <div style={{ color: 'rgba(184,191,200,0.6)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: "'Source Sans 3', sans-serif" }}>
              Sociedade de Advogados
            </div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }} className="desktop-nav">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: 'rgba(184,191,200,0.85)',
                fontSize: '13px',
                fontFamily: "'Source Sans 3', sans-serif",
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                textDecoration: 'none',
                transition: 'color 0.3s',
                position: 'relative',
                paddingBottom: '4px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#c4a96a')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(184,191,200,0.85)')}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Desktop */}
        <div className="desktop-nav">
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584999999999'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <Phone style={{ width: '16px', height: '16px' }} />
            Fale com um Advogado
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="mobile-toggle"
          style={{
            color: '#b8bfc8', background: 'none', border: 'none', padding: '8px', cursor: 'pointer',
            transition: 'color 0.3s',
          }}
          aria-label="Menu"
        >
          {isOpen ? <X style={{ width: '24px', height: '24px' }} /> : <Menu style={{ width: '24px', height: '24px' }} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        style={{
          overflow: 'hidden',
          transition: 'max-height 0.5s, opacity 0.5s',
          maxHeight: isOpen ? '500px' : '0',
          opacity: isOpen ? 1 : 0,
        }}
        className="mobile-menu"
      >
        <div style={{
          background: 'rgba(21,33,56,0.98)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          padding: '24px 16px',
        }}>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                style={{
                  color: 'rgba(184,191,200,0.8)',
                  fontSize: '16px',
                  fontFamily: "'Source Sans 3', sans-serif",
                  padding: '12px 16px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#c4a96a'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(184,191,200,0.8)'; e.currentTarget.style.background = 'transparent' }}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div style={{ marginTop: '24px', padding: '0 16px' }}>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584999999999'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              <Phone style={{ width: '16px', height: '16px' }} />
              Fale com um Advogado
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .desktop-nav { display: none; }
        .mobile-toggle { display: block; }
        .mobile-menu { display: block; }
        @media (min-width: 1024px) {
          .desktop-nav { display: flex; }
          .mobile-toggle { display: none; }
          .mobile-menu { display: none; }
        }
      `}</style>
    </header>
  )
}
