'use client'

import { useState } from 'react'
import { Phone, Send, MapPin, CheckCircle } from 'lucide-react'

interface ContactCTAProps {
  cmsData?: {
    title?: string
    subtitle?: string
    email?: string
    phone?: string
    address?: string
  } | null
}

export function ContactCTA({ cmsData }: ContactCTAProps) {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const contactAddress = cmsData?.address || 'Rua Francisco Maia Sobrinho, 1950 — Lagoa Nova, Natal/RN'
  const contactPhone = cmsData?.phone || '(84) 99124-3985'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const data = new FormData(form)

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          phone: data.get('phone'),
          subject: data.get('subject'),
          message: data.get('message'),
        }),
      })
      setSubmitted(true)
    } catch {
      alert('Erro ao enviar. Tente pelo WhatsApp.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '2px',
    padding: '12px 16px',
    color: 'var(--color-brand-silver-light)',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.3s',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: 'rgba(184,191,200,0.6)',
    fontSize: '11px',
    fontFamily: 'var(--font-body)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '8px',
  }

  return (
    <section className="relative gradient-navy overflow-hidden">
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(to right, transparent, rgba(196,169,106,0.3), transparent)',
      }} />

      <div className="container-wide mx-auto section-padding">
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '48px',
        }} className="contact-grid">
          {/* Left — CTA */}
          <div>
            <span style={{
              color: 'var(--color-brand-gold-dark)',
              fontSize: '12px',
              fontFamily: 'var(--font-body)',
              textTransform: 'uppercase',
              letterSpacing: '0.25em',
              display: 'block',
              marginBottom: '16px',
            }}>
              Entre em Contato
            </span>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.75rem, 4vw, 3rem)',
              fontWeight: 600,
              color: 'var(--color-brand-champagne)',
              lineHeight: 1.15,
              marginBottom: '32px',
            }}>
              {cmsData?.title || 'Conte-nos o seu caso.'}
              <br />
              <span style={{ color: 'var(--color-brand-gold-dark)' }}>
                {cmsData?.subtitle || 'Podemos ajudar.'}
              </span>
            </h2>

            <p style={{
              color: 'rgba(184,191,200,0.6)',
              fontFamily: 'var(--font-body)',
              fontSize: '18px',
              lineHeight: 1.6,
              marginBottom: '40px',
            }}>
              Preencha o formulário ou fale diretamente pelo WhatsApp.
              Respondemos em até 2 horas durante o horário comercial.
            </p>

            <div style={{ marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'rgba(184,191,200,0.6)' }}>
                <MapPin style={{ width: '20px', height: '20px', color: 'var(--color-brand-gold-dark)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px' }}>
                  {contactAddress}
                </span>
              </div>
              {cmsData?.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'rgba(184,191,200,0.6)' }}>
                  <Send style={{ width: '20px', height: '20px', color: 'var(--color-brand-gold-dark)', flexShrink: 0 }} />
                  <a href={`mailto:${cmsData.email}`} style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'rgba(184,191,200,0.6)', textDecoration: 'none' }}>
                    {cmsData.email}
                  </a>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'rgba(184,191,200,0.6)' }}>
                <Phone style={{ width: '20px', height: '20px', color: 'var(--color-brand-gold-dark)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '14px' }}>
                  {contactPhone}
                </span>
              </div>
            </div>

            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985'}?text=${encodeURIComponent('Olá! Gostaria de agendar uma consulta.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              style={{ fontSize: '15px' }}
            >
              <Phone style={{ width: '20px', height: '20px' }} />
              Falar pelo WhatsApp
            </a>
          </div>

          {/* Right — Form */}
          <div>
            {submitted ? (
              <div className="glass-card" style={{ padding: '48px', textAlign: 'center' }}>
                <CheckCircle style={{ width: '64px', height: '64px', color: '#25D366', margin: '0 auto 24px' }} />
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '24px',
                  color: 'var(--color-brand-champagne)',
                  fontWeight: 600,
                  marginBottom: '16px',
                }}>
                  Mensagem Enviada!
                </h3>
                <p style={{ color: 'rgba(184,191,200,0.6)', fontFamily: 'var(--font-body)' }}>
                  Recebemos sua mensagem e retornaremos em breve. Obrigado pela confiança.
                </p>
              </div>
            ) : (
              <div className="glass-card" style={{ padding: '32px' }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '20px',
                  color: 'var(--color-brand-champagne)',
                  fontWeight: 600,
                  marginBottom: '32px',
                }}>
                  Envie sua mensagem
                </h3>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={labelStyle}>Nome completo</label>
                    <input name="name" required style={inputStyle} placeholder="Seu nome" />
                  </div>

                  <div>
                    <label style={labelStyle}>Telefone / WhatsApp</label>
                    <input name="phone" type="tel" required style={inputStyle} placeholder="(84) 99999-9999" />
                  </div>

                  <div>
                    <label style={labelStyle}>Assunto</label>
                    <select name="subject" required style={{ ...inputStyle, appearance: 'none' }}>
                      <option value="">Selecione o tipo de problema</option>
                      <option value="consumidor">Direito do Consumidor</option>
                      <option value="digital">Direito Digital / LGPD</option>
                      <option value="civil">Direito Civil</option>
                      <option value="imobiliario">Direito Imobiliário</option>
                      <option value="tributario">Direito Tributário</option>
                      <option value="licitacoes">Licitações</option>
                      <option value="penal">Direito Penal (Urgente)</option>
                      <option value="outro">Outro Assunto</option>
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Mensagem</label>
                    <textarea
                      name="message"
                      rows={4}
                      style={{ ...inputStyle, resize: 'none' }}
                      placeholder="Descreva brevemente seu caso..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{
                      width: '100%',
                      opacity: loading ? 0.5 : 1,
                      cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <Send style={{ width: '16px', height: '16px' }} />
                    {loading ? 'Enviando...' : 'Enviar Mensagem'}
                  </button>

                  <p style={{
                    color: 'rgba(184,191,200,0.3)',
                    fontSize: '12px',
                    fontFamily: 'var(--font-body)',
                    textAlign: 'center',
                  }}>
                    Suas informações são protegidas conforme a LGPD.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (min-width: 1024px) {
          .contact-grid { grid-template-columns: 1fr 1fr !important; gap: 80px !important; }
        }
        .contact-grid input:focus, .contact-grid select:focus, .contact-grid textarea:focus {
          border-color: rgba(196,169,106,0.5) !important;
        }
      `}} />
    </section>
  )
}
