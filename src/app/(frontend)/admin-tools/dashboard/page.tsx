'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Users, TrendingUp, Target, Calendar, AlertTriangle, Star, ArrowLeft, RefreshCw, Loader2, Briefcase } from 'lucide-react'
import Link from 'next/link'

interface DashboardData {
  kpis: {
    leadsThisMonth: number
    leadsLastMonth: number
    monthGrowth: string
    totalLeads: number
    convertedThisMonth: number
    convertedTotal: number
    conversionRate: string
    activeClients: number
    activeCampaigns: number
    upcomingDeadlines: number
    criticalDeadlines: number
    avgNps: string
    npsCount: number
  }
  breakdown: {
    leadsByStatus: Record<string, number>
    leadsBySource: Record<string, number>
    topCampaigns: Array<{ slug: string; count: number }>
    byAttorney: Record<string, { total: number; converted: number }>
  }
}

const statusLabels: Record<string, { label: string; color: string }> = {
  new: { label: 'Novo', color: '#eab308' },
  contacted: { label: 'Contatado', color: '#3b82f6' },
  qualified: { label: 'Qualificado', color: '#8b5cf6' },
  proposal: { label: 'Proposta', color: 'var(--color-ca-steel-500)' },
  converted: { label: 'Convertido', color: '#25D366' },
  lost: { label: 'Perdido', color: '#dc2626' },
}

const sourceLabels: Record<string, string> = {
  'campaign-form': 'Formulário de Campanha',
  'contact-form': 'Formulário de Contato',
  whatsapp: 'WhatsApp',
  referral: 'Indicação',
  calculator: 'Calculadora',
  other: 'Outro',
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<DashboardData | null>(null)
  const [error, setError] = useState('')

  async function fetchDashboard() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/dashboard', {
        credentials: 'include',
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error || 'Erro'); return }
      setData(json)
    } catch {
      setError('Erro de conexão')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchDashboard() }, [])


  if (!data) return null

  const { kpis, breakdown } = data
  const maxStatusCount = Math.max(...Object.values(breakdown.leadsByStatus), 1)

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: 'var(--color-ca-platinum-100)', fontFamily: "'Source Sans 3', sans-serif" }}>
      {/* Header */}
      <div style={{ background: 'var(--color-ca-navy-950)', padding: '24px', borderBottom: '1px solid color-mix(in srgb, var(--color-ca-steel-500) 15%, transparent)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', margin: 0 }}>Dashboard <span style={{ color: 'var(--color-ca-steel-500)' }}>Gerencial</span></h1>
            <p style={{ color: 'var(--color-ca-steel-400)', fontSize: '13px', marginTop: '4px' }}>Cavalcante Albuquerque — Visão geral</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button onClick={fetchDashboard} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 16px', color: 'var(--color-ca-steel-400)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <RefreshCw style={{ width: '14px' }} /> Atualizar
            </button>
            <Link href="/admin-tools/leads-kanban" style={{ background: 'var(--color-ca-steel-500)', color: 'var(--color-ca-navy-950)', borderRadius: '6px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
              Kanban de Leads →
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { icon: Users, label: 'Leads (mês)', value: kpis.leadsThisMonth, sub: kpis.monthGrowth, color: '#3b82f6' },
            { icon: Target, label: 'Taxa de Conversão', value: kpis.conversionRate, sub: `${kpis.convertedTotal} convertidos`, color: '#25D366' },
            { icon: Briefcase, label: 'Clientes Ativos', value: kpis.activeClients, sub: `${kpis.activeCampaigns} campanhas`, color: 'var(--color-ca-steel-500)' },
            { icon: Calendar, label: 'Prazos (7 dias)', value: kpis.upcomingDeadlines, sub: kpis.criticalDeadlines > 0 ? `${kpis.criticalDeadlines} crítico(s)!` : 'Nenhum crítico', color: kpis.criticalDeadlines > 0 ? '#dc2626' : 'var(--color-ca-steel-500)' },
            { icon: Star, label: 'NPS Médio', value: kpis.avgNps, sub: `${kpis.npsCount} respostas`, color: '#eab308' },
            { icon: TrendingUp, label: 'Total de Leads', value: kpis.totalLeads, sub: `${kpis.convertedThisMonth} conversões mês`, color: '#8b5cf6' },
          ].map(({ icon: Icon, label, value, sub, color }) => (
            <div key={label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '20px', borderTop: `3px solid ${color}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <Icon style={{ width: '18px', height: '18px', color }} />
                <span style={{ fontSize: '12px', color: 'var(--color-ca-steel-400)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</span>
              </div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 700, color: 'var(--color-ca-platinum-100)', lineHeight: 1 }}>
                {value}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-ca-steel-400)', marginTop: '4px' }}>{sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
          {/* Pipeline de Leads */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BarChart3 style={{ width: '20px', color: 'var(--color-ca-steel-500)' }} /> Pipeline de Leads
            </h3>
            {Object.entries(breakdown.leadsByStatus).map(([status, count]) => (
              <div key={status} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--color-ca-steel-400)' }}>{statusLabels[status]?.label || status}</span>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: statusLabels[status]?.color || 'var(--color-ca-steel-400)' }}>{count}</span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${(count / maxStatusCount) * 100}%`, background: statusLabels[status]?.color || 'var(--color-ca-steel-400)', borderRadius: '4px', transition: 'width 0.5s' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Origem dos Leads */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', marginBottom: '20px' }}>Origem dos Leads</h3>
            {Object.entries(breakdown.leadsBySource).sort(([,a],[,b]) => b - a).map(([src, count]) => (
              <div key={src} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize: '14px', color: 'var(--color-ca-steel-400)' }}>{sourceLabels[src] || src}</span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-ca-platinum-100)' }}>{count}</span>
              </div>
            ))}
          </div>

          {/* Top Campanhas */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', marginBottom: '20px' }}>Top Campanhas</h3>
            {breakdown.topCampaigns.length > 0 ? breakdown.topCampaigns.map(({ slug, count }, i) => (
              <div key={slug} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: i === 0 ? 'var(--color-ca-steel-500)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600, color: i === 0 ? 'var(--color-ca-navy-950)' : 'var(--color-ca-steel-400)' }}>{i + 1}</span>
                  <span style={{ fontSize: '13px', color: 'var(--color-ca-steel-400)' }}>{slug}</span>
                </div>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-ca-steel-500)' }}>{count} leads</span>
              </div>
            )) : <p style={{ color: '#666', fontSize: '13px' }}>Nenhuma campanha com leads ainda.</p>}
          </div>

          {/* Performance por Advogado */}
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', marginBottom: '20px' }}>Performance por Advogado</h3>
            {Object.entries(breakdown.byAttorney).map(([key, stats]) => {
              const name = key === 'edivaldo' ? 'Dr. Edivaldo Cavalcante' : 'Dra. Gabrielly Melo'
              const rate = stats.total > 0 ? ((stats.converted / stats.total) * 100).toFixed(0) : '0'
              return (
                <div key={key} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-ca-platinum-100)', marginBottom: '8px' }}>{name}</div>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '13px' }}>
                    <span style={{ color: 'var(--color-ca-steel-400)' }}>Leads: <strong style={{ color: 'var(--color-ca-platinum-100)' }}>{stats.total}</strong></span>
                    <span style={{ color: 'var(--color-ca-steel-400)' }}>Convertidos: <strong style={{ color: '#25D366' }}>{stats.converted}</strong></span>
                    <span style={{ color: 'var(--color-ca-steel-400)' }}>Taxa: <strong style={{ color: 'var(--color-ca-steel-500)' }}>{rate}%</strong></span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}


