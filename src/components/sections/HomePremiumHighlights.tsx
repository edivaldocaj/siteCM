import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type HighlightRecord = {
  title?: string | null
  slug?: string | null
  excerpt?: string | null
  subtitle?: string | null
  category?: string | null
  featuredImage?: { url?: string | null } | null
}

interface HomePremiumHighlightsProps {
  homepage?: any
  posts?: HighlightRecord[]
  news?: HighlightRecord[]
  campaigns?: HighlightRecord[]
}

function getHighlight(posts: HighlightRecord[] = [], news: HighlightRecord[] = [], campaigns: HighlightRecord[] = []) {
  const post = posts[0]
  if (post?.slug) return { item: post, href: `/blog/${post.slug}`, label: post.category || 'Artigo' }

  const newsItem = news[0]
  if (newsItem?.slug) return { item: newsItem, href: '/blog', label: newsItem.category || 'Atualização' }

  const campaign = campaigns[0]
  if (campaign?.slug) return { item: campaign, href: `/campanhas/${campaign.slug}`, label: campaign.category || 'Campanha' }

  return null
}

export function HomePremiumHighlights({ homepage, posts = [], news = [], campaigns = [] }: HomePremiumHighlightsProps) {
  const highlight = getHighlight(posts, news, campaigns)
  const about = homepage?.aboutPartners

  return (
    <section className="ca-premium-highlights" aria-label="Sobre o escritório e conteúdos">
      <div className={`ca-premium-highlights__inner ${highlight ? '' : 'ca-premium-highlights__inner--single'}`}>
        <article className="ca-premium-highlights__about">
          <div className="ca-premium-highlights__copy">
            <span className="ca-eyebrow">Sobre o escritório</span>
            <h2>{about?.sectionTitle || 'Atuação técnica com visão estratégica.'}</h2>
            <p>
              {about?.sectionDescription ||
                'A Cavalcante Albuquerque reúne análise jurídica, comunicação objetiva e acompanhamento próximo para construir soluções seguras em cada demanda.'}
            </p>
            <Link href="/sobre" className="ca-inline-link">
              Conheça nossa história
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          <div className="ca-premium-highlights__image">
            <Image src="/brand/office-room.webp" alt="Ambiente institucional do escritório" fill sizes="(max-width: 900px) 100vw, 44vw" />
          </div>
        </article>

        {highlight && (
          <article className="ca-premium-highlights__content">
            <span className="ca-eyebrow">Conteúdos e atualizações</span>
            <div className="ca-premium-highlights__feature">
              <div className="ca-premium-highlights__feature-image">
                {highlight.item.featuredImage?.url ? (
                  <Image src={highlight.item.featuredImage.url} alt={highlight.item.title || ''} fill sizes="(max-width: 900px) 100vw, 28vw" />
                ) : (
                  <Image src="/brand/areas-presentation.webp" alt="" fill sizes="(max-width: 900px) 100vw, 28vw" />
                )}
              </div>
              <div>
                <p className="ca-premium-highlights__label">{highlight.label}</p>
                <h3>{highlight.item.title}</h3>
                {(highlight.item.excerpt || highlight.item.subtitle) && <p>{highlight.item.excerpt || highlight.item.subtitle}</p>}
                <Link href={highlight.href} className="ca-inline-link">
                  Ler mais
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>
        )}
      </div>
    </section>
  )
}
