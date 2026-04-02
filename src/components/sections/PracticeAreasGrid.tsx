'use client'

import Link from 'next/link'
import {
  Shield, Scale, ShoppingBag, Home, Receipt,
  FileText, Gavel, Laptop, Landmark, Building,
  Briefcase, ShieldAlert, ArrowRight,
} from 'lucide-react'

const iconMap: Record<string, any> = {
  shield: Shield, scale: Scale, 'shopping-bag': ShoppingBag,
  home: Home, receipt: Receipt, 'file-text': FileText,
  gavel: Gavel, laptop: Laptop, landmark: Landmark,
  building: Building, briefcase: Briefcase, 'shield-alert': ShieldAlert,
}

const defaultAreas = [
  { icon: 'shield', title: 'Direito Digital e LGPD', slug: 'direito-digital-lgpd', shortDescription: 'Proteção de dados, crimes cibernéticos, compliance digital e adequação à LGPD.' },
  { icon: 'scale', title: 'Direito Civil', slug: 'direito-civil', shortDescription: 'Contratos, responsabilidade civil, família, sucessões e ações indenizatórias.' },
  { icon: 'shopping-bag', title: 'Direito do Consumidor', slug: 'direito-consumidor', shortDescription: 'Fraudes bancárias, negativação indevida, revisão de juros e planos de saúde.' },
  { icon: 'home', title: 'Direito Imobiliário', slug: 'direito-imobiliario', shortDescription: 'Compra e venda, contratos imobiliários, usucapião e regularização.' },
  { icon: 'receipt', title: 'Direito Tributário', slug: 'direito-tributario', shortDescription: 'Planejamento fiscal, defesa em execuções fiscais e recuperação de tributos.' },
  { icon: 'file-text', title: 'Licitações e Contratos', slug: 'licitacoes-contratos', shortDescription: 'Assessoria em licitações, impugnações, contratos administrativos.' },
  { icon: 'gavel', title: 'Direito Penal', slug: 'direito-penal', shortDescription: 'Defesa criminal, habeas corpus, audiência de custódia. Atendimento 24h.', is24h: true },
]

interface PracticeAreasGridProps {
  cmsAreas?: any[]
  showTitle?: boolean
}

export function PracticeAreasGrid({ cmsAreas = [], showTitle = true }: PracticeAreasGridProps) {
  const areas = cmsAreas.length > 0 ? cmsAreas : defaultAreas

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-wide mx-auto">
        {/* Header */}
        {showTitle && (
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <span style={{
              color: 'var(--color-brand-gold-dark)',
              fontSize: '12px',
              fontFamily: 'var(--font-body)',
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
              display: 'block',
              marginBottom: '16px',
            }}>
              Especialidades
            </span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 4vw, 3rem)',
              fontWeight: 600,
              color: 'var(--color-brand-navy)',
              marginBottom: '24px',
            }}>
              Áreas de Atuação
            </h2>
            <p style={{
              color: 'rgba(21,33,56,0.6)',
              fontFamily: 'var(--font-body)',
              fontSize: '18px',
              maxWidth: '40rem',
              margin: '0 auto',
              lineHeight: 1.6,
            }}>
              Atuação estratégica em diversas áreas do Direito, sempre com foco na defesa dos seus interesses.
            </p>
          </div>
        )}

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          {areas.map((area: any, i: number) => {
            const is24h = area.is24h || false
            const IconComponent = iconMap[area.icon] || Scale

            return (
              <Link
                key={area.slug || i}
                href={`/areas-de-atuacao/${area.slug}`}
                className="practice-card"
                style={{
                  display: 'block',
                  padding: '32px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.5s',
                  ...(is24h
                    ? {
                        background: 'linear-gradient(135deg, #152138, #1c2d4a)',
                        border: '1px solid rgba(196,169,106,0.2)',
                      }
                    : {
                        background: 'white',
                        border: '1px solid rgba(196,169,106,0.1)',
                      }),
                }}
              >
                {is24h && (
                  <span style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    background: 'var(--color-brand-urgency)',
                    color: 'white',
                    fontSize: '10px',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    padding: '4px 12px',
                    borderRadius: '2px',
                  }}>
                    24h
                  </span>
                )}

                <IconComponent style={{
                  width: '40px',
                  height: '40px',
                  marginBottom: '24px',
                  color: is24h ? 'var(--color-brand-gold-dark)' : 'rgba(21,33,56,0.3)',
                  transition: 'color 0.3s',
                }} />

                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '18px',
                  fontWeight: 600,
                  marginBottom: '12px',
                  color: is24h ? 'var(--color-brand-champagne)' : 'var(--color-brand-navy)',
                }}>
                  {area.title}
                </h3>

                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  color: is24h ? 'rgba(184,191,200,0.7)' : 'rgba(21,33,56,0.5)',
                }}>
                  {area.shortDescription || area.short_description}
                </p>

                <div style={{
                  marginTop: '24px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-body)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: 600,
                  color: is24h ? 'var(--color-brand-gold-dark)' : 'rgba(21,33,56,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'color 0.3s',
                }}>
                  Saiba mais <ArrowRight style={{ width: '14px', height: '14px' }} />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .practice-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .practice-card:hover div:last-child {
          color: var(--color-brand-gold-dark) !important;
        }
        .practice-card:hover svg:first-of-type {
          color: var(--color-brand-gold-dark) !important;
        }
      `}} />
    </section>
  )
}
