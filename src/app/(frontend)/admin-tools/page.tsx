'use client'

import { useState } from 'react'
import { AlertCircle, ArrowRight, BarChart3, CalendarDays, CheckCircle, FileText, Image, KanbanSquare, Newspaper, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default function AdminToolsPage() {
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
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || 'Erro ao buscar notícias')
      else setResult(data)
    } catch {
      setError('Erro de conexão.')
    } finally {
      setLoading(false)
    }
  }

  async function revalidatePages() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ collection: 'news-articles' }),
      })
      const data = await res.json()
      if (!res.ok) setError(data.error || 'Erro ao revalidar páginas')
      else if (data.revalidated) setResult({ message: 'Cache das páginas atualizado com sucesso.' })
    } catch {
      setError('Erro ao revalidar páginas')
    } finally {
      setLoading(false)
    }
  }

  const modules = [
    { href: '/admin-tools/analytics', title: 'Analytics de Campanhas', desc: 'Views, leads, conversões e taxa de cada campanha em tempo real.', color: '#60a5fa', icon: BarChart3 },
    { href: '/admin-tools/cards', title: 'Gerador de Cards', desc: 'Crie cards 1080x1080 e 1080x1920 com o branding Cavalcante Albuquerque.', color: 'var(--color-ca-steel-500)', icon: Image },
    { href: '/admin-tools/leads-kanban', title: 'Kanban de Leads', desc: 'Pipeline visual: Novo, Contatado, Qualificado e Convertido.', color: '#25D366', icon: KanbanSquare },
    { href: '/admin-tools/dashboard', title: 'Dashboard Gerencial', desc: 'KPIs de leads, conversão, NPS, prazos e performance por advogado.', color: '#8b5cf6', icon: BarChart3 },
    { href: '/admin-tools/deadlines', title: 'Calendário de Prazos', desc: 'Prazos processuais com alertas escalonados em 7d, 3d e 1d.', color: '#ea580c', icon: CalendarDays },
    { href: '/admin-tools/petition-generator', title: 'Gerador de Petições IA', desc: 'Minutas assistidas por IA com banco de jurisprudência.', color: 'var(--color-ca-steel-500)', icon: FileText },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-ca-navy-950)', padding: '32px' }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '32px', color: 'var(--color-ca-platinum-100)', marginBottom: '8px' }}>Ferramentas Admin</h1>
          <p style={{ color: 'var(--color-ca-steel-400)', fontSize: '14px' }}>Cavalcante Albuquerque - gerenciamento do site</p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <a href="/admin" style={{ color: 'var(--color-ca-steel-500)', fontSize: '13px', textDecoration: 'none' }}>Voltar ao CMS</a>
            <a href="/" style={{ color: 'var(--color-ca-steel-400)', fontSize: '13px', textDecoration: 'none' }}>Voltar ao site</a>
          </div>
        </div>

        {modules.map((module) => {
          const Icon = module.icon
          return (
            <Link key={module.href} href={module.href} style={{ textDecoration: 'none', display: 'block', marginBottom: '20px' }}>
              <div style={{ background: `linear-gradient(135deg, ${module.color}18, ${module.color}08)`, border: `1px solid ${module.color}50`, borderRadius: '8px', padding: '28px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: `${module.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon style={{ width: '24px', height: '24px', color: module.color }} aria-hidden="true" />
                    </div>
                    <div>
                      <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '20px', color: 'var(--color-ca-platinum-100)', margin: 0, marginBottom: '4px' }}>{module.title}</h2>
                      <p style={{ color: 'var(--color-ca-steel-400)', fontSize: '14px', margin: 0 }}>{module.desc}</p>
                    </div>
                  </div>
                  <ArrowRight style={{ width: '20px', height: '20px', color: module.color, flexShrink: 0 }} aria-hidden="true" />
                </div>
              </div>
            </Link>
          )
        })}

        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '28px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Newspaper style={{ width: '24px', height: '24px', color: 'var(--color-ca-steel-500)' }} aria-hidden="true" />
            <h2 style={{ fontFamily: 'var(--font-cormorant)', fontSize: '20px', color: 'var(--color-ca-platinum-100)', margin: 0 }}>Buscar notícias jurídicas</h2>
          </div>
          <p style={{ color: 'var(--color-ca-steel-400)', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>
            Busca notícias de Conjur, Migalhas e Google News para triagem editorial no CMS.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button onClick={fetchNews} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: '#25D366', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}>
              <RefreshCw style={{ width: '16px', height: '16px', animation: loading ? 'spin 1s linear infinite' : 'none' }} aria-hidden="true" />
              {loading ? 'Buscando...' : 'Buscar notícias agora'}
            </button>
            <button onClick={revalidatePages} disabled={loading} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'transparent', color: 'var(--color-ca-steel-400)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', fontSize: '14px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.5 : 1 }}>
              Atualizar cache do site
            </button>
          </div>
        </div>

        {result && (
          <div style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <CheckCircle style={{ width: '20px', height: '20px', color: '#25D366' }} aria-hidden="true" />
              <strong style={{ color: '#25D366', fontSize: '14px' }}>Sucesso</strong>
            </div>
            {result.message ? <p style={{ color: 'var(--color-ca-steel-400)', fontSize: '14px' }}>{result.message}</p> : (
              <div style={{ color: 'var(--color-ca-steel-400)', fontSize: '14px', lineHeight: '1.8' }}>
                <p>Notícias encontradas: <strong style={{ color: 'var(--color-ca-platinum-100)' }}>{result.fetched || 0}</strong></p>
                <p>Notícias salvas: <strong style={{ color: 'var(--color-ca-platinum-100)' }}>{result.saved || 0}</strong></p>
              </div>
            )}
          </div>
        )}

        {error && (
          <div style={{ background: 'rgba(122,27,27,0.2)', border: '1px solid rgba(122,27,27,0.5)', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle style={{ width: '20px', height: '20px', color: '#dc2626' }} aria-hidden="true" />
              <strong style={{ color: '#dc2626', fontSize: '14px' }}>{error}</strong>
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
