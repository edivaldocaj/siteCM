export function AboutPartners({ cmsData }: { cmsData?: any }) {
  const sectionTitle = cmsData?.sectionTitle || 'Nossos Sócios'
  const sectionDesc = cmsData?.sectionDescription || 'Conheça os especialistas à frente do Cavalcante & Melo.'

  const defaultPartners = [
    { name: 'Dr. Edivaldo Cavalcante', role: 'Direito Digital, LGPD, Civil, Licitações, Penal', initials: 'EC', bio: 'Advogado com atuação estratégica em Direito Digital e LGPD, aliando tecnologia e inovação à prática jurídica.' },
    { name: 'Dra. Gabrielly Melo', role: 'Tributário, Imobiliário, Civil', initials: 'GM', bio: 'Advogada especialista em Direito Tributário e Imobiliário, com foco em planejamento fiscal e regularização.' },
  ]

  const partners = cmsData?.partnersList?.length > 0
    ? cmsData.partnersList.map((p: any) => ({
        name: p.name,
        role: p.role,
        initials: p.name.split(' ').filter((_: string, i: number, arr: string[]) => i === 0 || i === arr.length - 1).map((n: string) => n[0]).join(''),
        bio: p.bio,
        oab: p.oab,
        photoUrl: p.photo?.url || null,
      }))
    : defaultPartners

  return (
    <section style={{ padding: '80px 24px', backgroundColor: '#faf8f5' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <span style={{ color: '#c4a96a', fontSize: '12px', fontFamily: "'Source Sans 3', sans-serif", textTransform: 'uppercase', letterSpacing: '0.25em', display: 'block', marginBottom: '16px' }}>Equipe</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', color: '#152138', margin: '0 0 16px 0', lineHeight: 1.2 }}>{sectionTitle}</h2>
          <p style={{ color: 'rgba(21,33,56,0.55)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '17px', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>{sectionDesc}</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px', maxWidth: '720px', margin: '0 auto' }}>
          {partners.map((partner: any) => (
            <div key={partner.name} style={{ background: 'white', borderRadius: '4px', padding: '40px', border: '1px solid rgba(237,225,195,0.3)', boxShadow: '0 4px 20px rgba(21,33,56,0.06)', textAlign: 'center' }}>
              {partner.photoUrl ? (
                <img src={partner.photoUrl} alt={partner.name} style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 20px' }} />
              ) : (
                <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'linear-gradient(135deg, #152138, #1c2d4a)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <span style={{ background: 'linear-gradient(135deg, #b8bfc8, #e8ebee, #b8bfc8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: "'Playfair Display', serif", fontSize: '24px', fontWeight: 'bold' }}>{partner.initials}</span>
                </div>
              )}
              <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 600, color: '#152138', marginBottom: '4px' }}>{partner.name}</h3>
              <p style={{ color: '#c4a96a', fontSize: '13px', fontFamily: "'Source Sans 3', sans-serif", fontWeight: 500, marginBottom: '16px' }}>{partner.role}</p>
              {partner.oab && <p style={{ color: 'rgba(21,33,56,0.4)', fontSize: '12px', marginBottom: '12px' }}>{partner.oab}</p>}
              <p style={{ color: 'rgba(21,33,56,0.6)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '14px', lineHeight: 1.7 }}>{partner.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
