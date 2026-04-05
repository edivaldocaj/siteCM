'use client'

import { Phone, Shield, Clock, Heart } from 'lucide-react'

interface CriminalUrgencyProps {
  cmsData?: {
    tag?: string
    title?: string
    highlight?: string
    description?: string
  } | null
}

export function CriminalUrgency({ cmsData }: CriminalUrgencyProps) {
  const tag = cmsData?.tag || 'Defesa Criminal — Atendimento Imediato'
  const title = cmsData?.title || 'Você não está sozinho.'
  const highlight = cmsData?.highlight || 'Nós sabemos o que fazer.'
  const description = cmsData?.description || 'Se você ou alguém que você ama está sendo investigado, foi preso ou precisa de defesa criminal urgente, nossa equipe está pronta para agir imediatamente. Cada minuto conta.'

  return (
    <section className="relative overflow-hidden">
      {/* Dark background */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0e1628, #152138)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(122,27,27,0.1), transparent, rgba(122,27,27,0.05))' }} />
      <div className="absolute top-0 left-0 right-0" style={{ height: '3px', background: 'linear-gradient(90deg, var(--color-brand-urgency), var(--color-brand-gold-dark), var(--color-brand-urgency))' }} />

      <div className="container-wide mx-auto section-padding relative" style={{ zIndex: 10 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '48px',
          alignItems: 'center',
        }} className="criminal-grid">
          {/* Left — Message */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <Shield style={{ width: '24px', height: '24px', color: 'var(--color-brand-gold-dark)' }} />
              <span style={{
                color: 'var(--color-brand-gold-dark)',
                fontSize: '12px',
                fontFamily: 'var(--font-body)',
                textTransform: 'uppercase',
                letterSpacing: '0.25em',
              }}>
                {tag}
              </span>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 4vw, 3rem)',
              fontWeight: 600,
              color: 'var(--color-brand-champagne)',
              lineHeight: 1.15,
              marginBottom: '32px',
            }}>
              {title}
              <br />
              <span style={{ color: 'var(--color-brand-gold-dark)' }}>{highlight}</span>
            </h2>

            <p style={{
              color: 'rgba(184,191,200,0.6)',
              fontFamily: 'var(--font-body)',
              fontSize: '18px',
              lineHeight: 1.6,
              marginBottom: '32px',
            }}>
              {description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985'}?text=${encodeURIComponent('Preciso de ajuda urgente com um caso criminal.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
                style={{ fontSize: '15px' }}
              >
                <Phone style={{ width: '20px', height: '20px' }} />
                Ajuda Urgente — WhatsApp
              </a>
              <a
                href="tel:+5584991243985"
                className="btn-outline"
                style={{
                  borderColor: 'rgba(196,169,106,0.4)',
                  color: 'var(--color-brand-gold-dark)',
                  fontSize: '15px',
                }}
              >
                <Phone style={{ width: '20px', height: '20px' }} />
                Ligar Agora
              </a>
            </div>
          </div>

          {/* Right — Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[
              {
                icon: Clock,
                title: 'Atendimento 24 horas',
                text: 'Plantão permanente para situações de urgência. Noites, fins de semana e feriados.',
              },
              {
                icon: Shield,
                title: 'Habeas Corpus Imediato',
                text: 'Atuação célere para garantir sua liberdade nos casos de prisão ilegal ou abusiva.',
              },
              {
                icon: Heart,
                title: 'Acolhimento e Sigilo',
                text: 'Sabemos que este é um momento difícil. Tratamos cada caso com empatia, discrição e respeito absoluto.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="glass-card"
                style={{
                  padding: '24px',
                  display: 'flex',
                  gap: '20px',
                  transition: 'all 0.3s',
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '8px',
                  background: 'rgba(196,169,106,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <item.icon style={{ width: '24px', height: '24px', color: 'var(--color-brand-gold-dark)' }} />
                </div>
                <div>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    color: 'var(--color-brand-champagne)',
                    fontWeight: 600,
                    fontSize: '18px',
                    marginBottom: '8px',
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    color: 'rgba(184,191,200,0.5)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    lineHeight: 1.6,
                  }}>
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 1024px) {
          .criminal-grid { grid-template-columns: 1fr 1fr !important; gap: 80px !important; }
        }
      `}} />
    </section>
  )
}
