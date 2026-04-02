export function TrustBar() {
  const stats = [
    { number: '7', label: 'Áreas de Atuação' },
    { number: '24h', label: 'Atendimento Penal' },
    { number: '100%', label: 'Digital e Presencial' },
    { number: 'OAB', label: 'Advocacia Responsável' },
  ]

  return (
    <section style={{ backgroundColor: '#152138', borderTop: '1px solid rgba(196,169,106,0.15)', borderBottom: '1px solid rgba(196,169,106,0.15)' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px', textAlign: 'center' }}>
          {stats.map((stat) => (
            <div key={stat.label}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 700, color: '#c4a96a', marginBottom: '4px' }}>{stat.number}</div>
              <div style={{ color: 'rgba(184,191,200,0.6)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) { section > div > div { grid-template-columns: repeat(2, 1fr) !important; } }
      `}} />
    </section>
  )
}
