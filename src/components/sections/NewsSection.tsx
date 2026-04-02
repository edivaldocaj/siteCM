import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function NewsSection({ cmsNews = [] }: { cmsNews?: any[] }) {
  if (!cmsNews || cmsNews.length === 0) return null;

  return (
    <section style={{ padding: '80px 16px', backgroundColor: '#152138' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <span style={{ color: '#c4a96a', fontSize: '12px', fontFamily: "'Source Sans 3', sans-serif", textTransform: 'uppercase', letterSpacing: '0.25em', display: 'block', marginBottom: '16px' }}>Atualizações</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', color: '#f1eae2', margin: '0 0 16px 0', lineHeight: 1.2 }}>Notícias do Judiciário</h2>
          <p style={{ color: 'rgba(184,191,200,0.55)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '17px', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>Fique por dentro das últimas decisões e mudanças no cenário jurídico.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {cmsNews.map((news: any) => {
            const newsLink = news.sourceUrl || news.source_url || '#'
            return (
              <a key={news.slug} href={newsLink} target="_blank" rel="noopener noreferrer"
                style={{ display: 'block', border: '1px solid rgba(255,255,255,0.08)', borderTop: '2px solid rgba(196,169,106,0.2)', padding: '28px', borderRadius: '4px', textDecoration: 'none', background: 'rgba(255,255,255,0.03)', transition: 'all 0.3s ease', position: 'relative' }}
                className="news-card-hover">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <span style={{ fontSize: '10px', fontFamily: "'Source Sans 3', sans-serif", textTransform: 'uppercase', letterSpacing: '0.08em', color: 'rgba(184,191,200,0.5)' }}>{news.source || 'Judiciário'}</span>
                  <ArrowUpRight style={{ width: '14px', height: '14px', color: 'rgba(196,169,106,0.5)', flexShrink: 0 }} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px', color: '#f1eae2', margin: '0 0 12px 0', lineHeight: 1.4 }}>{news.title}</h3>
                <p style={{ color: 'rgba(184,191,200,0.5)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{news.excerpt}</p>
              </a>
            )
          })}
        </div>
        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link href="/blog" style={{ color: '#c4a96a', fontSize: '13px', fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.08em', border: '1px solid rgba(196,169,106,0.4)', padding: '12px 28px', borderRadius: '2px', transition: 'all 0.3s', display: 'inline-block' }} className="news-view-all">
            Ver todas as atualizações
          </Link>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .news-card-hover:hover { background: rgba(255,255,255,0.06) !important; border-top-color: rgba(196,169,106,0.5) !important; transform: translateY(-2px); }
        .news-view-all:hover { background: rgba(196,169,106,0.1) !important; border-color: rgba(196,169,106,0.7) !important; }
      `}} />
    </section>
  )
}
