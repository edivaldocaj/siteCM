import Link from 'next/link'

export function FeaturedCampaigns({ cmsCampaigns = [] }: { cmsCampaigns?: any[] }) {
  // Se não tiver campanhas marcadas como "Destaque" no painel, oculta a sessão
  if (!cmsCampaigns || cmsCampaigns.length === 0) return null;

  return (
    <section style={{ padding: '80px 16px', backgroundColor: '#faf8f5' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ color: '#c4a96a', fontSize: '12px', fontFamily: "'Source Sans 3', sans-serif", textTransform: 'uppercase', letterSpacing: '0.25em' }}>Atuação Imediata</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', color: '#152138', marginTop: '16px' }}>Campanhas em Destaque</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
          {cmsCampaigns.map((camp: any) => (
            <Link key={camp.slug} href={`/campanhas/${camp.slug}`} style={{ display: 'block', background: 'white', padding: '32px', borderRadius: '8px', textDecoration: 'none', border: '1px solid rgba(21,33,56,0.05)' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: '#c4a96a', background: 'rgba(196,169,106,0.1)', padding: '4px 12px', borderRadius: '4px' }}>{camp.category}</span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#152138', margin: '16px 0' }}>{camp.title}</h3>
              <p style={{ color: 'rgba(21,33,56,0.6)', fontSize: '15px', lineHeight: 1.6, marginBottom: '24px' }}>{camp.subtitle}</p>
              <span style={{ color: '#c4a96a', fontSize: '13px', fontWeight: 'bold' }}>Ver detalhes &rarr;</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}