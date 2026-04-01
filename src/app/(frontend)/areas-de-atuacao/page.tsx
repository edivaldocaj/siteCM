import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PracticeAreasGrid } from '@/components/sections/PracticeAreasGrid'
import { ContactCTA } from '@/components/sections/ContactCTA'

export const revalidate = 60

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
    <div style={{ backgroundColor: '#faf8f5', minHeight: '100vh', paddingBottom: '0' }}>
      <section style={{ background: 'linear-gradient(135deg, #152138 0%, #1c2d4a 50%, #0e1628 100%)', paddingTop: '120px', paddingBottom: '80px', paddingLeft: '16px', paddingRight: '16px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#f1eae2', lineHeight: 1.1, marginBottom: '24px' }}>{title}</h1>
          <p style={{ color: 'rgba(184,191,200,0.8)', fontSize: '18px', lineHeight: 1.6, maxWidth: '600px', margin: '0 auto' }}>{subtitle}</p>
        </div>
      </section>

      <PracticeAreasGrid cmsAreas={areas} />
      <ContactCTA />
    </div>
  )
}