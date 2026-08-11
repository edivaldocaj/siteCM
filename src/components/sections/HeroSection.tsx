'use client'

import Image from 'next/image'
import { ArrowRight, MapPin, MessageCircle } from 'lucide-react'

interface HeroSectionProps {
  cmsData?: {
    heroTitle?: string
    heroSubtitle?: string
    heroButtonText?: string
  } | null
}

export function HeroSection({ cmsData }: HeroSectionProps) {
  const buttonText = cmsData?.heroButtonText || 'Fale com um advogado'
  const title = cmsData?.heroTitle || 'Advocacia estratégica. Soluções que geram segurança e resultados.'
  const subtitle =
    cmsData?.heroSubtitle ||
    'Atuação técnica e personalizada em Licitações e Contratos, Direito Digital, Direito Civil e Direito Penal.'
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985'
  const whatsappMessage = process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || 'Olá! Gostaria de falar com um advogado.'

  return (
    <section className="ca-hero" aria-labelledby="home-hero-title">
      <div className="ca-hero__media" aria-hidden="true">
        <Image src="/brand/watermark-transparent.webp" alt="" width={898} height={278} priority />
      </div>
      <div className="ca-hero__shade" aria-hidden="true" />
      <div className="ca-hero__mark" aria-hidden="true">
        <Image src="/brand/brand-symbol-transparent.webp" alt="" width={520} height={520} priority />
      </div>

      <div className="ca-hero__inner">
        <div className="ca-hero__content">
          <p className="ca-hero__eyebrow">Advocacia e Consultoria - Natal/RN</p>

          <h1 id="home-hero-title" className="ca-hero__title">
            {title}
          </h1>

          <p className="ca-hero__subtitle">{subtitle}</p>

          <p className="ca-hero__location">
            <MapPin aria-hidden="true" />
            Natal/RN
          </p>

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
            <a href="/sobre" className="ca-btn ca-btn--outline-light">
              Conheça o escritório
              <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
