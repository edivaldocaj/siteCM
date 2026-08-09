import type { Metadata } from 'next'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://cavalcantealbuquerque.com.br').replace(/\/$/, '')

export const metadata: Metadata = {
  title: 'Campanhas Juridicas',
  description: 'Campanhas juridicas ativas da Cavalcante Albuquerque. Verifique se seu caso se encaixa.',
  alternates: { canonical: `${siteUrl}/campanhas` },
  openGraph: {
    title: 'Campanhas Juridicas',
    description: 'Campanhas juridicas ativas da Cavalcante Albuquerque. Verifique se seu caso se encaixa.',
    url: `${siteUrl}/campanhas`,
    images: [{ url: `${siteUrl}/brand/og-default.jpg`, width: 1200, height: 630 }],
  },
}

export default async function CampanhasPage() {
  let campaigns: any[] = []

  try {
    const payload = await getPayload({ config: configPromise })
    const result = await (payload as any).find({
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
      <section style={{ background: 'linear-gradient(135deg, var(--color-ca-navy-950) 0%, var(--color-ca-navy-800) 50%, var(--color-ca-navy-900) 100%)', paddingTop: '128px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 16px' }}>
          <span style={{ color: 'var(--color-ca-steel-500)', fontSize: '12px', fontFamily: "'Source Sans 3', sans-serif", textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '16px', display: 'block' }}>Ações em Andamento</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 600, color: 'var(--color-ca-platinum-100)', lineHeight: 1.1, marginBottom: '24px' }}>Campanhas Jurídicas</h1>
          <p style={{ color: 'color-mix(in srgb, var(--color-ca-steel-400) 70%, transparent)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '18px', maxWidth: '42rem', lineHeight: 1.6 }}>Ações coletivas e individuais em andamento. Verifique se o seu caso se encaixa.</p>
        </div>
      </section>

      <section style={{ padding: '80px 16px', backgroundColor: 'var(--color-ca-bone)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          {campaigns.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <p style={{ color: 'color-mix(in srgb, var(--color-ca-navy-950) 50%, transparent)', fontSize: '18px' }}>Nenhuma campanha ativa no momento.</p>
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
                    <span style={{ fontSize: '11px', fontFamily: "'Source Sans 3', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-ca-steel-500)', background: 'rgba(237,225,195,0.1)', padding: '4px 12px', borderRadius: '2px' }}>
                      {campaign.category}
                    </span>
                  </div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 600, color: 'var(--color-ca-navy-950)', marginBottom: '12px' }}>
                    {campaign.title}
                  </h2>
                  <p style={{ color: 'color-mix(in srgb, var(--color-ca-navy-950) 50%, transparent)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '14px', lineHeight: 1.6, marginBottom: '24px' }}>
                    {campaign.subtitle}
                  </p>
                  <span style={{ color: 'var(--color-ca-steel-500)', fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
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
