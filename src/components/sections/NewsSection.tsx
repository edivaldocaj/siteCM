import Link from 'next/link'

export function NewsSection({ cmsNews = [] }: { cmsNews?: any[] }) {
  if (!cmsNews || cmsNews.length === 0) return null;

  return (
    <section style={{ padding: '80px 16px', backgroundColor: '#152138' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ color: '#c4a96a', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.25em' }}>Atualizações</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', color: '#f1eae2', marginTop: '16px' }}>Notícias do Judiciário</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {cmsNews.map((news: any) => {
            // CORREÇÃO DO LINK AQUI TAMBÉM
            const newsLink = news.sourceUrl || news.source_url || '#'
            
            return (
              <a key={news.slug} href={newsLink} target="_blank" rel="noopener noreferrer" style={{ display: 'block', border: '1px solid rgba(255,255,255,0.1)', padding: '24px', borderRadius: '8px', textDecoration: 'none', background: 'rgba(255,255,255,0.02)' }}>
                <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#b8bfc8' }}>{news.source || 'Judiciário'}</span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#f1eae2', margin: '12px 0' }}>{news.title}</h3>
                <p style={{ color: 'rgba(184,191,200,0.6)', fontSize: '14px', lineHeight: 1.6 }}>{news.excerpt}</p>
              </a>
            )
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
           <Link href="/blog" style={{ color: '#c4a96a', fontSize: '14px', textDecoration: 'none', border: '1px solid rgba(196,169,106,0.5)', padding: '12px 24px', borderRadius: '4px', transition: 'all 0.3s' }}>
             Ver todas as atualizações
           </Link>
        </div>
      </div>
    </section>
  )
}