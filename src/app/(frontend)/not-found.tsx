'use client'

import Link from 'next/link'
import { ArrowLeft, Home, MessageCircle, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="ca-surface-dark" style={{ minHeight: '100vh', padding: '144px 24px 96px' }}>
      <div className="container-narrow mx-auto">
        <span className="ca-eyebrow">Erro 404</span>
        <h1 className="ca-heading-xl" style={{ color: 'var(--color-ca-platinum-100)', marginTop: '16px', marginBottom: '20px' }}>
          Página não encontrada
        </h1>
        <p className="ca-lead" style={{ color: 'color-mix(in srgb, var(--color-ca-platinum-100) 72%, transparent)', marginBottom: '32px' }}>
          O endereço acessado não existe ou foi movido. Você pode retornar ao site ou falar com o escritório para atendimento.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/" className="ca-btn ca-btn--invert">
            <Home aria-hidden="true" />
            Ir para o início
          </Link>
          <Link href="/areas-de-atuacao" className="ca-btn ca-btn--outline-light">
            <Search aria-hidden="true" />
            Ver áreas de atuação
          </Link>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ca-btn ca-btn--whatsapp"
          >
            <MessageCircle aria-hidden="true" />
            Falar pelo WhatsApp
          </a>
        </div>
        <Link href="/contato" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-ca-steel-400)', marginTop: '28px', textDecoration: 'none' }}>
          <ArrowLeft aria-hidden="true" size={16} />
          Voltar para contato
        </Link>
      </div>
    </section>
  )
}
