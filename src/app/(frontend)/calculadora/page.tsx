'use client'

import { useState } from 'react'
import { Calculator, ChevronRight, ChevronLeft, CheckCircle, AlertCircle, MessageCircle, Scale, Send, Loader2 } from 'lucide-react'
import Link from 'next/link'

/* ── Tipos de caso e faixas de indenização (baseado em jurisprudência TJRN/STJ) ── */
const caseTypes: Record<string, {
  label: string
  category: string
  questions: Array<{ question: string; options: Array<{ label: string; weight: number }> }>
  baseRange: [number, number]
}> = {
  'negativacao-indevida': {
    label: 'Negativação Indevida (SPC/Serasa)',
    category: 'consumidor',
    questions: [
      {
        question: 'A negativação já foi removida?',
        options: [
          { label: 'Não, ainda está ativa', weight: 1.5 },
          { label: 'Sim, mas demorou meses', weight: 1.2 },
          { label: 'Sim, foi removida rapidamente', weight: 0.8 },
        ],
      },
      {
        question: 'Você tinha algum crédito negado por causa disso?',
        options: [
          { label: 'Sim, perdi financiamento/empréstimo', weight: 1.8 },
          { label: 'Sim, cartão de crédito recusado', weight: 1.3 },
          { label: 'Não percebi impacto direto', weight: 0.7 },
        ],
      },
      {
        question: 'Havia dívida legítima com a empresa?',
        options: [
          { label: 'Não, nunca fui cliente', weight: 1.6 },
          { label: 'Já tinha quitado a dívida', weight: 1.4 },
          { label: 'A dívida existia mas o valor estava errado', weight: 1.0 },
        ],
      },
    ],
    baseRange: [3000, 15000],
  },
  'cobranca-indevida': {
    label: 'Cobrança Indevida / Valor Pago a Mais',
    category: 'consumidor',
    questions: [
      {
        question: 'Qual o valor cobrado indevidamente?',
        options: [
          { label: 'Até R$ 500', weight: 0.8 },
          { label: 'R$ 500 a R$ 2.000', weight: 1.2 },
          { label: 'R$ 2.000 a R$ 10.000', weight: 1.5 },
          { label: 'Acima de R$ 10.000', weight: 2.0 },
        ],
      },
      {
        question: 'Você chegou a pagar o valor indevido?',
        options: [
          { label: 'Sim, paguei integralmente', weight: 1.5 },
          { label: 'Sim, paguei parcialmente', weight: 1.2 },
          { label: 'Não paguei', weight: 0.8 },
        ],
      },
      {
        question: 'Como foi a tentativa de resolver com a empresa?',
        options: [
          { label: 'Não consegui contato', weight: 1.3 },
          { label: 'Prometeram resolver e não resolveram', weight: 1.4 },
          { label: 'Recusaram o ressarcimento', weight: 1.5 },
        ],
      },
    ],
    baseRange: [2000, 12000],
  },
  'fraude-bancaria': {
    label: 'Fraude Bancária / Golpe em Conta',
    category: 'consumidor',
    questions: [
      {
        question: 'Qual o tipo de fraude?',
        options: [
          { label: 'Pix/transferência não autorizada', weight: 1.5 },
          { label: 'Cartão clonado', weight: 1.3 },
          { label: 'Empréstimo fraudulento em meu nome', weight: 1.8 },
          { label: 'Golpe via WhatsApp/ligação', weight: 1.2 },
        ],
      },
      {
        question: 'Qual o valor do prejuízo?',
        options: [
          { label: 'Até R$ 1.000', weight: 0.8 },
          { label: 'R$ 1.000 a R$ 5.000', weight: 1.2 },
          { label: 'R$ 5.000 a R$ 20.000', weight: 1.6 },
          { label: 'Acima de R$ 20.000', weight: 2.0 },
        ],
      },
      {
        question: 'O banco se recusou a devolver o valor?',
        options: [
          { label: 'Sim, negaram minha contestação', weight: 1.5 },
          { label: 'Devolveram parcialmente', weight: 1.2 },
          { label: 'Ainda estou aguardando resposta', weight: 1.0 },
        ],
      },
    ],
    baseRange: [5000, 25000],
  },
  'vazamento-dados': {
    label: 'Vazamento de Dados Pessoais (LGPD)',
    category: 'digital',
    questions: [
      {
        question: 'Quais dados foram vazados?',
        options: [
          { label: 'Nome e e-mail', weight: 0.8 },
          { label: 'CPF e dados bancários', weight: 1.5 },
          { label: 'Dados sensíveis (saúde, biometria)', weight: 2.0 },
          { label: 'Fotos/vídeos pessoais', weight: 1.8 },
        ],
      },
      {
        question: 'Sofreu alguma consequência?',
        options: [
          { label: 'Spam/ligações indesejadas', weight: 0.8 },
          { label: 'Tentativas de fraude em meu nome', weight: 1.5 },
          { label: 'Fraude consumada (perdi dinheiro)', weight: 2.0 },
          { label: 'Exposição/constrangimento público', weight: 1.7 },
        ],
      },
      {
        question: 'A empresa reconheceu o vazamento?',
        options: [
          { label: 'Sim, mas não ofereceu reparação', weight: 1.3 },
          { label: 'Negou o vazamento', weight: 1.5 },
          { label: 'Não respondeu', weight: 1.2 },
        ],
      },
    ],
    baseRange: [5000, 30000],
  },
}

export default function CalculadoraPage() {
  const [selectedCase, setSelectedCase] = useState<string | null>(null)
  const [step, setStep] = useState(0) // 0 = select case, 1-N = questions, last = result
  const [weights, setWeights] = useState<number[]>([])
  const [result, setResult] = useState<{ min: number; max: number } | null>(null)
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadSent, setLeadSent] = useState(false)
  const [leadLoading, setLeadLoading] = useState(false)
  const [leadName, setLeadName] = useState('')
  const [leadPhone, setLeadPhone] = useState('')
  const [leadError, setLeadError] = useState('')

  const caseData = selectedCase ? caseTypes[selectedCase] : null
  const totalSteps = caseData ? caseData.questions.length + 2 : 1

  function selectCase(caseKey: string) {
    setSelectedCase(caseKey)
    setWeights([])
    setResult(null)
    setStep(1)
  }

  function answerQuestion(weight: number) {
    const newWeights = [...weights, weight]
    setWeights(newWeights)

    if (caseData && newWeights.length >= caseData.questions.length) {
      // Calculate result
      const avgWeight = newWeights.reduce((a, b) => a + b, 0) / newWeights.length
      const [baseMin, baseMax] = caseData.baseRange
      setResult({
        min: Math.round((baseMin * avgWeight) / 100) * 100,
        max: Math.round((baseMax * avgWeight) / 100) * 100,
      })
      setStep(newWeights.length + 1)
    } else {
      setStep((s) => s + 1)
    }
  }

  function formatCurrency(value: number) {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0 })
  }

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, '')
    if (digits.length <= 2) return `(${digits}`
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`
  }

  async function submitLead() {
    if (!leadName || leadPhone.replace(/\D/g, '').length < 10) {
      setLeadError('Preencha nome e telefone.')
      return
    }
    setLeadLoading(true)
    setLeadError('')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName,
          phone: leadPhone.replace(/\D/g, ''),
          source: 'calculator',
          campaignSlug: selectedCase,
          urgency: 'medium',
          estimatedValue: result ? Math.round((result.min + result.max) / 2) : undefined,
          caseDescription: `Calculadora de Causas — Tipo: ${caseData?.label}. Estimativa: ${result ? `${formatCurrency(result.min)} a ${formatCurrency(result.max)}` : 'N/A'}.`,
          qualificationAnswers: caseData?.questions.map((q, i) => ({
            question: q.question,
            answer: q.options.find((o) => o.weight === weights[i])?.label || '',
          })) || [],
        }),
      })
      if (res.ok) setLeadSent(true)
      else setLeadError('Erro ao enviar. Tente novamente.')
    } catch {
      setLeadError('Erro de conexão.')
    } finally {
      setLeadLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f1eae2', fontFamily: "'Source Sans 3', sans-serif" }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #152138 0%, #1c2d4a 100%)', padding: '100px 24px 80px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-5%', opacity: 0.03, pointerEvents: 'none' }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '500px', fontWeight: 'bold', color: '#ede1c3' }}>CM</span>
        </div>
        <div style={{ position: 'relative', zIndex: 10, maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(196,169,106,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Calculator style={{ width: '32px', height: '32px', color: '#c4a96a' }} />
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#f1eae2', marginBottom: '16px', lineHeight: 1.15 }}>
            Calculadora de<br /><span style={{ color: '#c4a96a' }}>Indenização</span>
          </h1>
          <p style={{ color: 'rgba(241,234,226,0.6)', fontSize: '17px', lineHeight: 1.7, fontWeight: 300 }}>
            Descubra uma estimativa do valor que você pode ter direito a receber. Gratuito, rápido e sem compromisso.
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '640px', margin: '-40px auto 0', padding: '0 24px 80px', position: 'relative', zIndex: 20 }}>

        {/* Step 0: Select case type */}
        {step === 0 && (
          <div style={{ background: '#fff', borderRadius: '8px', padding: '40px 32px', boxShadow: '0 10px 40px rgba(21,33,56,0.08)', borderTop: '4px solid #c4a96a' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#152138', marginBottom: '8px' }}>
              Qual é a sua situação?
            </h2>
            <p style={{ color: 'rgba(21,33,56,0.5)', fontSize: '14px', marginBottom: '24px' }}>
              Selecione o tipo de problema para iniciar a estimativa.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(caseTypes).map(([key, ct]) => (
                <button
                  key={key}
                  onClick={() => selectCase(key)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '18px 20px',
                    background: '#fff',
                    border: '2px solid rgba(21,33,56,0.08)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: "'Source Sans 3', sans-serif",
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#c4a96a'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(21,33,56,0.08)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(21,33,56,0.08)'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 600, color: '#152138', marginBottom: '2px' }}>{ct.label}</div>
                    <div style={{ fontSize: '12px', color: 'rgba(21,33,56,0.4)' }}>Estimativa: {formatCurrency(ct.baseRange[0])} — {formatCurrency(ct.baseRange[1])}</div>
                  </div>
                  <ChevronRight style={{ width: '20px', height: '20px', color: '#c4a96a', flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Question Steps */}
        {caseData && step >= 1 && step <= caseData.questions.length && (() => {
          const q = caseData.questions[step - 1]
          return (
            <div key={step} style={{ background: '#fff', borderRadius: '8px', padding: '40px 32px', boxShadow: '0 10px 40px rgba(21,33,56,0.08)', borderTop: '4px solid #c4a96a', animation: 'fadeIn 0.3s ease' }}>
              {/* Progress */}
              <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', color: 'rgba(21,33,56,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Pergunta {step} de {caseData.questions.length}
                  </span>
                  <span style={{ fontSize: '11px', color: '#c4a96a', fontWeight: 600 }}>
                    {caseData.label}
                  </span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(21,33,56,0.06)', borderRadius: '2px' }}>
                  <div style={{ width: `${(step / caseData.questions.length) * 100}%`, height: '100%', background: '#c4a96a', borderRadius: '2px', transition: 'width 0.4s' }} />
                </div>
              </div>

              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#152138', marginBottom: '24px' }}>
                {q.question}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {q.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => answerQuestion(option.weight)}
                    style={{
                      padding: '16px 20px',
                      border: '2px solid rgba(21,33,56,0.08)',
                      borderRadius: '6px',
                      background: '#fff',
                      color: '#152138',
                      fontSize: '15px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: "'Source Sans 3', sans-serif",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#c4a96a'; e.currentTarget.style.background = 'rgba(196,169,106,0.04)' }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(21,33,56,0.08)'; e.currentTarget.style.background = '#fff' }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {step > 1 && (
                <button onClick={() => { setWeights(w => w.slice(0, -1)); setStep(s => s - 1) }}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '20px', background: 'none', border: 'none', color: 'rgba(21,33,56,0.4)', fontSize: '13px', cursor: 'pointer', fontFamily: "'Source Sans 3', sans-serif" }}>
                  <ChevronLeft style={{ width: '14px', height: '14px' }} /> Voltar
                </button>
              )}
            </div>
          )
        })()}

        {/* Result */}
        {result && step > (caseData?.questions.length || 0) && (
          <div style={{ animation: 'fadeIn 0.5s ease' }}>
            <div style={{ background: '#fff', borderRadius: '8px', padding: '48px 32px', boxShadow: '0 10px 40px rgba(21,33,56,0.08)', borderTop: '4px solid #25D366', textAlign: 'center', marginBottom: '24px' }}>
              <Scale style={{ width: '40px', height: '40px', color: '#c4a96a', margin: '0 auto 20px' }} />
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#152138', marginBottom: '8px' }}>
                Estimativa de Indenização
              </h2>
              <p style={{ color: 'rgba(21,33,56,0.5)', fontSize: '13px', marginBottom: '32px' }}>
                {caseData?.label} — baseado em jurisprudência do TJRN e STJ
              </p>

              <div style={{ background: 'linear-gradient(135deg, #152138, #1c2d4a)', borderRadius: '12px', padding: '32px', marginBottom: '24px' }}>
                <div style={{ color: 'rgba(241,234,226,0.5)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '12px' }}>Valor Estimado</div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', fontWeight: 700, color: '#c4a96a', lineHeight: 1.2 }}>
                  {formatCurrency(result.min)} <span style={{ color: 'rgba(241,234,226,0.3)', fontSize: '24px' }}>a</span> {formatCurrency(result.max)}
                </div>
              </div>

              <p style={{ color: 'rgba(21,33,56,0.5)', fontSize: '12px', lineHeight: 1.6, marginBottom: '24px' }}>
                * Valores estimados com base em decisões judiciais recentes. O valor real depende de análise detalhada do caso por um advogado.
              </p>

              {!showLeadForm && !leadSent && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    onClick={() => setShowLeadForm(true)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      padding: '16px 32px', background: '#152138', color: '#f1eae2',
                      border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: 600,
                      cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em',
                      fontFamily: "'Source Sans 3', sans-serif",
                    }}
                  >
                    <Send style={{ width: '16px', height: '16px' }} />
                    Quero uma análise gratuita do meu caso
                  </button>
                  <a
                    href={`https://wa.me/5584991243985?text=${encodeURIComponent(`Olá! Fiz a calculadora no site e meu caso de ${caseData?.label} tem estimativa de ${formatCurrency(result.min)} a ${formatCurrency(result.max)}. Gostaria de uma análise.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      padding: '14px 32px', background: '#25D366', color: '#fff',
                      borderRadius: '4px', textDecoration: 'none', fontSize: '14px', fontWeight: 600,
                      textTransform: 'uppercase', letterSpacing: '0.05em',
                    }}
                  >
                    <MessageCircle style={{ width: '16px', height: '16px' }} />
                    Falar pelo WhatsApp agora
                  </a>
                </div>
              )}

              {/* Lead form inline */}
              {showLeadForm && !leadSent && (
                <div style={{ textAlign: 'left', marginTop: '8px' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#152138', display: 'block', marginBottom: '6px' }}>Nome *</label>
                    <input type="text" value={leadName} onChange={(e) => setLeadName(e.target.value)} placeholder="Seu nome completo"
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid rgba(21,33,56,0.15)', borderRadius: '6px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 600, color: '#152138', display: 'block', marginBottom: '6px' }}>WhatsApp *</label>
                    <input type="tel" value={leadPhone} onChange={(e) => setLeadPhone(formatPhone(e.target.value))} placeholder="(84) 99999-9999" maxLength={15}
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid rgba(21,33,56,0.15)', borderRadius: '6px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  {leadError && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', color: '#dc2626', fontSize: '13px' }}>
                      <AlertCircle style={{ width: '14px', height: '14px' }} /> {leadError}
                    </div>
                  )}
                  <button onClick={submitLead} disabled={leadLoading}
                    style={{
                      width: '100%', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      background: '#152138', color: '#f1eae2', border: 'none', borderRadius: '4px',
                      fontSize: '14px', fontWeight: 600, cursor: leadLoading ? 'not-allowed' : 'pointer',
                      textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: "'Source Sans 3', sans-serif",
                    }}>
                    {leadLoading ? <><Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} /> Enviando...</> : <><Send style={{ width: '16px', height: '16px' }} /> Solicitar Análise Gratuita</>}
                  </button>
                </div>
              )}

              {leadSent && (
                <div style={{ background: 'rgba(37,211,102,0.06)', border: '1px solid rgba(37,211,102,0.2)', borderRadius: '8px', padding: '24px', marginTop: '8px' }}>
                  <CheckCircle style={{ width: '32px', height: '32px', color: '#25D366', margin: '0 auto 12px' }} />
                  <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#152138', marginBottom: '8px' }}>Recebemos!</h4>
                  <p style={{ color: 'rgba(21,33,56,0.6)', fontSize: '14px' }}>Um advogado especialista entrará em contato em até 24h úteis.</p>
                </div>
              )}
            </div>

            <button onClick={() => { setStep(0); setSelectedCase(null); setWeights([]); setResult(null); setShowLeadForm(false); setLeadSent(false) }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: '0 auto', background: 'none', border: 'none', color: 'rgba(21,33,56,0.4)', fontSize: '13px', cursor: 'pointer', fontFamily: "'Source Sans 3', sans-serif" }}>
              <ChevronLeft style={{ width: '14px', height: '14px' }} /> Calcular outro tipo de caso
            </button>
          </div>
        )}

        {/* Disclaimer */}
        <div style={{ marginTop: '48px', textAlign: 'center' }}>
          <p style={{ color: 'rgba(21,33,56,0.3)', fontSize: '11px', lineHeight: 1.6 }}>
            Esta calculadora oferece estimativas com base em decisões judiciais recentes e não constitui aconselhamento jurídico.
            Os valores reais podem variar conforme as circunstâncias específicas de cada caso.
            <br />Cavalcante & Melo Sociedade de Advogados — OAB/RN
          </p>
          <Link href="/" style={{ color: '#c4a96a', fontSize: '13px', textDecoration: 'none', display: 'inline-block', marginTop: '12px' }}>
            ← Voltar ao site
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
