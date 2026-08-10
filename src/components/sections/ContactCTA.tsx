'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CheckCircle, Mail, MapPin, Phone, Send } from 'lucide-react'
import { LEAD_CONSENT_TEXT } from '@/lib/public-form-security'

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
  const [error, setError] = useState('')
  const [formStartedAt] = useState(() => Date.now())

  const contactAddress = cmsData?.address || 'Rua Francisco Maia Sobrinho, 1950 - Lagoa Nova, Natal/RN'
  const contactPhone = cmsData?.phone || '(84) 99124-3985'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          phone: data.get('phone'),
          subject: data.get('subject'),
          message: data.get('message'),
          website: data.get('website'),
          formStartedAt,
          consentAccepted: data.get('consentAccepted') === 'on',
          consentText: LEAD_CONSENT_TEXT,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error || 'Erro ao enviar. Tente pelo WhatsApp.')
      }

      setSubmitted(true)
      form.reset()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Erro ao enviar. Tente pelo WhatsApp.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="ca-contact" aria-labelledby="contact-title">
      <div className="ca-contact__mark" aria-hidden="true">
        <Image src="/brand/symbol-mono-light.svg" alt="" width={260} height={260} unoptimized />
      </div>

      <div className="container-wide mx-auto ca-contact__inner">
        <div className="ca-contact__copy">
          <span className="ca-eyebrow ca-eyebrow--dark">Entre em contato</span>
          <h2 id="contact-title">
            {cmsData?.title || 'Conte-nos o seu caso.'}
            <span>{cmsData?.subtitle || 'Podemos ajudar.'}</span>
          </h2>
          <p>Use o formulario para uma triagem inicial ou fale diretamente pelo WhatsApp em casos urgentes.</p>

          <div className="ca-contact__details">
            <p>
              <MapPin size={18} />
              <span>{contactAddress}</span>
            </p>
            {cmsData?.email && (
              <p>
                <Mail size={18} />
                <a href={`mailto:${cmsData.email}`}>{cmsData.email}</a>
              </p>
            )}
            <p>
              <Phone size={18} />
              <span>{contactPhone}</span>
            </p>
          </div>

          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985'}?text=${encodeURIComponent('Olá! Gostaria de agendar uma consulta.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
          >
            <Phone size={18} />
            Falar pelo WhatsApp
          </a>
        </div>

        <div className="ca-contact__form-wrap">
          {submitted ? (
            <div className="ca-contact__success">
              <CheckCircle size={56} />
              <h3>Mensagem enviada</h3>
              <p>Recebemos sua solicitacao e retornaremos pelos dados informados.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="ca-contact__form">
              <h3>Envie sua mensagem</h3>
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="ca-honeypot" />

              <label>
                <span>Nome completo</span>
                <input name="name" required placeholder="Seu nome" />
              </label>

              <label>
                <span>Telefone / WhatsApp</span>
                <input name="phone" type="tel" required placeholder="(84) 99999-9999" />
              </label>

              <label>
                <span>Assunto</span>
                <select name="subject" required defaultValue="">
                  <option value="" disabled>
                    Selecione o tipo de problema
                  </option>
                  <option value="consumidor">Direito do Consumidor</option>
                  <option value="digital">Direito Digital / LGPD</option>
                  <option value="civil">Direito Civil</option>
                  <option value="imobiliario">Direito Imobiliário</option>
                  <option value="tributario">Direito Tributário</option>
                  <option value="licitacoes">Licitações</option>
                  <option value="penal">Direito Penal urgente</option>
                  <option value="outro">Outro assunto</option>
                </select>
              </label>

              <label>
                <span>Mensagem</span>
                <textarea name="message" rows={4} placeholder="Descreva brevemente seu caso" />
              </label>

              <label className="ca-contact__consent">
                <input name="consentAccepted" type="checkbox" required />
                <span>{LEAD_CONSENT_TEXT}</span>
              </label>

              {error && <p className="ca-contact__error">{error}</p>}

              <button type="submit" disabled={loading} className="btn-primary">
                <Send size={16} />
                {loading ? 'Enviando...' : 'Enviar mensagem'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
