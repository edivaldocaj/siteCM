'use client'

interface CampaignUrgencyBarProps {
  text: string
  accentColor?: string
}

export function CampaignUrgencyBar({ text, accentColor = 'var(--color-ca-steel-500)' }: CampaignUrgencyBarProps) {
  return (
    <div
      className="campaign-urgency-bar"
      style={{
        // The notice belongs to the campaign flow. Keeping it in normal
        // document flow prevents it from covering the global navigation.
        position: 'relative',
        background: accentColor,
        padding: '10px 20px',
        textAlign: 'center',
      }}
    >
      <div className="urgency-scroll" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
      }}>
        <span style={{
          color: 'var(--color-ca-navy-950)',
          fontFamily: "'Source Sans 3', sans-serif",
          fontSize: '13px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          lineHeight: 1.35,
        }}>
          ⚠ {text}
        </span>
      </div>

    </div>
  )
}
