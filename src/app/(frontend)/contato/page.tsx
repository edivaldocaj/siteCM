import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Mail, Phone, MapPin } from 'lucide-react'
import { ContactForm } from '@/components/ContactForm'

export const dynamic = 'force-dynamic'

export default async function ContatoPage() {
  const payload = await getPayload({ config: configPromise })
  const siteConfig = await (payload as any).findGlobal({ slug: 'site-config' }).catch(() => null)

  const title = siteConfig?.contactTitle || 'Fale com nossa equipe'
  const subtitle = siteConfig?.contactSubtitle || 'Estamos prontos para analisar o seu caso e propor a melhor estratégia.'
  const email = siteConfig?.contactEmail || 'contato@cavalcantemelo.com.br'
  const phone = siteConfig?.contactPhone || '(84) 99999-9999'
  const address = siteConfig?.contactAddress || 'Natal/RN'

  return (
    <div style={{ backgroundColor: '#f1eae2', minHeight: '100vh', paddingBottom: '100px', fontFamily: "'Source Sans 3', sans-serif" }}>
      
      {/* Hero Premium */}
      <section style={{ backgroundColor: '#152138', paddingTop: '140px', paddingBottom: '120px', paddingLeft: '24px', paddingRight: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-5%', opacity: 0.03, pointerEvents: 'none' }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '600px', fontWeight: 'bold', color: '#ede1c3' }}>CM</span>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <span style={{ color: '#152138', backgroundColor: '#ede1c3', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', padding: '6px 16px', borderRadius: '2px', display: 'inline-block', marginBottom: '24px', fontWeight: 600 }}>
            Atendimento
          </span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#f1eae2', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.02em' }}>
            {title}
          </h1>
          <p style={{ color: 'rgba(241,234,226,0.7)', fontSize: '20px', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto', fontWeight: 300 }}>
            {subtitle}
          </p>
        </div>
      </section>

      <section style={{ maxWidth: '1000px', margin: '-60px auto 0', position: 'relative', zIndex: 20, padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
          
          {/* Card de Informações (Dark) */}
          <div style={{ background: '#152138', padding: '48px', borderRadius: '4px', color: '#f1eae2', borderBottom: '4px solid #ede1c3', boxShadow: '0 10px 40px rgba(21,33,56,0.1)' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', marginBottom: '40px', color: '#ede1c3' }}>Nossos Contatos</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
              <div style={{ background: 'rgba(237,225,195,0.1)', padding: '12px', borderRadius: '50%' }}>
                <Mail style={{ color: '#ede1c3', width: '20px', height: '20px' }} strokeWidth={1.5} />
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'rgba(241,234,226,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>E-mail Oficial</p>
                <p style={{ fontSize: '16px', fontWeight: 300 }}>{email}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
              <div style={{ background: 'rgba(237,225,195,0.1)', padding: '12px', borderRadius: '50%' }}>
                <Phone style={{ color: '#ede1c3', width: '20px', height: '20px' }} strokeWidth={1.5} />
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'rgba(241,234,226,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Telefone Direto</p>
                <p style={{ fontSize: '16px', fontWeight: 300 }}>{phone}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ background: 'rgba(237,225,195,0.1)', padding: '12px', borderRadius: '50%' }}>
                <MapPin style={{ color: '#ede1c3', width: '20px', height: '20px' }} strokeWidth={1.5} />
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'rgba(241,234,226,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Endereço</p>
                <p style={{ fontSize: '16px', lineHeight: 1.5, fontWeight: 300 }}>{address}</p>
              </div>
            </div>
          </div>

          {/* Formulário (Light) */}
          <div style={{ background: '#ffffff', padding: '48px', borderRadius: '4px', boxShadow: '0 10px 40px rgba(21,33,56,0.08)', borderTop: '4px solid #152138' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#152138', marginBottom: '32px' }}>Envie sua mensagem</h3>
            <ContactForm />
          </div>

        </div>
      </section>
    </div>
  )
}