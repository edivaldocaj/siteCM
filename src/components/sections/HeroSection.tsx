'use client'

import Image from 'next/image'
import { Calendar, MessageCircle } from 'lucide-react'

interface HeroSectionProps {
  cmsData?: {
    heroTitle?: string
    heroSubtitle?: string
    heroButtonText?: string
  } | null
}

export function HeroSection({ cmsData }: HeroSectionProps) {
  const buttonText = cmsData?.heroButtonText || 'Fale com um advogado'
  const title = cmsData?.heroTitle || 'Advocacia com estrategia e solidez.'
  const subtitle = cmsData?.heroSubtitle || 'Atendimento juridico em Natal/RN com analise tecnica, comunicacao direta e acompanhamento cuidadoso em cada etapa do caso.'
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985'
  const whatsappMessage = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || 'Ola! Gostaria de falar com um advogado.'

  return (
    <section className="ca-hero" aria-labelledby="home-hero-title">
      <div className="ca-hero__media" aria-hidden="true" />
      <div className="ca-hero__shade" aria-hidden="true" />
      <div className="ca-hero__mark" aria-hidden="true">
        <Image src="/brand/symbol-mono-light.svg" alt="" width={420} height={420} priority />
      </div>

      <div className="ca-hero__inner">
        <div className="ca-hero__content">
          <div className="ca-hero__brand-lockup">
            <Image
              src="/brand/lockup-light.svg"
              alt="Cavalcante Albuquerque"
              width={330}
              height={86}
              className="ca-hero__lockup"
              priority
            />
            <div className="ca-hero__brand-text" aria-hidden="true">
              <strong>Cavalcante Albuquerque</strong>
              <span>Sociedade de Advogados</span>
            </div>
          </div>

          <div className="ca-hero__rule" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          <p className="ca-hero__eyebrow">Advocacia e Consultoria - Natal/RN</p>

          <h1 id="home-hero-title" className="ca-hero__title">
            {title}
          </h1>

          <p className="ca-hero__subtitle">{subtitle}</p>

          <div className="ca-hero__actions">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ca-btn ca-btn--whatsapp"
            >
              <MessageCircle aria-hidden="true" />
              {buttonText}
            </a>
            <a href="/contato" className="ca-btn ca-btn--invert">
              <Calendar aria-hidden="true" />
              Agendar consulta
            </a>
          </div>

          <dl className="ca-hero__signals" aria-label="Diferenciais do atendimento">
            <div>
              <dt>Atendimento</dt>
              <dd>Direto com advogado</dd>
            </div>
            <div>
              <dt>Metodo</dt>
              <dd>Analise tecnica do caso</dd>
            </div>
            <div>
              <dt>Urgencia</dt>
              <dd>Plantao criminal 24h</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
