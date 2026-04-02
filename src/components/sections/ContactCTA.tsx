import { Phone, MessageCircle } from 'lucide-react'

export function ContactCTA() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985'

  return (
    <section style={{ background: 'linear-gradient(135deg, #152138 0%, #1c2d4a 50%, #0e1628 100%)', padding: '80px 24px', textAlign: 'center' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <MessageCircle style={{ width: '40px', height: '40px', color: '#c4a96a', margin: '0 auto 24px' }} />
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', color: '#f1eae2', marginBottom: '16px', lineHeight: 1.2 }}>
          Precisa de orientação jurídica?
        </h2>
        <p style={{ color: 'rgba(184,191,200,0.6)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '17px', marginBottom: '40px', lineHeight: 1.6 }}>
          Fale com um advogado especialista. Atendimento ágil e sigiloso.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
          >
            <Phone style={{ width: '18px', height: '18px' }} />
            Fale pelo WhatsApp
          </a>
          <a href="/contato" className="btn-outline">
            Enviar Mensagem
          </a>
        </div>
      </div>
    </section>
  )
}
