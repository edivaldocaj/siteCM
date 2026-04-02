import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PracticeAreasGrid } from '@/components/sections/PracticeAreasGrid'
import { ContactCTA } from '@/components/sections/ContactCTA'

export const dynamic = 'force-dynamic'

export default async function AtuacaoPage() {
  const payload = await getPayload({ config: configPromise })
  
  const siteConfig = await (payload as any).findGlobal({ slug: 'site-config' }).catch(() => null)
  
  const { docs: areas } = await (payload as any).find({
    collection: 'practice-areas',
    sort: 'order'
  }).catch(() => ({ docs: [] }))

  const title = siteConfig?.practiceTitle || 'Nossas Especialidades'
  const subtitle = siteConfig?.practiceSubtitle || 'Especialistas nas áreas mais complexas do Direito, oferecendo soluções jurídicas inovadoras e seguras.'

  return (
    <div style={{ backgroundColor: '#f1eae2', minHeight: '100vh', paddingBottom: '0', fontFamily: "'Source Sans 3', sans-serif" }}>
      
      {/* Hero Premium */}
      <section style={{ backgroundColor: '#152138', paddingTop: '140px', paddingBottom: '120px', paddingLeft: '24px', paddingRight: '24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-5%', opacity: 0.03, pointerEvents: 'none' }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '600px', fontWeight: 'bold', color: '#ede1c3' }}>CM</span>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <span style={{ color: '#152138', backgroundColor: '#ede1c3', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', padding: '6px 16px', borderRadius: '2px', display: 'inline-block', marginBottom: '24px', fontWeight: 600 }}>
            Atuação
          </span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#f1eae2', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.02em' }}>
            {title}
          </h1>
          <p style={{ color: 'rgba(241,234,226,0.7)', fontSize: '20px', lineHeight: 1.6, maxWidth: '640px', margin: '0 auto', fontWeight: 300 }}>
            {subtitle}
          </p>
        </div>
      </section>

      {/* Grid de Atuação (com margin negativa para sobrepor o Hero elegantemente) */}
      <div style={{ marginTop: '-60px', position: 'relative', zIndex: 20 }}>
        <PracticeAreasGrid cmsAreas={areas} />
      </div>
      
      <ContactCTA />
    </div>
  )
}