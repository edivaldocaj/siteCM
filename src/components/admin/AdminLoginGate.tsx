'use client'

import { useState } from 'react'
import { Lock, Scale } from 'lucide-react'
import { useAdminAuth } from './AdminAuthContext'

export function AdminLoginGate() {
  const { login } = useAdminAuth()
  const [secret, setSecret] = useState('')
  const [shaking, setShaking] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!secret.trim()) {
      setShaking(true)
      setTimeout(() => setShaking(false), 500)
      return
    }
    login(secret)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(145deg, #0a0e1a 0%, #152138 50%, #0e1628 100%)',
      padding: '24px',
    }}>
      {/* Decorative elements */}
      <div style={{
        position: 'fixed', top: '-120px', right: '-80px',
        fontFamily: "'Playfair Display', serif", fontSize: '400px', fontWeight: 700,
        color: 'rgba(196,169,106,0.02)', pointerEvents: 'none', userSelect: 'none',
        lineHeight: 1,
      }}>CM</div>

      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '48px 40px',
        maxWidth: '420px',
        width: '100%',
        backdropFilter: 'blur(20px)',
        animation: shaking ? 'shake 0.4s ease' : 'fadeInUp 0.5s ease',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(196,169,106,0.15), rgba(196,169,106,0.05))',
            border: '1px solid rgba(196,169,106,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
          }}>
            <Scale style={{ width: '32px', height: '32px', color: '#c4a96a' }} />
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '26px',
            color: '#f1eae2',
            marginBottom: '6px',
            letterSpacing: '-0.01em',
          }}>
            Ferramentas <span style={{ color: '#c4a96a' }}>Admin</span>
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '14px',
            lineHeight: 1.5,
          }}>
            Cavalcante & Melo — Painel Interno
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <Lock style={{
              position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
              width: '18px', height: '18px', color: '#4b5563',
            }} />
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Chave de acesso"
              autoFocus
              required
              style={{
                width: '100%',
                padding: '14px 16px 14px 44px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '10px',
                color: '#f1eae2',
                fontSize: '15px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(196,169,106,0.4)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #c4a96a, #a8904e)',
              color: '#152138',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.03em',
              transition: 'opacity 0.2s',
            }}
          >
            Acessar Painel
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <a href="/" style={{ color: '#4b5563', fontSize: '13px', textDecoration: 'none' }}>← Voltar ao site</a>
          <span style={{ color: '#2a2a2a', margin: '0 12px' }}>·</span>
          <a href="/admin" style={{ color: '#4b5563', fontSize: '13px', textDecoration: 'none' }}>CMS Admin</a>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-8px); }
          40%, 80% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  )
}
