import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Clock, User } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { resolveTeamDisplayName } from '@/lib/team-display'

export const dynamic = 'force-dynamic'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://cavalcantealbuquerque.com.br').replace(/\/$/, '')

const fallbackEditorialItems = [
  {
    id: 'fallback-licitacoes',
    title: 'Como se preparar para disputar licitações com menos risco',
    excerpt: 'Pontos de atenção em edital, documentação, impugnações e execução contratual com a administração pública.',
    category: 'Licitações',
    href: '/areas-de-atuacao/licitacoes',
    byline: 'Cavalcante Albuquerque',
  },
  {
    id: 'fallback-digital',
    title: 'Incidente de dados: primeiros passos para empresas e titulares',
    excerpt: 'Organização inicial de evidências, comunicação, base legal e medidas de contenção em conflitos digitais.',
    category: 'Direito Digital',
    href: '/areas-de-atuacao/direito-digital',
    byline: 'Equipe jurídica',
  },
  {
    id: 'fallback-penal',
    title: 'Atendimento penal urgente: o que informar no primeiro contato',
    excerpt: 'Dados essenciais para análise rápida em flagrante, investigação, audiência de custódia e medidas cautelares.',
    category: 'Direito Penal',
    href: '/areas-de-atuacao/direito-penal',
    byline: 'Plantão penal',
  },
]

export const metadata: Metadata = {
  title: 'Blog e Notícias',
  description: 'Artigos, guias, últimas decisões e notícias do mundo jurídico.',
  alternates: { canonical: `${siteUrl}/blog` },
  openGraph: {
    title: 'Blog e Notícias',
    description: 'Artigos, guias, últimas decisões e notícias do mundo jurídico.',
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

  const editorialItems = allItems.length > 0 ? allItems : fallbackEditorialItems

  return (
    <>
      <section className="ca-page-hero ca-page-hero--blog">
        <div className="ca-page-hero__mark" aria-hidden="true">
          <Image src="/brand/brand-symbol-transparent.webp" alt="" width={360} height={360} unoptimized />
        </div>
        <div className="container-wide mx-auto ca-page-hero__inner">
          <span className="ca-eyebrow ca-eyebrow--dark">Conteúdo e atualizações</span>
          <h1>Blog e Notícias</h1>
          <p>Artigos, guias e atualizações jurídicas para acompanhar decisões, riscos e direitos relevantes.</p>
        </div>
      </section>

      <section className="ca-editorial-list">
        <div className="container-wide mx-auto">
          <div className="ca-section-heading ca-section-heading--split">
            <div>
              <span className="ca-eyebrow">{allItems.length > 0 ? 'Publicações recentes' : 'Seleção editorial'}</span>
              <h2>{allItems.length > 0 ? 'Conteúdos publicados pelo escritório' : 'Temas prioritários para orientar sua decisão'}</h2>
            </div>
            <p>{allItems.length > 0 ? 'Artigos e notícias reunidos para facilitar uma leitura técnica do cenário jurídico.' : 'Enquanto o CMS editorial é revisado, esta seção destaca os assuntos centrais da atuação do escritório.'}</p>
          </div>

          <div className="ca-editorial-list__grid">
            {editorialItems.map((item: any) => {
                const isNews = item._itemType === 'news'
                const newsLink = item.sourceUrl || item.source_url || '#'
                const href = item.href || (isNews ? newsLink : `/blog/${item.slug}`)
                const target = isNews && newsLink !== '#' ? '_blank' : '_self'
                const rel = isNews && newsLink !== '#' ? 'noopener noreferrer' : undefined
                const byline = item.byline || (isNews ? item.source || 'Judiciário' : resolveTeamDisplayName(item, 'authorRef', 'author'))
                const excerpt = item.excerpt || item.summary || item.aiSummary || ''

                return (
                  <Link key={item.id || item.slug} href={href} target={target} rel={rel} className="ca-editorial-card">
                    <div className="ca-editorial-card__media">
                      <Image src="/brand/brand-symbol-transparent.webp" alt="" width={86} height={86} unoptimized />
                      {isNews && (
                        <span className="ca-editorial-card__external" title="Notícia externa">
                          <ArrowUpRight size={16} />
                        </span>
                      )}
                    </div>
                    <div className="ca-editorial-card__body">
                      <div className="ca-editorial-card__meta">
                        <span>{isNews ? 'Notícia' : item.category || 'Artigo'}</span>
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
        </div>
      </section>
    </>
  )
}
