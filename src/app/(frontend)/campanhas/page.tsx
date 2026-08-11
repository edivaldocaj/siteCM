import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://cavalcantealbuquerque.com.br').replace(/\/$/, '')

export const metadata: Metadata = {
  title: 'Campanhas Jurídicas',
  description: 'Campanhas jurídicas ativas da Cavalcante Albuquerque. Verifique se seu caso se encaixa.',
  alternates: { canonical: `${siteUrl}/campanhas` },
  openGraph: {
    title: 'Campanhas Jurídicas',
    description: 'Campanhas jurídicas ativas da Cavalcante Albuquerque. Verifique se seu caso se encaixa.',
    url: `${siteUrl}/campanhas`,
    images: [{ url: `${siteUrl}/brand/og-default.jpg`, width: 1200, height: 630 }],
  },
}

const categoryLabels: Record<string, string> = {
  consumidor: 'Consumidor',
  digital: 'LGPD / Digital',
  criminal: 'Criminal',
  imobiliario: 'Imobiliário',
  tributario: 'Tributário',
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
  } catch (error) {
    console.error('[Campanhas] Error:', error)
  }

  return (
    <>
      <section className="ca-page-hero ca-page-hero--campaigns">
        <div className="ca-page-hero__mark" aria-hidden="true">
          <Image src="/brand/brand-symbol-transparent.webp" alt="" width={360} height={360} unoptimized />
        </div>
        <div className="container-wide mx-auto ca-page-hero__inner">
          <span className="ca-eyebrow ca-eyebrow--dark">Ações em andamento</span>
          <h1>Campanhas Jurídicas</h1>
          <p>Acompanhamento de frentes individuais e coletivas com triagem objetiva para identificar se o seu caso se encaixa.</p>
        </div>
      </section>

      <section className="ca-campaigns-page">
        <div className="container-wide mx-auto">
          {campaigns.length === 0 ? (
            <div className="ca-empty-state">
              <span className="ca-eyebrow">Sem campanhas ativas</span>
              <h2>Nenhuma campanha ativa no momento</h2>
              <p>Novas campanhas serão exibidas automaticamente quando forem publicadas no CMS.</p>
            </div>
          ) : (
            <div className="ca-campaigns-page__grid">
              {campaigns.map((campaign: any) => (
                <Link key={campaign.slug} href={`/campanhas/${campaign.slug}`} className="ca-campaigns-page__card">
                  <span className="ca-campaigns-page__category">{categoryLabels[campaign.category] || campaign.category || 'Campanha'}</span>
                  <h2>{campaign.title}</h2>
                  {campaign.subtitle && <p>{campaign.subtitle}</p>}
                  <span className="ca-inline-link">
                    Verificar meu caso
                    <ArrowRight size={15} />
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
