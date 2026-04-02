'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface AboutPartnersProps {
  cmsData?: {
    sectionTitle?: string
    sectionDescription?: string
    partnersList?: Array<{
      name: string
      role: string
      oab?: string
      bio: string
      photo?: { url: string }
    }>
  } | null
}

const defaultPartners = [
  {
    name: 'Dr. Edivaldo Cavalcante',
    fullName: 'Edivaldo Cavalcante de Albuquerque Junior',
    role: 'Sócio-Administrador',
    areas: ['Direito Digital', 'LGPD', 'Direito Civil', 'Licitações e Contratos', 'Direito Penal'],
    initials: 'EC',
    bio: 'Advogado com atuação estratégica em Direito Digital e LGPD, aliando tecnologia e inovação à prática jurídica.',
  },
  {
    name: 'Dra. Gabrielly Melo',
    fullName: 'Neura Gabrielly Evangelista de Melo Freitas',
    role: 'Sócia-Administradora',
    areas: ['Direito Tributário', 'Direito Imobiliário', 'Direito Civil'],
    initials: 'GM',
    bio: 'Advogada especialista em Direito Tributário e Imobiliário, com foco em planejamento fiscal e regularização.',
  },
]

export function AboutPartners({ cmsData }: AboutPartnersProps) {
  const sectionTitle = cmsData?.sectionTitle || 'Sócios Fundadores'
  const sectionDesc = cmsData?.sectionDescription || 'Profissionais comprometidos com a excelência, ética e resultados para nossos clientes.'

  const partners = cmsData?.partnersList?.length
    ? cmsData.partnersList.map((p) => ({
        name: p.name,
        role: p.role,
        areas: p.role.split(',').map((a: string) => a.trim()),
        initials: p.name
          .split(' ')
          .filter((_: string, i: number, arr: string[]) => i === 0 || i === arr.length - 1)
          .map((n: string) => n[0])
          .join(''),
        bio: p.bio,
        oab: p.oab,
        photoUrl: p.photo?.url || null,
      }))
    : defaultPartners

  return (
    <section style={{ padding: '80px 16px', backgroundColor: 'white' }}>
      <div className="container-wide mx-auto">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span style={{
            color: 'var(--color-brand-gold-dark)',
            fontSize: '12px',
            fontFamily: 'var(--font-body)',
            textTransform: 'uppercase',
            letterSpacing: '0.25em',
            display: 'block',
            marginBottom: '16px',
          }}>
            Quem Somos
          </span>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            fontWeight: 600,
            color: 'var(--color-brand-navy)',
            marginBottom: '24px',
          }}>
            {sectionTitle}
          </h2>
          <p style={{
            color: 'rgba(21,33,56,0.6)',
            fontFamily: 'var(--font-body)',
            fontSize: '18px',
            maxWidth: '40rem',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            {sectionDesc}
          </p>
        </div>

        {/* Partners */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '32px',
          maxWidth: '52rem',
          margin: '0 auto',
        }}>
          {partners.map((partner: any) => (
            <div
              key={partner.name}
              className="card-hover"
              style={{
                background: 'var(--color-brand-cream)',
                borderRadius: '8px',
                padding: '32px',
                border: '1px solid rgba(196,169,106,0.1)',
              }}
            >
              {/* Avatar */}
              {partner.photoUrl ? (
                <img
                  src={partner.photoUrl}
                  alt={partner.name}
                  style={{
                    width: '96px',
                    height: '96px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    margin: '0 auto 24px',
                    display: 'block',
                  }}
                />
              ) : (
                <div style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #152138, #1c2d4a)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                }}>
                  <span className="text-silver-gradient" style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '24px',
                    fontWeight: 'bold',
                  }}>
                    {partner.initials}
                  </span>
                </div>
              )}

              <div style={{ textAlign: 'center' }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '20px',
                  fontWeight: 600,
                  color: 'var(--color-brand-navy)',
                  marginBottom: '4px',
                }}>
                  {partner.name}
                </h3>
                <p style={{
                  color: 'var(--color-brand-gold-dark)',
                  fontSize: '14px',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  marginBottom: '16px',
                }}>
                  {partner.role}
                </p>

                {partner.oab && (
                  <p style={{ color: 'rgba(21,33,56,0.4)', fontSize: '12px', marginBottom: '12px' }}>
                    {partner.oab}
                  </p>
                )}

                {/* Area pills */}
                {partner.areas && (
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '8px',
                    marginBottom: '24px',
                  }}>
                    {partner.areas.map((area: string) => (
                      <span
                        key={area}
                        style={{
                          fontSize: '11px',
                          fontFamily: 'var(--font-body)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          color: 'rgba(21,33,56,0.5)',
                          background: 'white',
                          padding: '4px 12px',
                          borderRadius: '2px',
                          border: '1px solid rgba(196,169,106,0.1)',
                        }}
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                )}

                {partner.bio && (
                  <p style={{
                    color: 'rgba(21,33,56,0.6)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '14px',
                    lineHeight: 1.7,
                  }}>
                    {partner.bio}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link
            href="/sobre"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--color-brand-gold-dark)',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '13px',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              textDecoration: 'none',
              transition: 'gap 0.3s',
            }}
          >
            Conheça nossa história <ArrowRight style={{ width: '16px', height: '16px' }} />
          </Link>
        </div>
      </div>
    </section>
  )
}
