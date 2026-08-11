'use client'

interface TrustBarProps {
  cmsData?: {
    stats?: Array<{ value: number; suffix: string; label: string }>
  } | null
}

const defaultStats = [
  { value: 7, suffix: '', label: 'Áreas jurídicas estruturadas' },
  { value: 24, suffix: 'h', label: 'Resposta para urgências penais' },
  { value: 100, suffix: '%', label: 'Curadoria humana no atendimento' },
  { value: 1, suffix: ':1', label: 'Acompanhamento direto do caso' },
]

export function TrustBar({ cmsData }: TrustBarProps) {
  const stats = cmsData?.stats?.length ? cmsData.stats : defaultStats

  return (
    <section className="ca-trust" aria-label="Indicadores do escritório">
      <div className="ca-trust__inner">
        <p className="ca-trust__label">Escritório orientado por critério, discrição e clareza.</p>
        <div className="ca-trust__grid">
          {stats.map((stat) => (
            <div className="ca-trust__item" key={stat.label}>
              <strong>
                {Number(stat.value) || 0}
                {stat.suffix || ''}
              </strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
