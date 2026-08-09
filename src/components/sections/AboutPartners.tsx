'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

function getInitials(name: string): string {
  const clean = name.replace(/^(Dr\.|Dra\.|Prof\.|Sr\.|Sra\.)\s*/i, '').trim()
  const parts = clean.split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return parts[0]?.[0]?.toUpperCase() || '?'
}

interface AboutPartnersProps {
  cmsData?: {
    sectionTitle?: string
    sectionDescription?: string
    partnersList?: any[]
  } | null
}

export function AboutPartners({ cmsData }: AboutPartnersProps) {
  const partners = cmsData?.partnersList?.length
    ? cmsData.partnersList.map((partner: any) => ({
        name: partner.name || '',
        role: partner.role || '',
        areas: partner.areas
          ? partner.areas.split(/[,|]/).map((area: string) => area.trim()).filter(Boolean)
          : partner.role.split(/[,|]/).map((area: string) => area.trim()).filter(Boolean),
        initials: getInitials(partner.name || ''),
        bio: partner.bio || '',
        oab: partner.oab || '',
        photoUrl: partner.photo?.url || null,
      }))
    : []

  if (partners.length === 0) return null

  return (
    <section className="ca-about-team" aria-labelledby="about-partners-title">
      <div className="container-wide mx-auto">
        <div className="ca-section-heading ca-section-heading--split">
          <div>
            <span className="ca-eyebrow">Quem Somos</span>
            <h2 id="about-partners-title">{cmsData?.sectionTitle || 'Quem conduz o seu caso'}</h2>
          </div>
          {cmsData?.sectionDescription && <p>{cmsData.sectionDescription}</p>}
        </div>

        <div className="ca-about-team__grid">
          {partners.map((partner) => (
            <article className="ca-about-team__card" key={partner.name}>
              <div className="ca-about-team__portrait">
                {partner.photoUrl ? (
                  <Image src={partner.photoUrl} alt={partner.name} width={168} height={168} />
                ) : (
                  <span>{partner.initials}</span>
                )}
              </div>
              <div className="ca-about-team__body">
                <h3>{partner.name}</h3>
                <p className="ca-about-team__role">{partner.role}</p>
                {partner.oab && <p className="ca-about-team__oab">{partner.oab}</p>}
                {partner.areas.length > 0 && (
                  <div className="ca-about-team__tags">
                    {partner.areas.map((area: string) => (
                      <span key={area}>{area}</span>
                    ))}
                  </div>
                )}
                {partner.bio && <p className="ca-about-team__bio">{partner.bio}</p>}
              </div>
            </article>
          ))}
        </div>

        <Link href="/sobre" className="ca-inline-link ca-about-team__link">
          Conheca nossa historia
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}
