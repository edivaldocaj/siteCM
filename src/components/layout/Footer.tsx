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
  { href: '/cliente', label: 'Portal do Cliente' },
]

const linkStyle: React.CSSProperties = {
  color: 'rgba(184,191,200,0.7)',
  fontSize: '14px',
  textDecoration: 'none',
  transition: 'color 0.3s',
  display: 'block',
  lineHeight: 1.8,
}

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#152138', color: 'rgba(184,191,200,0.7)', fontFamily: "'Source Sans 3', sans-serif" }}>
      {/* Main Footer */}
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '64px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '48px' }}>

          {/* Brand */}
          <div>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#d4d8de', fontSize: '20px', fontWeight: 600, margin: 0 }}>
                Cavalcante & Melo
              </h3>
              <p style={{ color: 'rgba(184,191,200,0.4)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '4px' }}>
                Sociedade de Advogados
              </p>
            </div>
            <p style={{ fontSize: '14px', lineHeight: 1.7, marginBottom: '24px', color: 'rgba(184,191,200,0.6)' }}>
              Advocacia estratégica e humanizada em Natal/RN. Comprometidos com a defesa dos seus direitos e a busca por resultados concretos.
            </p>
          </div>

          {/* Áreas */}
          <div>
            <h4 style={{ fontFamily: "'Playfair Display', serif", color: '#d4d8de', fontWeight: 600, marginBottom: '24px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Áreas de Atuação
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {practiceAreas.map((area) => (
                <li key={area.href} style={{ marginBottom: '4px' }}>
                  <Link href={area.href} style={linkStyle}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#c4a96a'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(184,191,200,0.7)'}>
                    {area.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 style={{ fontFamily: "'Playfair Display', serif", color: '#d4d8de', fontWeight: 600, marginBottom: '24px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Navegação
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {navLinks.map((link) => (
                <li key={link.href} style={{ marginBottom: '4px' }}>
                  <Link href={link.href} style={linkStyle}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#c4a96a'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(184,191,200,0.7)'}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 style={{ fontFamily: "'Playfair Display', serif", color: '#d4d8de', fontWeight: 600, marginBottom: '24px', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Contato
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ display: 'flex', gap: '12px', fontSize: '14px', marginBottom: '16px' }}>
                <MapPin style={{ width: '18px', height: '18px', color: '#c4a96a', flexShrink: 0, marginTop: '2px' }} />
                <span>Rua Francisco Maia Sobrinho, 1950<br />Lagoa Nova — Natal/RN</span>
              </li>
              <li style={{ display: 'flex', gap: '12px', fontSize: '14px', marginBottom: '16px' }}>
                <Phone style={{ width: '18px', height: '18px', color: '#c4a96a', flexShrink: 0 }} />
                <a href="tel:+5584991243985" style={{ color: 'rgba(184,191,200,0.7)', textDecoration: 'none' }}>(84) 99124-3985</a>
              </li>
              <li style={{ display: 'flex', gap: '12px', fontSize: '14px', marginBottom: '16px' }}>
                <Mail style={{ width: '18px', height: '18px', color: '#c4a96a', flexShrink: 0 }} />
                <a href="mailto:contato@cavalcantemelo.adv.br" style={{ color: 'rgba(184,191,200,0.7)', textDecoration: 'none' }}>contato@cavalcantemelo.adv.br</a>
              </li>
              <li style={{ display: 'flex', gap: '12px', fontSize: '14px' }}>
                <Clock style={{ width: '18px', height: '18px', color: '#c4a96a', flexShrink: 0 }} />
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
            &copy; {new Date().getFullYear()} Cavalcante & Melo Sociedade de Advogados. Todos os direitos reservados.
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(184,191,200,0.3)', margin: 0 }}>
            OAB/RN — Advocacia responsável conforme Código de Ética da OAB
          </p>
        </div>
      </div>
    </footer>
  )
}
