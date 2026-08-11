'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CheckCircle, Clock, Mail, MapPin, Phone, Send } from 'lucide-react'
import { LEAD_CONSENT_TEXT } from '@/lib/public-form-security'

export function ContatoPageClient({ siteConfig }: { siteConfig: any }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [formStartedAt] = useState(() => Date.now())

  const contactEmail = siteConfig?.contactEmail || 'contato@cavalcantealbuquerque.com.br'
  const contactPhone = siteConfig?.contactPhone || '(84) 99124-3985'
  const contactAddress = siteConfig?.contactAddress || 'Rua Francisco Maia Sobrinho, 1950\nLagoa Nova - Natal/RN'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = e.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          phone: formData.get('phone'),
          subject: formData.get('subject'),
          message: formData.get('message'),
          website: formData.get('website'),
          formStartedAt,
          consentAccepted: formData.get('consentAccepted') === 'on',
          consentText: LEAD_CONSENT_TEXT,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error || 'Ocorreu um erro ao enviar. Tente novamente pelo WhatsApp.')
      }

      setSuccess(true)
      form.reset()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Ocorreu um erro ao enviar. Tente novamente pelo WhatsApp.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="ca-page-hero ca-page-hero--contact">
        <div className="ca-page-hero__mark" aria-hidden="true">
          <Image src="/brand/brand-symbol-transparent.webp" alt="" width={360} height={360} />
        </div>
        <div className="container-wide mx-auto ca-page-hero__inner">
          <span className="ca-eyebrow ca-eyebrow--dark">Fale conosco</span>
          <h1>Contato</h1>
          <p>Entre em contato pelo formulário, WhatsApp ou pelos canais institucionais do escritório.</p>
        </div>
      </section>

      <section className="ca-contact-page">
        <div className="container-wide mx-auto ca-contact-page__grid">
          <aside className="ca-contact-page__info" aria-label="Informações de contato">
            <span className="ca-eyebrow">Canais</span>
            <h2>Atendimento objetivo desde o primeiro contato</h2>

            <div className="ca-contact-page__items">
              <article>
                <MapPin size={21} />
                <div>
                  <h3>Endereço</h3>
                  <p>{contactAddress}</p>
                </div>
              </article>
              <article>
                <Phone size={21} />
                <div>
                  <h3>Telefone / WhatsApp</h3>
                  <p>{contactPhone}</p>
                </div>
              </article>
              <article>
                <Mail size={21} />
                <div>
                  <h3>E-mail</h3>
                  <p>{contactEmail}</p>
                </div>
              </article>
              <article>
                <Clock size={21} />
                <div>
                  <h3>Horário</h3>
                  <p>Segunda a sexta, 8h às 18h. Penal: atendimento emergencial.</p>
                </div>
              </article>
            </div>

            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <Phone size={18} />
              Falar pelo WhatsApp
            </a>
          </aside>

          <div className="ca-contact-page__form-panel">
            {success ? (
              <div className="ca-contact-page__success">
                <CheckCircle size={54} />
                <h2>Mensagem enviada</h2>
                <p>Nossa equipe recebeu sua solicitação e retornará pelos dados informados.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="ca-contact-page__form">
                <h2>Envie sua mensagem</h2>
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
                      Selecione
                    </option>
                    <option value="licitacoes">Licitações e Contratos</option>
                    <option value="digital">Direito Digital / LGPD</option>
                    <option value="civil">Direito Civil</option>
                    <option value="penal">Direito Penal urgente</option>
                    <option value="consumidor">Direito do Consumidor</option>
                    <option value="imobiliario">Direito Imobiliário</option>
                    <option value="tributario">Direito Tributário</option>
                    <option value="outro">Outro</option>
                  </select>
                </label>

                <label>
                  <span>Mensagem</span>
                  <textarea name="message" rows={5} placeholder="Descreva brevemente seu caso" />
                </label>

                <label className="ca-contact-page__consent">
                  <input name="consentAccepted" type="checkbox" required />
                  <span>{LEAD_CONSENT_TEXT}</span>
                </label>

                {error && <p className="ca-contact-page__error">{error}</p>}

                <button type="submit" disabled={loading} className="btn-primary">
                  <Send size={16} />
                  {loading ? 'Enviando...' : 'Enviar mensagem'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
