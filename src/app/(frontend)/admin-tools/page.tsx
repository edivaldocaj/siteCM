'use client'

import { useState } from 'react'
import { Newspaper, RefreshCw, CheckCircle, AlertCircle, Lock } from 'lucide-react'

export default function AdminToolsPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    // Usa o NEWS_REVALIDATE_SECRET como senha de acesso
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
        headers: {
          'Authorization': `Bearer ${password}`,
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erro ao buscar notícias')
      } else {
        setResult(data)
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
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
      if (data.revalidated) {
        setResult({ message: 'Cache das páginas atualizado com sucesso!' })
      }
    } catch {
      setError('Erro ao revalidar páginas')
    } finally {
      setLoading(false)
    }
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
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Secret key"
              required
              style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: '#f1eae2', fontSize: '14px', marginBottom: '16px', outline: 'none', boxSizing: 'border-box' }}
            />
            <button
              type="submit"
              style={{ width: '100%', padding: '12px', background: '#c4a96a', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em' }}
            >
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
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#f1eae2', marginBottom: '8px' }}>
            Ferramentas Admin
          </h1>
          <p style={{ color: '#b8bfc8', fontSize: '14px' }}>
            Cavalcante & Melo — Gerenciamento do Site
          </p>
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <a href="/admin" style={{ color: '#c4a96a', fontSize: '13px', textDecoration: 'none' }}>← Voltar ao CMS</a>
            <a href="/" style={{ color: '#b8bfc8', fontSize: '13px', textDecoration: 'none' }}>← Voltar ao Site</a>
          </div>
        </div>

        {/* Buscar Notícias */}
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '32px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Newspaper style={{ width: '24px', height: '24px', color: '#c4a96a' }} />
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#f1eae2', margin: 0 }}>
              Buscar Notícias Jurídicas
            </h2>
          </div>
          <p style={{ color: '#b8bfc8', fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>
            Busca notícias de <strong style={{ color: '#f1eae2' }}>Conjur</strong>, <strong style={{ color: '#f1eae2' }}>Migalhas</strong> e <strong style={{ color: '#f1eae2' }}>Google News</strong>.
            As notícias são salvas como "Pendente" e precisam ser aprovadas no CMS antes de aparecerem no site.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={fetchNews}
              disabled={loading}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '12px 24px', background: '#25D366', color: '#fff',
                border: 'none', borderRadius: '4px', fontSize: '14px',
                fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1, textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <RefreshCw style={{ width: '16px', height: '16px', animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              {loading ? 'Buscando...' : 'Buscar Notícias Agora'}
            </button>

            <button
              onClick={revalidatePages}
              disabled={loading}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '12px 24px', background: 'transparent', color: '#b8bfc8',
                border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px',
                fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.5 : 1, textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
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
                <p style={{ color: '#b8bfc8', fontSize: '12px', marginTop: '8px' }}>
                  Acesse o CMS → News Articles para aprovar as notícias pendentes.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Erro */}
        {error && (
          <div style={{ background: 'rgba(122,27,27,0.2)', border: '1px solid rgba(122,27,27,0.5)', borderRadius: '8px', padding: '24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle style={{ width: '20px', height: '20px', color: '#dc2626' }} />
              <strong style={{ color: '#dc2626', fontSize: '14px' }}>{error}</strong>
            </div>
          </div>
        )}

        {/* Fontes configuradas */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '8px', padding: '24px' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', color: '#f1eae2', marginBottom: '16px', marginTop: 0 }}>
            Fontes de Notícias Configuradas
          </h3>
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

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
