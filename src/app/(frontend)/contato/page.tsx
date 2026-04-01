import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Mail, Phone, MapPin } from 'lucide-react'
import { ContactForm } from '@/components/ContactForm'

export const revalidate = 60

export default async function ContatoPage() {
  const payload = await getPayload({ config: configPromise })
  const siteConfig = await (payload as any).findGlobal({ slug: 'site-config' }).catch(() => null)

  const title = siteConfig?.contactTitle || 'Fale com nossa equipe'
  const subtitle = siteConfig?.contactSubtitle || 'Estamos prontos para analisar o seu caso.'
  const email = siteConfig?.contactEmail || 'contato@cavalcantemelo.com.br'
  const phone = siteConfig?.contactPhone || '(84) 99999-9999'
  const address = siteConfig?.contactAddress || 'Natal/RN'

  return (
    <div style={{ backgroundColor: '#faf8f5', minHeight: '100vh', paddingBottom: '80px' }}>
      <section style={{ background: 'linear-gradient(135deg, #152138 0%, #1c2d4a 50%, #0e1628 100%)', paddingTop: '120px', paddingBottom: '80px', paddingLeft: '16px', paddingRight: '16px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ color: '#c4a96a', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.25em', display: 'block', marginBottom: '16px' }}>Atendimento</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#f1eae2', lineHeight: 1.1, marginBottom: '24px' }}>{title}</h1>
          <p style={{ color: 'rgba(184,191,200,0.8)', fontSize: '18px', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto' }}>{subtitle}</p>
        </div>
      </section>

      <section style={{ maxWidth: '1000px', margin: '-40px auto 0', position: 'relative', zIndex: 10, padding: '0 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          
          {/* Informações de Contato (Vem do CMS) */}
          <div style={{ background: '#152138', padding: '40px', borderRadius: '12px', color: '#f1eae2' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', marginBottom: '32px' }}>Nossos Contatos</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <Mail style={{ color: '#c4a96a' }} />
              <div>
                <p style={{ fontSize: '12px', color: '#b8bfc8', textTransform: 'uppercase', marginBottom: '4px' }}>E-mail</p>
                <p style={{ fontSize: '16px' }}>{email}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <Phone style={{ color: '#c4a96a' }} />
              <div>
                <p style={{ fontSize: '12px', color: '#b8bfc8', textTransform: 'uppercase', marginBottom: '4px' }}>Telefone</p>
                <p style={{ fontSize: '16px' }}>{phone}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <MapPin style={{ color: '#c4a96a' }} />
              <div>
                <p style={{ fontSize: '12px', color: '#b8bfc8', textTransform: 'uppercase', marginBottom: '4px' }}>Endereço</p>
                <p style={{ fontSize: '16px', lineHeight: 1.4 }}>{address}</p>
              </div>
            </div>
          </div>

          {/* Formulário (Componente isolado) */}
          <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(21,33,56,0.05)' }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#152138', marginBottom: '24px' }}>Envie sua dúvida</h3>
            <ContactForm />
          </div>

        </div>
      </section>
    </div>
  )
}