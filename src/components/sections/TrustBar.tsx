'use client'

import { useEffect, useRef, useState } from 'react'

interface TrustBarProps {
  cmsData?: {
    stats?: Array<{ value: number; suffix: string; label: string }>
  } | null
}

const defaultStats = [
  { value: 15, suffix: '+', label: 'Anos de Experiência Combinada' },
  { value: 500, suffix: '+', label: 'Clientes Atendidos' },
  { value: 7, suffix: '', label: 'Áreas de Atuação' },
  { value: 98, suffix: '%', label: 'Satisfação dos Clientes' },
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
          const duration = 2000
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
      { threshold: 0.5 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return (
    <div ref={ref} style={{
      fontSize: 'clamp(2rem, 4vw, 3rem)',
      fontFamily: 'var(--font-display)',
      fontWeight: 700,
      color: 'var(--color-brand-navy)',
    }}>
      {count}{suffix}
    </div>
  )
}

export function TrustBar({ cmsData }: TrustBarProps) {
  const stats = cmsData?.stats?.length ? cmsData.stats : defaultStats

  return (
    <section style={{
      backgroundColor: 'var(--color-brand-champagne)',
      borderTop: '1px solid rgba(196,169,106,0.2)',
      borderBottom: '1px solid rgba(196,169,106,0.2)',
    }}>
      <div className="container-wide mx-auto" style={{ padding: '56px 16px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '32px',
        }}>
          {stats.map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              <p style={{
                color: 'rgba(21,33,56,0.6)',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                marginTop: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          section > div > div { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}} />
    </section>
  )
}
