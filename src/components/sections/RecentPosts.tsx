import Link from 'next/link'
import { Clock, User, ArrowRight } from 'lucide-react'

const authorNames: Record<string, string> = { edivaldo: 'Dr. Edivaldo Cavalcante', gabrielly: 'Dra. Gabrielly Melo' }

const defaultPosts = [
  { title: 'O Guia Completo da LGPD para Empresas', slug: 'guia-lgpd-empresas', excerpt: 'Tudo sobre adequação à LGPD.', category: 'lgpd', author: 'edivaldo', readTime: 12 },
  { title: 'Negativação Indevida: Seus Direitos', slug: 'negativacao-indevida-direitos', excerpt: 'O que fazer quando negativado indevidamente.', category: 'consumidor', author: 'gabrielly', readTime: 8 },
  { title: '5 Direitos de Pessoa Presa em Flagrante', slug: 'direitos-preso-flagrante', excerpt: 'Direitos fundamentais na prisão em flagrante.', category: 'penal', author: 'edivaldo', readTime: 6 },
]

export function RecentPosts({ cmsPosts = [] }: { cmsPosts?: any[] }) {
  const posts = cmsPosts.length > 0 ? cmsPosts : defaultPosts

  return (
    <section style={{ padding: '80px 24px', backgroundColor: '#faf8f5' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <span style={{ color: '#c4a96a', fontSize: '12px', fontFamily: "'Source Sans 3', sans-serif", textTransform: 'uppercase', letterSpacing: '0.25em', display: 'block', marginBottom: '16px' }}>Blog Jurídico</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', color: '#152138', margin: '0 0 16px 0', lineHeight: 1.2 }}>Artigos Recentes</h2>
          <p style={{ color: 'rgba(21,33,56,0.55)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '17px', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>Conteúdo jurídico atualizado para ajudar você a entender seus direitos.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {posts.slice(0, 3).map((post: any, i: number) => (
            <Link key={i} href={`/blog/${post.slug}`} style={{ display: 'block', background: 'white', borderRadius: '4px', overflow: 'hidden', textDecoration: 'none', border: '1px solid rgba(237,225,195,0.3)', boxShadow: '0 4px 20px rgba(21,33,56,0.05)', transition: 'all 0.3s' }} className="post-card-hover">
              <div style={{ height: '180px', background: 'linear-gradient(135deg, #152138, #1c2d4a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'rgba(184,191,200,0.15)', fontFamily: "'Playfair Display', serif", fontSize: '56px', fontWeight: 'bold' }}>CM</span>
              </div>
              <div style={{ padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#c4a96a', background: 'rgba(196,169,106,0.1)', padding: '3px 8px', borderRadius: '2px', fontFamily: "'Source Sans 3', sans-serif", letterSpacing: '0.05em' }}>{post.category}</span>
                  {post.readTime && (
                    <span style={{ color: 'rgba(21,33,56,0.3)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock style={{ width: '12px', height: '12px' }} />{post.readTime} min
                    </span>
                  )}
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 600, color: '#152138', marginBottom: '12px', lineHeight: 1.3 }}>{post.title}</h3>
                <p style={{ color: 'rgba(21,33,56,0.5)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '14px', lineHeight: 1.6, marginBottom: '16px' }}>{post.excerpt}</p>
                <span style={{ color: 'rgba(21,33,56,0.3)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User style={{ width: '12px', height: '12px' }} />{authorNames[post.author] || 'Cavalcante & Melo'}
                </span>
              </div>
            </Link>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#152138', fontSize: '13px', fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.08em', border: '1px solid rgba(21,33,56,0.2)', padding: '12px 28px', borderRadius: '2px', transition: 'all 0.3s' }}>
            Ver todos os artigos <ArrowRight style={{ width: '14px', height: '14px' }} />
          </Link>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `.post-card-hover:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(21,33,56,0.1) !important; }`}} />
    </section>
  )
}
