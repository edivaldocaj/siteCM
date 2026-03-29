'use client'

import { useState } from 'react'
import { Lock, Search, FileText, Clock, ChevronDown, ChevronUp, AlertCircle, CheckCircle, User, Scale } from 'lucide-react'

interface ProcessResult {
  processNumber: string
  tribunal: string
  description: string
  attorney: string
  found: boolean
  datajud: {
    numeroProcesso: string
    classe: { nome: string }
    orgaoJulgador: { nome: string }
    dataAjuizamento: string
    assuntos: Array<{ nome: string }>
    movimentos: Array<{ nome: string; dataHora: string; complemento?: string }>
    grau: string
  } | null
}

function formatDate(d: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

function formatDateTime(d: string) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function ProcessCard({ proc }: { proc: ProcessResult }) {
  const [expanded, setExpanded] = useState(false)
  const d = proc.datajud

  return (
    <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', overflow: 'hidden', marginBottom: '16px' }}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{ width: '100%', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: proc.found ? 'rgba(37,211,102,0.1)' : 'rgba(196,169,106,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {proc.found ? <CheckCircle style={{ width: '20px', height: '20px', color: '#25D366' }} /> : <AlertCircle style={{ width: '20px', height: '20px', color: '#c4a96a' }} />}
          </div>
          <div>
            <div style={{ color: '#f1eae2', fontFamily: "'Playfair Display', serif", fontSize: '16px', fontWeight: 600 }}>
              {proc.processNumber}
            </div>
            <div style={{ color: '#b8bfc8', fontSize: '13px', marginTop: '4px' }}>
              {proc.tribunal?.toUpperCase()} {proc.description ? `— ${proc.description}` : ''} 
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {d && (
            <span style={{ color: '#c4a96a', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {d.classe?.nome}
            </span>
          )}
          {expanded ? <ChevronUp style={{ width: '20px', height: '20px', color: '#b8bfc8' }} /> : <ChevronDown style={{ width: '20px', height: '20px', color: '#b8bfc8' }} />}
        </div>
      </button>

      {/* Details */}
      {expanded && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px' }}>
          {!proc.found ? (
            <p style={{ color: '#b8bfc8', fontSize: '14px' }}>Processo não encontrado na base do Datajud. Pode estar em sigilo ou ainda não ter sido indexado.</p>
          ) : d ? (
            <>
              {/* Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '6px', padding: '12px' }}>
                  <div style={{ color: '#b8bfc8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Classe</div>
                  <div style={{ color: '#f1eae2', fontSize: '14px', fontWeight: 500 }}>{d.classe?.nome}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '6px', padding: '12px' }}>
                  <div style={{ color: '#b8bfc8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Órgão Julgador</div>
                  <div style={{ color: '#f1eae2', fontSize: '14px', fontWeight: 500 }}>{d.orgaoJulgador?.nome}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '6px', padding: '12px' }}>
                  <div style={{ color: '#b8bfc8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Data de Ajuizamento</div>
                  <div style={{ color: '#f1eae2', fontSize: '14px', fontWeight: 500 }}>{formatDate(d.dataAjuizamento)}</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '6px', padding: '12px' }}>
                  <div style={{ color: '#b8bfc8', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Grau</div>
                  <div style={{ color: '#f1eae2', fontSize: '14px', fontWeight: 500 }}>{d.grau || 'N/A'}</div>
                </div>
              </div>

              {/* Assuntos */}
              {d.assuntos?.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ color: '#c4a96a', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Assuntos</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {d.assuntos.map((a, i) => (
                      <span key={i} style={{ background: 'rgba(196,169,106,0.1)', color: '#c4a96a', padding: '4px 12px', borderRadius: '4px', fontSize: '12px' }}>
                        {a.nome}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Movimentos */}
              {d.movimentos?.length > 0 && (
                <div>
                  <h4 style={{ color: '#c4a96a', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                    Movimentações ({d.movimentos.length})
                  </h4>
                  <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '8px' }}>
                    {d.movimentos.slice(0, 20).map((mov, i) => (
                      <div key={i} style={{ display: 'flex', gap: '16px', marginBottom: '12px', paddingBottom: '12px', borderBottom: i < d.movimentos.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: i === 0 ? '#25D366' : '#b8bfc8', marginTop: '6px', flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ color: '#f1eae2', fontSize: '14px', fontWeight: 500 }}>{mov.nome}</div>
                          {mov.complemento && (
                            <div style={{ color: '#b8bfc8', fontSize: '12px', marginTop: '2px' }}>{mov.complemento}</div>
                          )}
                          <div style={{ color: 'rgba(184,191,200,0.5)', fontSize: '11px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock style={{ width: '10px', height: '10px' }} />
                            {formatDateTime(mov.dataHora)}
                          </div>
                        </div>
                      </div>
                    ))}
                    {d.movimentos.length > 20 && (
                      <p style={{ color: '#b8bfc8', fontSize: '12px', textAlign: 'center', padding: '8px' }}>
                        Mostrando 20 de {d.movimentos.length} movimentações
                      </p>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default function ClientePortalPage() {
  const [token, setToken] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [clientName, setClientName] = useState('')
  const [processes, setProcesses] = useState<ProcessResult[]>([])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/datajud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erro ao autenticar.')
        return
      }

      setAuthenticated(true)
      setClientName(data.client?.name || '')
      setProcesses(data.processes || [])
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  async function refreshProcess(processNumber: string, tribunal: string) {
    setLoading(true)
    try {
      const res = await fetch('/api/datajud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, processNumber, tribunal }),
      })
      const data = await res.json()
      if (data.success && data.process) {
        setProcesses(prev =>
          prev.map(p =>
            p.processNumber.replace(/\D/g, '') === processNumber.replace(/\D/g, '')
              ? { ...p, datajud: data.process, found: true }
              : p
          )
        )
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }

  // Login screen
  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #152138 0%, #1c2d4a 50%, #0e1628 100%)', padding: '16px' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '48px', maxWidth: '440px', width: '100%', backdropFilter: 'blur(12px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(196,169,106,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Lock style={{ width: '28px', height: '28px', color: '#c4a96a' }} />
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#f1eae2', marginBottom: '8px' }}>
              Portal do Cliente
            </h1>
            <p style={{ color: '#b8bfc8', fontSize: '14px', lineHeight: 1.6 }}>
              Cavalcante & Melo Sociedade de Advogados
            </p>
            <p style={{ color: 'rgba(184,191,200,0.5)', fontSize: '13px', marginTop: '8px' }}>
              Acompanhe o andamento dos seus processos
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', color: 'rgba(184,191,200,0.7)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                Token de Acesso
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Digite o token fornecido pelo advogado"
                required
                style={{
                  width: '100%', padding: '14px 16px',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '6px', color: '#f1eae2', fontSize: '14px', outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.3s',
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = 'rgba(196,169,106,0.5)'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>

            {error && (
              <div style={{ background: 'rgba(122,27,27,0.2)', border: '1px solid rgba(122,27,27,0.4)', borderRadius: '6px', padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle style={{ width: '16px', height: '16px', color: '#dc2626', flexShrink: 0 }} />
                <span style={{ color: '#fca5a5', fontSize: '13px' }}>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                opacity: loading ? 0.5 : 1, cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              <Search style={{ width: '16px', height: '16px' }} />
              {loading ? 'Verificando...' : 'Acessar Meus Processos'}
            </button>
          </form>

          <p style={{ color: 'rgba(184,191,200,0.3)', fontSize: '11px', textAlign: 'center', marginTop: '24px', lineHeight: 1.6 }}>
            O token de acesso é fornecido pelo seu advogado.<br />
            Dados consultados via API pública do CNJ (Datajud).
          </p>
        </div>
      </div>
    )
  }

  // Dashboard
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #152138 0%, #1c2d4a 50%, #0e1628 100%)' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '20px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#f1eae2', margin: 0 }}>
              Portal do Cliente
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <User style={{ width: '14px', height: '14px', color: '#c4a96a' }} />
              <span style={{ color: '#b8bfc8', fontSize: '14px' }}>{clientName}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="/" style={{ color: '#b8bfc8', fontSize: '13px', textDecoration: 'none', padding: '8px 16px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px' }}>
              ← Voltar ao Site
            </a>
            <button
              onClick={() => { setAuthenticated(false); setToken(''); setProcesses([]) }}
              style={{ color: '#b8bfc8', fontSize: '13px', background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', padding: '8px 16px', cursor: 'pointer' }}
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <FileText style={{ width: '16px', height: '16px', color: '#c4a96a' }} />
              <span style={{ color: 'rgba(184,191,200,0.6)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Processos</span>
            </div>
            <div style={{ color: '#f1eae2', fontSize: '32px', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
              {processes.length}
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Scale style={{ width: '16px', height: '16px', color: '#25D366' }} />
              <span style={{ color: 'rgba(184,191,200,0.6)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Encontrados</span>
            </div>
            <div style={{ color: '#25D366', fontSize: '32px', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
              {processes.filter(p => p.found).length}
            </div>
          </div>
        </div>

        {/* Processes */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#f1eae2', margin: 0 }}>
            Seus Processos
          </h2>
          <span style={{ color: 'rgba(184,191,200,0.4)', fontSize: '11px' }}>
            Dados via API pública CNJ (Datajud)
          </span>
        </div>

        {processes.length === 0 ? (
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '48px', textAlign: 'center' }}>
            <FileText style={{ width: '48px', height: '48px', color: 'rgba(184,191,200,0.2)', margin: '0 auto 16px' }} />
            <p style={{ color: '#b8bfc8', fontSize: '16px' }}>Nenhum processo cadastrado.</p>
            <p style={{ color: 'rgba(184,191,200,0.5)', fontSize: '13px', marginTop: '8px' }}>Entre em contato com seu advogado para vincular seus processos.</p>
          </div>
        ) : (
          processes.map((proc, i) => <ProcessCard key={i} proc={proc} />)
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '48px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p style={{ color: 'rgba(184,191,200,0.3)', fontSize: '12px' }}>
            Cavalcante & Melo Sociedade de Advogados — Natal/RN
          </p>
          <p style={{ color: 'rgba(184,191,200,0.2)', fontSize: '11px', marginTop: '4px' }}>
            Dados processuais obtidos da API pública do Datajud (CNJ). Podem haver atrasos na atualização.
          </p>
        </div>
      </div>
    </div>
  )
}
