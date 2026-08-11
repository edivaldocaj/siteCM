'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Clock, User } from 'lucide-react'
import { resolveTeamDisplayName } from '@/lib/team-display'

interface RecentPostsProps {
  cmsPosts?: any[]
  cmsData?: {
    title?: string
    subtitle?: string
  } | null
}

export function RecentPosts({ cmsPosts = [], cmsData }: RecentPostsProps) {
  if (cmsPosts.length === 0) return null

  const sectionTitle = cmsData?.title || 'Artigos Recentes'
  const sectionSubtitle = cmsData?.subtitle || 'Conteúdo jurídico atualizado para ajudar você a entender seus direitos.'

  return (
    <section className="ca-home-editorial" aria-labelledby="recent-posts-title">
      <div className="container-wide mx-auto">
        <div className="ca-section-heading ca-section-heading--split">
          <div>
            <span className="ca-eyebrow">Blog Jurídico</span>
            <h2 id="recent-posts-title">{sectionTitle}</h2>
          </div>
          <p>{sectionSubtitle}</p>
        </div>

        <div className="ca-home-editorial__grid">
          {cmsPosts.slice(0, 3).map((post: any) => {
            const rawLinked = post.linkedCampaign || post.linked_campaign
            const linkedCampaignSlug = typeof rawLinked === 'object' && rawLinked?.slug
              ? rawLinked.slug
              : typeof rawLinked === 'string' && rawLinked.length > 0
                ? rawLinked
                : null
            const readTime = post.readTime || post.read_time
            const featuredImageUrl = typeof post.featuredImage === 'object' && post.featuredImage?.url ? post.featuredImage.url : null
            const authorName = resolveTeamDisplayName(post, 'authorRef', 'author')

            return (
              <article key={post.id || post.slug} className="ca-home-editorial__card">
                <Link href={`/blog/${post.slug}`} className="ca-home-editorial__media">
                  {featuredImageUrl ? (
                    <Image src={featuredImageUrl} alt={post.title} fill sizes="(max-width: 900px) 100vw, 33vw" />
                  ) : (
                    <Image src="/brand/brand-symbol-transparent.webp" alt="" width={88} height={88} unoptimized />
                  )}
                </Link>

                <div className="ca-home-editorial__body">
                  <div className="ca-home-editorial__meta">
                    {post.category && <span>{post.category}</span>}
                    {readTime && (
                      <small>
                        <Clock size={12} />
                        {readTime} min
                      </small>
                    )}
                  </div>

                  <Link href={`/blog/${post.slug}`} className="ca-home-editorial__title">
                    <h3>{post.title}</h3>
                  </Link>

                  {post.excerpt && <p>{post.excerpt}</p>}

                  <div className="ca-home-editorial__footer">
                    <small>
                      <User size={12} />
                      {authorName}
                    </small>
                    {linkedCampaignSlug && (
                      <Link href={`/campanhas/${linkedCampaignSlug}`} className="ca-home-editorial__campaign">
                        Campanha
                        <ArrowRight size={12} />
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <Link href="/blog" className="btn-primary ca-home-editorial__all">
          Ver todos os artigos
        </Link>
      </div>
    </section>
  )
}
