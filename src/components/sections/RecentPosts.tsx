'use client'

import Link from 'next/link'
import { Clock, User, ArrowRight } from 'lucide-react'
import { resolveTeamDisplayName } from '@/lib/team-display'

const defaultPosts: any[] = []

interface RecentPostsProps {
  cmsPosts?: any[]
  cmsData?: {
    title?: string
    subtitle?: string
  } | null
}

export function RecentPosts({ cmsPosts = [], cmsData }: RecentPostsProps) {
  const posts = cmsPosts.length > 0 ? cmsPosts : defaultPosts
  const sectionTitle = cmsData?.title || 'Artigos Recentes'
  const sectionSubtitle = cmsData?.subtitle || 'Conteúdo jurídico atualizado para ajudar você a entender seus direitos.'

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-wide mx-auto">
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <span style={{ color: 'var(--color-brand-gold-dark)', fontSize: '12px', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.25em', display: 'block', marginBottom: '16px' }}>
            Blog Jurídico
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 600, color: 'var(--color-brand-navy)', marginBottom: '24px' }}>
            {sectionTitle}
          </h2>
          <p style={{ color: 'color-mix(in srgb, var(--color-ca-navy-950) 55%, transparent)', fontFamily: 'var(--font-body)', fontSize: '17px', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
            {sectionSubtitle}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {posts.slice(0, 3).map((post: any, i: number) => {
            // Resolve linkedCampaign — string (slug) ou objeto populado
            const rawLinked = post.linkedCampaign || post.linked_campaign
            const linkedCampaignSlug = typeof rawLinked === 'object' && rawLinked?.slug
              ? rawLinked.slug
              : typeof rawLinked === 'string' && rawLinked.length > 0
                ? rawLinked
                : null

            const readTime = post.readTime || post.read_time
            const featuredImageUrl = typeof post.featuredImage === 'object' && post.featuredImage?.url
              ? post.featuredImage.url
              : null
            const authorName = resolveTeamDisplayName(post, 'authorRef', 'author')

            return (
              <div key={i} className="post-card" style={{ background: 'white', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(237,225,195,0.3)', boxShadow: '0 4px 20px color-mix(in srgb, var(--color-ca-navy-950) 5%, transparent)', transition: 'all 0.3s' }}>
                <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ height: '180px', background: 'linear-gradient(135deg, var(--color-ca-navy-950), var(--color-ca-navy-800))', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {featuredImageUrl ? (
                      <img src={featuredImageUrl} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ color: 'color-mix(in srgb, var(--color-ca-steel-400) 15%, transparent)', fontFamily: 'var(--font-display)', fontSize: '56px', fontWeight: 'bold' }}>CM</span>
                    )}
                  </div>
                </Link>

                <div style={{ padding: '28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--color-brand-gold-dark)', background: 'color-mix(in srgb, var(--color-ca-steel-500) 10%, transparent)', padding: '3px 8px', borderRadius: '2px', fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>
                      {post.category}
                    </span>
                    {readTime && (
                      <span style={{ color: 'color-mix(in srgb, var(--color-ca-navy-950) 30%, transparent)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock style={{ width: '12px', height: '12px' }} />
                        {readTime} min
                      </span>
                    )}
                  </div>

                  <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, color: 'var(--color-brand-navy)', marginBottom: '12px', lineHeight: 1.3 }}>
                      {post.title}
                    </h3>
                  </Link>

                  <p style={{ color: 'color-mix(in srgb, var(--color-ca-navy-950) 50%, transparent)', fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.6, marginBottom: '16px' }}>
                    {post.excerpt}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'color-mix(in srgb, var(--color-ca-navy-950) 30%, transparent)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User style={{ width: '12px', height: '12px' }} />
                      {authorName}
                    </span>

                    {linkedCampaignSlug && (
                      <Link href={`/campanhas/${linkedCampaignSlug}`} style={{ color: 'var(--color-brand-gold-dark)', fontSize: '10px', fontFamily: 'var(--font-body)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', background: 'color-mix(in srgb, var(--color-ca-steel-500) 10%, transparent)', padding: '3px 8px', borderRadius: '2px' }}>
                        Campanha <ArrowRight style={{ width: '10px', height: '10px' }} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-brand-navy)', fontSize: '13px', fontFamily: 'var(--font-body)', fontWeight: 600, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.08em', border: '1px solid color-mix(in srgb, var(--color-ca-navy-950) 20%, transparent)', padding: '12px 28px', borderRadius: '2px', transition: 'all 0.3s' }}>
            Ver todos os artigos <ArrowRight style={{ width: '14px', height: '14px' }} />
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `.post-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px color-mix(in srgb, var(--color-ca-navy-950) 10%, transparent) !important; }` }} />
    </section>
  )
}
