'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Briefcase,
  Building,
  FileText,
  Gavel,
  Home,
  Laptop,
  Landmark,
  Receipt,
  Scale,
  Shield,
  ShieldAlert,
  ShoppingBag,
} from 'lucide-react'

const iconMap: Record<string, any> = {
  shield: Shield,
  scale: Scale,
  'shopping-bag': ShoppingBag,
  home: Home,
  receipt: Receipt,
  'file-text': FileText,
  gavel: Gavel,
  laptop: Laptop,
  landmark: Landmark,
  building: Building,
  briefcase: Briefcase,
  'shield-alert': ShieldAlert,
}

interface PracticeAreasGridProps {
  cmsAreas?: any[]
  showTitle?: boolean
  featuredOnly?: boolean
}

const featuredAreaOrder = ['licitacoes', 'direito-digital', 'direito-civil', 'direito-penal']

const fallbackAreas = [
  {
    title: 'Licitações e Contratos',
    slug: 'licitacoes',
    icon: 'file-text',
    shortDescription: 'Assessoria completa em licitações, recursos, editais e contratos administrativos.',
  },
  {
    title: 'Direito Digital',
    slug: 'direito-digital',
    icon: 'shield',
    shortDescription: 'Proteção de dados, privacidade, LGPD, contratos digitais e conflitos em plataformas.',
  },
  {
    title: 'Direito Civil',
    slug: 'direito-civil',
    icon: 'scale',
    shortDescription: 'Contratos, responsabilidade civil, cobranças, indenizações e conflitos patrimoniais.',
  },
  {
    title: 'Direito Penal',
    slug: 'direito-penal',
    icon: 'gavel',
    shortDescription: 'Defesa técnica em investigações, flagrantes, audiências de custódia e medidas urgentes.',
    is24h: true,
  },
]

function areaPriority(area: any): number {
  const slug = String(area?.slug || '').toLowerCase()
  const title = String(area?.title || '').toLowerCase()
  const exact = featuredAreaOrder.indexOf(slug)

  if (exact >= 0) return exact
  if (title.includes('licita') || title.includes('contrato')) return 0
  if (title.includes('digital') || title.includes('lgpd')) return 1
  if (title.includes('civil')) return 2
  if (title.includes('penal') || title.includes('criminal')) return 3

  return 99
}

export function PracticeAreasGrid({ cmsAreas = [], showTitle = true, featuredOnly = false }: PracticeAreasGridProps) {
  const sourceAreas = cmsAreas.length > 0 ? cmsAreas : fallbackAreas
  const areas = sourceAreas.length > 0
    ? [...sourceAreas]
        .sort((a, b) => {
          const priorityDiff = areaPriority(a) - areaPriority(b)
          if (priorityDiff !== 0) return priorityDiff
          return Number(a.order || 0) - Number(b.order || 0)
        })
        .filter((area) => !featuredOnly || areaPriority(area) < 99)
        .slice(0, featuredOnly ? 4 : sourceAreas.length)
    : []

  if (areas.length === 0) return null

  return (
    <section className="ca-practice" aria-labelledby={showTitle ? 'practice-title' : undefined}>
      <div className="ca-practice__inner">
        {showTitle && (
          <div className="ca-section-heading ca-practice__heading">
            <span className="ca-eyebrow">Especialidades</span>
            <h2 id="practice-title">Áreas de atuação</h2>
            <p>
              Atuação concentrada nos eixos estratégicos do escritório, com leitura técnica do caso e comunicação clara
              desde o primeiro contato.
            </p>
          </div>
        )}

        <div className="ca-practice__grid">
          {areas.map((area: any, i: number) => {
            const is24h = area.is24h === true || area.is24h === 'true' || area.slug === 'direito-penal'
            const IconComponent = iconMap[area.icon] || Scale

            return (
              <Link
                key={area.slug || i}
                href={`/areas-de-atuacao/${area.slug}`}
                className={is24h ? 'ca-practice-card ca-practice-card--urgent' : 'ca-practice-card'}
              >
                <span className="ca-practice-card__index">{String(i + 1).padStart(2, '0')}</span>
                {is24h && <span className="ca-practice-card__badge">24h</span>}
                <IconComponent className="ca-practice-card__icon" aria-hidden="true" />
                <h3>{area.title}</h3>
                <p>{area.shortDescription || area.short_description || area.heroHeadline}</p>
                <span className="ca-practice-card__link">
                  Saiba mais <ArrowRight aria-hidden="true" />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
