'use client'

import Link from 'next/link'
import { AlertTriangle, ArrowRight, Landmark, MonitorCheck, Shield } from 'lucide-react'

const iconMap: Record<string, any> = {
  consumidor: AlertTriangle,
  digital: MonitorCheck,
  criminal: Shield,
  imobiliario: Landmark,
  tributario: Landmark,
}

const categoryLabels: Record<string, string> = {
  consumidor: 'Consumidor',
  digital: 'LGPD / Digital',
  criminal: 'Criminal',
  imobiliario: 'Imobiliario',
  tributario: 'Tributario',
}

interface FeaturedCampaignsProps {
  cmsCampaigns?: any[]
  cmsData?: {
    title?: string
    subtitle?: string
  } | null
}

export function FeaturedCampaigns({ cmsCampaigns = [], cmsData }: FeaturedCampaignsProps) {
  if (cmsCampaigns.length === 0) return null

  return (
    <section className="ca-campaigns" aria-labelledby="featured-campaigns-title">
      <div className="container-wide mx-auto">
        <div className="ca-section-heading">
          <span className="ca-eyebrow">Acoes em andamento</span>
          <h2 id="featured-campaigns-title">{cmsData?.title || 'Campanhas juridicas'}</h2>
          <p>{cmsData?.subtitle || 'Acompanhe frentes de atendimento individual e coletivo abertas pelo escritorio.'}</p>
        </div>

        <div className="ca-campaigns__grid">
          {cmsCampaigns.map((campaign: any) => {
            const catKey = campaign.category || 'consumidor'
            const IconComponent = iconMap[catKey] || AlertTriangle

            return (
              <Link key={campaign.slug} href={`/campanhas/${campaign.slug}`} className="ca-campaigns__card">
                <span className="ca-campaigns__topline">
                  {categoryLabels[catKey] || catKey}
                  <IconComponent size={20} />
                </span>
                <h3>{campaign.title}</h3>
                {campaign.subtitle && <p>{campaign.subtitle}</p>}
                <span className="ca-inline-link">
                  Verificar meu caso
                  <ArrowRight size={15} />
                </span>
              </Link>
            )
          })}
        </div>

        <Link href="/campanhas" className="btn-primary ca-campaigns__all">
          Ver todas as campanhas
        </Link>
      </div>
    </section>
  )
}
