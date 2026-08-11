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

const defaultTimeline = [
  {
    year: 'Atuação',
    title: 'Estratégia antes do volume',
    description: 'Cada caso é analisado por risco, prova, urgência e viabilidade antes da definição do caminho jurídico.',
  },
  {
    year: 'Método',
    title: 'Comunicação clara',
    description: 'O cliente recebe orientação objetiva sobre próximos passos, documentos necessários e possíveis cenários.',
  },
  {
    year: 'Natal/RN',
    title: 'Presença institucional',
    description: 'Atendimento em Natal/RN com suporte remoto quando a rotina do caso permite mais agilidade.',
  },
]

const defaultValues = [
  {
    icon: 'scale',
    title: 'Critério técnico',
    description: 'Atuação sustentada por análise jurídica, leitura do contexto e decisões documentadas.',
  },
  {
    icon: 'shield',
    title: 'Discrição',
    description: 'Tratamento cuidadoso de informações sensíveis, especialmente em casos empresariais, digitais e penais.',
  },
  {
    icon: 'users',
    title: 'Proximidade',
    description: 'Contato direto e acompanhamento compatível com a urgência e a complexidade de cada demanda.',
  },
]

function getInitials(name: string): string {
  const clean = name.replace(/^(Dr\.|Dra\.|Prof\.)\s*/i, '').trim()
  const parts = clean.split(/\s+/)
  return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : parts[0]?.[0]?.toUpperCase() || '?'
}

export function AboutPageClient({ homepage, siteConfig }: { homepage: any; siteConfig: any }) {
  const aboutTitle = siteConfig?.aboutTitle || 'Sobre o Escritório'
  const aboutSubtitle = siteConfig?.aboutSubtitle || 'Advocacia com estratégia, técnica e presença institucional.'
  const aboutHistory =
    siteConfig?.aboutHistory ||
    'O Cavalcante Albuquerque atua com foco em demandas que exigem leitura estratégica, organização documental e resposta técnica. O escritório combina atuação consultiva e contenciosa para orientar decisões em Licitações e Contratos, Direito Digital, Direito Civil e Direito Penal.'

  const timeline = siteConfig?.aboutTimeline?.length
    ? siteConfig.aboutTimeline.map((item: any) => ({
        year: item.year,
        title: item.title,
        description: item.description,
      }))
    : defaultTimeline

  const values = siteConfig?.aboutValues?.length
    ? siteConfig.aboutValues.map((item: any) => ({
        icon: item.icon || 'scale',
        title: item.title,
        description: item.description,
      }))
    : defaultValues

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
          <Image src="/brand/brand-symbol-transparent.webp" alt="" width={360} height={360} unoptimized />
        </div>
        <div className="container-wide mx-auto ca-page-hero__inner">
          <span className="ca-eyebrow ca-eyebrow--dark">Quem somos</span>
          <h1>{aboutTitle}</h1>
          <p>{aboutSubtitle}</p>
          <div className="ca-page-hero__proof" aria-label="Diferenciais do escritório">
            <article>
              <span>01</span>
              <strong>Estratégia jurídica</strong>
              <p>Diagnóstico do caso antes da ação.</p>
            </article>
            <article>
              <span>02</span>
              <strong>Atuação técnica</strong>
              <p>Base documental, precedentes e risco.</p>
            </article>
            <article>
              <span>03</span>
              <strong>Natal/RN</strong>
              <p>Presença local e atendimento remoto.</p>
            </article>
          </div>
        </div>
      </section>

      {(aboutHistory || timeline.length > 0) && (
        <section className="ca-story">
          <div className="container-wide mx-auto ca-story__inner">
            {aboutHistory && (
              <div className="ca-story__copy">
                <span className="ca-eyebrow">Trajetória</span>
                <h2>Nossa história</h2>
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
              <span className="ca-eyebrow">Princípios</span>
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
