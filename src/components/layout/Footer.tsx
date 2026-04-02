'use client'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

const practiceAreas = [
  { href: '/areas-de-atuacao/direito-digital-lgpd', label: 'Direito Digital e LGPD' },
  { href: '/areas-de-atuacao/direito-civil', label: 'Direito Civil' },
  { href: '/areas-de-atuacao/direito-consumidor', label: 'Direito do Consumidor' },
  { href: '/areas-de-atuacao/direito-imobiliario', label: 'Direito Imobiliário' },
  { href: '/areas-de-atuacao/direito-tributario', label: 'Direito Tributário' },
  { href: '/areas-de-atuacao/licitacoes-contratos', label: 'Licitações e Contratos' },
  { href: '/areas-de-atuacao/direito-penal', label: 'Direito Penal' },
]

const navLinks = [
  { href: '/sobre', label: 'Sobre o Escritório' },
  { href: '/campanhas', label: 'Campanhas Jurídicas' },
  { href: '/blog', label: 'Blog Jurídico' },
  { href: '/contato', label: 'Contato' },
]

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--color-brand-navy)', color: 'rgba(184,191,200,0.7)', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '48px' }} className="footer-grid">
          {/* Brand */}
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', color: '#d4d8de', fontSize: '20px', fontWeight: 600, margin: 0 }}>
                Cavalcante &amp; Melo
              </h3>
              <p style={{ color: 'rgba(184,191,200,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '4px' }}>
                Sociedade de Advogados
              </p>
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.7, marginBottom: '24px', color: 'rgba(184,191,200,0.6)' }}>
              Advocacia estratégica e humanizada em Natal/RN. Comprometidos com a defesa dos seus direitos e a busca por resultados concretos.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <a href="#" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(184,191,200,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(184,191,200,0.7)', transition: 'all 0.3s', textDecoration: 'none' }} className="social-icon">
                <InstagramIcon />
              </a>
              <a href="#" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(184,191,200,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(184,191,200,0.7)', transition: 'all 0.3s', textDecoration: 'none' }} className="social-icon">
                <LinkedinIcon />
              </a>
            </div>
          </div>

          {/* Áreas */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', color: '#d4d8de', fontWeight: 600, marginBottom: '24px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Áreas de Atuação
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {practiceAreas.map((area) => (
                <li key={area.href} style={{ marginBottom: '4px' }}>
                  <Link href={area.href} style={{ color: 'rgba(184,191,200,0.7)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.3s', display: 'block', lineHeight: 1.8 }} className="footer-link">
                    {area.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', color: '#d4d8de', fontWeight: 600, marginBottom: '24px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Navegação
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {navLinks.map((link) => (
                <li key={link.href} style={{ marginBottom: '4px' }}>
                  <Link href={link.href} style={{ color: 'rgba(184,191,200,0.7)', fontSize: '14px', textDecoration: 'none', transition: 'color 0.3s', display: 'block', lineHeight: 1.8 }} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 style={{ fontFamily: 'var(--font-display)', color: '#d4d8de', fontWeight: 600, marginBottom: '24px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Contato
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ display: 'flex', gap: '12px', fontSize: '14px', marginBottom: '16px' }}>
                <MapPin style={{ width: '18px', height: '18px', color: 'var(--color-brand-gold-dark)', flexShrink: 0, marginTop: '2px' }} />
                <span>Rua Francisco Maia Sobrinho, 1950<br />Lagoa Nova — Natal/RN</span>
              </li>
              <li style={{ display: 'flex', gap: '12px', fontSize: '14px', marginBottom: '16px' }}>
                <Phone style={{ width: '18px', height: '18px', color: 'var(--color-brand-gold-dark)', flexShrink: 0 }} />
                <a href="tel:+5584999999999" style={{ color: 'rgba(184,191,200,0.7)', textDecoration: 'none' }}>(84) 99999-9999</a>
              </li>
              <li style={{ display: 'flex', gap: '12px', fontSize: '14px', marginBottom: '16px' }}>
                <Mail style={{ width: '18px', height: '18px', color: 'var(--color-brand-gold-dark)', flexShrink: 0 }} />
                <a href="mailto:contato@cavalcantemelo.adv.br" style={{ color: 'rgba(184,191,200,0.7)', textDecoration: 'none' }}>contato@cavalcantemelo.adv.br</a>
              </li>
              <li style={{ display: 'flex', gap: '12px', fontSize: '14px' }}>
                <Clock style={{ width: '18px', height: '18px', color: 'var(--color-brand-gold-dark)', flexShrink: 0 }} />
                <span>Seg a Sex: 8h às 18h<br />Penal: Atendimento 24h</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={{ borderTop: '1px solid rgba(184,191,200,0.1)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '20px 24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          <p style={{ fontSize: '12px', color: 'rgba(184,191,200,0.4)', margin: 0 }}>
            &copy; {new Date().getFullYear()} Cavalcante &amp; Melo Sociedade de Advogados. Todos os direitos reservados.
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(184,191,200,0.3)', margin: 0 }}>
            OAB/RN — Advocacia responsável conforme Código de Ética da OAB
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .footer-link:hover { color: var(--color-brand-gold-dark) !important; }
        .social-icon:hover { border-color: var(--color-brand-gold-dark) !important; color: var(--color-brand-gold-dark) !important; }
        @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 480px) { .footer-grid { grid-template-columns: 1fr !important; } }
      `}} />
    </footer>
  )
}
