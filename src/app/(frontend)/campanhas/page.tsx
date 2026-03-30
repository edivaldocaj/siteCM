import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const revalidate = 1800

export const metadata: Metadata = {
  title: 'Campanhas Jurídicas',
  description: 'Campanhas jurídicas ativas da Cavalcante & Melo. Verifique se seu caso se encaixa.',
}

export default async function CampanhasPage() {
  let campaigns: any[] = []

  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'campaigns',
      where: { status: { equals: 'active' } },
      sort: '-createdAt',
      limit: 20,
    })
    campaigns = result.docs
  } catch (e) {
    console.error('[Campanhas] Error:', e)
  }

  return (
    <>
      <section style={{ background: 'linear-gradient(135deg, #152138 0%, #1c2d4a 50%, #0e1628 100%)', paddingTop: '128px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 16px' }}>
          <span style={{ color: '#c4a96a', fontSize: '12px', fontFamily: "'Source Sans 3', sans-serif", textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '16px', display: 'block' }}>Ações em Andamento</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 600, color: '#f1eae2', lineHeight: 1.1, marginBottom: '24px' }}>Campanhas Jurídicas</h1>
          <p style={{ color: 'rgba(184,191,200,0.7)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '18px', maxWidth: '42rem', lineHeight: 1.6 }}>Ações coletivas e individuais em andamento. Verifique se o seu caso se encaixa.</p>
        </div>
      </section>

      <section style={{ padding: '80px 16px', backgroundColor: '#faf8f5' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          {campaigns.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <p style={{ color: 'rgba(21,33,56,0.5)', fontSize: '18px' }}>Nenhuma campanha ativa no momento.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {campaigns.map((campaign: any) => (
                <Link
                  key={campaign.slug}
                  href={`/campanhas/${campaign.slug}`}
                  style={{ display: 'block', background: 'white', borderRadius: '8px', padding: '32px', border: '1px solid rgba(237,225,195,0.1)', transition: 'all 0.3s', textDecoration: 'none', height: '100%' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <span style={{ fontSize: '11px', fontFamily: "'Source Sans 3', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em', color: '#c4a96a', background: 'rgba(237,225,195,0.1)', padding: '4px 12px', borderRadius: '2px' }}>
                      {campaign.category}
                    </span>
                  </div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 600, color: '#152138', marginBottom: '12px' }}>
                    {campaign.title}
                  </h2>
                  <p style={{ color: 'rgba(21,33,56,0.5)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
                    {campaign.subtitle}
                  </p>
                  <span style={{ color: '#c4a96a', fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Verificar meu caso →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
