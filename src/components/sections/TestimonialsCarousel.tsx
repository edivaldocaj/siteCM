'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'

const defaultTestimonials = [
  { authorName: 'M.S.', text: 'Fui negativado indevidamente. A equipe resolveu tudo rápido e consegui indenização.', caseType: 'Negativação Indevida', rating: 5 },
  { authorName: 'R.A.', text: 'Adequação à LGPD conduzida com excelência pelo Dr. Edivaldo.', caseType: 'LGPD Empresarial', rating: 5 },
  { authorName: 'L.F.', text: 'Familiar preso. Atendimento imediato. Habeas corpus em tempo recorde.', caseType: 'Habeas Corpus', rating: 5 },
]

export function TestimonialsCarousel({ cmsTestimonials = [] }: { cmsTestimonials?: any[] }) {
  const testimonials = cmsTestimonials.length > 0 ? cmsTestimonials : defaultTestimonials
  const [current, setCurrent] = useState(0)
  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1))

  if (testimonials.length === 0) return null

  const t = testimonials[current]

  return (
    <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg, #152138 0%, #1c2d4a 50%, #0e1628 100%)' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
        <span style={{ color: '#c4a96a', fontSize: '12px', fontFamily: "'Source Sans 3', sans-serif", textTransform: 'uppercase', letterSpacing: '0.25em', display: 'block', marginBottom: '16px' }}>Depoimentos</span>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', color: '#f1eae2', margin: '0 0 48px 0', lineHeight: 1.2 }}>O que nossos clientes dizem</h2>

        <div style={{ position: 'relative' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '48px 40px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '24px' }}>
              {[...Array(t.rating || 5)].map((_, i) => (
                <Star key={i} style={{ width: '18px', height: '18px', color: '#c4a96a', fill: '#c4a96a' }} />
              ))}
            </div>
            <p style={{ color: '#f1eae2', fontFamily: "'Source Sans 3', sans-serif", fontSize: '18px', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '24px' }}>
              &ldquo;{t.text}&rdquo;
            </p>
            <div>
              <p style={{ color: '#c4a96a', fontFamily: "'Playfair Display', serif", fontSize: '16px', fontWeight: 600, marginBottom: '4px' }}>{t.authorName || t.author_name}</p>
              <p style={{ color: 'rgba(184,191,200,0.5)', fontSize: '13px' }}>{t.caseType || t.case_type}</p>
            </div>
          </div>

          {testimonials.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '32px' }}>
              <button onClick={prev} style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', background: 'none', color: '#b8bfc8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronLeft style={{ width: '20px', height: '20px' }} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setCurrent(i)} style={{ width: i === current ? '24px' : '8px', height: '8px', borderRadius: '4px', background: i === current ? '#c4a96a' : 'rgba(184,191,200,0.3)', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} />
                ))}
              </div>
              <button onClick={next} style={{ width: '44px', height: '44px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)', background: 'none', color: '#b8bfc8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ChevronRight style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
