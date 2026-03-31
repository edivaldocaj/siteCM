import React from 'react'

export function AboutPartners({ cmsData }: { cmsData?: any }) {
  if (!cmsData || !cmsData.partnersList || cmsData.partnersList.length === 0) {
    return (
      <section style={{ padding: '80px 16px', backgroundColor: '#faf8f5', textAlign: 'center' }}>
        <p style={{ color: 'rgba(21,33,56,0.5)' }}>Adicione as informações dos advogados no menu "Página Inicial" do Painel CMS.</p>
      </section>
    );
  }

  return (
    <section style={{ padding: '80px 16px', backgroundColor: '#faf8f5' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span style={{ color: '#c4a96a', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.25em' }}>Especialistas</span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', color: '#152138', marginTop: '16px' }}>
            {cmsData.sectionTitle || 'Nossos Sócios'}
          </h2>
          <p style={{ color: 'rgba(21,33,56,0.6)', fontSize: '16px', maxWidth: '600px', margin: '16px auto 0' }}>
            {cmsData.sectionDescription}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
          {cmsData.partnersList.map((partner: any, index: number) => (
            <div key={index} style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(21,33,56,0.05)' }}>
              {/* Foto do Advogado */}
              <div style={{ height: '350px', backgroundColor: '#152138', position: 'relative' }}>
                {partner.photo && partner.photo.url ? (
                  <img 
                    src={partner.photo.url} 
                    alt={partner.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)' }}>
                    Sem Foto
                  </div>
                )}
              </div>
              
              {/* Informações */}
              <div style={{ padding: '24px' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#152138', margin: '0 0 8px 0' }}>{partner.name}</h3>
                <p style={{ color: '#c4a96a', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>{partner.role}</p>
                {partner.oab && <p style={{ color: 'rgba(21,33,56,0.4)', fontSize: '12px', marginBottom: '16px' }}>{partner.oab}</p>}
                
                <p style={{ color: 'rgba(21,33,56,0.6)', fontSize: '15px', lineHeight: 1.6 }}>
                  {partner.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}