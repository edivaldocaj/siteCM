'use client'

import { Phone, Calendar } from 'lucide-react'

interface HeroSectionProps {
  cmsData?: {
    heroTitle?: string
    heroSubtitle?: string
    heroButtonText?: string
  } | null
}

export function HeroSection({ cmsData }: HeroSectionProps) {
  const buttonText = cmsData?.heroButtonText || 'Fale com um Advogado'
  const subtitle = cmsData?.heroSubtitle || 'Assessoria jurídica completa com atendimento humanizado. Direito Digital, Civil, Consumidor, Tributário, Imobiliário e Defesa Criminal 24h.'
  const hasCustomTitle = cmsData?.heroTitle && cmsData.heroTitle !== 'Defesa Especializada e Estratégica'

  return (
    <section className="relative min-h-screen flex items-center gradient-navy overflow-hidden">
      {/* Subtle geometric pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E")`,
        backgroundSize: '60px 60px',
      }} />

      {/* Gradient accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full" style={{ background: 'linear-gradient(to left, rgba(196,169,106,0.05), transparent)' }} />

      <div className="container-wide mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-28 pb-20">
        <div style={{ maxWidth: '48rem' }}>
          {/* Tag */}
          <div className="mb-8">
            <span style={{
              display: 'inline-block',
              padding: '8px 16px',
              border: '1px solid rgba(196,169,106,0.3)',
              color: 'var(--color-brand-gold-dark)',
              fontSize: '12px',
              fontFamily: 'var(--font-body)',
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
              borderRadius: '2px',
            }}>
              Advocacia Estratégica em Natal/RN
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 600,
            lineHeight: 1.1,
            marginBottom: '32px',
          }}>
            {hasCustomTitle ? (
              <span style={{ color: 'var(--color-brand-champagne)' }}>{cmsData!.heroTitle}</span>
            ) : (
              <>
                <span className="text-silver-gradient">Seu direito,</span>
                <br />
                <span style={{ color: 'var(--color-brand-champagne)' }}>nossa missão.</span>
              </>
            )}
          </h1>

          {/* Subheadline */}
          <p style={{
            color: 'rgba(184,191,200,0.7)',
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(16px, 2vw, 20px)',
            lineHeight: 1.6,
            marginBottom: '48px',
            maxWidth: '36rem',
          }}>
            {subtitle}
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985'}?text=${encodeURIComponent(process.env.NEXT_PUBLIC_WHATSAPP_MESSAGE || 'Olá! Gostaria de falar com um advogado.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              style={{ fontSize: '15px' }}
            >
              <Phone style={{ width: '20px', height: '20px' }} />
              {buttonText}
            </a>
            <a href="/contato" className="btn-outline" style={{ fontSize: '15px' }}>
              <Calendar style={{ width: '20px', height: '20px' }} />
              Agendar Consulta
            </a>
          </div>
        </div>

        {/* Decorative line */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: 'linear-gradient(to right, transparent, rgba(196,169,106,0.3), transparent)',
        }} />
      </div>
    </section>
  )
}
