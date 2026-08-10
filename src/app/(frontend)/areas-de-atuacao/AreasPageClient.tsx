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

export function AreasPageClient({ areas, siteConfig }: { areas: any[]; siteConfig: any }) {
  const practiceTitle = siteConfig?.practiceTitle || 'Áreas de Atuação'
  const practiceSubtitle =
    siteConfig?.practiceSubtitle ||
    'Atuação estratégica em áreas essenciais do Direito, com leitura técnica do caso e comunicação clara desde o primeiro contato.'
  const list = areas.length > 0 ? [...areas] : []

  return (
    <>
      <section className="ca-page-hero ca-page-hero--areas">
        <div className="ca-page-hero__image" aria-hidden="true">
          <Image src="/brand/areas-presentation.webp" alt="" fill sizes="100vw" priority />
        </div>
        <div className="ca-page-hero__mark" aria-hidden="true">
          <Image src="/brand/symbol-mono-light.svg" alt="" width={360} height={360} unoptimized />
        </div>
        <div className="container-wide mx-auto ca-page-hero__inner">
          <span className="ca-eyebrow ca-eyebrow--dark">Especialidades</span>
          <h1>{practiceTitle}</h1>
          <p>{practiceSubtitle}</p>
        </div>
      </section>

      <section className="ca-areas-list">
        <div className="container-wide mx-auto">
          {list.length > 0 ? (
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
          ) : (
            <div className="ca-empty-state">
              <span className="ca-eyebrow">Conteúdo em revisão</span>
              <h2>Áreas de atuação serão publicadas pelo CMS</h2>
              <p>Assim que o banco for inicializado e o conteúdo aprovado, esta listagem será exibida automaticamente.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
