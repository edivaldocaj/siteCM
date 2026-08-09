'use client'

import Link from 'next/link'
import {
  Shield, Scale, ShoppingBag, Home, Receipt,
  FileText, Gavel, Laptop, Landmark, Building,
  Briefcase, ShieldAlert, ArrowRight,
} from 'lucide-react'

const iconMap: Record<string, any> = {
  shield: Shield, scale: Scale, 'shopping-bag': ShoppingBag,
  home: Home, receipt: Receipt, 'file-text': FileText,
  gavel: Gavel, laptop: Laptop, landmark: Landmark,
  building: Building, briefcase: Briefcase, 'shield-alert': ShieldAlert,
}

interface PracticeAreasGridProps {
  cmsAreas?: any[]
  showTitle?: boolean
}

export function PracticeAreasGrid({ cmsAreas = [], showTitle = true }: PracticeAreasGridProps) {
  const areas = cmsAreas.length > 0 ? [...cmsAreas] : []
  if (areas.length === 0) return null

  return (
    <section className="ca-practice" aria-labelledby={showTitle ? 'practice-title' : undefined}>
      <div className="ca-practice__inner">
        {showTitle && (
          <div className="ca-section-heading ca-practice__heading">
            <span className="ca-eyebrow">Especialidades</span>
            <h2 id="practice-title">Areas de atuacao</h2>
            <p>Atuacao juridica organizada por contexto, urgencia e estrategia processual.</p>
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
