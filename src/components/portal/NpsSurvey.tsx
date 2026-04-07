'use client'

import { useState } from 'react'
import { Star, Send, CheckCircle, MessageCircle, Loader2 } from 'lucide-react'

interface NpsSurveyProps {
  clientToken: string
  processNumber?: string
  onComplete?: () => void
}

export function NpsSurvey({ clientToken, processNumber, onComplete }: NpsSurveyProps) {
  const [step, setStep] = useState<'score' | 'feedback' | 'testimonial' | 'done'>('score')
  const [score, setScore] = useState<number | null>(null)
  const [hoveredScore, setHoveredScore] = useState<number | null>(null)
  const [feedback, setFeedback] = useState('')
  const [testimonial, setTestimonial] = useState('')
  const [npsId, setNpsId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const scoreLabels: Record<number, string> = {
    0: 'Péssimo', 1: 'Muito ruim', 2: 'Ruim', 3: 'Razoável', 4: 'Abaixo da média',
    5: 'Neutro', 6: 'Razoável', 7: 'Bom', 8: 'Muito bom', 9: 'Excelente', 10: 'Excepcional',
  }

  async function submitNps() {
    if (score === null) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/nps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientToken, score, feedback, processNumber }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erro ao enviar avaliação.')
        return
      }

      setNpsId(data.npsId)

      if (data.promptTestimonial) {
        setStep('testimonial')
      } else {
        setStep('done')
        onComplete?.()
      }
    } catch {
      setError('Erro de conexão.')
    } finally {
      setLoading(false)
    }
  }

  async function submitTestimonial() {
    if (!testimonial.trim() || !npsId) return
    setLoading(true)

    try {
      await fetch('/api/nps', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ npsId, testimonialText: testimonial, clientToken }),
      })
      setStep('done')
      onComplete?.()
    } catch {
      setStep('done')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (s: number) => {
    if (s <= 6) return '#dc2626'
    if (s <= 8) return '#c4a96a'
    return '#25D366'
  }

  if (step === 'done') {
    return (
      <div style={{
        background: 'rgba(37,211,102,0.06)',
        border: '1px solid rgba(37,211,102,0.2)',
        borderRadius: '12px',
        padding: '32px',
        textAlign: 'center',
      }}>
        <CheckCircle style={{ width: '48px', height: '48px', color: '#25D366', margin: '0 auto 16px' }} />
        <h3 style={{ color: '#f1eae2', fontFamily: "'Playfair Display', serif", fontSize: '20px', marginBottom: '8px' }}>
          Obrigado pela sua avaliação!
        </h3>
        <p style={{ color: '#b8bfc8', fontSize: '14px' }}>
          Sua opinião é fundamental para melhorarmos nossos serviços.
        </p>
      </div>
    )
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      padding: '32px',
    }}>
      {/* Score Step */}
      {step === 'score' && (
        <>
          <h3 style={{ color: '#f1eae2', fontFamily: "'Playfair Display', serif", fontSize: '20px', marginBottom: '8px', textAlign: 'center' }}>
            Como você avalia nosso atendimento?
          </h3>
          <p style={{ color: '#b8bfc8', fontSize: '13px', textAlign: 'center', marginBottom: '24px' }}>
            De 0 a 10, qual a probabilidade de recomendar nosso escritório?
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {Array.from({ length: 11 }, (_, i) => i).map((n) => (
              <button
                key={n}
                onClick={() => setScore(n)}
                onMouseEnter={() => setHoveredScore(n)}
                onMouseLeave={() => setHoveredScore(null)}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '8px',
                  border: score === n ? `2px solid ${getScoreColor(n)}` : '1px solid rgba(255,255,255,0.1)',
                  background: score === n ? `${getScoreColor(n)}20` : 'rgba(255,255,255,0.04)',
                  color: score === n || hoveredScore === n ? getScoreColor(hoveredScore ?? n) : '#b8bfc8',
                  fontSize: '16px',
                  fontWeight: score === n ? 700 : 400,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {n}
              </button>
            ))}
          </div>

          {(score !== null || hoveredScore !== null) && (
            <p style={{
              textAlign: 'center',
              color: getScoreColor(hoveredScore ?? score ?? 5),
              fontSize: '14px',
              fontWeight: 600,
              marginBottom: '16px',
            }}>
              {scoreLabels[hoveredScore ?? score ?? 5]}
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px', marginBottom: '24px' }}>
            <span style={{ color: '#666', fontSize: '11px' }}>Nada provável</span>
            <span style={{ color: '#666', fontSize: '11px' }}>Muito provável</span>
          </div>

          {score !== null && (
            <button
              onClick={() => setStep('feedback')}
              style={{
                width: '100%',
                padding: '14px',
                background: '#c4a96a',
                color: '#152138',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Continuar
            </button>
          )}
        </>
      )}

      {/* Feedback Step */}
      {step === 'feedback' && (
        <>
          <h3 style={{ color: '#f1eae2', fontFamily: "'Playfair Display', serif", fontSize: '20px', marginBottom: '8px', textAlign: 'center' }}>
            Quer nos contar mais?
          </h3>
          <p style={{ color: '#b8bfc8', fontSize: '13px', textAlign: 'center', marginBottom: '24px' }}>
            Seu comentário nos ajuda a melhorar (opcional).
          </p>

          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="O que podemos melhorar? O que você mais gostou?"
            rows={4}
            style={{
              width: '100%',
              padding: '14px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#f1eae2',
              fontSize: '14px',
              resize: 'vertical',
              marginBottom: '16px',
              fontFamily: "'Source Sans 3', sans-serif",
            }}
          />

          {error && (
            <p style={{ color: '#dc2626', fontSize: '13px', marginBottom: '12px', textAlign: 'center' }}>{error}</p>
          )}

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setStep('score')}
              style={{
                flex: 1,
                padding: '14px',
                background: 'rgba(255,255,255,0.06)',
                color: '#b8bfc8',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Voltar
            </button>
            <button
              onClick={submitNps}
              disabled={loading}
              style={{
                flex: 2,
                padding: '14px',
                background: '#c4a96a',
                color: '#152138',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {loading ? <Loader2 style={{ width: '18px', animation: 'spin 1s linear infinite' }} /> : <Send style={{ width: '16px' }} />}
              {loading ? 'Enviando...' : 'Enviar avaliação'}
            </button>
          </div>
        </>
      )}

      {/* Testimonial Step (for promoters score >= 9) */}
      {step === 'testimonial' && (
        <>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <Star style={{ width: '48px', height: '48px', color: '#c4a96a', fill: '#c4a96a', margin: '0 auto 12px' }} />
            <h3 style={{ color: '#f1eae2', fontFamily: "'Playfair Display', serif", fontSize: '20px', marginBottom: '8px' }}>
              Que bom que gostou!
            </h3>
            <p style={{ color: '#b8bfc8', fontSize: '14px' }}>
              Gostaria de deixar um depoimento? Ele poderá ser exibido em nosso site para ajudar outras pessoas.
            </p>
          </div>

          <textarea
            value={testimonial}
            onChange={(e) => setTestimonial(e.target.value)}
            placeholder="Conte como foi sua experiência com o escritório Cavalcante & Melo..."
            rows={4}
            style={{
              width: '100%',
              padding: '14px',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#f1eae2',
              fontSize: '14px',
              resize: 'vertical',
              marginBottom: '16px',
              fontFamily: "'Source Sans 3', sans-serif",
            }}
          />

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => { setStep('done'); onComplete?.() }}
              style={{
                flex: 1,
                padding: '14px',
                background: 'rgba(255,255,255,0.06)',
                color: '#b8bfc8',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              Pular
            </button>
            <button
              onClick={submitTestimonial}
              disabled={loading || !testimonial.trim()}
              style={{
                flex: 2,
                padding: '14px',
                background: '#c4a96a',
                color: '#152138',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading || !testimonial.trim() ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {loading ? <Loader2 style={{ width: '18px', animation: 'spin 1s linear infinite' }} /> : <MessageCircle style={{ width: '16px' }} />}
              {loading ? 'Enviando...' : 'Enviar depoimento'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
