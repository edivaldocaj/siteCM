import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { Scale, Users, Award, MapPin, Phone } from 'lucide-react'

export const dynamic = 'force-dynamic'

const timeline = [
  { year: '2025', title: 'Fundação', description: 'Cavalcante & Melo Sociedade de Advogados é fundada em Natal/RN.' },
  { year: '2025', title: 'Especialização Digital', description: 'Foco estratégico em Direito Digital, LGPD e tecnologia jurídica.' },
  { year: '2026', title: 'Expansão', description: 'Ampliação das áreas de atuação e consolidação no mercado potiguar.' },
]

const defaultPartners = [
  {
    name: 'Dr. Edivaldo Cavalcante',
    role: 'Sócio-Administrador',
    initials: 'EC',
    areas: ['Direito Digital', 'LGPD', 'Direito Civil', 'Licitações e Contratos', 'Direito Penal'],
    bio: 'Advogado com atuação estratégica em Direito Digital e LGPD, aliando tecnologia e inovação à prática jurídica. Também atua em Direito Civil, Licitações e Contratos Administrativos, além de Direito Penal com atendimento 24 horas para casos urgentes.',
  },
  {
    name: 'Dra. Gabrielly Melo',
    role: 'Sócia-Administradora',
    initials: 'GM',
    areas: ['Direito Tributário', 'Direito Imobiliário', 'Direito Civil'],
    bio: 'Advogada especialista em Direito Tributário e Imobiliário, com foco em planejamento fiscal, regularização de imóveis e assessoria contratual. Atua também em Direito Civil com atenção ao detalhe e compromisso com resultados.',
  },
]

const values = [
  { icon: Scale, title: 'Ética', description: 'Compromisso absoluto com a ética profissional e o Código da OAB.' },
  { icon: Users, title: 'Proximidade', description: 'Atendimento humanizado, tratando cada cliente com atenção individual.' },
  { icon: Award, title: 'Resultado', description: 'Foco em soluções concretas e eficazes para cada caso.' },
]

export default async function SobrePage() {
  const payload = await getPayload({ config: configPromise })
  const siteConfig = await (payload as any).findGlobal({ slug: 'site-config' }).catch(() => null)
  const homepageData = await (payload as any).findGlobal({ slug: 'homepage' }).catch(() => null)

  const title = siteConfig?.aboutTitle || 'Sobre o Escritório'
  const subtitle = siteConfig?.aboutSubtitle || 'Advocacia estratégica e humanizada, construída sobre os pilares da ética, proximidade e busca por resultados concretos.'
  const cmsPartners = homepageData?.aboutPartners?.partnersList

  const partners = cmsPartners?.length > 0
    ? cmsPartners.map((p: any) => ({
        name: p.name,
        role: p.role,
        initials: p.name.split(' ').filter((_: string, i: number) => i === 0 || i === p.name.split(' ').length - 1).map((n: string) => n[0]).join(''),
        bio: p.bio,
        oab: p.oab,
        areas: [],
        photoUrl: p.photo?.url || null,
      }))
    : defaultPartners

  return (
    <>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #152138 0%, #1c2d4a 50%, #0e1628 100%)', paddingTop: '140px', paddingBottom: '120px', padding: '140px 24px 120px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-5%', opacity: 0.03, pointerEvents: 'none' }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '600px', fontWeight: 'bold', color: '#ede1c3' }}>CM</span>
        </div>
        <div style={{ maxWidth: '80rem', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <span style={{ color: '#c4a96a', fontSize: '12px', fontFamily: "'Source Sans 3', sans-serif", textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '16px', display: 'block' }}>Quem Somos</span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3.75rem)', fontWeight: 600, color: '#f1eae2', lineHeight: 1.1, marginBottom: '24px' }}>{title}</h1>
          <p style={{ color: 'rgba(184,191,200,0.7)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '18px', maxWidth: '42rem', lineHeight: 1.6 }}>{subtitle}</p>
        </div>
      </section>

      {/* História + CMS Content */}
      <section style={{ padding: '80px 24px', backgroundColor: '#faf8f5' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 600, color: '#152138', marginBottom: '32px' }}>Nossa História</h2>

          {siteConfig?.aboutContent ? (
            <div style={{ color: 'rgba(21,33,56,0.7)', fontSize: '17px', lineHeight: 1.8, marginBottom: '48px', background: '#ffffff', padding: '48px', borderRadius: '4px', boxShadow: '0 4px 20px rgba(21,33,56,0.06)', borderTop: '3px solid #152138' }} className="cms-rich-text">
              <RichText data={siteConfig.aboutContent} />
            </div>
          ) : (
            <p style={{ color: 'rgba(21,33,56,0.7)', fontSize: '17px', lineHeight: 1.8, marginBottom: '48px' }}>
              A Cavalcante & Melo Sociedade de Advogados nasceu em 2025 com a missão de oferecer advocacia de excelência em Natal/RN. Fundada por profissionais com experiência complementar, o escritório se destaca pela combinação de expertise em áreas tradicionais do Direito com a inovação do Direito Digital e LGPD.
            </p>
          )}

          {/* Timeline */}
          <div style={{ borderLeft: '2px solid rgba(196,169,106,0.3)', paddingLeft: '32px', marginLeft: '16px', marginBottom: '64px' }}>
            {timeline.map((item) => (
              <div key={item.title} style={{ position: 'relative', marginBottom: '32px' }}>
                <div style={{ position: 'absolute', left: '-41px', width: '16px', height: '16px', borderRadius: '50%', background: '#c4a96a', border: '4px solid #faf8f5' }} />
                <span style={{ color: '#c4a96a', fontFamily: "'Source Sans 3', sans-serif", fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{item.year}</span>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 600, color: '#152138', marginTop: '4px', marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ color: 'rgba(21,33,56,0.6)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '15px' }}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valores */}
      <section style={{ padding: '80px 24px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 600, color: '#152138', marginBottom: '48px', textAlign: 'center' }}>Nossos Valores</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '32px' }}>
            {values.map((value) => (
              <div key={value.title} style={{ textAlign: 'center', padding: '40px 32px', backgroundColor: '#faf8f5', borderRadius: '4px', border: '1px solid rgba(237,225,195,0.3)' }}>
                <value.icon style={{ width: '40px', height: '40px', color: '#c4a96a', margin: '0 auto 16px' }} />
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 600, color: '#152138', marginBottom: '12px' }}>{value.title}</h3>
                <p style={{ color: 'rgba(21,33,56,0.6)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '14px', lineHeight: 1.6 }}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sócios */}
      <section style={{ padding: '80px 24px', backgroundColor: '#faf8f5' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 600, color: '#152138', marginBottom: '48px', textAlign: 'center' }}>Sócios Fundadores</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
            {partners.map((partner: any) => (
              <div key={partner.name} style={{ background: 'white', borderRadius: '4px', padding: '40px', border: '1px solid rgba(237,225,195,0.3)', boxShadow: '0 4px 20px rgba(21,33,56,0.06)' }}>
                {partner.photoUrl ? (
                  <img src={partner.photoUrl} alt={partner.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '24px' }} />
                ) : (
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #152138, #1c2d4a)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                    <span style={{ background: 'linear-gradient(135deg, #b8bfc8, #e8ebee, #b8bfc8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 'bold' }}>{partner.initials}</span>
                  </div>
                )}
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 600, color: '#152138', marginBottom: '4px' }}>{partner.name}</h3>
                <p style={{ color: '#c4a96a', fontSize: '14px', fontFamily: "'Source Sans 3', sans-serif", fontWeight: 500, marginBottom: '16px' }}>{partner.role}</p>
                {partner.oab && <p style={{ color: 'rgba(21,33,56,0.4)', fontSize: '12px', marginBottom: '12px' }}>{partner.oab}</p>}
                <p style={{ color: 'rgba(21,33,56,0.6)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>{partner.bio}</p>
                {partner.areas?.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {partner.areas.map((area: string) => (
                      <span key={area} style={{ fontSize: '11px', fontFamily: "'Source Sans 3', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(21,33,56,0.5)', background: '#faf8f5', padding: '4px 12px', borderRadius: '2px', border: '1px solid rgba(237,225,195,0.3)' }}>{area}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Localização */}
      <section style={{ background: 'linear-gradient(135deg, #152138 0%, #1c2d4a 50%, #0e1628 100%)', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: '72rem', margin: '0 auto' }}>
          <MapPin style={{ width: '40px', height: '40px', color: '#c4a96a', margin: '0 auto 24px' }} />
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', fontWeight: 600, color: '#f1eae2', marginBottom: '16px' }}>Localização</h2>
          <p style={{ color: 'rgba(184,191,200,0.6)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '18px', marginBottom: '32px' }}>
            Rua Francisco Maia Sobrinho, 1950 — Lagoa Nova, Natal/RN
          </p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
          >
            <Phone style={{ width: '20px', height: '20px' }} />
            Fale com um Advogado
          </a>
        </div>
      </section>
    </>
  )
}
