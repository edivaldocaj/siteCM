'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'

const defaultTestimonials = [
  {
    text: 'Fui negativado indevidamente e não sabia o que fazer. A equipe do escritório resolveu tudo de forma rápida e ainda consegui uma indenização. Recomendo demais!',
    authorName: 'M.S.',
    caseType: 'Negativação Indevida',
    rating: 5,
  },
  {
    text: 'Minha empresa precisava de adequação à LGPD e o Dr. Edivaldo conduziu todo o processo com excelência. Profissional extremamente competente.',
    authorName: 'R.A.',
    caseType: 'LGPD Empresarial',
    rating: 5,
  },
  {
    text: 'Situação muito difícil envolvendo um familiar preso. O atendimento foi imediato, acolhedor e eficiente. Conseguiram o habeas corpus em tempo recorde.',
    authorName: 'L.F.',
    caseType: 'Habeas Corpus',
    rating: 5,
  },
  {
    text: 'A Dra. Gabrielly cuidou do meu processo imobiliário com toda atenção. Resolveu uma disputa que já durava anos. Muito grata pelo profissionalismo.',
    authorName: 'C.P.',
    caseType: 'Direito Imobiliário',
    rating: 5,
  },
]

interface TestimonialsCarouselProps {
  cmsTestimonials?: any[]
  cmsData?: {
    title?: string
  } | null
}

export function TestimonialsCarousel({ cmsTestimonials = [], cmsData }: TestimonialsCarouselProps) {
  const testimonials = cmsTestimonials.length > 0 ? cmsTestimonials : defaultTestimonials
  const sectionTitle = cmsData?.title || 'O que nossos clientes dizem'
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1))

  if (testimonials.length === 0) return null

  const t = testimonials[current]

  return (
    <section className="section-padding gradient-navy relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0v40M0 20h40' stroke='%23ffffff' stroke-width='0.5' fill='none'/%3E%3C/svg%3E")`,
      }} />

      <div className="container-narrow mx-auto relative" style={{ zIndex: 10 }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span style={{
            color: 'var(--color-brand-gold-dark)',
            fontSize: '12px',
            fontFamily: 'var(--font-body)',
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            display: 'block',
            marginBottom: '16px',
          }}>
            Depoimentos
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 600,
            color: 'var(--color-brand-champagne)',
          }}>
            {sectionTitle}
          </h2>
        </div>

        <div style={{ maxWidth: '48rem', margin: '0 auto', position: 'relative' }}>
          <Quote style={{
            position: 'absolute',
            top: '-16px',
            left: '-16px',
            width: '64px',
            height: '64px',
            color: 'rgba(196,169,106,0.1)',
          }} />

          <div style={{ textAlign: 'center', padding: '0 32px' }}>
            {/* Stars */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '32px' }}>
              {Array.from({ length: t.rating || 5 }).map((_, i) => (
                <Star key={i} style={{
                  width: '20px',
                  height: '20px',
                  fill: 'var(--color-brand-gold-dark)',
                  color: 'var(--color-brand-gold-dark)',
                }} />
              ))}
            </div>

            {/* Quote */}
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'clamp(18px, 2.5vw, 24px)',
              color: 'var(--color-brand-silver-light)',
              lineHeight: 1.6,
              marginBottom: '32px',
              fontStyle: 'italic',
            }}>
              &ldquo;{t.text}&rdquo;
            </p>

            {/* Author */}
            <p style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--color-brand-champagne)',
              fontWeight: 600,
              fontSize: '18px',
              marginBottom: '4px',
            }}>
              {t.authorName || t.author_name}
            </p>
            <p style={{
              color: 'rgba(184,191,200,0.5)',
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
            }}>
              {t.caseType || t.case_type}
            </p>
          </div>

          {/* Controls */}
          {testimonials.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '48px' }}>
              <button
                onClick={prev}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: '1px solid rgba(184,191,200,0.2)',
                  background: 'none',
                  color: 'rgba(184,191,200,0.6)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                }}
                aria-label="Anterior"
              >
                <ChevronLeft style={{ width: '20px', height: '20px' }} />
              </button>

              {/* Dots */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {testimonials.map((_: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    style={{
                      width: i === current ? '32px' : '10px',
                      height: '10px',
                      borderRadius: '5px',
                      background: i === current ? 'var(--color-brand-gold-dark)' : 'rgba(184,191,200,0.3)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                    aria-label={`Depoimento ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={next}
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  border: '1px solid rgba(184,191,200,0.2)',
                  background: 'none',
                  color: 'rgba(184,191,200,0.6)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                }}
                aria-label="Próximo"
              >
                <ChevronRight style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
