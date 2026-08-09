'use client'

import { Clock, HeartHandshake, Phone, ShieldCheck } from 'lucide-react'

interface CriminalUrgencyProps {
  cmsData?: {
    tag?: string
    title?: string
    highlight?: string
    description?: string
  } | null
}

const urgencyItems = [
  {
    icon: Clock,
    title: 'Resposta imediata',
    text: 'Atuacao em flagrantes, audiencias de custodia e situacoes que exigem decisao rapida.',
  },
  {
    icon: ShieldCheck,
    title: 'Defesa tecnica',
    text: 'Analise objetiva dos riscos, das provas e das medidas cabiveis desde o primeiro contato.',
  },
  {
    icon: HeartHandshake,
    title: 'Sigilo absoluto',
    text: 'Conducao discreta, linguagem clara e suporte para a familia durante a urgencia.',
  },
]

export function CriminalUrgency({ cmsData }: CriminalUrgencyProps) {
  const tag = cmsData?.tag || 'Defesa Criminal | Plantao'
  const title = cmsData?.title || 'Voce nao esta sozinho.'
  const highlight = cmsData?.highlight || 'Nos sabemos o que fazer.'
  const description =
    cmsData?.description ||
    'Se voce ou alguem proximo foi preso, intimado ou esta sob investigacao, acione uma defesa tecnica antes de qualquer decisao.'

  return (
    <section className="ca-criminal" aria-labelledby="criminal-urgency-title">
      <div className="ca-criminal__watermark" aria-hidden="true" />
      <div className="container-wide mx-auto ca-criminal__inner">
        <div className="ca-criminal__copy">
          <span className="ca-eyebrow ca-eyebrow--dark">{tag}</span>
          <h2 id="criminal-urgency-title" className="ca-criminal__title">
            {title}
            <span>{highlight}</span>
          </h2>
          <p className="ca-criminal__description">{description}</p>
          <div className="ca-criminal__actions">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985'}?text=${encodeURIComponent('Preciso de ajuda urgente com um caso criminal.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <Phone size={18} />
              Ajuda urgente
            </a>
            <a href="tel:+5584991243985" className="ca-dark-link">
              Ligar agora
            </a>
          </div>
        </div>

        <div className="ca-criminal__panel" aria-label="Diferenciais no atendimento criminal">
          {urgencyItems.map((item) => (
            <article className="ca-criminal__item" key={item.title}>
              <span className="ca-criminal__icon" aria-hidden="true">
                <item.icon size={22} />
              </span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
