import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, User, ArrowUpRight } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const revalidate = 1800

export const metadata: Metadata = {
  title: 'Blog e Notícias',
  description: 'Artigos, guias, últimas decisões e notícias do mundo jurídico.',
}

const authorNames: Record<string, string> = { edivaldo: 'Dr. Edivaldo Cavalcante', gabrielly: 'Dra. Gabrielly Melo', escritorio: 'Cavalcante & Melo' }

export default async function BlogPage() {
  let allItems: any[] = []

  try {
    const payload = await getPayload({ config: configPromise })
    
    // Busca posts e notícias simultaneamente
    const [postsRes, newsRes] = await Promise.all([
      (payload as any).find({
        collection: 'posts',
        where: { status: { equals: 'published' } },
        limit: 20,
      }),
      (payload as any).find({
        collection: 'news-articles',
        where: { status: { equals: 'published' } },
        limit: 20,
      })
    ])

    // Adiciona uma flag para sabermos de onde veio cada item
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
      <section style={{ background: 'linear-gradient(135deg, #152138 0%, #1c2d4a 50%, #0e1628 100%)', paddingTop: '128px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 16px' }}>
          <span style={{ color: '#c4a96a', fontSize: '12px', fontFamily: "'Source Sans 3', sans-serif", textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '16px', display: 'block' }}>Conteúdo e Atualizações</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 600, color: '#f1eae2', lineHeight: 1.1, marginBottom: '24px' }}>Blog e Notícias</h1>
          <p style={{ color: 'rgba(184,191,200,0.7)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '18px', maxWidth: '42rem', lineHeight: 1.6 }}>Artigos, guias e as últimas decisões dos tribunais para ajudar você a entender seus direitos.</p>
        </div>
      </section>

      <section style={{ padding: '80px 16px', backgroundColor: '#faf8f5', minHeight: '50vh' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          {allItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <p style={{ color: 'rgba(21,33,56,0.5)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '18px', marginBottom: '16px' }}>Novos artigos e notícias em breve.</p>
              <p style={{ color: 'rgba(21,33,56,0.3)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '14px' }}>Os conteúdos são gerenciados pelo painel administrativo em <code style={{ background: 'white', padding: '2px 8px', borderRadius: '4px' }}>/admin</code></p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {allItems.map((item: any) => {
                const isNews = item._itemType === 'news'
                // Se for notícia, aponta para o link original externo. Se for post, aponta para a página interna
                const href = isNews ? (item.source_url || '#') : `/blog/${item.slug}`
                const target = isNews ? '_blank' : '_self'
                const rel = isNews ? 'noopener noreferrer' : undefined

                return (
                  <Link key={item.id || item.slug} href={href} target={target} rel={rel} style={{ display: 'block', background: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(237,225,195,0.1)', transition: 'all 0.3s', textDecoration: 'none' }}>
                    <div style={{ height: '192px', background: 'linear-gradient(135deg, #152138, #1c2d4a)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <span style={{ color: 'rgba(184,191,200,0.2)', fontFamily: "'Playfair Display', serif", fontSize: '60px', fontWeight: 'bold' }}>CM</span>
                      {isNews && (
                        <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.3)', padding: '6px', borderRadius: '50%' }} title="Notícia Externa">
                          <ArrowUpRight style={{ width: '16px', height: '16px', color: '#f1eae2' }} />
                        </div>
                      )}
                    </div>
                    <div style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <span style={{ fontSize: '10px', fontFamily: "'Source Sans 3', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em', color: '#c4a96a', background: 'rgba(237,225,195,0.1)', padding: '4px 8px', borderRadius: '2px' }}>
                          {isNews ? 'Notícia' : (item.category || 'Geral')}
                        </span>
                        {!isNews && item.readTime && (
                          <span style={{ color: 'rgba(21,33,56,0.3)', fontSize: '12px', fontFamily: "'Source Sans 3', sans-serif", display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock style={{ width: '12px', height: '12px' }} />{item.readTime} min
                          </span>
                        )}
                      </div>
                      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 600, color: '#152138', marginBottom: '12px', lineHeight: 1.3 }}>{item.title}</h2>
                      <p style={{ color: 'rgba(21,33,56,0.5)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '14px', lineHeight: 1.6, marginBottom: '16px' }}>{item.excerpt}</p>
                      <span style={{ color: 'rgba(21,33,56,0.3)', fontSize: '12px', fontFamily: "'Source Sans 3', sans-serif", display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <User style={{ width: '12px', height: '12px' }} />
                        {isNews ? (item.source || 'Jusbrasil / STJ') : (authorNames[item.author] || 'Cavalcante & Melo')}
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