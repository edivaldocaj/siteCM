'use client'

import Link from 'next/link'
import { ArrowRight, ExternalLink, Clock, Globe } from 'lucide-react'

const defaultNews = [
  { title: 'STJ firma entendimento sobre revisão de juros abusivos', summary: 'Decisão reforça direito do consumidor à revisão contratual.', source: 'Conjur', category: 'Direito do Consumidor', slug: 'stj-revisao-juros', publishedAt: '2026-03-24' },
  { title: 'ANPD aplica multa milionária por vazamento de dados', summary: 'Empresa é penalizada após exposição de dados pessoais.', source: 'Migalhas', category: 'LGPD', slug: 'anpd-multa-vazamento', publishedAt: '2026-03-23' },
  { title: 'Nova lei amplia penas para estelionato digital', summary: 'Legislação aumenta rigor contra golpes praticados pela internet.', source: 'Consultor Jurídico', category: 'Direito Penal', slug: 'nova-lei-estelionato', publishedAt: '2026-03-21' },
  { title: 'TJRN decide sobre requisitos de usucapião urbana em Natal', summary: 'Novos parâmetros para regularização fundiária na capital.', source: 'TJRN', category: 'Direito Imobiliário', slug: 'tjrn-usucapiao', publishedAt: '2026-03-19' },
]

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).replace('.', '')
}

interface NewsSectionProps {
  cmsNews?: any[]
}

export function NewsSection({ cmsNews = [] }: NewsSectionProps) {
  const news = cmsNews.length > 0 ? cmsNews : defaultNews

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-wide mx-auto">
        {/* Header - split layout */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '48px', flexWrap: 'wrap', gap: '24px' }}>
          <div>
            <span style={{
              color: 'var(--color-brand-gold-dark)',
              fontSize: '12px',
              fontFamily: 'var(--font-body)',
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
              display: 'block',
              marginBottom: '16px',
            }}>
              Atualidades Jurídicas
            </span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 4vw, 3rem)',
              fontWeight: 600,
              color: 'var(--color-brand-navy)',
            }}>
              Notícias do Direito
            </h2>
          </div>
          <p style={{
            color: 'rgba(21,33,56,0.55)',
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            maxWidth: '340px',
            lineHeight: 1.6,
            marginTop: '28px',
          }}>
            Notícias relevantes do mundo jurídico, selecionadas e comentadas pela nossa equipe.
          </p>
        </div>

        {/* Grid 2x2 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px',
        }} className="news-grid">
          {news.slice(0, 4).map((item: any, i: number) => {
            const hasUrl = item.sourceUrl || item.source_url
            const isExternal = !!hasUrl
            const href = isExternal ? hasUrl : `/blog/${item.slug || '#'}`

            return (
              <a
                key={i}
                href={href}
                target={isExternal ? '_blank' : '_self'}
                rel={isExternal ? 'noopener noreferrer' : undefined}
                className="news-card"
                style={{
                  display: 'block',
                  background: 'white',
                  padding: '28px 32px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  border: '1px solid rgba(21,33,56,0.06)',
                  boxShadow: '0 2px 12px rgba(21,33,56,0.04)',
                  transition: 'all 0.3s',
                }}
              >
                {/* Top: category + date */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <span style={{
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    color: 'var(--color-brand-gold-dark)',
                    background: 'rgba(196,169,106,0.1)',
                    padding: '4px 10px',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-body)',
                    letterSpacing: '0.05em',
                    fontWeight: 600,
                  }}>
                    {item.category || 'Geral'}
                  </span>
                  {item.publishedAt && (
                    <span style={{ color: 'rgba(21,33,56,0.35)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock style={{ width: '12px', height: '12px' }} />
                      {formatDate(item.publishedAt)}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '18px',
                  color: 'var(--color-brand-navy)',
                  lineHeight: 1.35,
                  marginBottom: '8px',
                  fontWeight: 600,
                }}>
                  {item.title}
                </h3>

                {/* Summary */}
                {item.summary && (
                  <p style={{
                    color: 'rgba(21,33,56,0.5)',
                    fontSize: '14px',
                    fontFamily: 'var(--font-body)',
                    lineHeight: 1.5,
                    marginBottom: '16px',
                  }}>
                    {item.summary}
                  </p>
                )}

                {/* Bottom: source + link */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'rgba(21,33,56,0.35)', fontSize: '12px', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Globe style={{ width: '12px', height: '12px' }} />
                    {item.source || 'Judiciário'}
                  </span>
                  <span style={{
                    color: 'var(--color-brand-gold-dark)',
                    fontSize: '11px',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    Campanha <ArrowRight style={{ width: '12px', height: '12px' }} />
                  </span>
                </div>
              </a>
            )
          })}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .news-card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(21,33,56,0.08) !important; }
        @media (max-width: 768px) { .news-grid { grid-template-columns: 1fr !important; } }
      `}} />
    </section>
  )
}
