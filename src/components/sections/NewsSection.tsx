'use client'

import Link from 'next/link'
import { ArrowRight, Clock, ExternalLink, Globe } from 'lucide-react'

function formatDate(dateStr?: string) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).replace('.', '')
}

interface NewsSectionProps {
  cmsNews?: any[]
  cmsData?: {
    title?: string
    subtitle?: string
  } | null
}

export function NewsSection({ cmsNews = [], cmsData }: NewsSectionProps) {
  if (cmsNews.length === 0) return null

  const sectionTitle = cmsData?.title || 'Notícias do Direito'
  const sectionSubtitle = cmsData?.subtitle || 'Atualizações relevantes do mundo jurídico, selecionadas para leitura rápida.'

  return (
    <section className="ca-news-strip" aria-labelledby="home-news-title">
      <div className="container-wide mx-auto">
        <div className="ca-section-heading ca-section-heading--split">
          <div>
            <span className="ca-eyebrow">Atualidades Jurídicas</span>
            <h2 id="home-news-title">{sectionTitle}</h2>
          </div>
          <p>{sectionSubtitle}</p>
        </div>

        <div className="ca-news-strip__grid">
          {cmsNews.slice(0, 4).map((item: any) => {
            const hasUrl = item.sourceUrl || item.source_url
            const isExternal = Boolean(hasUrl)
            const href = isExternal ? hasUrl : `/blog/${item.slug || '#'}`
            const rawLinked = item.linkedCampaign || item.linked_campaign
            const linkedCampaignSlug = typeof rawLinked === 'object' && rawLinked?.slug
              ? rawLinked.slug
              : typeof rawLinked === 'string' && rawLinked.length > 0
                ? rawLinked
                : null

            return (
              <article key={item.id || item.slug} className="ca-news-strip__card">
                <div className="ca-news-strip__meta">
                  <span>{item.category || 'Geral'}</span>
                  {(item.publishedAt || item.published_at) && (
                    <small>
                      <Clock size={12} />
                      {formatDate(item.publishedAt || item.published_at)}
                    </small>
                  )}
                </div>

                <a href={href} target={isExternal ? '_blank' : '_self'} rel={isExternal ? 'noopener noreferrer' : undefined}>
                  <h3>{item.title}</h3>
                </a>

                {(item.summary || item.excerpt || item.aiSummary) && <p>{item.summary || item.excerpt || item.aiSummary}</p>}

                <div className="ca-news-strip__footer">
                  <small>
                    <Globe size={12} />
                    {item.source || 'Judiciário'}
                  </small>
                  {linkedCampaignSlug ? (
                    <Link href={`/campanhas/${linkedCampaignSlug}`}>
                      Ver campanha
                      <ArrowRight size={12} />
                    </Link>
                  ) : (
                    <a href={href} target={isExternal ? '_blank' : '_self'} rel={isExternal ? 'noopener noreferrer' : undefined}>
                      Ler mais
                      {isExternal ? <ExternalLink size={12} /> : <ArrowRight size={12} />}
                    </a>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
