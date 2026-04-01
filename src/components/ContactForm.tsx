'use client'

import { useState } from 'react'

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setSuccess(true)
      e.currentTarget.reset()
    } catch (err) {
      setError('Ocorreu um erro ao enviar. Tente novamente mais tarde.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{ background: 'rgba(37,211,102,0.1)', border: '1px solid #25D366', padding: '32px', borderRadius: '8px', textAlign: 'center' }}>
        <h3 style={{ color: '#25D366', fontSize: '20px', marginBottom: '8px' }}>Mensagem Enviada!</h3>
        <p style={{ color: 'rgba(21,33,56,0.7)', fontSize: '15px' }}>Nossa equipe de especialistas entrará em contato em breve.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#152138', marginBottom: '8px' }}>Nome Completo</label>
        <input name="name" required style={{ width: '100%', padding: '14px', borderRadius: '6px', border: '1px solid rgba(21,33,56,0.2)' }} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#152138', marginBottom: '8px' }}>Telefone / WhatsApp</label>
        <input name="phone" required style={{ width: '100%', padding: '14px', borderRadius: '6px', border: '1px solid rgba(21,33,56,0.2)' }} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#152138', marginBottom: '8px' }}>Assunto Principal</label>
        <input name="subject" required style={{ width: '100%', padding: '14px', borderRadius: '6px', border: '1px solid rgba(21,33,56,0.2)' }} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', color: '#152138', marginBottom: '8px' }}>Sua Mensagem</label>
        <textarea name="message" rows={4} style={{ width: '100%', padding: '14px', borderRadius: '6px', border: '1px solid rgba(21,33,56,0.2)' }}></textarea>
      </div>
      {error && <p style={{ color: '#dc2626', fontSize: '14px' }}>{error}</p>}
      <button type="submit" disabled={loading} style={{ background: '#152138', color: 'white', padding: '16px', borderRadius: '6px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer' }}>
        {loading ? 'A enviar...' : 'Enviar Mensagem'}
      </button>
    </form>
  )
}