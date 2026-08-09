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

const defaultAreas: any[] = []

interface PracticeAreasGridProps {
  cmsAreas?: any[]
  showTitle?: boolean
}

export function PracticeAreasGrid({ cmsAreas = [], showTitle = true }: PracticeAreasGridProps) {
  const areas = cmsAreas.length > 0 ? [...cmsAreas] : defaultAreas

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
              color: 'color-mix(in srgb, var(--color-ca-navy-950) 60%, transparent)',
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
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '24px',
        }} className="practice-grid">
          {areas.map((area: any, i: number) => {
            const is24h = area.is24h === true || area.is24h === 'true' || area.slug === 'direito-penal'
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
                        background: 'linear-gradient(135deg, var(--color-ca-navy-950), var(--color-ca-navy-800))',
                        border: '1px solid color-mix(in srgb, var(--color-ca-steel-500) 20%, transparent)',
                      }
                    : {
                        background: 'white',
                        border: '1px solid color-mix(in srgb, var(--color-ca-steel-500) 10%, transparent)',
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
                  color: is24h ? 'var(--color-brand-gold-dark)' : 'color-mix(in srgb, var(--color-ca-navy-950) 30%, transparent)',
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
                  color: is24h ? 'color-mix(in srgb, var(--color-ca-steel-400) 70%, transparent)' : 'color-mix(in srgb, var(--color-ca-navy-950) 50%, transparent)',
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
                  color: is24h ? 'var(--color-brand-gold-dark)' : 'color-mix(in srgb, var(--color-ca-navy-950) 30%, transparent)',
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
        .practice-grid { }
        @media (max-width: 1024px) { .practice-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px) { .practice-grid { grid-template-columns: 1fr !important; } }
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
