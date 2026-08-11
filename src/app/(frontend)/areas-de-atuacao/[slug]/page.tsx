import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Check, HelpCircle, Phone } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

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
    if (!area) return { title: 'Área não encontrada | Cavalcante Albuquerque' }

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
      title: 'Áreas de atuação | Cavalcante Albuquerque',
      description: 'Áreas de atuação jurídica do escritório Cavalcante Albuquerque.',
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
  const headline = area.heroHeadline || area.shortDescription || ''
  const description = area.shortDescription || ''
  const cases = area.caseTypes?.map((item: any) => item.name).filter(Boolean) || []
  const faq = area.faq || []
  const isPenal = slug === 'direito-penal' || area?.is24h === true

  return (
    <>
      <section className={isPenal ? 'ca-area-detail-hero ca-area-detail-hero--urgent' : 'ca-area-detail-hero'}>
        <div className="ca-page-hero__image" aria-hidden="true">
          <Image src="/brand/cover-areas.jpg" alt="" fill sizes="100vw" priority />
        </div>
        <div className="ca-page-hero__mark" aria-hidden="true">
          <Image src="/brand/brand-symbol-transparent.webp" alt="" width={360} height={360} unoptimized />
        </div>
        <div className="container-narrow mx-auto ca-area-detail-hero__inner">
          <Link href="/areas-de-atuacao" className="ca-back-link">
            <ArrowLeft size={16} />
            Áreas de Atuação
          </Link>
          {isPenal && <span className="ca-area-detail-hero__badge">Atendimento 24h</span>}
          <h1>{title}</h1>
          {headline && <p>{headline}</p>}
        </div>
      </section>

      <section className="ca-area-detail">
        <div className="container-narrow mx-auto">
          {description && <p className="ca-area-detail__lead">{description}</p>}

          {cases.length > 0 && (
            <section className="ca-area-detail__block" aria-labelledby="area-cases-title">
              <div className="ca-section-heading">
                <span className="ca-eyebrow">Escopo</span>
                <h2 id="area-cases-title">Tipos de casos</h2>
              </div>
              <div className="ca-area-detail__cases">
                {cases.map((caseName: string) => (
                  <article key={caseName}>
                    <Check size={18} />
                    <span>{caseName}</span>
                  </article>
                ))}
              </div>
            </section>
          )}

          {faq.length > 0 && (
            <section className="ca-area-detail__block" aria-labelledby="area-faq-title">
              <div className="ca-section-heading">
                <span className="ca-eyebrow">Dúvidas comuns</span>
                <h2 id="area-faq-title">Perguntas frequentes</h2>
              </div>
              <div className="ca-area-detail__faq">
                {faq.map((item: any) => (
                  <article key={item.question || item.q}>
                    <HelpCircle size={20} />
                    <div>
                      <h3>{item.question || item.q}</h3>
                      <p>{item.answer || item.a}</p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          <aside className={isPenal ? 'ca-area-detail__cta ca-area-detail__cta--urgent' : 'ca-area-detail__cta'}>
            <h2>{isPenal ? 'Precisa de ajuda urgente?' : 'Tem um caso nessa área?'}</h2>
            <p>Fale com um advogado para uma primeira leitura técnica do seu caso.</p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985'}?text=${encodeURIComponent(`Olá! Preciso de orientação sobre ${title}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <Phone size={18} />
              Falar com advogado
            </a>
          </aside>
        </div>
      </section>
    </>
  )
}
