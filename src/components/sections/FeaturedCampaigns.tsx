import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function FeaturedCampaigns({ cmsCampaigns = [] }: { cmsCampaigns?: any[] }) {
  if (!cmsCampaigns || cmsCampaigns.length === 0) return null;

  return (
    <section style={{ padding: '80px 16px', backgroundColor: '#f1eae2' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <span style={{ color: '#c4a96a', fontSize: '12px', fontFamily: "'Source Sans 3', sans-serif", textTransform: 'uppercase', letterSpacing: '0.25em', display: 'block', marginBottom: '16px' }}>Atuação Imediata</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', color: '#152138', margin: '0 0 16px 0', lineHeight: 1.2 }}>Campanhas em Destaque</h2>
          <p style={{ color: 'rgba(21,33,56,0.55)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '17px', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>Conheça nossas campanhas ativas e saiba como podemos defender os seus direitos.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {cmsCampaigns.map((camp: any) => (
            <Link key={camp.slug} href={`/campanhas/${camp.slug}`}
              style={{ display: 'block', background: 'white', padding: '36px', borderRadius: '4px', textDecoration: 'none', border: '1px solid rgba(21,33,56,0.06)', borderTop: '3px solid transparent', boxShadow: '0 4px 20px rgba(21,33,56,0.05)', transition: 'all 0.3s ease' }}
              className="campaign-card-hover">
              <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#c4a96a', background: 'rgba(196,169,106,0.1)', padding: '4px 10px', borderRadius: '2px', fontFamily: "'Source Sans 3', sans-serif", letterSpacing: '0.05em' }}>{camp.category}</span>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '21px', color: '#152138', margin: '16px 0 12px' }}>{camp.title}</h3>
              <p style={{ color: 'rgba(21,33,56,0.6)', fontSize: '15px', fontFamily: "'Source Sans 3', sans-serif", lineHeight: 1.6, marginBottom: '24px' }}>{camp.subtitle}</p>
              <span style={{ color: '#c4a96a', fontSize: '12px', fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                Ver detalhes <ArrowRight style={{ width: '13px', height: '13px' }} />
              </span>
            </Link>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .campaign-card-hover:hover { transform: translateY(-4px); border-top: 3px solid #152138 !important; box-shadow: 0 16px 40px rgba(21,33,56,0.1) !important; }
      `}} />
    </section>
  )
}
