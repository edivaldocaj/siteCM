import { Phone, Shield } from 'lucide-react'

export function CriminalUrgency() {
  return (
    <section style={{ background: '#7a1b1b', padding: '64px 24px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #7a1b1b, #c4a96a, #7a1b1b)' }} />
      <div style={{ maxWidth: '80rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, minWidth: '280px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Shield style={{ width: '24px', height: '24px', color: '#f1eae2' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 600, color: '#f1eae2', margin: 0 }}>Defesa Criminal Urgente</h2>
              <span style={{ background: 'rgba(255,255,255,0.15)', color: '#f1eae2', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 10px', borderRadius: '2px' }}>24h</span>
            </div>
            <p style={{ color: 'rgba(241,234,226,0.7)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '15px', lineHeight: 1.5, margin: 0 }}>
              Sendo investigado ou preso? Não fale sem um advogado. Atendimento imediato.
            </p>
          </div>
        </div>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985'}?text=${encodeURIComponent('Preciso de ajuda urgente com um caso criminal.')}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f1eae2', color: '#7a1b1b', padding: '14px 28px', borderRadius: '4px', fontFamily: "'Source Sans 3', sans-serif", fontWeight: 700, fontSize: '14px', textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'all 0.3s', flexShrink: 0 }}
        >
          <Phone style={{ width: '18px', height: '18px' }} />
          Ligar Agora
        </a>
      </div>
    </section>
  )
}
