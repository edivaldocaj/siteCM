import Link from 'next/link'

export function RecentPosts({ cmsPosts = [] }: { cmsPosts?: any[] }) {
  if (!cmsPosts || cmsPosts.length === 0) return null;

  return (
    <section style={{ padding: '80px 16px', backgroundColor: '#ffffff' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '48px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ color: '#c4a96a', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.25em' }}>Nosso Blog</span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', color: '#152138', marginTop: '16px' }}>Artigos Recentes</h2>
          </div>
          <Link href="/blog" style={{ color: '#c4a96a', fontSize: '14px', textDecoration: 'none', fontWeight: 'bold' }}>Ver todos &rarr;</Link>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {cmsPosts.map((post: any) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} style={{ display: 'block', background: '#faf8f5', borderRadius: '8px', overflow: 'hidden', textDecoration: 'none' }}>
              <div style={{ height: '200px', background: '#152138', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.1)', fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 'bold' }}>CM</span>
              </div>
              <div style={{ padding: '24px' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#c4a96a' }}>{post.category}</span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#152138', margin: '12px 0' }}>{post.title}</h3>
                <p style={{ color: 'rgba(21,33,56,0.6)', fontSize: '14px', lineHeight: 1.6 }}>{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}