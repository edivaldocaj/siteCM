'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'

export function ContatoPageClient({ siteConfig }: { siteConfig: any }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const contactEmail = siteConfig?.contactEmail || 'contato@cavalcantemelo.adv.br'
  const contactPhone = siteConfig?.contactPhone || '(84) 99999-9999'
  const contactAddress = siteConfig?.contactAddress || 'Rua Francisco Maia Sobrinho, 1950\nLagoa Nova — Natal/RN'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          phone: formData.get('phone'),
          subject: formData.get('subject'),
          message: formData.get('message'),
        }),
      })
      if (!res.ok) throw new Error()
      setSuccess(true)
    } catch {
      setError('Ocorreu um erro ao enviar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '4px',
    border: '1px solid rgba(21,33,56,0.15)',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    color: 'var(--color-brand-navy)',
    outline: 'none',
    transition: 'border-color 0.3s',
    background: 'white',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    color: 'rgba(21,33,56,0.6)',
    fontSize: '11px',
    fontFamily: 'var(--font-body)',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '8px',
    fontWeight: 600,
  }

  return (
    <>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #152138 0%, #1c2d4a 50%, #0e1628 100%)', padding: '140px 24px 80px' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <span style={{ color: 'var(--color-brand-gold-dark)', fontSize: '12px', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.25em', display: 'block', marginBottom: '16px' }}>
            Fale Conosco
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 600, color: 'var(--color-brand-champagne)', lineHeight: 1.1, marginBottom: '24px' }}>
            Contato
          </h1>
          <p style={{ color: 'rgba(184,191,200,0.7)', fontFamily: 'var(--font-body)', fontSize: '18px', lineHeight: 1.6, maxWidth: '600px' }}>
            Entre em contato pelo formulário, WhatsApp ou visite nosso escritório.
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '80px 24px', backgroundColor: 'var(--color-brand-cream)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px' }} className="contact-page-grid">
            {/* Left - Informações */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--color-brand-navy)', fontWeight: 600, marginBottom: '32px' }}>
                Informações
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <MapPin style={{ width: '22px', height: '22px', color: 'var(--color-brand-gold-dark)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 600, color: 'var(--color-brand-navy)', marginBottom: '4px' }}>Endereço</h4>
                    <p style={{ color: 'rgba(21,33,56,0.6)', fontSize: '14px', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{contactAddress}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <Phone style={{ width: '22px', height: '22px', color: 'var(--color-brand-gold-dark)', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 600, color: 'var(--color-brand-navy)', marginBottom: '4px' }}>Telefone / WhatsApp</h4>
                    <p style={{ color: 'rgba(21,33,56,0.6)', fontSize: '14px' }}>{contactPhone}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <Mail style={{ width: '22px', height: '22px', color: 'var(--color-brand-gold-dark)', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 600, color: 'var(--color-brand-navy)', marginBottom: '4px' }}>E-mail</h4>
                    <p style={{ color: 'rgba(21,33,56,0.6)', fontSize: '14px' }}>{contactEmail}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <Clock style={{ width: '22px', height: '22px', color: 'var(--color-brand-gold-dark)', flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '15px', fontWeight: 600, color: 'var(--color-brand-navy)', marginBottom: '4px' }}>Horário</h4>
                    <p style={{ color: 'rgba(21,33,56,0.6)', fontSize: '14px', lineHeight: 1.6 }}>Seg a Sex: 8h às 18h<br />Penal: Atendimento 24h</p>
                  </div>
                </div>
              </div>

              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
                style={{ fontSize: '14px' }}
              >
                <Phone style={{ width: '18px', height: '18px' }} />
                Falar pelo WhatsApp
              </a>
            </div>

            {/* Right - Formulário */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--color-brand-navy)', fontWeight: 600, marginBottom: '32px' }}>
                Envie sua mensagem
              </h2>

              {success ? (
                <div style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.3)', padding: '40px', borderRadius: '8px', textAlign: 'center' }}>
                  <h3 style={{ color: '#25D366', fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>Mensagem Enviada!</h3>
                  <p style={{ color: 'rgba(21,33,56,0.6)', fontSize: '14px' }}>Nossa equipe entrará em contato em breve.</p>
                </div>
              ) : (
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
                    <select name="subject" required style={inputStyle}>
                      <option value="">Selecione</option>
                      <option value="consumidor">Direito do Consumidor</option>
                      <option value="digital">Direito Digital / LGPD</option>
                      <option value="civil">Direito Civil</option>
                      <option value="imobiliario">Direito Imobiliário</option>
                      <option value="tributario">Direito Tributário</option>
                      <option value="licitacoes">Licitações</option>
                      <option value="penal">Direito Penal (Urgente)</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Mensagem</label>
                    <textarea name="message" rows={5} style={{ ...inputStyle, resize: 'none' }} placeholder="Descreva brevemente seu caso..." />
                  </div>
                  {error && <p style={{ color: '#dc2626', fontSize: '14px', margin: 0 }}>{error}</p>}
                  <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}>
                    <Send style={{ width: '16px', height: '16px' }} />
                    {loading ? 'Enviando...' : 'Enviar Mensagem'}
                  </button>
                  <p style={{ color: 'rgba(21,33,56,0.35)', fontSize: '12px', textAlign: 'center', margin: 0 }}>
                    Protegido conforme a LGPD.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) { .contact-page-grid { grid-template-columns: 1fr !important; gap: 40px !important; } }
        .contact-page-grid input:focus, .contact-page-grid select:focus, .contact-page-grid textarea:focus {
          border-color: var(--color-brand-gold-dark) !important;
        }
      `}} />
    </>
  )
}
