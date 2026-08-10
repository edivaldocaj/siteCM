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
    <div style={{ backgroundColor: 'var(--color-ca-bone)', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Cabeçalho do Artigo */}
      <section style={{ background: 'linear-gradient(135deg, var(--color-ca-navy-950) 0%, var(--color-ca-navy-800) 50%, var(--color-ca-navy-900) 100%)', paddingTop: '120px', paddingBottom: '100px', paddingLeft: '16px', paddingRight: '16px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Link href="/blog" style={{ color: 'var(--color-ca-steel-500)', fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', width: 'fit-content' }}>
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            Voltar para o Blog
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <span style={{ color: 'var(--color-ca-steel-500)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'color-mix(in srgb, var(--color-ca-steel-500) 10%, transparent)', padding: '4px 12px', borderRadius: '4px' }}>
              {post.category}
            </span>
            {post.readTime && (
              <span style={{ color: 'color-mix(in srgb, var(--color-ca-steel-400) 60%, transparent)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock style={{ width: '14px', height: '14px' }} /> {post.readTime} min de leitura
              </span>
            )}
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: 'var(--color-ca-platinum-100)', lineHeight: 1.2, marginBottom: '24px' }}>
            {post.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-ca-steel-400)', fontSize: '14px' }}>
              <User style={{ width: '16px', height: '16px', color: 'var(--color-ca-steel-500)' }} />
              {authorName}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-ca-steel-400)', fontSize: '14px' }}>
              <Calendar style={{ width: '16px', height: '16px', color: 'var(--color-ca-steel-500)' }} />
              {formattedDate}
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo do Artigo */}
      <section style={{ maxWidth: '800px', margin: '-40px auto 0', position: 'relative', zIndex: 10, padding: '0 16px' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid color-mix(in srgb, var(--color-ca-navy-950) 5%, transparent)' }}>
          
          <div style={{ color: 'color-mix(in srgb, var(--color-ca-navy-950) 80%, transparent)', fontSize: '18px', lineHeight: 1.6, marginBottom: '32px', fontStyle: 'italic', borderLeft: '4px solid var(--color-ca-steel-500)', paddingLeft: '16px' }}>
            {post.excerpt}
          </div>

          {/* O Renderizador que puxa os parágrafos diretos do CMS */}
          <div style={{ color: 'color-mix(in srgb, var(--color-ca-navy-950) 70%, transparent)', fontSize: '16px', lineHeight: 1.8 }} className="cms-rich-text">
            {post.content ? (
              <RichText data={post.content} />
            ) : (
              <p>Conteúdo não disponível.</p>
            )}
          </div>
          
        </div>
      </section>
    </div>
  )
}
