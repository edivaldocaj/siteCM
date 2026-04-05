'use client'

import Link from 'next/link'
import { ArrowRight, AlertTriangle, Shield, Smartphone } from 'lucide-react'

const iconMap: Record<string, any> = {
  consumidor: AlertTriangle,
  digital: Shield,
  criminal: Smartphone,
  imobiliario: AlertTriangle,
  tributario: AlertTriangle,
}

const defaultCampaigns = [
  {
    slug: 'fraudes-bancarias',
    title: 'Fraudes Bancárias',
    category: 'consumidor',
    subtitle: 'Cobranças abusivas? Você pode ter direito a restituição.',
  },
  {
    slug: 'vazamento-de-dados',
    title: 'Vazamento de Dados',
    category: 'digital',
    subtitle: 'Seus dados foram expostos? Você tem direito a indenização.',
  },
  {
    slug: 'golpes-online',
    title: 'Golpes Online',
    category: 'digital',
    subtitle: 'Caiu em um golpe digital? Saiba como recuperar seu dinheiro.',
  },
]

const categoryLabels: Record<string, string> = {
  consumidor: 'Consumidor',
  digital: 'LGPD / Digital',
  criminal: 'Criminal',
  imobiliario: 'Imobiliário',
  tributario: 'Tributário',
}

interface FeaturedCampaignsProps {
  cmsCampaigns?: any[]
  cmsData?: {
    title?: string
    subtitle?: string
  } | null
}

export function FeaturedCampaigns({ cmsCampaigns = [], cmsData }: FeaturedCampaignsProps) {
  const campaigns = cmsCampaigns.length > 0 ? cmsCampaigns : defaultCampaigns
  const sectionTitle = cmsData?.title || 'Campanhas Jurídicas'
  const sectionSubtitle = cmsData?.subtitle || 'Ações coletivas e individuais em andamento. Verifique se o seu caso se encaixa.'

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-wide mx-auto">
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span style={{
            color: 'var(--color-brand-gold-dark)',
            fontSize: '12px',
            fontFamily: 'var(--font-body)',
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            display: 'block',
            marginBottom: '16px',
          }}>
            Ações em Andamento
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            fontWeight: 600,
            color: 'var(--color-brand-navy)',
            marginBottom: '24px',
          }}>
            {sectionTitle}
          </h2>
          <p style={{
            color: 'rgba(21,33,56,0.6)',
            fontFamily: 'var(--font-body)',
            fontSize: '18px',
            maxWidth: '40rem',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            {sectionSubtitle}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          {campaigns.map((campaign: any) => {
            const catKey = campaign.category || 'consumidor'
            const IconComponent = iconMap[catKey] || AlertTriangle

            return (
              <Link
                key={campaign.slug}
                href={`/campanhas/${campaign.slug}`}
                className="campaign-card"
                style={{
                  display: 'block',
                  background: 'white',
                  borderRadius: '8px',
                  padding: '32px',
                  border: '1px solid rgba(196,169,106,0.1)',
                  textDecoration: 'none',
                  transition: 'all 0.5s',
                  height: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <span style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-body)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    color: 'var(--color-brand-gold-dark)',
                    background: 'rgba(196,169,106,0.1)',
                    padding: '4px 12px',
                    borderRadius: '2px',
                  }}>
                    {categoryLabels[catKey] || catKey}
                  </span>
                  <IconComponent style={{
                    width: '32px',
                    height: '32px',
                    color: 'rgba(21,33,56,0.2)',
                    transition: 'color 0.3s',
                  }} />
                </div>

                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '20px',
                  fontWeight: 600,
                  color: 'var(--color-brand-navy)',
                  marginBottom: '12px',
                  transition: 'color 0.3s',
                }}>
                  {campaign.title}
                </h3>

                <p style={{
                  color: 'rgba(21,33,56,0.5)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  marginBottom: '24px',
                }}>
                  {campaign.subtitle}
                </p>

                <span style={{
                  color: 'var(--color-brand-gold-dark)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'gap 0.3s',
                }}>
                  Verificar meu caso <ArrowRight style={{ width: '14px', height: '14px' }} />
                </span>
              </Link>
            )
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link href="/campanhas" className="btn-primary">
            Ver Todas as Campanhas
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .campaign-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
        .campaign-card:hover h3 { color: var(--color-brand-gold-dark) !important; }
        .campaign-card:hover svg { color: var(--color-brand-gold-dark) !important; }
      `}} />
    </section>
  )
}
