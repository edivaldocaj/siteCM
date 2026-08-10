'use client'

import { useEffect, useRef, useState } from 'react'

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

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const counted = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true
          const duration = 1200
          const start = performance.now()
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress < 1) requestAnimationFrame(step)
          }
          requestAnimationFrame(step)
        }
      },
      { threshold: 0.35 },
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return <strong ref={ref}>{count}{suffix}</strong>
}

export function TrustBar({ cmsData }: TrustBarProps) {
  const stats = cmsData?.stats?.length ? cmsData.stats : defaultStats

  return (
    <section className="ca-trust" aria-label="Indicadores do escritório">
      <div className="ca-trust__inner">
        <p className="ca-trust__label">Escritório orientado por critério, discrição e clareza.</p>
        <div className="ca-trust__grid">
          {stats.map((stat) => (
            <div className="ca-trust__item" key={stat.label}>
              <AnimatedCounter target={Number(stat.value) || 0} suffix={stat.suffix || ''} />
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
