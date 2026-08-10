'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react'

interface TestimonialsCarouselProps {
  cmsTestimonials?: any[]
  cmsData?: {
    title?: string
  } | null
}

export function TestimonialsCarousel({ cmsTestimonials = [], cmsData }: TestimonialsCarouselProps) {
  const testimonials = cmsTestimonials
  const sectionTitle = cmsData?.title || 'O que nossos clientes dizem'
  const [current, setCurrent] = useState(0)

  if (testimonials.length === 0) return null

  const active = testimonials[current]
  const rating = Math.max(1, Math.min(Number(active.rating || 5), 5))

  const prev = () => setCurrent((index) => (index === 0 ? testimonials.length - 1 : index - 1))
  const next = () => setCurrent((index) => (index === testimonials.length - 1 ? 0 : index + 1))

  return (
    <section className="ca-testimonials" aria-labelledby="testimonials-title">
      <div className="container-narrow mx-auto ca-testimonials__inner">
        <div className="ca-section-heading">
          <span className="ca-eyebrow ca-eyebrow--dark">Depoimentos</span>
          <h2 id="testimonials-title">{sectionTitle}</h2>
        </div>

        <article className="ca-testimonials__quote">
          <Quote className="ca-testimonials__quote-icon" size={60} aria-hidden="true" />
          <div className="ca-testimonials__stars" aria-label={`${rating} de 5 estrelas`}>
            {Array.from({ length: rating }).map((_, index) => (
              <Star key={index} size={18} />
            ))}
          </div>
          <p>&ldquo;{active.text}&rdquo;</p>
          <footer>
            <strong>{active.authorName || active.author_name}</strong>
            {(active.caseType || active.case_type) && <span>{active.caseType || active.case_type}</span>}
          </footer>
        </article>

        {testimonials.length > 1 && (
          <div className="ca-testimonials__controls">
            <button onClick={prev} type="button" aria-label="Depoimento anterior">
              <ChevronLeft size={20} />
            </button>
            <div className="ca-testimonials__dots" aria-label="Selecionar depoimento">
              {testimonials.map((_: any, index: number) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrent(index)}
                  className={index === current ? 'is-active' : ''}
                  aria-label={`Depoimento ${index + 1}`}
                  aria-current={index === current ? 'true' : undefined}
                />
              ))}
            </div>
            <button onClick={next} type="button" aria-label="Proximo depoimento">
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
