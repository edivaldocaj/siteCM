import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, User } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const revalidate = 1800

export const metadata: Metadata = {
  title: 'Blog Jurídico',
  description: 'Artigos sobre Direito Digital, LGPD, Consumidor, Imobiliário, Tributário e Penal.',
}

const authorNames: Record<string, string> = { edivaldo: 'Dr. Edivaldo Cavalcante', gabrielly: 'Dra. Gabrielly Melo', escritorio: 'Cavalcante & Melo' }

export default async function BlogPage() {
  let posts: any[] = []

  try {
    const payload = await getPayload({ config: configPromise })
    const result = await (payload as any).find({
      collection: 'posts',
      where: { status: { equals: 'published' } },
      sort: '-publishedAt',
      limit: 20,
    })
    posts = result.docs
  } catch (e) {
    console.error('[Blog] Error fetching posts:', e)
  }

  return (
    <>
      <section style={{ background: 'linear-gradient(135deg, #152138 0%, #1c2d4a 50%, #0e1628 100%)', paddingTop: '128px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 16px' }}>
          <span style={{ color: '#c4a96a', fontSize: '12px', fontFamily: "'Source Sans 3', sans-serif", textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '16px', display: 'block' }}>Conteúdo Jurídico</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 600, color: '#f1eae2', lineHeight: 1.1, marginBottom: '24px' }}>Blog Jurídico</h1>
          <p style={{ color: 'rgba(184,191,200,0.7)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '18px', maxWidth: '42rem', lineHeight: 1.6 }}>Artigos, guias e notícias para ajudar você a entender seus direitos.</p>
        </div>
      </section>

      <section style={{ padding: '80px 16px', backgroundColor: '#faf8f5' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <p style={{ color: 'rgba(21,33,56,0.5)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '18px', marginBottom: '16px' }}>Novos artigos em breve.</p>
              <p style={{ color: 'rgba(21,33,56,0.3)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '14px' }}>Os artigos são gerenciados pelo painel administrativo em <code style={{ background: 'white', padding: '2px 8px', borderRadius: '4px' }}>/admin</code></p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {posts.map((post: any) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} style={{ display: 'block', background: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(237,225,195,0.1)', transition: 'all 0.3s', textDecoration: 'none' }}>
                  <div style={{ height: '192px', background: 'linear-gradient(135deg, #152138, #1c2d4a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'rgba(184,191,200,0.2)', fontFamily: "'Playfair Display', serif", fontSize: '60px', fontWeight: 'bold' }}>CM</span>
                  </div>
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <span style={{ fontSize: '10px', fontFamily: "'Source Sans 3', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em', color: '#c4a96a', background: 'rgba(237,225,195,0.1)', padding: '4px 8px', borderRadius: '2px' }}>{post.category}</span>
                      {post.readTime && <span style={{ color: 'rgba(21,33,56,0.3)', fontSize: '12px', fontFamily: "'Source Sans 3', sans-serif", display: 'flex', alignItems: 'center', gap: '4px' }}><Clock style={{ width: '12px', height: '12px' }} />{post.readTime} min</span>}
                    </div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 600, color: '#152138', marginBottom: '12px', lineHeight: 1.3 }}>{post.title}</h2>
                    <p style={{ color: 'rgba(21,33,56,0.5)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '14px', lineHeight: 1.6, marginBottom: '16px' }}>{post.excerpt}</p>
                    <span style={{ color: 'rgba(21,33,56,0.3)', fontSize: '12px', fontFamily: "'Source Sans 3', sans-serif", display: 'flex', alignItems: 'center', gap: '4px' }}><User style={{ width: '12px', height: '12px' }} />{authorNames[post.author] || 'Cavalcante & Melo'}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
