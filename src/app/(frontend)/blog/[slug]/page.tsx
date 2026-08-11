import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { resolveTeamDisplayName } from '@/lib/team-display'
import { ArrowLeft, Clock, User, Calendar } from 'lucide-react'

// Renderizador oficial do texto formatado (RichText)
import { RichText } from '@payloadcms/richtext-lexical/react'


export const dynamic = 'force-dynamic'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://cavalcantealbuquerque.com.br').replace(/\/$/, '')

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params

  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await (payload as any).find({
      collection: 'posts',
      where: {
        slug: { equals: slug },
        status: { equals: 'published' },
      },
      depth: 1,
      limit: 1,
    })

    const post = docs?.[0]
    if (!post) {
      return {
        title: 'Artigo nao encontrado | Cavalcante Albuquerque',
      }
    }

    const title = post.seo?.metaTitle || post.title
    const description = post.seo?.metaDescription || post.excerpt || ''
    const imageUrl = post.featuredImage && typeof post.featuredImage === 'object' && post.featuredImage.url
      ? post.featuredImage.url
      : `${siteUrl}/brand/og-default.jpg`
    const canonical = `${siteUrl}/blog/${slug}`

    return {
      title: `${title} | Cavalcante Albuquerque`,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        type: 'article',
        url: canonical,
        images: [{ url: imageUrl, width: 1200, height: 630 }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
    }
  } catch {
    return {
      title: 'Blog | Cavalcante Albuquerque',
      description: 'Artigos e analises juridicas do escritorio Cavalcante Albuquerque.',
    }
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  
  // Busca o post no banco de dados com base na URL
  const { docs } = await (payload as any).find({
    collection: 'posts',
    where: { slug: { equals: slug } },
    depth: 1,
  })

  const post = docs[0]

  // A CORREÇÃO ESTÁ AQUI: Se o post não existir no banco, força o erro 404 (Página não encontrada)
  if (!post) {
    notFound()
  }

  // Formata a data de publicação
  const publishDate = post.publishedAt || post.createdAt
  const formattedDate = new Date(publishDate).toLocaleDateString('pt-BR', { 
    day: '2-digit', month: 'long', year: 'numeric' 
  })
  const authorName = resolveTeamDisplayName(post, 'authorRef', 'author')

  return (
    <article className="ca-article-page">
      <section className="ca-article-hero">
        <div className="ca-page-hero__mark" aria-hidden="true" />
        <div className="container-narrow mx-auto ca-article-hero__inner">
          <Link href="/blog" className="ca-back-link">
            <ArrowLeft size={16} />
            Voltar para o Blog
          </Link>

          <div className="ca-article-hero__meta">
            <span>{post.category || 'Artigo'}</span>
            {post.readTime && (
              <span>
                <Clock size={14} /> {post.readTime} min de leitura
              </span>
            )}
          </div>

          <h1>{post.title}</h1>
          {post.excerpt && <p>{post.excerpt}</p>}

          <div className="ca-article-hero__byline">
            <span>
              <User size={16} />
              {authorName}
            </span>
            <span>
              <Calendar size={16} />
              {formattedDate}
            </span>
          </div>
        </div>
      </section>

      <section className="ca-article-body">
        <div className="container-narrow mx-auto">
          <div className="ca-article-body__panel">
            {post.excerpt && <p className="ca-article-body__lede">{post.excerpt}</p>}
            <div className="cms-rich-text ca-article-richtext">
              {post.content ? (
                <RichText data={post.content} />
              ) : (
                <p>Conteúdo não disponível.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}
