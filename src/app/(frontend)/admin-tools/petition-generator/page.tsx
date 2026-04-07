'use client'

import { useState } from 'react'
import { FileText, Scale, Send, Loader2, ArrowLeft, Copy, CheckCircle, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

const categories = [
  { value: 'consumidor', label: 'Consumidor / Cível' },
  { value: 'digital', label: 'Digital / LGPD' },
  { value: 'criminal', label: 'Criminal' },
  { value: 'imobiliario', label: 'Imobiliário' },
  { value: 'tributario', label: 'Tributário' },
]

export default function PetitionGeneratorPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [leadId, setLeadId] = useState('')
  const [category, setCategory] = useState('consumidor')
  const [additionalContext, setAdditionalContext] = useState('')
  const [loading, setLoading] = useState(false)
  const [petition, setPetition] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  async function generate() {
    if (!leadId.trim()) { setError('Informe o ID do lead.'); return }
    setLoading(true)
    setError('')
    setPetition('')

    try {
      const res = await fetch('/api/petition-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ leadId: leadId.trim(), category, additionalContext }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erro ao gerar minuta.'); return }
      setPetition(data.petition)
    } catch {
      setError('Erro de conexão.')
    } finally {
      setLoading(false)
    }
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(petition)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <Scale style={{ width: '48px', height: '48px', color: '#c4a96a', margin: '0 auto 16px' }} />
          <h1 style={{ color: '#f1eae2', fontFamily: "'Playfair Display', serif", fontSize: '24px', marginBottom: '8px' }}>Gerador de Petições</h1>
          <p style={{ color: '#b8bfc8', fontSize: '14px', marginBottom: '24px' }}>Minutas com IA — revisão obrigatória</p>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && setAuthenticated(true)} placeholder="Senha" style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f1eae2', fontSize: '15px', marginBottom: '12px', textAlign: 'center' }} />
          <button onClick={() => setAuthenticated(true)} style={{ width: '100%', padding: '14px', background: '#c4a96a', color: '#152138', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>Acessar</button>
          <Link href="/admin-tools" style={{ color: '#b8bfc8', fontSize: '13px', display: 'block', marginTop: '16px', textDecoration: 'none' }}>← Voltar</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1eae2', fontFamily: "'Source Sans 3', sans-serif" }}>
      <div style={{ background: '#152138', padding: '20px 24px', borderBottom: '1px solid rgba(196,169,106,0.15)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/admin-tools" style={{ color: '#b8bfc8', textDecoration: 'none' }}><ArrowLeft style={{ width: '20px' }} /></Link>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', margin: 0 }}>Gerador de <span style={{ color: '#c4a96a' }}>Petições com IA</span></h1>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Warning */}
        <div style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.25)', borderRadius: '8px', padding: '16px', marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <AlertTriangle style={{ width: '20px', height: '20px', color: '#eab308', flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '13px', color: '#b8bfc8', lineHeight: 1.6 }}>
            <strong style={{ color: '#eab308' }}>ATENÇÃO:</strong> As minutas geradas por IA são apenas rascunhos iniciais e requerem revisão obrigatória pelo advogado responsável antes de qualquer uso. A IA utiliza exclusivamente os precedentes cadastrados no banco de jurisprudência do escritório.
          </div>
        </div>

        {/* Form */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#b8bfc8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', display: 'block' }}>ID do Lead</label>
              <input value={leadId} onChange={e => setLeadId(e.target.value)} placeholder="Ex: 1, 2, 3..." style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#f1eae2', fontSize: '14px' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#b8bfc8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', display: 'block' }}>Categoria</label>
              <select value={category} onChange={e => setCategory(e.target.value)} style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#f1eae2', fontSize: '14px' }}>
                {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', color: '#b8bfc8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px', display: 'block' }}>Contexto adicional (opcional)</label>
            <textarea value={additionalContext} onChange={e => setAdditionalContext(e.target.value)} rows={4} placeholder="Informações adicionais do advogado: fatos complementares, pedidos específicos, estratégia desejada..." style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: '#f1eae2', fontSize: '14px', resize: 'vertical', fontFamily: "'Source Sans 3', sans-serif" }} />
          </div>
          <button onClick={generate} disabled={loading} style={{ width: '100%', padding: '14px', background: '#c4a96a', color: '#152138', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {loading ? <><Loader2 style={{ width: '18px', animation: 'spin 1s linear infinite' }} /> Gerando minuta (pode levar até 30s)...</> : <><FileText style={{ width: '18px' }} /> Gerar Minuta</>}
          </button>
          {error && <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '12px', textAlign: 'center' }}>{error}</p>}
        </div>

        {/* Result */}
        {petition && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', overflow: 'hidden' }}>
            <div style={{ background: '#152138', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText style={{ width: '18px', color: '#c4a96a' }} /> Minuta Gerada
              </h3>
              <button onClick={copyToClipboard} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px 16px', color: '#b8bfc8', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {copied ? <><CheckCircle style={{ width: '14px', color: '#25D366' }} /> Copiado!</> : <><Copy style={{ width: '14px' }} /> Copiar</>}
              </button>
            </div>
            <div style={{ padding: '24px', fontSize: '14px', lineHeight: 1.8, color: '#d1d5db', whiteSpace: 'pre-wrap', maxHeight: '600px', overflowY: 'auto' }}>
              {petition}
            </div>
            <div style={{ padding: '12px 20px', background: 'rgba(220,38,38,0.06)', borderTop: '1px solid rgba(220,38,38,0.15)', fontSize: '12px', color: '#dc2626', textAlign: 'center', fontWeight: 600 }}>
              ⚠️ MINUTA GERADA POR IA — REVISÃO OBRIGATÓRIA ANTES DE PROTOCOLAR
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
