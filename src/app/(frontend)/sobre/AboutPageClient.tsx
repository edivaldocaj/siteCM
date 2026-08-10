'use client'

import Image from 'next/image'
import { Award, Heart, MapPin, Phone, Scale, Shield, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const valueIconMap: Record<string, LucideIcon> = {
  scale: Scale,
  users: Users,
  award: Award,
  shield: Shield,
  heart: Heart,
}

function getInitials(name: string): string {
  const clean = name.replace(/^(Dr\.|Dra\.|Prof\.)\s*/i, '').trim()
  const parts = clean.split(/\s+/)
  return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : parts[0]?.[0]?.toUpperCase() || '?'
}

export function AboutPageClient({ homepage, siteConfig }: { homepage: any; siteConfig: any }) {
  const aboutTitle = siteConfig?.aboutTitle || 'Sobre o Escritorio'
  const aboutSubtitle = siteConfig?.aboutSubtitle || 'Advocacia com estratégia, técnica e presença institucional.'
  const aboutHistory = siteConfig?.aboutHistory || ''

  const timeline = siteConfig?.aboutTimeline?.length
    ? siteConfig.aboutTimeline.map((item: any) => ({
        year: item.year,
        title: item.title,
        description: item.description,
      }))
    : []

  const values = siteConfig?.aboutValues?.length
    ? siteConfig.aboutValues.map((item: any) => ({
        icon: item.icon || 'scale',
        title: item.title,
        description: item.description,
      }))
    : []

  const partners = homepage?.aboutPartners?.partnersList?.length
    ? homepage.aboutPartners.partnersList.map((partner: any) => ({
        name: partner.name,
        role: partner.role,
        initials: getInitials(partner.name || ''),
        bio: partner.bio,
        oab: partner.oab,
        areas: (partner.areas || partner.role || '').split(/[,|]/).map((area: string) => area.trim()).filter(Boolean),
        photoUrl: partner.photo?.url || null,
      }))
    : []

  const contactAddress = siteConfig?.contactAddress || ''

  return (
    <>
      <section className="ca-page-hero ca-page-hero--about">
        <div className="ca-page-hero__mark" aria-hidden="true">
          <Image src="/brand/symbol-mono-light.svg" alt="" width={360} height={360} />
        </div>
        <div className="container-wide mx-auto ca-page-hero__inner">
          <span className="ca-eyebrow ca-eyebrow--dark">Quem somos</span>
          <h1>{aboutTitle}</h1>
          <p>{aboutSubtitle}</p>
        </div>
      </section>

      {(aboutHistory || timeline.length > 0) && (
        <section className="ca-story">
          <div className="container-wide mx-auto ca-story__inner">
            {aboutHistory && (
              <div className="ca-story__copy">
                <span className="ca-eyebrow">Trajetoria</span>
                <h2>Nossa historia</h2>
                <p>{aboutHistory}</p>
              </div>
            )}

            {timeline.length > 0 && (
              <div className="ca-story__timeline" aria-label="Linha do tempo do escritorio">
                {timeline.map((item: any) => (
                  <article key={`${item.year}-${item.title}`}>
                    <span>{item.year}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {values.length > 0 && (
        <section className="ca-values">
          <div className="container-wide mx-auto">
            <div className="ca-section-heading">
              <span className="ca-eyebrow">Principios</span>
              <h2>Nossos valores</h2>
            </div>
            <div className="ca-values__grid">
              {values.map((value: any) => {
                const IconComp = valueIconMap[value.icon] || Scale
                return (
                  <article className="ca-values__card" key={value.title}>
                    <IconComp size={34} strokeWidth={1.5} />
                    <h3>{value.title}</h3>
                    <p>{value.description}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {partners.length > 0 && (
        <section className="ca-about-team ca-about-team--page">
          <div className="container-wide mx-auto">
            <div className="ca-section-heading ca-section-heading--split">
              <div>
                <span className="ca-eyebrow">Equipe</span>
                <h2>Quem conduz o seu caso</h2>
              </div>
              <p>Atendimento jurídico conduzido por profissionais responsáveis pela estratégia, comunicação e acompanhamento do caso.</p>
            </div>

            <div className="ca-about-team__grid">
              {partners.map((partner: any) => (
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
                    {partner.bio && <p className="ca-about-team__bio">{partner.bio}</p>}
                    {partner.areas.length > 0 && (
                      <div className="ca-about-team__tags">
                        {partner.areas.map((area: string) => (
                          <span key={area}>{area}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {contactAddress && (
        <section className="ca-location-band">
          <div className="container-narrow mx-auto">
            <MapPin size={30} />
            <p>{contactAddress}</p>
            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985'}`} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <Phone size={16} />
              Fale com um advogado
            </a>
          </div>
        </section>
      )}
    </>
  )
}
