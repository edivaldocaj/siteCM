'use client'

import { useState, useEffect } from 'react'
import { Send, CheckCircle, AlertCircle, ChevronRight, ChevronLeft, User, Phone, Mail, FileText, Loader2 } from 'lucide-react'

/* ── Perguntas de qualificação por categoria ── */
const qualificationQuestions: Record<string, Array<{ question: string; type: 'select' | 'text' | 'number'; options?: string[] }>> = {
  consumidor: [
    { question: 'Qual o tipo de problema?', type: 'select', options: ['Cobrança indevida', 'Negativação indevida', 'Produto com defeito', 'Serviço não prestado', 'Fraude bancária', 'Outro'] },
    { question: 'Qual empresa ou banco envolvido?', type: 'text' },
    { question: 'Qual o valor aproximado do prejuízo (R$)?', type: 'number' },
    { question: 'Há quanto tempo ocorreu o problema?', type: 'select', options: ['Menos de 1 mês', '1-6 meses', '6-12 meses', 'Mais de 1 ano', 'Mais de 3 anos'] },
  ],
  digital: [
    { question: 'Qual o tipo de problema?', type: 'select', options: ['Vazamento de dados pessoais', 'Uso indevido de dados', 'Golpe online / Phishing', 'Difamação na internet', 'Remoção de conteúdo', 'Outro'] },
    { question: 'Qual plataforma ou empresa envolvida?', type: 'text' },
    { question: 'Você possui provas (prints, e-mails)?', type: 'select', options: ['Sim, tenho provas', 'Tenho algumas', 'Não tenho', 'Não sei o que serve como prova'] },
    { question: 'Houve prejuízo financeiro?', type: 'select', options: ['Sim, perdi dinheiro', 'Sim, perdi oportunidades', 'Apenas dano moral', 'Não sei avaliar'] },
  ],
  criminal: [
    { question: 'Qual a situação?', type: 'select', options: ['Fui vítima de crime', 'Estou sendo investigado', 'Fui intimado/citado', 'Alguém próximo foi preso', 'Preciso de habeas corpus', 'Outro'] },
    { question: 'Já tem advogado no caso?', type: 'select', options: ['Não', 'Sim, mas quero trocar', 'Sim, quero segunda opinião'] },
    { question: 'Qual a urgência?', type: 'select', options: ['Emergência (prisão/flagrante)', 'Urgente (prazo correndo)', 'Normal (quero me informar)'] },
  ],
  imobiliario: [
    { question: 'Qual o tipo de problema?', type: 'select', options: ['Atraso na entrega do imóvel', 'Defeito na construção', 'Distrato / Rescisão', 'Problema com locação', 'Usucapião', 'Regularização', 'Outro'] },
    { question: 'Qual o valor do imóvel (R$)?', type: 'number' },
    { question: 'Existe contrato assinado?', type: 'select', options: ['Sim', 'Não', 'Não sei'] },
  ],
  tributario: [
    { question: 'Qual o tipo de problema?', type: 'select', options: ['Execução fiscal', 'Cobrança indevida de tributo', 'Planejamento tributário', 'Parcelamento de dívida', 'Auto de infração', 'Outro'] },
    { question: 'Pessoa física ou jurídica?', type: 'select', options: ['Pessoa Física', 'MEI / ME', 'Empresa (EPP/Ltda/SA)'] },
    { question: 'Qual o valor aproximado envolvido (R$)?', type: 'number' },
  ],
}

/* ── Fallback questions for unknown categories ── */
const defaultQuestions = [
  { question: 'Descreva brevemente sua situação', type: 'text' as const },
  { question: 'Qual a urgência?', type: 'select' as const, options: ['Baixa', 'Média', 'Alta', 'Urgente'] },
]

interface CampaignLeadFormProps {
  campaignSlug: string
  campaignTitle: string
  category: string
  accentColor: string
  whatsappUrl: string
}

export function CampaignLeadForm({
  campaignSlug,
  campaignTitle,
  category,
  accentColor,
  whatsappUrl,
}: CampaignLeadFormProps) {
  const [step, setStep] = useState(0) // 0 = dados pessoais, 1+ = qualificação, last = envio
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [score, setScore] = useState(0)

  // Form data
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [caseDescription, setCaseDescription] = useState('')
  const [answers, setAnswers] = useState<Array<{ question: string; answer: string }>>([])

  // UTM params
  const [utmParams, setUtmParams] = useState<Record<string, string>>({})

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      setUtmParams({
        utmSource: params.get('utm_source') || '',
        utmMedium: params.get('utm_medium') || '',
        utmCampaign: params.get('utm_campaign') || '',
        utmContent: params.get('utm_content') || '',
        referrerUrl: document.referrer || '',
      })
    }
  }, [])

  const questions = qualificationQuestions[category] || defaultQuestions
  const totalSteps = 2 + questions.length // dados pessoais + N perguntas + caso/envio
  const progress = ((step + 1) / totalSteps) * 100

  function handleAnswerChange(questionIndex: number, question: string, answer: string) {
    setAnswers((prev) => {
      const updated = [...prev]
      updated[questionIndex] = { question, answer }
      return updated
    })
  }

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '')
    if (digits.length <= 2) return `(${digits}`
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
  }

  function canProceed(): boolean {
    if (step === 0) return name.trim().length >= 2 && phone.replace(/\D/g, '').length >= 10
    if (step > 0 && step <= questions.length) {
      const currentAnswer = answers[step - 1]
      return !!(currentAnswer?.answer?.trim())
    }
    return true
  }

  async function handleSubmit() {
    setLoading(true)
    setError('')

    try {
      // Extract estimated value from answers if present
      let estimatedValue: number | undefined
      const valueAnswer = answers.find((a) => a.question.toLowerCase().includes('valor'))
      if (valueAnswer) {
        const numStr = valueAnswer.answer.replace(/\D/g, '')
        if (numStr) estimatedValue = parseInt(numStr)
      }

      // Extract urgency
      let urgency = 'medium'
      const urgencyAnswer = answers.find((a) => a.question.toLowerCase().includes('urgência') || a.question.toLowerCase().includes('urgencia'))
      if (urgencyAnswer) {
        const ans = urgencyAnswer.answer.toLowerCase()
        if (ans.includes('emergência') || ans.includes('emergencia') || ans.includes('urgente')) urgency = 'urgent'
        else if (ans.includes('alta') || ans.includes('prazo')) urgency = 'high'
        else if (ans.includes('baixa') || ans.includes('informar')) urgency = 'low'
      }

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone: phone.replace(/\D/g, ''),
          email: email || undefined,
          source: 'campaign-form',
          campaignSlug,
          caseDescription: caseDescription || undefined,
          estimatedValue,
          urgency,
          qualificationAnswers: answers.filter((a) => a.answer),
          ...utmParams,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erro ao enviar. Tente novamente.')
        return
      }

      setScore(data.score || 0)
      setSuccess(true)
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  /* ── Success State ── */
  if (success) {
    return (
      <div
        id="formulario"
        style={{
          background: '#ffffff',
          borderRadius: '8px',
          padding: '48px 32px',
          boxShadow: '0 10px 40px rgba(21,33,56,0.08)',
          borderTop: `4px solid #25D366`,
          textAlign: 'center',
          animation: 'fadeInUp 0.5s ease',
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'rgba(37,211,102,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
          }}
        >
          <CheckCircle style={{ width: '36px', height: '36px', color: '#25D366' }} />
        </div>
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '24px',
            color: '#152138',
            marginBottom: '12px',
          }}
        >
          Recebemos sua solicitação!
        </h3>
        <p style={{ color: 'rgba(21,33,56,0.6)', fontSize: '15px', lineHeight: 1.7, marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
          Nossa equipe analisará seu caso e entrará em contato em até <strong style={{ color: '#152138' }}>24 horas úteis</strong>.
          {score >= 60 && (
            <span style={{ display: 'block', marginTop: '8px', color: '#25D366', fontWeight: 600 }}>
              Seu caso foi identificado como prioritário.
            </span>
          )}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#25D366',
              color: '#fff',
              padding: '14px 28px',
              borderRadius: '4px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '14px',
              transition: 'transform 0.2s',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.612.638l4.695-1.283A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.359 0-4.546-.685-6.398-1.867l-.448-.276-3.148.86.88-3.074-.303-.467A9.958 9.958 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
            Falar agora pelo WhatsApp
          </a>
        </div>

        <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </div>
    )
  }

  /* ── Form Steps ── */
  return (
    <div
      id="formulario"
      style={{
        background: '#ffffff',
        borderRadius: '8px',
        padding: '40px 32px',
        boxShadow: '0 10px 40px rgba(21,33,56,0.08)',
        borderTop: `4px solid ${accentColor}`,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
        <FileText style={{ width: '24px', height: '24px', color: '#152138' }} strokeWidth={1.5} />
        <h3
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '22px',
            color: '#152138',
            margin: 0,
          }}
        >
          Análise Gratuita do Seu Caso
        </h3>
      </div>
      <p style={{ color: 'rgba(21,33,56,0.5)', fontSize: '14px', marginBottom: '24px' }}>
        Responda algumas perguntas para que possamos avaliar sua situação.
      </p>

      {/* Progress bar */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '11px', color: 'rgba(21,33,56,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            Etapa {step + 1} de {totalSteps}
          </span>
          <span style={{ fontSize: '11px', color: accentColor, fontWeight: 600 }}>
            {Math.round(progress)}%
          </span>
        </div>
        <div style={{ width: '100%', height: '4px', background: 'rgba(21,33,56,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: accentColor,
              borderRadius: '2px',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      {/* Step 0: Personal Data */}
      {step === 0 && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#152138', marginBottom: '8px' }}>
              <User style={{ width: '14px', height: '14px' }} />
              Nome Completo *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '1px solid rgba(21,33,56,0.15)',
                borderRadius: '6px',
                fontSize: '15px',
                color: '#152138',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = accentColor)}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(21,33,56,0.15)')}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#152138', marginBottom: '8px' }}>
              <Phone style={{ width: '14px', height: '14px' }} />
              WhatsApp / Telefone *
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="(84) 99999-9999"
              required
              maxLength={15}
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '1px solid rgba(21,33,56,0.15)',
                borderRadius: '6px',
                fontSize: '15px',
                color: '#152138',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = accentColor)}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(21,33,56,0.15)')}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#152138', marginBottom: '8px' }}>
              <Mail style={{ width: '14px', height: '14px' }} />
              E-mail <span style={{ fontWeight: 300, color: 'rgba(21,33,56,0.4)' }}>(opcional)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '1px solid rgba(21,33,56,0.15)',
                borderRadius: '6px',
                fontSize: '15px',
                color: '#152138',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.3s',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = accentColor)}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(21,33,56,0.15)')}
            />
          </div>
        </div>
      )}

      {/* Steps 1-N: Qualification Questions */}
      {step > 0 && step <= questions.length && (() => {
        const q = questions[step - 1]
        const currentAnswer = answers[step - 1]?.answer || ''

        return (
          <div key={step} style={{ animation: 'fadeIn 0.3s ease' }}>
            <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#152138', marginBottom: '20px' }}>
              {q.question}
            </h4>

            {q.type === 'select' && q.options ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {q.options.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleAnswerChange(step - 1, q.question, option)}
                    style={{
                      padding: '14px 20px',
                      border: `2px solid ${currentAnswer === option ? accentColor : 'rgba(21,33,56,0.1)'}`,
                      borderRadius: '6px',
                      background: currentAnswer === option ? `${accentColor}0D` : '#fff',
                      color: '#152138',
                      fontSize: '15px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: "'Source Sans 3', sans-serif",
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            ) : q.type === 'number' ? (
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(21,33,56,0.4)', fontSize: '15px' }}>R$</span>
                <input
                  type="text"
                  value={currentAnswer}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '')
                    handleAnswerChange(step - 1, q.question, val ? Number(val).toLocaleString('pt-BR') : '')
                  }}
                  placeholder="0"
                  style={{
                    width: '100%',
                    padding: '14px 16px 14px 42px',
                    border: '1px solid rgba(21,33,56,0.15)',
                    borderRadius: '6px',
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#152138',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = accentColor)}
                  onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(21,33,56,0.15)')}
                />
              </div>
            ) : (
              <textarea
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(step - 1, q.question, e.target.value)}
                rows={4}
                placeholder="Descreva aqui..."
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '1px solid rgba(21,33,56,0.15)',
                  borderRadius: '6px',
                  fontSize: '15px',
                  color: '#152138',
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'vertical',
                  fontFamily: "'Source Sans 3', sans-serif",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = accentColor)}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(21,33,56,0.15)')}
              />
            )}
          </div>
        )
      })()}

      {/* Last step: Case description + Submit */}
      {step === questions.length + 1 && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#152138', marginBottom: '8px' }}>
            Quer acrescentar algo?
          </h4>
          <p style={{ color: 'rgba(21,33,56,0.5)', fontSize: '13px', marginBottom: '16px' }}>
            Opcional — descreva detalhes adicionais do seu caso.
          </p>
          <textarea
            value={caseDescription}
            onChange={(e) => setCaseDescription(e.target.value)}
            rows={4}
            placeholder="Conte mais detalhes sobre a sua situação..."
            style={{
              width: '100%',
              padding: '14px 16px',
              border: '1px solid rgba(21,33,56,0.15)',
              borderRadius: '6px',
              fontSize: '15px',
              color: '#152138',
              outline: 'none',
              boxSizing: 'border-box',
              resize: 'vertical',
              fontFamily: "'Source Sans 3', sans-serif",
            }}
          />

          {/* Summary */}
          <div style={{ marginTop: '24px', padding: '20px', background: 'rgba(21,33,56,0.02)', borderRadius: '6px', border: '1px solid rgba(21,33,56,0.06)' }}>
            <p style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(21,33,56,0.4)', marginBottom: '12px' }}>Resumo</p>
            <p style={{ fontSize: '14px', color: '#152138', marginBottom: '4px' }}><strong>{name}</strong> — {phone}</p>
            {email && <p style={{ fontSize: '13px', color: 'rgba(21,33,56,0.6)' }}>{email}</p>}
            {answers.filter((a) => a.answer).map((a, i) => (
              <p key={i} style={{ fontSize: '13px', color: 'rgba(21,33,56,0.5)', marginTop: '4px' }}>
                {a.question}: <strong style={{ color: '#152138' }}>{a.answer}</strong>
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', padding: '12px', background: 'rgba(220,38,38,0.06)', borderRadius: '6px', border: '1px solid rgba(220,38,38,0.15)' }}>
          <AlertCircle style={{ width: '16px', height: '16px', color: '#dc2626', flexShrink: 0 }} />
          <span style={{ color: '#dc2626', fontSize: '13px' }}>{error}</span>
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px', gap: '12px' }}>
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '12px 20px',
              border: '1px solid rgba(21,33,56,0.15)',
              borderRadius: '4px',
              background: 'transparent',
              color: 'rgba(21,33,56,0.6)',
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: "'Source Sans 3', sans-serif",
            }}
          >
            <ChevronLeft style={{ width: '16px', height: '16px' }} />
            Voltar
          </button>
        ) : (
          <div />
        )}

        {step < totalSteps - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 28px',
              border: 'none',
              borderRadius: '4px',
              background: canProceed() ? accentColor : 'rgba(21,33,56,0.1)',
              color: canProceed() ? '#fff' : 'rgba(21,33,56,0.3)',
              fontSize: '14px',
              fontWeight: 600,
              cursor: canProceed() ? 'pointer' : 'not-allowed',
              fontFamily: "'Source Sans 3', sans-serif",
              transition: 'all 0.3s',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Continuar
            <ChevronRight style={{ width: '16px', height: '16px' }} />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 32px',
              border: 'none',
              borderRadius: '4px',
              background: loading ? 'rgba(21,33,56,0.3)' : '#152138',
              color: '#f1eae2',
              fontSize: '14px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Source Sans 3', sans-serif",
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              transition: 'all 0.3s',
            }}
          >
            {loading ? (
              <>
                <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                Enviando...
              </>
            ) : (
              <>
                <Send style={{ width: '16px', height: '16px' }} />
                Solicitar Análise Gratuita
              </>
            )}
          </button>
        )}
      </div>

      {/* Privacy note */}
      <p style={{ color: 'rgba(21,33,56,0.3)', fontSize: '11px', textAlign: 'center', marginTop: '20px', lineHeight: 1.6 }}>
        Seus dados são protegidos conforme a LGPD. Utilizaremos suas informações exclusivamente para análise do caso e contato.
      </p>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateX(12px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
