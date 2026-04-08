'use client'

import { useState } from 'react'
import { Newspaper, RefreshCw, CheckCircle, AlertCircle, Image, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useAdminAuth } from '@/components/admin/AdminAuthContext'

export default function AdminToolsPage() {
  const { token } = useAdminAuth()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  async function fetchNews() {
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const res = await fetch('/api/news-feed', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
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
        body: JSON.stringify({ collection: 'news-articles', secret: token }),
      })
      const data = await res.json()
      if (data.revalidated) setResult({ message: 'Cache das páginas atualizado com sucesso!' })
    } catch { setError('Erro ao revalidar páginas') }
    finally { setLoading(false) }
  }

  const modules = [
    { href: '/admin-tools/analytics', title: 'Analytics de Campanhas', desc: 'Views, leads, conversões e taxa de cada campanha em tempo real.', color: '#60a5fa', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg> },
    { href: '/admin-tools/cards', title: 'Gerador de Cards', desc: 'Crie cards 1080×1080 e 1080×1920 com o branding CM.', color: '#c4a96a', icon: <Image style={{ width: '24px', height: '24px', color: '#c4a96a' }} /> },
    { href: '/admin-tools/leads-kanban', title: 'Kanban de Leads', desc: 'Pipeline visual: Novo → Contatado → Qualificado → Convertido.', color: '#25D366', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2"><rect x="3" y="3" width="6" height="18" rx="1"/><rect x="11" y="3" width="6" height="12" rx="1"/><rect x="19" y="3" width="2" height="8" rx="1"/></svg> },
    { href: '/admin-tools/dashboard', title: 'Dashboard Gerencial', desc: 'KPIs: leads/mês, conversão, NPS, prazos, performance por advogado.', color: '#8b5cf6', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg> },
    { href: '/admin-tools/deadlines', title: 'Calendário de Prazos', desc: 'Prazos processuais com alertas escalonados (7d, 3d, 1d).', color: '#ea580c', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> },
    { href: '/admin-tools/petition-generator', title: 'Gerador de Petições IA', desc: 'Minutas via Claude API + banco de jurisprudência.', color: '#c4a96a', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c4a96a" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#152138', padding: '32px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#f1eae2', marginBottom: '8px' }}>Ferramentas Admin</h1>
          <p style={{ color: '#b8bfc8', fontSize: '14px' }}>Cavalcante & Melo — Gerenciamento do Site</p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <a href="/admin" style={{ color: '#c4a96a', fontSize: '13px', textDecoration: 'none' }}>← Voltar ao CMS</a>
            <a href="/" style={{ color: '#b8bfc8', fontSize: '13px', textDecoration: 'none' }}>← Voltar ao Site</a>
          </div>
        </div>

        {modules.map(m => (
          <Link key={m.href} href={m.href} style={{ textDecoration: 'none', display: 'block', marginBottom: '24px' }}>
            <div style={{ background: `linear-gradient(135deg, ${m.color}18, ${m.color}08)`, border: `1px solid ${m.color}50`, borderRadius: '8px', padding: '32px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: `${m.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{m.icon}</div>
                  <div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#f1eae2', margin: 0, marginBottom: '4px' }}>{m.title}</h2>
                    <p style={{ color: '#b8bfc8', fontSize: '14px', margin: 0 }}>{m.desc}</p>
                  </div>
                </div>
                <ArrowRight style={{ width: '20px', height: '20px', color: m.color, flexShrink: 0 }} />
              </div>
            </div>
          </Link>
        ))}

        {/* Buscar Notícias */}
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '32px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Newspaper style={{ width: '24px', height: '24px', color: '#c4a96a' }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#f1eae2', margin: 0 }}>Buscar Notícias Jurídicas</h2>
          </div>
          <p style={{ color: '#b8bfc8', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>
            Busca notícias de <strong style={{ color: '#f1eae2' }}>Conjur</strong>, <strong style={{ color: '#f1eae2' }}>Migalhas</strong> e <strong style={{ color: '#f1eae2' }}>Google News</strong>.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={fetchNews} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}>
              <RefreshCw style={{ width: '16px', height: '16px', animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              {loading ? 'Buscando...' : 'Buscar Notícias Agora'}
            </button>
            <button onClick={revalidatePages} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'transparent', color: '#b8bfc8', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}>
              Atualizar Cache do Site
            </button>
          </div>
        </div>

        {result && (
          <div style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <CheckCircle style={{ width: '20px', height: '20px', color: '#25D366' }} />
              <strong style={{ color: '#25D366', fontSize: '14px' }}>Sucesso!</strong>
            </div>
            {result.message ? <p style={{ color: '#b8bfc8', fontSize: '14px' }}>{result.message}</p> : (
              <div style={{ color: '#b8bfc8', fontSize: '14px', lineHeight: '1.8' }}>
                <p>Notícias encontradas: <strong style={{ color: '#f1eae2' }}>{result.fetched || 0}</strong></p>
                <p>Notícias salvas (novas): <strong style={{ color: '#f1eae2' }}>{result.saved || 0}</strong></p>
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
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
