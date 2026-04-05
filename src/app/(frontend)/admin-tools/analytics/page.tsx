'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Eye, MessageCircle, FileText, Share2, Users, TrendingUp, RefreshCw, ArrowLeft, Trophy, AlertCircle } from 'lucide-react'
import Link from 'next/link'

interface CampaignMetrics {
  slug: string
  title: string
  category: string
  status: string
  metrics: {
    views: number
    whatsappClicks: number
    formSubmits: number
    shares: number
    totalLeads: number
    convertedLeads: number
    conversionRate: string
  }
}

interface AnalyticsData {
  campaigns: CampaignMetrics[]
  summary: {
    totalCampaigns: number
    totalViews: number
    totalLeads: number
    totalConverted: number
  }
}

const categoryLabels: Record<string, string> = {
  consumidor: 'Consumidor',
  digital: 'Digital / LGPD',
  criminal: 'Criminal',
  imobiliario: 'Imobiliário',
  tributario: 'Tributário',
}

export default function CampaignAnalyticsPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [error, setError] = useState('')

  async function fetchAnalytics() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/campaign-track', {
        headers: { 'Authorization': `Bearer ${password}` },
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error || 'Erro ao buscar analytics')
        return
      }
      setData(json)
    } catch {
      setError('Erro de conexão.')
    } finally {
      setLoading(false)
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthenticated(true)
    fetchAnalytics()
  }

  // Login
  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#152138' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '48px', maxWidth: '400px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <BarChart3 style={{ width: '48px', height: '48px', color: '#c4a96a', margin: '0 auto 16px' }} />
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#f1eae2', marginBottom: '8px' }}>Analytics de Campanhas</h1>
            <p style={{ color: '#b8bfc8', fontSize: '14px' }}>Digite o NEWS_REVALIDATE_SECRET</p>
          </div>
          <form onSubmit={handleLogin}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Secret key" required
              style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#f1eae2', fontSize: '14px', marginBottom: '16px', outline: 'none', boxSizing: 'border-box' }} />
            <button type="submit" style={{ width: '100%', padding: '12px', background: '#c4a96a', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Acessar
            </button>
          </form>
        </div>
      </div>
    )
  }

  const s = data?.summary

  return (
    <div style={{ minHeight: '100vh', background: '#0e1628', padding: '32px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <Link href="/admin-tools" style={{ color: '#b8bfc8', fontSize: '13px', textDecoration: 'none' }}>
                <ArrowLeft style={{ width: '16px', height: '16px' }} />
              </Link>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#f1eae2', margin: 0 }}>
                Analytics de Campanhas
              </h1>
            </div>
            <p style={{ color: '#b8bfc8', fontSize: '14px' }}>Métricas de performance em tempo real</p>
          </div>
          <button onClick={fetchAnalytics} disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'rgba(196,169,106,0.15)', border: '1px solid rgba(196,169,106,0.3)', borderRadius: '4px', color: '#c4a96a', fontSize: '13px', fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <RefreshCw style={{ width: '14px', height: '14px', animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            Atualizar
          </button>
        </div>

        {error && (
          <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: '8px', padding: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle style={{ width: '16px', height: '16px', color: '#dc2626' }} />
            <span style={{ color: '#fca5a5', fontSize: '14px' }}>{error}</span>
          </div>
        )}

        {/* Summary Cards */}
        {s && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            {[
              { icon: <BarChart3 style={{ width: '20px', height: '20px', color: '#c4a96a' }} />, value: s.totalCampaigns, label: 'Campanhas Ativas', color: '#c4a96a' },
              { icon: <Eye style={{ width: '20px', height: '20px', color: '#60a5fa' }} />, value: s.totalViews.toLocaleString('pt-BR'), label: 'Visualizações Total', color: '#60a5fa' },
              { icon: <Users style={{ width: '20px', height: '20px', color: '#25D366' }} />, value: s.totalLeads, label: 'Leads Captados', color: '#25D366' },
              { icon: <Trophy style={{ width: '20px', height: '20px', color: '#f59e0b' }} />, value: s.totalConverted, label: 'Convertidos', color: '#f59e0b' },
            ].map((stat, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  {stat.icon}
                  <span style={{ color: 'rgba(184,191,200,0.6)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</span>
                </div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', fontWeight: 700, color: stat.color }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Campaign Cards */}
        {data?.campaigns?.length ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {data.campaigns
              .sort((a, b) => b.metrics.totalLeads - a.metrics.totalLeads)
              .map((campaign) => {
                const m = campaign.metrics
                const convRate = parseFloat(m.conversionRate)

                return (
                  <div key={campaign.slug} style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    padding: '24px',
                    transition: 'border-color 0.3s',
                  }}>
                    {/* Campaign Header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
                      <div>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#f1eae2', margin: 0, marginBottom: '4px' }}>
                          {campaign.title}
                        </h3>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', color: '#c4a96a', background: 'rgba(196,169,106,0.1)', padding: '2px 8px', borderRadius: '2px' }}>
                            {categoryLabels[campaign.category] || campaign.category}
                          </span>
                          <span style={{ fontSize: '11px', color: '#b8bfc8' }}>/{campaign.slug}</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '24px', fontWeight: 700, color: convRate >= 5 ? '#25D366' : convRate >= 2 ? '#c4a96a' : '#b8bfc8', fontFamily: "'Playfair Display', serif" }}>
                          {m.conversionRate}
                        </div>
                        <div style={{ fontSize: '10px', color: 'rgba(184,191,200,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Taxa de Conversão</div>
                      </div>
                    </div>

                    {/* Metrics Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
                      {[
                        { icon: <Eye style={{ width: '14px', height: '14px' }} />, value: m.views, label: 'Views', color: '#60a5fa' },
                        { icon: <MessageCircle style={{ width: '14px', height: '14px' }} />, value: m.whatsappClicks, label: 'WhatsApp', color: '#25D366' },
                        { icon: <FileText style={{ width: '14px', height: '14px' }} />, value: m.formSubmits, label: 'Formulários', color: '#c4a96a' },
                        { icon: <Share2 style={{ width: '14px', height: '14px' }} />, value: m.shares, label: 'Shares', color: '#a78bfa' },
                        { icon: <Users style={{ width: '14px', height: '14px' }} />, value: m.totalLeads, label: 'Leads', color: '#f59e0b' },
                        { icon: <Trophy style={{ width: '14px', height: '14px' }} />, value: m.convertedLeads, label: 'Conversões', color: '#34d399' },
                      ].map((metric, i) => (
                        <div key={i} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '6px', padding: '12px', textAlign: 'center' }}>
                          <div style={{ color: metric.color, marginBottom: '4px' }}>{metric.icon}</div>
                          <div style={{ fontSize: '20px', fontWeight: 700, color: '#f1eae2', fontFamily: "'Playfair Display', serif" }}>{metric.value}</div>
                          <div style={{ fontSize: '10px', color: 'rgba(184,191,200,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>{metric.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Conversion funnel bar */}
                    {m.views > 0 && (
                      <div style={{ marginTop: '16px' }}>
                        <div style={{ display: 'flex', gap: '2px', height: '6px', borderRadius: '3px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
                          <div style={{ width: '100%', background: 'rgba(96,165,250,0.3)', borderRadius: '3px 0 0 3px' }} title="Views" />
                          <div style={{ width: `${Math.min((m.totalLeads / m.views) * 100, 100)}%`, background: 'rgba(196,169,106,0.6)' }} title="Leads" />
                          <div style={{ width: `${Math.min((m.convertedLeads / Math.max(m.views, 1)) * 100, 100)}%`, background: '#25D366', borderRadius: '0 3px 3px 0' }} title="Convertidos" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                          <span style={{ fontSize: '10px', color: 'rgba(96,165,250,0.6)' }}>Views</span>
                          <span style={{ fontSize: '10px', color: 'rgba(196,169,106,0.6)' }}>Leads</span>
                          <span style={{ fontSize: '10px', color: 'rgba(37,211,102,0.6)' }}>Convertidos</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        ) : !loading && (
          <div style={{ textAlign: 'center', padding: '64px', color: '#b8bfc8' }}>
            <BarChart3 style={{ width: '48px', height: '48px', opacity: 0.3, margin: '0 auto 16px' }} />
            <p>Nenhuma campanha ativa encontrada.</p>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
