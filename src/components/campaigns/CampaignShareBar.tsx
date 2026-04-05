'use client'

import { useState } from 'react'
import { Share2, Copy, Check, MessageCircle, ExternalLink } from 'lucide-react'

interface CampaignShareBarProps {
  title: string
  subtitle: string
  shareUrl: string
  whatsappMessage: string
  accentColor?: string
}

export function CampaignShareBar({
  title,
  subtitle,
  shareUrl,
  whatsappMessage,
  accentColor = '#c4a96a',
}: CampaignShareBarProps) {
  const [copied, setCopied] = useState(false)

  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985'
  const shareText = `${title} — ${subtitle}`

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // fallback
      const input = document.createElement('input')
      input.value = shareUrl
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`

  const btnStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    borderRadius: '4px',
    fontSize: '13px',
    fontFamily: "'Source Sans 3', sans-serif",
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'all 0.2s',
    cursor: 'pointer',
    border: 'none',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  }

  return (
    <div style={{
      background: '#ffffff',
      padding: '32px',
      borderRadius: '4px',
      boxShadow: '0 4px 16px rgba(21,33,56,0.04)',
      border: '1px solid rgba(21,33,56,0.06)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <Share2 style={{ width: '20px', height: '20px', color: accentColor }} />
        <h3 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '18px',
          color: '#152138',
          margin: 0,
          fontWeight: 600,
        }}>
          Compartilhe esta campanha
        </h3>
      </div>

      <p style={{
        color: 'rgba(21,33,56,0.5)',
        fontSize: '14px',
        fontFamily: "'Source Sans 3', sans-serif",
        lineHeight: 1.5,
        marginBottom: '24px',
      }}>
        Conhece alguém que pode estar passando por essa situação? Compartilhe e ajude a informar.
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {/* WhatsApp */}
        <a
          href={whatsappShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...btnStyle,
            background: '#25D366',
            color: '#fff',
          }}
        >
          <MessageCircle style={{ width: '16px', height: '16px' }} />
          WhatsApp
        </a>

        {/* Facebook */}
        <a
          href={facebookShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...btnStyle,
            background: '#1877F2',
            color: '#fff',
          }}
        >
          <ExternalLink style={{ width: '16px', height: '16px' }} />
          Facebook
        </a>

        {/* Twitter/X */}
        <a
          href={twitterShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            ...btnStyle,
            background: '#0f1419',
            color: '#fff',
          }}
        >
          <ExternalLink style={{ width: '16px', height: '16px' }} />
          X / Twitter
        </a>

        {/* Copiar link */}
        <button
          onClick={copyLink}
          style={{
            ...btnStyle,
            background: copied ? 'rgba(4,120,87,0.1)' : 'rgba(21,33,56,0.05)',
            color: copied ? '#059669' : '#152138',
            border: `1px solid ${copied ? '#059669' : 'rgba(21,33,56,0.1)'}`,
          }}
        >
          {copied ? <Check style={{ width: '16px', height: '16px' }} /> : <Copy style={{ width: '16px', height: '16px' }} />}
          {copied ? 'Copiado!' : 'Copiar Link'}
        </button>
      </div>
    </div>
  )
}
