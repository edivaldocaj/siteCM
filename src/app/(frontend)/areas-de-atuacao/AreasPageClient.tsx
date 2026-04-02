'use client'

import Link from 'next/link'
import { Shield, Scale, ShoppingBag, Home, Receipt, FileText, Gavel, Laptop, Landmark, Building, Briefcase, ShieldAlert, ArrowRight } from 'lucide-react'

const iconMap: Record<string, any> = {
  shield: Shield, scale: Scale, 'shopping-bag': ShoppingBag,
  home: Home, receipt: Receipt, 'file-text': FileText,
  gavel: Gavel, laptop: Laptop, landmark: Landmark,
  building: Building, briefcase: Briefcase, 'shield-alert': ShieldAlert,
}

const attorneyNames: Record<string, string> = {
  edivaldo: 'Dr. Edivaldo Cavalcante',
  gabrielly: 'Dra. Gabrielly Melo',
  both: 'Ambos os sócios',
}

const defaultAreas = [
  { icon: 'laptop', title: 'Direito Digital e LGPD', slug: 'direito-digital-lgpd', shortDescription: 'Proteção de dados pessoais, adequação à LGPD, crimes cibernéticos, compliance digital e consultoria para empresas de tecnologia.', attorney: 'edivaldo' },
  { icon: 'scale', title: 'Direito Civil', slug: 'direito-civil', shortDescription: 'Contratos, responsabilidade civil, direito de família, sucessões, ações indenizatórias e resolução de conflitos.', attorney: 'both' },
  { icon: 'shopping-bag', title: 'Direito do Consumidor', slug: 'direito-consumidor', shortDescription: 'Fraudes bancárias, negativação indevida, revisão de juros abusivos, problemas com planos de saúde e defesa contra cobranças indevidas.', attorney: 'gabrielly' },
  { icon: 'home', title: 'Direito Imobiliário', slug: 'direito-imobiliario', shortDescription: 'Compra e venda de imóveis, contratos imobiliários, usucapião, regularização fundiária e disputas de propriedade.', attorney: 'gabrielly' },
  { icon: 'landmark', title: 'Direito Tributário', slug: 'direito-tributario', shortDescription: 'Planejamento fiscal, defesa em execuções fiscais, recuperação de tributos pagos indevidamente e consultoria tributária.', attorney: 'gabrielly' },
  { icon: 'file-text', title: 'Licitações e Contratos', slug: 'licitacoes-contratos', shortDescription: 'Assessoria em licitações públicas, impugnações, contratos administrativos e defesa em processos do TCE/TCU.', attorney: 'edivaldo' },
  { icon: 'gavel', title: 'Direito Penal', slug: 'direito-penal', shortDescription: 'Defesa criminal em todas as fases, habeas corpus, audiência de custódia, crimes contra a honra e estelionato. Atendimento 24h.', attorney: 'edivaldo', is24h: true },
]

export function AreasPageClient({ areas, siteConfig }: { areas: any[]; siteConfig: any }) {
  const practiceTitle = siteConfig?.practiceTitle || 'Áreas de Atuação'
  const practiceSubtitle = siteConfig?.practiceSubtitle || 'Atuação estratégica em diversas áreas do Direito, com foco na defesa dos seus interesses e na busca por resultados concretos.'
  const list = areas.length > 0 ? areas : defaultAreas

  return (
    <>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #152138 0%, #1c2d4a 50%, #0e1628 100%)', padding: '140px 24px 80px' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <span style={{ color: 'var(--color-brand-gold-dark)', fontSize: '12px', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.25em', display: 'block', marginBottom: '16px' }}>
            Especialidades
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 600, color: 'var(--color-brand-champagne)', lineHeight: 1.1, marginBottom: '24px' }}>
            {practiceTitle}
          </h1>
          <p style={{ color: 'rgba(184,191,200,0.7)', fontFamily: 'var(--font-body)', fontSize: '18px', lineHeight: 1.6, maxWidth: '600px' }}>
            {practiceSubtitle}
          </p>
        </div>
      </section>

      {/* List */}
      <section style={{ padding: '60px 24px 80px', backgroundColor: 'var(--color-brand-cream)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {list.map((area: any, i: number) => {
              const is24h = area.is24h || false
              const IconComponent = iconMap[area.icon] || Scale
              const isLast = i === list.length - 1

              return (
                <Link
                  key={area.slug || i}
                  href={`/areas-de-atuacao/${area.slug}`}
                  className="area-list-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    padding: '32px',
                    textDecoration: 'none',
                    borderRadius: is24h ? '8px' : '0',
                    transition: 'all 0.3s',
                    borderBottom: is24h ? 'none' : '1px solid rgba(21,33,56,0.06)',
                    ...(is24h
                      ? { background: 'linear-gradient(135deg, #152138, #1c2d4a)', marginTop: '8px' }
                      : { background: 'transparent' }),
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '8px',
                    background: is24h ? 'rgba(196,169,106,0.15)' : 'rgba(196,169,106,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <IconComponent style={{ width: '24px', height: '24px', color: 'var(--color-brand-gold-dark)' }} strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                      <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '20px',
                        fontWeight: 600,
                        color: is24h ? 'var(--color-brand-champagne)' : 'var(--color-brand-navy)',
                        margin: 0,
                      }}>
                        {area.title}
                      </h2>
                      {is24h && (
                        <span style={{ background: '#25D366', color: 'white', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', padding: '3px 10px', borderRadius: '3px' }}>
                          24h
                        </span>
                      )}
                    </div>
                    <p style={{
                      color: is24h ? 'rgba(184,191,200,0.6)' : 'rgba(21,33,56,0.55)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '14px',
                      lineHeight: 1.5,
                      marginBottom: '6px',
                    }}>
                      {area.shortDescription || area.short_description}
                    </p>
                    <span style={{ color: is24h ? 'rgba(184,191,200,0.4)' : 'rgba(21,33,56,0.35)', fontSize: '12px', fontFamily: 'var(--font-body)' }}>
                      {attorneyNames[area.attorney] || ''}
                    </span>
                  </div>

                  {/* Arrow */}
                  <span style={{
                    color: is24h ? 'var(--color-brand-gold-dark)' : 'rgba(21,33,56,0.2)',
                    fontSize: '12px',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    transition: 'color 0.3s',
                  }}>
                    Saiba mais <ArrowRight style={{ width: '14px', height: '14px' }} />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .area-list-card:hover { background: rgba(21,33,56,0.02) !important; }
        .area-list-card:hover span:last-child { color: var(--color-brand-gold-dark) !important; }
        @media (max-width: 768px) {
          .area-list-card { flex-direction: column !important; align-items: flex-start !important; }
          .area-list-card span:last-child { align-self: flex-end; }
        }
      `}} />
    </>
  )
}
