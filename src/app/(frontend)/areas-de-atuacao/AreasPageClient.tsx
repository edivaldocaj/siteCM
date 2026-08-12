'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Briefcase,
  Building,
  FileText,
  Gavel,
  Home,
  Landmark,
  Laptop,
  Receipt,
  Scale,
  Shield,
  ShieldAlert,
  ShoppingBag,
} from 'lucide-react'
import { resolveTeamDisplayName } from '@/lib/team-display'

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

const focusOrder = ['licitacoes', 'direito-digital', 'direito-civil', 'direito-penal']

const fallbackAreas = [
  {
    title: 'Licitações e Contratos',
    slug: 'licitacoes',
    icon: 'file-text',
    shortDescription: 'Apoio em editais, recursos, impugnações, contratos públicos e relações com a administração.',
  },
  {
    title: 'Direito Digital e LGPD',
    slug: 'direito-digital',
    icon: 'shield',
    shortDescription: 'Proteção de dados, contratos digitais, incidentes de segurança e conflitos em plataformas.',
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

export function AreasPageClient({ areas, siteConfig }: { areas: any[]; siteConfig: any }) {
  const practiceTitle = siteConfig?.practiceTitle || 'Áreas de Atuação'
  const practiceSubtitle =
    siteConfig?.practiceSubtitle ||
    'Atuação estratégica em áreas essenciais do Direito, com leitura técnica do caso e comunicação clara desde o primeiro contato.'
  const list = (areas.length > 0 ? [...areas] : fallbackAreas).sort((a: any, b: any) => {
    const aIndex = focusOrder.indexOf(a.slug)
    const bIndex = focusOrder.indexOf(b.slug)
    const normalizedA = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex
    const normalizedB = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex
    return normalizedA - normalizedB
  })

  return (
    <>
      <section className="ca-page-hero ca-page-hero--areas">
        <div className="ca-page-hero__image" aria-hidden="true">
          <Image src="/brand/areas-presentation.webp" alt="" fill sizes="100vw" priority />
        </div>
        <div className="ca-page-hero__mark" aria-hidden="true">
          <Image src="/brand/brand-symbol-transparent.webp" alt="" width={360} height={360} unoptimized />
        </div>
        <div className="container-wide mx-auto ca-page-hero__inner">
          <span className="ca-eyebrow ca-eyebrow--dark">Especialidades</span>
          <h1>{practiceTitle}</h1>
          <p>{practiceSubtitle}</p>
        </div>
      </section>

      <section className="ca-areas-list">
        <div className="container-wide mx-auto">
          <div className="ca-section-heading ca-section-heading--split">
            <div>
              <span className="ca-eyebrow">Frentes principais</span>
              <h2>Especialidades com leitura estratégica do caso</h2>
            </div>
            <p>O atendimento organiza fatos, documentos e urgência para definir o melhor caminho: consultivo, administrativo, contencioso ou emergencial.</p>
          </div>

          <div className="ca-areas-list__grid">
            {list.map((area: any, index: number) => {
              const is24h = area.is24h === true || area.is24h === 'true' || area.slug === 'direito-penal'
              const IconComponent = iconMap[area.icon] || Scale
              const responsibleName = area.responsibleRef || area.byFirm || area.by_firm || area.attorney
                ? resolveTeamDisplayName(area, 'responsibleRef', 'attorney')
                : ''

              return (
                <Link
                  key={area.slug || index}
                  href={`/areas-de-atuacao/${area.slug}`}
                  className={is24h ? 'ca-areas-list__card ca-areas-list__card--urgent' : 'ca-areas-list__card'}
                >
                  <span className="ca-areas-list__index">{String(index + 1).padStart(2, '0')}</span>
                  {is24h && <span className="ca-areas-list__badge">24h</span>}
                  <IconComponent className="ca-areas-list__icon" strokeWidth={1.5} />
                  <h2>{area.title}</h2>
                  {(area.shortDescription || area.short_description) && <p>{area.shortDescription || area.short_description}</p>}
                  {responsibleName && <small>{responsibleName}</small>}
                  <span className="ca-areas-list__link">
                    Saiba mais
                    <ArrowRight size={15} />
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
