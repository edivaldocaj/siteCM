import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Clock, User } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { resolveTeamDisplayName } from '@/lib/team-display'

export const dynamic = 'force-dynamic'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://cavalcantealbuquerque.com.br').replace(/\/$/, '')

export const metadata: Metadata = {
  title: 'Blog e Noticias',
  description: 'Artigos, guias, ultimas decisoes e noticias do mundo juridico.',
  alternates: { canonical: `${siteUrl}/blog` },
  openGraph: {
    title: 'Blog e Noticias',
    description: 'Artigos, guias, ultimas decisoes e noticias do mundo juridico.',
    url: `${siteUrl}/blog`,
    images: [{ url: `${siteUrl}/brand/og-default.jpg`, width: 1200, height: 630 }],
  },
}

export default async function BlogPage() {
  let allItems: any[] = []

  try {
    const payload = await getPayload({ config: configPromise })
    const [postsRes, newsRes] = await Promise.all([
      (payload as any).find({
        collection: 'posts',
        where: { status: { equals: 'published' } },
        limit: 20,
        depth: 1,
      }),
      (payload as any).find({
        collection: 'news-articles',
        where: { status: { equals: 'published' } },
        limit: 20,
      }),
    ])

    const posts = postsRes.docs.map((post: any) => ({ ...post, _itemType: 'post' }))
    const news = newsRes.docs.map((article: any) => ({ ...article, _itemType: 'news' }))

    allItems = [...posts, ...news].sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt).getTime()
      const dateB = new Date(b.publishedAt || b.createdAt).getTime()
      return dateB - dateA
    })
  } catch (error) {
    console.error('[Blog] Error fetching posts and news:', error)
  }

  return (
    <>
      <section className="ca-page-hero ca-page-hero--blog">
        <div className="ca-page-hero__mark" aria-hidden="true">
          <Image src="/brand/symbol-mono-light.svg" alt="" width={360} height={360} />
        </div>
        <div className="container-wide mx-auto ca-page-hero__inner">
          <span className="ca-eyebrow ca-eyebrow--dark">Conteudo e atualizacoes</span>
          <h1>Blog e Noticias</h1>
          <p>Artigos, guias e atualizacoes juridicas para acompanhar decisoes, riscos e direitos relevantes.</p>
        </div>
      </section>

      <section className="ca-editorial-list">
        <div className="container-wide mx-auto">
          {allItems.length === 0 ? (
            <div className="ca-empty-state">
              <span className="ca-eyebrow">Conteudo em revisao</span>
              <h2>Novos artigos e noticias em breve</h2>
              <p>Os conteudos editoriais serao publicados pelo painel administrativo.</p>
            </div>
          ) : (
            <div className="ca-editorial-list__grid">
              {allItems.map((item: any) => {
                const isNews = item._itemType === 'news'
                const newsLink = item.sourceUrl || item.source_url || '#'
                const href = isNews ? newsLink : `/blog/${item.slug}`
                const target = isNews && newsLink !== '#' ? '_blank' : '_self'
                const rel = isNews && newsLink !== '#' ? 'noopener noreferrer' : undefined
                const byline = isNews ? item.source || 'Judiciario' : resolveTeamDisplayName(item, 'authorRef', 'author')
                const excerpt = item.excerpt || item.summary || item.aiSummary || ''

                return (
                  <Link key={item.id || item.slug} href={href} target={target} rel={rel} className="ca-editorial-card">
                    <div className="ca-editorial-card__media">
                      <Image src="/brand/symbol-mono-light.svg" alt="" width={86} height={86} />
                      {isNews && (
                        <span className="ca-editorial-card__external" title="Noticia externa">
                          <ArrowUpRight size={16} />
                        </span>
                      )}
                    </div>
                    <div className="ca-editorial-card__body">
                      <div className="ca-editorial-card__meta">
                        <span>{isNews ? 'Noticia' : item.category || 'Artigo'}</span>
                        {!isNews && item.readTime && (
                          <small>
                            <Clock size={12} />
                            {item.readTime} min
                          </small>
                        )}
                      </div>
                      <h2>{item.title}</h2>
                      {excerpt && <p>{excerpt}</p>}
                      <small className="ca-editorial-card__byline">
                        <User size={12} />
                        {byline}
                      </small>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
