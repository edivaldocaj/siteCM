import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { ContactCTA } from '@/components/sections/ContactCTA'

export const dynamic = 'force-dynamic'

export default async function SobrePage() {
  const payload = await getPayload({ config: configPromise })
  const siteConfig = await (payload as any).findGlobal({ slug: 'site-config' }).catch(() => null)

  const title = siteConfig?.aboutTitle || 'Nossa História e Valores'
  const subtitle = siteConfig?.aboutSubtitle || 'Comprometimento absoluto com a excelência jurídica e a defesa intransigente dos direitos dos nossos clientes.'

  return (
    <div style={{ backgroundColor: '#faf8f5', minHeight: '100vh', paddingBottom: '80px' }}>
      <section style={{ background: 'linear-gradient(135deg, #152138 0%, #1c2d4a 50%, #0e1628 100%)', paddingTop: '120px', paddingBottom: '80px', paddingLeft: '16px', paddingRight: '16px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ color: '#c4a96a', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.25em', display: 'block', marginBottom: '16px' }}>O Escritório</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#f1eae2', lineHeight: 1.1, marginBottom: '24px' }}>{title}</h1>
          <p style={{ color: 'rgba(184,191,200,0.8)', fontSize: '18px', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto' }}>{subtitle}</p>
        </div>
      </section>

      <section style={{ maxWidth: '800px', margin: '-40px auto 40px', position: 'relative', zIndex: 10, padding: '0 16px' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(21,33,56,0.05)' }}>
          <div style={{ color: 'rgba(21,33,56,0.7)', fontSize: '16px', lineHeight: 1.8 }} className="cms-rich-text">
            {siteConfig?.aboutContent ? (
              <RichText data={siteConfig.aboutContent} />
            ) : (
              <p>O conteúdo da página Sobre Nós será exibido aqui quando preenchido no CMS (Aba Configurações Gerais).</p>
            )}
          </div>
        </div>
      </section>
      
      <ContactCTA />
    </div>
  )
}