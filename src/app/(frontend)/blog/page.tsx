import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, User, ArrowUpRight } from 'lucide-react'
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
    
    // Busca posts e notÃ­cias simultaneamente
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
      })
    ])

    const posts = postsRes.docs.map((p: any) => ({ ...p, _itemType: 'post' }))
    const news = newsRes.docs.map((n: any) => ({ ...n, _itemType: 'news' }))

    // Junta as duas listas e ordena pela data mais recente
    allItems = [...posts, ...news].sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt).getTime()
      const dateB = new Date(b.publishedAt || b.createdAt).getTime()
      return dateB - dateA
    })
  } catch (e) {
    console.error('[Blog] Error fetching posts and news:', e)
  }

  return (
    <>
      <section style={{ background: 'linear-gradient(135deg, var(--color-ca-navy-950) 0%, var(--color-ca-navy-800) 50%, var(--color-ca-navy-900) 100%)', paddingTop: '128px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 16px' }}>
          <span style={{ color: 'var(--color-ca-steel-500)', fontSize: '12px', fontFamily: "'Source Sans 3', sans-serif", textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '16px', display: 'block' }}>ConteÃºdo e AtualizaÃ§Ãµes</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 600, color: 'var(--color-ca-platinum-100)', lineHeight: 1.1, marginBottom: '24px' }}>Blog e NotÃ­cias</h1>
          <p style={{ color: 'color-mix(in srgb, var(--color-ca-steel-400) 70%, transparent)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '18px', maxWidth: '42rem', lineHeight: 1.6 }}>Artigos, guias e as Ãºltimas decisÃµes dos tribunais para ajudar vocÃª a entender seus direitos.</p>
        </div>
      </section>

      <section style={{ padding: '80px 16px', backgroundColor: 'var(--color-ca-bone)', minHeight: '50vh' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          {allItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <p style={{ color: 'color-mix(in srgb, var(--color-ca-navy-950) 50%, transparent)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '18px', marginBottom: '16px' }}>Novos artigos e notÃ­cias em breve.</p>
              <p style={{ color: 'color-mix(in srgb, var(--color-ca-navy-950) 30%, transparent)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '14px' }}>Os conteÃºdos sÃ£o gerenciados pelo painel administrativo em <code style={{ background: 'white', padding: '2px 8px', borderRadius: '4px' }}>/admin</code></p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {allItems.map((item: any) => {
                const isNews = item._itemType === 'news'
                
                // CORREÃ‡ÃƒO: Tenta ler o link do site da fonte, independentemente do formato da variÃ¡vel
                const newsLink = item.sourceUrl || item.source_url || '#'
                const href = isNews ? newsLink : `/blog/${item.slug}`
                
                const target = (isNews && newsLink !== '#') ? '_blank' : '_self'
                const rel = (isNews && newsLink !== '#') ? 'noopener noreferrer' : undefined
                const byline = isNews ? (item.source || 'Judiciário') : resolveTeamDisplayName(item, 'authorRef', 'author')

                return (
                  <Link key={item.id || item.slug} href={href} target={target} rel={rel} style={{ display: 'block', background: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(237,225,195,0.1)', transition: 'all 0.3s', textDecoration: 'none' }}>
                    <div style={{ height: '192px', background: 'linear-gradient(135deg, var(--color-ca-navy-950), var(--color-ca-navy-800))', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <span style={{ color: 'color-mix(in srgb, var(--color-ca-steel-400) 20%, transparent)', fontFamily: "'Playfair Display', serif", fontSize: '60px', fontWeight: 'bold' }}>CM</span>
                      {isNews && (
                        <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '50%' }} title="NotÃ­cia Externa">
                          <ArrowUpRight style={{ width: '16px', height: '16px', color: 'var(--color-ca-platinum-100)' }} />
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <span style={{ fontSize: '10px', fontFamily: "'Source Sans 3', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-ca-steel-500)', background: 'rgba(237,225,195,0.1)', padding: '4px 8px', borderRadius: '2px' }}>
                          {isNews ? 'NotÃ­cia' : (item.category || 'Geral')}
                        </span>
                        {!isNews && item.readTime && (
                          <span style={{ color: 'color-mix(in srgb, var(--color-ca-navy-950) 30%, transparent)', fontSize: '12px', fontFamily: "'Source Sans 3', sans-serif", display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock style={{ width: '12px', height: '12px' }} />{item.readTime} min
                          </span>
                        )}
                      </div>
                      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 600, color: 'var(--color-ca-navy-950)', marginBottom: '12px', lineHeight: 1.3 }}>{item.title}</h2>
                      <p style={{ color: 'color-mix(in srgb, var(--color-ca-navy-950) 50%, transparent)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '14px', lineHeight: 1.6, marginBottom: '16px' }}>{item.excerpt}</p>
                      <span style={{ color: 'color-mix(in srgb, var(--color-ca-navy-950) 30%, transparent)', fontSize: '12px', fontFamily: "'Source Sans 3', sans-serif", display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User style={{ width: '12px', height: '12px' }} />
                        {byline}
                      </span>
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