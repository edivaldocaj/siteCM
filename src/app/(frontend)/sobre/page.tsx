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
    <div style={{ backgroundColor: '#f1eae2', minHeight: '100vh', paddingBottom: '0', fontFamily: "'Source Sans 3', sans-serif" }}>
      
      {/* Hero Premium */}
      <section style={{ backgroundColor: '#152138', paddingTop: '140px', paddingBottom: '120px', paddingLeft: '24px', paddingRight: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-5%', opacity: 0.03, pointerEvents: 'none' }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '600px', fontWeight: 'bold', color: '#ede1c3' }}>CM</span>
        </div>
        
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <span style={{ color: '#152138', backgroundColor: '#ede1c3', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', padding: '6px 16px', borderRadius: '2px', display: 'inline-block', marginBottom: '24px', fontWeight: 600 }}>
            O Escritório
          </span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#f1eae2', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.02em' }}>
            {title}
          </h1>
          <p style={{ color: 'rgba(241,234,226,0.7)', fontSize: '20px', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto', fontWeight: 300 }}>
            {subtitle}
          </p>
        </div>
      </section>

      {/* Conteúdo CMS Elegante */}
      <section style={{ maxWidth: '800px', margin: '-60px auto 80px', position: 'relative', zIndex: 20, padding: '0 24px' }}>
        <div style={{ background: '#ffffff', padding: '56px', borderRadius: '4px', boxShadow: '0 10px 40px rgba(21,33,56,0.08)', borderTop: '4px solid #152138', borderLeft: '1px solid #ede1c3' }}>
          <div style={{ color: '#4a5568', fontSize: '17px', lineHeight: 1.8, fontWeight: 300 }} className="cms-rich-text">
            {siteConfig?.aboutContent ? (
              <RichText data={siteConfig.aboutContent} />
            ) : (
              <p>O conteúdo da página Sobre Nós será exibido aqui quando preenchido no CMS.</p>
            )}
          </div>
        </div>
      </section>
      
      <ContactCTA />
    </div>
  )
}