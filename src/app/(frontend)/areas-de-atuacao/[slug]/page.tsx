import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Phone, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://cavalcantealbuquerque.com.br').replace(/\/$/, '')

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params

  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await (payload as any).find({
      collection: 'practice-areas',
      where: { slug: { equals: slug } },
      depth: 0,
      limit: 1,
    })

    const area = docs?.[0]
    if (!area) {
      return {
        title: 'Area nao encontrada | Cavalcante Albuquerque',
      }
    }

    const title = area.seo?.metaTitle || area.title
    const description = area.seo?.metaDescription || area.shortDescription || area.heroHeadline || ''
    const canonical = `${siteUrl}/areas-de-atuacao/${slug}`
    const imageUrl = `${siteUrl}/brand/cover-areas-og.jpg`

    return {
      title: `${title} | Cavalcante Albuquerque`,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        type: 'website',
        url: canonical,
        images: [{ url: imageUrl, width: 1200, height: 630 }],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
    }
  } catch {
    return {
      title: 'Areas de atuacao | Cavalcante Albuquerque',
      description: 'Areas de atuacao juridica do escritorio Cavalcante Albuquerque.',
    }
  }
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let area: any = null
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await (payload as any).find({
      collection: 'practice-areas',
      where: { slug: { equals: slug } },
    })
    if (docs?.[0]) area = docs[0]
  } catch {}

  if (!area) notFound()

  const title = area.title || ''
  const headline = area.heroHeadline || ''
  const description = area.shortDescription || ''
  const cases = area.caseTypes?.map((c: any) => c.name) || []
  const faq = area.faq || []
  const isPenal = slug === 'direito-penal' || area?.is24h === true

  return (
    <>
      <section style={{ background: isPenal ? 'linear-gradient(135deg, var(--color-ca-navy-900), var(--color-ca-navy-950))' : 'linear-gradient(135deg, var(--color-ca-navy-950) 0%, var(--color-ca-navy-800) 50%, var(--color-ca-navy-900) 100%)', paddingTop: '128px', paddingBottom: '80px', position: 'relative' }}>
        {isPenal && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, var(--color-ca-urgent), var(--color-ca-steel-500), var(--color-ca-urgent))' }} />}
        <div className="container-wide mx-auto" style={{ padding: '0 24px' }}>
          <Link href="/areas-de-atuacao" style={{ color: 'color-mix(in srgb, var(--color-ca-steel-400) 50%, transparent)', fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <ArrowLeft style={{ width: '16px', height: '16px' }} /> Ãreas de AtuaÃ§Ã£o
          </Link>
          {isPenal && (
            <span style={{ marginLeft: '16px', background: 'var(--color-ca-urgent)', color: 'white', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 12px', borderRadius: '2px' }}>
              Atendimento 24h
            </span>
          )}
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 600, color: 'var(--color-brand-champagne)', lineHeight: 1.1, marginBottom: '16px' }}>
            {title}
          </h1>
          <p style={{ color: 'color-mix(in srgb, var(--color-ca-steel-400) 70%, transparent)', fontFamily: 'var(--font-body)', fontSize: '20px', maxWidth: '40rem' }}>
            {headline}
          </p>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
        <div className="container-narrow mx-auto">
          <p style={{ color: 'color-mix(in srgb, var(--color-ca-navy-950) 70%, transparent)', fontFamily: 'var(--font-body)', fontSize: '18px', lineHeight: 1.7, marginBottom: '48px' }}>
            {description}
          </p>

          {cases.length > 0 && (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 600, color: 'var(--color-brand-navy)', marginBottom: '24px' }}>Tipos de Casos</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '48px' }} className="cases-grid">
                {cases.map((c: string) => (
                  <div key={c} style={{ background: 'white', borderRadius: '8px', padding: '16px', border: '1px solid color-mix(in srgb, var(--color-ca-steel-500) 10%, transparent)', color: 'color-mix(in srgb, var(--color-ca-navy-950) 70%, transparent)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>{c}</div>
                ))}
              </div>
            </>
          )}

          {faq.length > 0 && (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 600, color: 'var(--color-brand-navy)', marginBottom: '24px' }}>Perguntas Frequentes</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px' }}>
                {faq.map((item: any) => (
                  <div key={item.question || item.q} style={{ background: 'white', borderRadius: '8px', padding: '24px', border: '1px solid color-mix(in srgb, var(--color-ca-steel-500) 10%, transparent)' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, color: 'var(--color-brand-navy)', marginBottom: '12px' }}>{item.question || item.q}</h3>
                    <p style={{ color: 'color-mix(in srgb, var(--color-ca-navy-950) 60%, transparent)', fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.6 }}>{item.answer || item.a}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          <div style={{ background: isPenal ? 'linear-gradient(135deg, var(--color-ca-navy-900), var(--color-ca-navy-950))' : 'linear-gradient(135deg, var(--color-ca-navy-950), var(--color-ca-navy-800))', borderRadius: '8px', padding: '48px 32px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 600, color: 'var(--color-brand-champagne)', marginBottom: '16px' }}>
              {isPenal ? 'Precisa de ajuda urgente?' : 'Tem um caso nessa Ã¡rea?'}
            </h2>
            <p style={{ color: 'color-mix(in srgb, var(--color-ca-steel-400) 60%, transparent)', fontFamily: 'var(--font-body)', marginBottom: '24px' }}>Fale com um advogado especialista agora mesmo.</p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985'}?text=${encodeURIComponent(`OlÃ¡! Preciso de orientaÃ§Ã£o sobre ${title}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <Phone style={{ width: '20px', height: '20px' }} />
              Falar com Advogado
            </a>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 640px) { .cases-grid { grid-template-columns: 1fr !important; } }
      `}} />
    </>
  )
}

