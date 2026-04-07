'use client'

import { useState } from 'react'
import { Newspaper, RefreshCw, CheckCircle, AlertCircle, Lock, Image, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function AdminToolsPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setAuthenticated(true)
    setError('')
  }

  async function fetchNews() {
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const res = await fetch('/api/news-feed', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${password}`, 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || 'Erro ao buscar notícias')
      else setResult(data)
    } catch { setError('Erro de conexão.') }
    finally { setLoading(false) }
  }

  async function revalidatePages() {
    setLoading(true)
    try {
      const res = await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collection: 'news-articles', secret: password }),
      })
      const data = await res.json()
      if (data.revalidated) setResult({ message: 'Cache das páginas atualizado com sucesso!' })
    } catch { setError('Erro ao revalidar páginas') }
    finally { setLoading(false) }
  }

  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#152138' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '48px', maxWidth: '400px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Lock style={{ width: '48px', height: '48px', color: '#c4a96a', margin: '0 auto 16px' }} />
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#f1eae2', marginBottom: '8px' }}>Ferramentas Admin</h1>
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

  return (
    <div style={{ minHeight: '100vh', background: '#152138', padding: '32px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#f1eae2', marginBottom: '8px' }}>Ferramentas Admin</h1>
          <p style={{ color: '#b8bfc8', fontSize: '14px' }}>Cavalcante & Melo — Gerenciamento do Site</p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <a href="/admin" style={{ color: '#c4a96a', fontSize: '13px', textDecoration: 'none' }}>← Voltar ao CMS</a>
            <a href="/" style={{ color: '#b8bfc8', fontSize: '13px', textDecoration: 'none' }}>← Voltar ao Site</a>
          </div>
        </div>

        {/* ── ANALYTICS DE CAMPANHAS ── */}
        <Link href="/admin-tools/analytics" style={{ textDecoration: 'none', display: 'block', marginBottom: '24px' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(96,165,250,0.1), rgba(96,165,250,0.05))', border: '1px solid rgba(96,165,250,0.3)', borderRadius: '8px', padding: '32px', transition: 'all 0.3s', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(96,165,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </div>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#f1eae2', margin: 0, marginBottom: '4px' }}>
                    Analytics de Campanhas
                  </h2>
                  <p style={{ color: '#b8bfc8', fontSize: '14px', margin: 0 }}>
                    Views, leads, conversões e taxa de cada campanha em tempo real.
                  </p>
                </div>
              </div>
              <ArrowRight style={{ width: '20px', height: '20px', color: '#60a5fa', flexShrink: 0 }} />
            </div>
          </div>
        </Link>

        {/* ── GERADOR DE CARDS ── */}
        <Link href="/admin-tools/cards" style={{ textDecoration: 'none', display: 'block', marginBottom: '24px' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(196,169,106,0.1), rgba(196,169,106,0.05))', border: '1px solid rgba(196,169,106,0.3)', borderRadius: '8px', padding: '32px', transition: 'all 0.3s', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(196,169,106,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image style={{ width: '24px', height: '24px', color: '#c4a96a' }} />
                </div>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#f1eae2', margin: 0, marginBottom: '4px' }}>
                    Gerador de Cards para Redes Sociais
                  </h2>
                  <p style={{ color: '#b8bfc8', fontSize: '14px', margin: 0 }}>
                    Crie cards 1080×1080 e 1080×1920 com o branding CM. Puxa campanhas direto do CMS.
                  </p>
                </div>
              </div>
              <ArrowRight style={{ width: '20px', height: '20px', color: '#c4a96a', flexShrink: 0 }} />
            </div>
          </div>
        </Link>

        {/* ── KANBAN DE LEADS ── */}
        <Link href="/admin-tools/leads-kanban" style={{ textDecoration: 'none', display: 'block', marginBottom: '24px' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(37,211,102,0.1), rgba(37,211,102,0.05))', border: '1px solid rgba(37,211,102,0.3)', borderRadius: '8px', padding: '32px', transition: 'all 0.3s', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(37,211,102,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2"><rect x="3" y="3" width="6" height="18" rx="1"/><rect x="11" y="3" width="6" height="12" rx="1"/><rect x="19" y="3" width="2" height="8" rx="1"/></svg>
                </div>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#f1eae2', margin: 0, marginBottom: '4px' }}>Kanban de Leads</h2>
                  <p style={{ color: '#b8bfc8', fontSize: '14px', margin: 0 }}>Pipeline visual: Novo → Contatado → Qualificado → Convertido. Mude status com um clique.</p>
                </div>
              </div>
              <ArrowRight style={{ width: '20px', height: '20px', color: '#25D366', flexShrink: 0 }} />
            </div>
          </div>
        </Link>

        {/* ── DASHBOARD GERENCIAL ── */}
        <Link href="/admin-tools/dashboard" style={{ textDecoration: 'none', display: 'block', marginBottom: '24px' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(139,92,246,0.05))', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '8px', padding: '32px', transition: 'all 0.3s', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                </div>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#f1eae2', margin: 0, marginBottom: '4px' }}>Dashboard Gerencial</h2>
                  <p style={{ color: '#b8bfc8', fontSize: '14px', margin: 0 }}>KPIs: leads/mês, taxa de conversão, NPS, clientes ativos, campanhas e performance por advogado.</p>
                </div>
              </div>
              <ArrowRight style={{ width: '20px', height: '20px', color: '#8b5cf6', flexShrink: 0 }} />
            </div>
          </div>
        </Link>

        {/* ── CALENDÁRIO DE PRAZOS ── */}
        <Link href="/admin-tools/deadlines" style={{ textDecoration: 'none', display: 'block', marginBottom: '24px' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(234,88,12,0.1), rgba(234,88,12,0.05))', border: '1px solid rgba(234,88,12,0.3)', borderRadius: '8px', padding: '32px', transition: 'all 0.3s', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(234,88,12,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>
                </div>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#f1eae2', margin: 0, marginBottom: '4px' }}>Calendário de Prazos</h2>
                  <p style={{ color: '#b8bfc8', fontSize: '14px', margin: 0 }}>Prazos processuais com alertas escalonados (7d, 3d, 1d) e notificação por e-mail.</p>
                </div>
              </div>
              <ArrowRight style={{ width: '20px', height: '20px', color: '#ea580c', flexShrink: 0 }} />
            </div>
          </div>
        </Link>

        {/* ── GERADOR DE PETIÇÕES IA ── */}
        <Link href="/admin-tools/petition-generator" style={{ textDecoration: 'none', display: 'block', marginBottom: '24px' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(196,169,106,0.1), rgba(196,169,106,0.05))', border: '1px solid rgba(196,169,106,0.3)', borderRadius: '8px', padding: '32px', transition: 'all 0.3s', cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(196,169,106,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c4a96a" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                </div>
                <div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#f1eae2', margin: 0, marginBottom: '4px' }}>Gerador de Petições com IA</h2>
                  <p style={{ color: '#b8bfc8', fontSize: '14px', margin: 0 }}>Minutas automatizadas via Claude API, baseadas nos dados do lead e banco de jurisprudência.</p>
                </div>
              </div>
              <ArrowRight style={{ width: '20px', height: '20px', color: '#c4a96a', flexShrink: 0 }} />
            </div>
          </div>
        </Link>

        {/* ── BUSCAR NOTÍCIAS ── */}
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '32px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Newspaper style={{ width: '24px', height: '24px', color: '#c4a96a' }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#f1eae2', margin: 0 }}>
              Buscar Notícias Jurídicas
            </h2>
          </div>
          <p style={{ color: '#b8bfc8', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>
            Busca notícias de <strong style={{ color: '#f1eae2' }}>Conjur</strong>, <strong style={{ color: '#f1eae2' }}>Migalhas</strong> e <strong style={{ color: '#f1eae2' }}>Google News</strong>.
            As notícias são salvas como &quot;Pendente&quot; e precisam ser aprovadas no CMS.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={fetchNews} disabled={loading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <RefreshCw style={{ width: '16px', height: '16px', animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              {loading ? 'Buscando...' : 'Buscar Notícias Agora'}
            </button>
            <button onClick={revalidatePages} disabled={loading}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'transparent', color: '#b8bfc8', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Atualizar Cache do Site
            </button>
          </div>
        </div>

        {/* Resultado */}
        {result && (
          <div style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <CheckCircle style={{ width: '20px', height: '20px', color: '#25D366' }} />
              <strong style={{ color: '#25D366', fontSize: '14px' }}>Sucesso!</strong>
            </div>
            {result.message ? (
              <p style={{ color: '#b8bfc8', fontSize: '14px' }}>{result.message}</p>
            ) : (
              <div style={{ color: '#b8bfc8', fontSize: '14px', lineHeight: '1.8' }}>
                <p>Notícias encontradas: <strong style={{ color: '#f1eae2' }}>{result.fetched || 0}</strong></p>
                <p>Notícias salvas (novas): <strong style={{ color: '#f1eae2' }}>{result.saved || 0}</strong></p>
                <p style={{ color: '#b8bfc8', fontSize: '12px', marginTop: '8px' }}>Acesse o CMS → News Articles para aprovar.</p>
              </div>
            )}
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(122,27,27,0.2)', border: '1px solid rgba(122,27,27,0.5)', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle style={{ width: '20px', height: '20px', color: '#dc2626' }} />
              <strong style={{ color: '#dc2626', fontSize: '14px' }}>{error}</strong>
            </div>
          </div>
        )}

        {/* Fontes */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '24px' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', color: '#f1eae2', marginBottom: '16px', marginTop: 0 }}>Fontes de Notícias</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {[
              { name: 'Conjur', url: 'conjur.com.br', type: 'RSS' },
              { name: 'Migalhas', url: 'migalhas.com.br', type: 'RSS' },
              { name: 'Google News — Consumidor', url: 'news.google.com', type: 'Search' },
              { name: 'Google News — LGPD', url: 'news.google.com', type: 'Search' },
              { name: 'Google News — Penal', url: 'news.google.com', type: 'Search' },
              { name: 'Google News — Imobiliário', url: 'news.google.com', type: 'Search' },
              { name: 'Google News — STJ/STF', url: 'news.google.com', type: 'Search' },
            ].map((source) => (
              <div key={source.name} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '4px', padding: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ color: '#f1eae2', fontSize: '13px', fontWeight: '600' }}>{source.name}</div>
                <div style={{ color: '#b8bfc8', fontSize: '11px', marginTop: '4px' }}>{source.url}</div>
                <div style={{ color: '#c4a96a', fontSize: '10px', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{source.type}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
