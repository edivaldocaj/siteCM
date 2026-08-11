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
  civil: 'Civil',
  penal: 'Penal',
  licitacoes: 'Licitações',
  imobiliario: 'Imobiliário',
  tributario: 'Tributário',
}

const fallbackCampaigns = [
  {
    slug: 'triagem-licitacoes',
    title: 'Triagem para Licitações e Contratos',
    subtitle: 'Análise inicial de edital, habilitação, recurso, impugnação ou execução de contrato administrativo.',
    category: 'licitacoes',
    href: '/contato',
  },
  {
    slug: 'triagem-direito-digital',
    title: 'Conflitos digitais e proteção de dados',
    subtitle: 'Orientação inicial sobre LGPD, incidentes, remoção de conteúdo, contratos digitais e plataformas.',
    category: 'digital',
    href: '/contato',
  },
  {
    slug: 'triagem-penal-urgente',
    title: 'Atendimento penal urgente',
    subtitle: 'Canal de triagem para flagrante, investigação, audiência de custódia e medidas cautelares.',
    category: 'penal',
    href: '/contato',
  },
]

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

  const campaignItems = campaigns.length > 0 ? campaigns : fallbackCampaigns

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
          <div className="ca-page-hero__proof" aria-label="Modelo de triagem das campanhas">
            <article>
              <span>01</span>
              <strong>Enquadramento</strong>
              <p>Verificação inicial do tipo de caso e documentos.</p>
            </article>
            <article>
              <span>02</span>
              <strong>Risco e prazo</strong>
              <p>Leitura da urgência, prova disponível e medidas cabíveis.</p>
            </article>
            <article>
              <span>03</span>
              <strong>Próximo passo</strong>
              <p>Direcionamento para consulta, análise ou atuação emergencial.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="ca-campaigns-page">
        <div className="container-wide mx-auto">
          <div className="ca-section-heading ca-section-heading--split">
            <div>
              <span className="ca-eyebrow">{campaigns.length > 0 ? 'Campanhas ativas' : 'Frentes de triagem'}</span>
              <h2>{campaigns.length > 0 ? 'Verifique se seu caso se encaixa' : 'Atendimentos prioritários enquanto campanhas são revisadas'}</h2>
            </div>
            <p>{campaigns.length > 0 ? 'Cada campanha organiza uma hipótese de atendimento com perguntas objetivas e próximos passos.' : 'Quando o CMS publicar campanhas ativas, esta página passa a exibir as páginas específicas automaticamente.'}</p>
          </div>

          <div className="ca-campaigns-page__grid">
            {campaignItems.map((campaign: any) => (
                <Link key={campaign.slug} href={campaign.href || `/campanhas/${campaign.slug}`} className="ca-campaigns-page__card">
                  <span className="ca-campaigns-page__category">{categoryLabels[campaign.category] || campaign.category || 'Campanha'}</span>
                  <h2>{campaign.title}</h2>
                  {campaign.subtitle && <p>{campaign.subtitle}</p>}
                  <span className="ca-inline-link">
                    {campaign.href ? 'Falar com o escritório' : 'Verificar meu caso'}
                    <ArrowRight size={15} />
                  </span>
                </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
