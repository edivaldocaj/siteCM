import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function RecentPosts({ cmsPosts = [] }: { cmsPosts?: any[] }) {
  if (!cmsPosts || cmsPosts.length === 0) return null;

  return (
    <section style={{ padding: '80px 16px', backgroundColor: '#faf8f5' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ color: '#c4a96a', fontSize: '12px', fontFamily: "'Source Sans 3', sans-serif", textTransform: 'uppercase', letterSpacing: '0.25em', display: 'block', marginBottom: '12px' }}>Nosso Blog</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', color: '#152138', margin: 0, lineHeight: 1.2 }}>Artigos Recentes</h2>
          </div>
          <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#c4a96a', fontSize: '13px', fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Ver todos <ArrowRight style={{ width: '14px', height: '14px' }} />
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {cmsPosts.map((post: any) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              style={{ display: 'block', background: '#ffffff', borderRadius: '4px', overflow: 'hidden', textDecoration: 'none', border: '1px solid rgba(237,225,195,0.5)', boxShadow: '0 4px 20px rgba(21,33,56,0.05)', transition: 'all 0.3s ease' }}
              className="post-card-hover">
              <div style={{ height: '180px', background: 'linear-gradient(135deg, #152138 0%, #1c2d4a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'rgba(196,169,106,0.15)', fontFamily: "'Playfair Display', serif", fontSize: '56px', fontWeight: 'bold' }}>CM</span>
              </div>
              <div style={{ padding: '24px' }}>
                <span style={{ fontSize: '10px', fontFamily: "'Source Sans 3', sans-serif", textTransform: 'uppercase', letterSpacing: '0.08em', color: '#c4a96a', background: 'rgba(196,169,106,0.08)', padding: '3px 8px', borderRadius: '2px' }}>{post.category || 'Artigo'}</span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#152138', margin: '12px 0 10px 0', lineHeight: 1.35 }}>{post.title}</h3>
                <p style={{ color: 'rgba(21,33,56,0.55)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .post-card-hover:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(21,33,56,0.1) !important; border-color: rgba(196,169,106,0.4) !important; }
      `}} />
    </section>
  )
}
