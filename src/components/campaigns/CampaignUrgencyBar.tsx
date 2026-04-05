'use client'

interface CampaignUrgencyBarProps {
  text: string
  accentColor?: string
}

export function CampaignUrgencyBar({ text, accentColor = '#c4a96a' }: CampaignUrgencyBarProps) {
  return (
    <div
      className="campaign-urgency-bar"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: accentColor,
        padding: '10px 24px',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <div className="urgency-scroll" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '48px',
        animation: 'urgencyPulse 3s ease-in-out infinite',
      }}>
        <span style={{
          color: '#152138',
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: '13px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          whiteSpace: 'nowrap',
        }}>
          ⚠ {text}
        </span>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes urgencyPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}} />
    </div>
  )
}
