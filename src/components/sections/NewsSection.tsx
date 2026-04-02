'use client'

import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'

const defaultNews = [
  { title: 'STJ firma entendimento sobre revisão de juros', source: 'Conjur', category: 'direito-consumidor', slug: 'stj-revisao-juros' },
  { title: 'ANPD aplica multa por vazamento de dados', source: 'Migalhas', category: 'lgpd', slug: 'anpd-multa-vazamento' },
  { title: 'Nova lei amplia penas para estelionato digital', source: 'Conjur', category: 'direito-penal', slug: 'nova-lei-estelionato' },
]

interface NewsSectionProps {
  cmsNews?: any[]
}

export function NewsSection({ cmsNews = [] }: NewsSectionProps) {
  const news = cmsNews.length > 0 ? cmsNews : defaultNews

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-brand-champagne)' }}>
      <div className="container-wide mx-auto">
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <span style={{
            color: 'var(--color-brand-gold-dark)',
            fontSize: '12px',
            fontFamily: 'var(--font-body)',
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            display: 'block',
            marginBottom: '16px',
          }}>
            Atualizações
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            fontWeight: 600,
            color: 'var(--color-brand-navy)',
            marginBottom: '24px',
          }}>
            Notícias do Direito
          </h2>
          <p style={{
            color: 'rgba(21,33,56,0.55)',
            fontFamily: 'var(--font-body)',
            fontSize: '17px',
            maxWidth: '520px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Últimas decisões e notícias relevantes do mundo jurídico.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}>
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
                  padding: '28px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  border: '1px solid rgba(21,33,56,0.06)',
                  boxShadow: '0 2px 12px rgba(21,33,56,0.04)',
                  transition: 'all 0.3s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    color: 'var(--color-brand-gold-dark)',
                    background: 'rgba(196,169,106,0.1)',
                    padding: '3px 8px',
                    borderRadius: '2px',
                    fontFamily: 'var(--font-body)',
                    letterSpacing: '0.05em',
                  }}>
                    {item.category || 'Geral'}
                  </span>
                  {isExternal && <ExternalLink style={{ width: '14px', height: '14px', color: 'rgba(21,33,56,0.3)' }} />}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '16px',
                  color: 'var(--color-brand-navy)',
                  lineHeight: 1.4,
                  marginBottom: '12px',
                }}>
                  {item.title}
                </h3>
                <p style={{ color: 'rgba(21,33,56,0.4)', fontSize: '12px', fontFamily: 'var(--font-body)' }}>
                  Fonte: {item.source || 'Judiciário'}
                </p>
              </a>
            )
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/blog" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--color-brand-navy)',
            fontSize: '13px',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            textDecoration: 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            border: '1px solid rgba(21,33,56,0.2)',
            padding: '12px 28px',
            borderRadius: '2px',
            transition: 'all 0.3s',
          }}>
            Ver todas as notícias <ArrowRight style={{ width: '14px', height: '14px' }} />
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .news-card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(21,33,56,0.08) !important; }
      `}} />
    </section>
  )
}
