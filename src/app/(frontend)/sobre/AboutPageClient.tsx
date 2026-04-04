'use client'

import { Scale, Users, Award, MapPin, Phone } from 'lucide-react'

const defaultPartners = [
  {
    name: 'Dr. Edivaldo Cavalcante',
    role: 'Sócio-Administrador',
    initials: 'EC',
    bio: 'Advogado com atuação estratégica em Direito Digital e LGPD, aliando tecnologia e inovação à prática jurídica. Também atua em Direito Civil, Licitações e Contratos Administrativos, além de Direito Penal com atendimento 24 horas para casos urgentes.',
    areas: ['Direito Digital', 'LGPD', 'Direito Civil', 'Licitações e Contratos', 'Direito Penal'],
  },
  {
    name: 'Dra. Gabrielly Melo',
    role: 'Sócia-Administradora',
    initials: 'GM',
    bio: 'Advogada especialista em Direito Tributário e Imobiliário, com foco em planejamento fiscal, regularização de imóveis e assessoria contratual. Atua também em Direito Civil com atenção ao detalhe e compromisso com resultados.',
    areas: ['Direito Tributário', 'Direito Imobiliário', 'Direito Civil'],
  },
]

const timeline = [
  { year: '2025', title: 'Fundação', desc: 'Cavalcante & Melo Sociedade de Advogados é fundada em Natal/RN.' },
  { year: '2025', title: 'Especialização Digital', desc: 'Foco estratégico em Direito Digital, LGPD e tecnologia jurídica.' },
  { year: '2026', title: 'Expansão', desc: 'Ampliação das áreas de atuação e consolidação no mercado potiguar.' },
]

const values = [
  { icon: Scale, title: 'Ética', desc: 'Compromisso absoluto com a ética profissional e o Código da OAB.' },
  { icon: Users, title: 'Proximidade', desc: 'Atendimento humanizado, tratando cada cliente com atenção individual.' },
  { icon: Award, title: 'Resultado', desc: 'Foco em soluções concretas e eficazes para cada caso.' },
]

export function AboutPageClient({ homepage, siteConfig }: { homepage: any; siteConfig: any }) {
  const aboutTitle = siteConfig?.aboutTitle || 'Sobre o Escritório'
  const aboutSubtitle = siteConfig?.aboutSubtitle || 'Advocacia estratégica e humanizada, construída sobre os pilares da ética, proximidade e busca por resultados concretos.'

  const partners = homepage?.aboutPartners?.partnersList?.length
    ? homepage.aboutPartners.partnersList.map((p: any) => ({
        name: p.name,
        role: p.role,
        initials: (() => {
          const clean = p.name.replace(/^(Dr\.|Dra\.|Prof\.)\s*/i, '').trim()
          const parts = clean.split(/\s+/)
          return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : parts[0]?.[0]?.toUpperCase() || '?'
        })(),
        bio: p.bio,
        oab: p.oab,
        areas: p.role.split(/[,|]/).map((a: string) => a.trim()).filter(Boolean),
        photoUrl: p.photo?.url || null,
      }))
    : defaultPartners

  return (
    <>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #152138 0%, #1c2d4a 50%, #0e1628 100%)', padding: '140px 24px 80px' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <span style={{ color: 'var(--color-brand-gold-dark)', fontSize: '12px', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.25em', display: 'block', marginBottom: '16px' }}>
            Quem Somos
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 600, color: 'var(--color-brand-champagne)', lineHeight: 1.1, marginBottom: '24px' }}>
            {aboutTitle}
          </h1>
          <p style={{ color: 'rgba(184,191,200,0.7)', fontFamily: 'var(--font-body)', fontSize: '18px', lineHeight: 1.6, maxWidth: '600px' }}>
            {aboutSubtitle}
          </p>
        </div>
      </section>

      {/* Nossa História */}
      <section style={{ padding: '80px 24px', backgroundColor: 'var(--color-brand-cream)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: 'var(--color-brand-navy)', marginBottom: '24px' }}>
            Nossa História
          </h2>
          <p style={{ color: 'rgba(21,33,56,0.7)', fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, maxWidth: '900px', marginBottom: '48px' }}>
            A Cavalcante &amp; Melo Sociedade de Advogados nasceu em 2025 com a missão de oferecer advocacia de excelência em Natal/RN. Fundada por profissionais com experiência complementar, o escritório se destaca pela combinação de expertise em áreas tradicionais do Direito com a inovação do Direito Digital e LGPD.
          </p>

          {/* Timeline */}
          <div style={{ position: 'relative', paddingLeft: '32px', borderLeft: '2px solid rgba(196,169,106,0.2)' }}>
            {timeline.map((item, i) => (
              <div key={i} style={{ marginBottom: i < timeline.length - 1 ? '40px' : '0', position: 'relative' }}>
                <div style={{ position: 'absolute', left: '-41px', top: '4px', width: '18px', height: '18px', borderRadius: '50%', background: 'var(--color-brand-gold-dark)', border: '3px solid var(--color-brand-cream)' }} />
                <span style={{ color: 'var(--color-brand-gold-dark)', fontSize: '14px', fontFamily: 'var(--font-body)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  {item.year}
                </span>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--color-brand-navy)', fontWeight: 600, marginBottom: '8px' }}>
                  {item.title}
                </h3>
                <p style={{ color: 'rgba(21,33,56,0.6)', fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nossos Valores */}
      <section style={{ padding: '80px 24px', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: 'var(--color-brand-navy)', textAlign: 'center', marginBottom: '48px' }}>
            Nossos Valores
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }} className="values-grid">
            {values.map((v) => (
              <div key={v.title} style={{ backgroundColor: 'var(--color-brand-cream)', borderRadius: '8px', padding: '40px 32px', textAlign: 'center' }}>
                <v.icon style={{ width: '40px', height: '40px', color: 'var(--color-brand-gold-dark)', margin: '0 auto 20px' }} strokeWidth={1.5} />
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--color-brand-navy)', fontWeight: 600, marginBottom: '12px' }}>
                  {v.title}
                </h3>
                <p style={{ color: 'rgba(21,33,56,0.6)', fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.6 }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sócios Fundadores */}
      <section style={{ padding: '80px 24px', backgroundColor: 'var(--color-brand-cream)' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: 'var(--color-brand-navy)', textAlign: 'center', marginBottom: '48px' }}>
            Sócios Fundadores
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px', maxWidth: '900px', margin: '0 auto' }} className="partners-grid">
            {partners.map((p: any) => (
              <div key={p.name} style={{ backgroundColor: 'white', borderRadius: '8px', padding: '40px 32px', border: '1px solid rgba(237,225,195,0.3)' }}>
                {/* Avatar */}
                {p.photoUrl ? (
                  <img src={p.photoUrl} alt={p.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '20px' }} />
                ) : (
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #152138, #1c2d4a)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                    <span className="text-silver-gradient" style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 'bold' }}>{p.initials}</span>
                  </div>
                )}
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 600, color: 'var(--color-brand-navy)', marginBottom: '4px' }}>
                  {p.name}
                </h3>
                <p style={{ color: 'var(--color-brand-gold-dark)', fontSize: '14px', fontFamily: 'var(--font-body)', fontWeight: 500, marginBottom: '16px' }}>
                  {p.role}
                </p>
                <p style={{ color: 'rgba(21,33,56,0.6)', fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>
                  {p.bio}
                </p>
                {/* Area pills */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {(p.areas || []).map((area: string) => (
                    <span key={area} style={{ fontSize: '10px', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(21,33,56,0.5)', background: 'var(--color-brand-cream)', padding: '4px 12px', borderRadius: '2px', border: '1px solid rgba(196,169,106,0.1)' }}>
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Localização */}
      <section style={{ padding: '64px 24px', background: 'linear-gradient(135deg, #152138 0%, #1c2d4a 50%, #0e1628 100%)', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <MapPin style={{ width: '32px', height: '32px', color: 'var(--color-brand-gold-dark)', margin: '0 auto 16px' }} />
          <p style={{ color: 'rgba(184,191,200,0.7)', fontFamily: 'var(--font-body)', fontSize: '16px', marginBottom: '24px' }}>
            Rua Francisco Maia Sobrinho, 1950 — Lagoa Nova, Natal/RN
          </p>
          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985'}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <Phone style={{ width: '16px', height: '16px' }} />
            Fale com um Advogado
          </a>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .values-grid { grid-template-columns: 1fr !important; }
          .partners-grid { grid-template-columns: 1fr !important; }
        }
      `}} />
    </>
  )
}
