'use client'

import { useState, useEffect } from 'react'
import { Calendar, AlertTriangle, Clock, CheckCircle, ArrowLeft, RefreshCw, Scale, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Deadline {
  id: string
  title: string
  clientName: string
  processNumber: string
  deadlineDate: string
  deadlineType: string
  attorney: string
  status: string
  priority: string
  daysUntil: number
  alertLevel: string
  notes: string
}

const typeLabels: Record<string, string> = {
  contestation: 'Contestação', appeal: 'Recurso', manifestation: 'Manifestação',
  hearing: 'Audiência', expertise: 'Perícia', 'sentence-compliance': 'Cumprimento', other: 'Outro',
}
const alertColors: Record<string, { bg: string; border: string; text: string }> = {
  critical: { bg: 'rgba(220,38,38,0.08)', border: '#dc2626', text: '#dc2626' },
  urgent: { bg: 'rgba(234,88,12,0.08)', border: '#ea580c', text: '#ea580c' },
  attention: { bg: 'rgba(234,179,8,0.08)', border: '#eab308', text: '#eab308' },
  normal: { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.08)', text: '#b8bfc8' },
}

export default function DeadlinesPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deadlines, setDeadlines] = useState<Deadline[]>([])
  const [summary, setSummary] = useState<any>(null)
  const [error, setError] = useState('')
  const [days, setDays] = useState(30)

  async function fetchDeadlines() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/deadlines?days=${days}`, {
        headers: { Authorization: `Bearer ${password}` },
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Erro'); return }
      setDeadlines(json.deadlines || [])
      setSummary(json.summary || null)
      setAuthenticated(true)
    } catch {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '400px', width: '100%', textAlign: 'center' }}>
          <Calendar style={{ width: '48px', height: '48px', color: '#c4a96a', margin: '0 auto 16px' }} />
          <h1 style={{ color: '#f1eae2', fontFamily: "'Playfair Display', serif", fontSize: '24px', marginBottom: '24px' }}>Calendário de Prazos</h1>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && fetchDeadlines()} placeholder="Senha" style={{ width: '100%', padding: '14px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#f1eae2', fontSize: '15px', marginBottom: '12px', textAlign: 'center' }} />
          <button onClick={fetchDeadlines} disabled={loading} style={{ width: '100%', padding: '14px', background: '#c4a96a', color: '#152138', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>{loading ? 'Carregando...' : 'Acessar'}</button>
          {error && <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '12px' }}>{error}</p>}
        </div>
      </div>
    )
  }

  // Agrupar por semana
  const byWeek: Record<string, Deadline[]> = {}
  deadlines.forEach(d => {
    const weekStart = new Date(d.deadlineDate)
    const dayOfWeek = weekStart.getDay()
    weekStart.setDate(weekStart.getDate() - dayOfWeek)
    const key = weekStart.toISOString().split('T')[0]
    if (!byWeek[key]) byWeek[key] = []
    byWeek[key].push(d)
  })

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f1eae2', fontFamily: "'Source Sans 3', sans-serif" }}>
      {/* Header */}
      <div style={{ background: '#152138', padding: '20px 24px', borderBottom: '1px solid rgba(196,169,106,0.15)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/admin-tools" style={{ color: '#b8bfc8', textDecoration: 'none' }}><ArrowLeft style={{ width: '20px' }} /></Link>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', margin: 0 }}>Prazos <span style={{ color: '#c4a96a' }}>Processuais</span></h1>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select value={days} onChange={e => { setDays(Number(e.target.value)); setTimeout(fetchDeadlines, 100) }} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px 12px', color: '#b8bfc8', fontSize: '12px' }}>
              <option value={7}>7 dias</option>
              <option value={14}>14 dias</option>
              <option value={30}>30 dias</option>
              <option value={60}>60 dias</option>
            </select>
            <button onClick={fetchDeadlines} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '6px 12px', color: '#b8bfc8', cursor: 'pointer', fontSize: '12px' }}>
              <RefreshCw style={{ width: '12px' }} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
        {/* Summary cards */}
        {summary && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '32px' }}>
            {[
              { label: 'Crítico (1d)', count: summary.critical, color: '#dc2626', icon: AlertTriangle },
              { label: 'Urgente (3d)', count: summary.urgent, color: '#ea580c', icon: Clock },
              { label: 'Atenção (7d)', count: summary.attention, color: '#eab308', icon: Calendar },
              { label: 'Normal', count: summary.normal, color: '#25D366', icon: CheckCircle },
            ].map(({ label, count, color, icon: Icon }) => (
              <div key={label} style={{ background: `${color}10`, border: `1px solid ${color}25`, borderRadius: '10px', padding: '16px', textAlign: 'center' }}>
                <Icon style={{ width: '20px', height: '20px', color, margin: '0 auto 8px' }} />
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 700, color }}>{count}</div>
                <div style={{ fontSize: '11px', color: '#b8bfc8', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Deadline list */}
        {deadlines.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px', color: '#666' }}>
            <CheckCircle style={{ width: '48px', height: '48px', color: '#25D366', margin: '0 auto 16px' }} />
            <p style={{ fontSize: '16px' }}>Nenhum prazo nos próximos {days} dias</p>
          </div>
        ) : (
          deadlines.map(d => {
            const ac = alertColors[d.alertLevel] || alertColors.normal
            const dateStr = new Date(d.deadlineDate).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
            return (
              <div key={d.id} style={{
                background: ac.bg,
                border: `1px solid ${ac.border}`,
                borderLeft: `4px solid ${ac.border}`,
                borderRadius: '8px',
                padding: '16px 20px',
                marginBottom: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
                flexWrap: 'wrap',
              }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <div style={{ fontWeight: 600, fontSize: '15px', color: '#f1eae2', marginBottom: '4px' }}>{d.title}</div>
                  <div style={{ fontSize: '12px', color: '#b8bfc8', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ color: ac.text, fontWeight: 600 }}>{typeLabels[d.deadlineType] || d.deadlineType}</span>
                    {d.clientName && <span>• {d.clientName}</span>}
                    {d.processNumber && <span>• {d.processNumber}</span>}
                    {d.attorney && <span>• {d.attorney === 'edivaldo' ? 'Dr. Edivaldo' : 'Dra. Gabrielly'}</span>}
                  </div>
                </div>
                <div style={{ textAlign: 'right', minWidth: '120px' }}>
                  <div style={{ fontSize: '13px', color: '#b8bfc8' }}>{dateStr}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: ac.text, marginTop: '2px' }}>
                    {d.daysUntil === 0 ? 'HOJE' : d.daysUntil === 1 ? 'AMANHÃ' : `${d.daysUntil} dias`}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
