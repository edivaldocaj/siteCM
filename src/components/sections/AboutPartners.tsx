'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

function getInitials(name: string): string {
  const clean = name.replace(/^(Dr\.|Dra\.|Prof\.|Sr\.|Sra\.)\s*/i, '').trim()
  const parts = clean.split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return parts[0]?.[0]?.toUpperCase() || '?'
}

const defaultPartners = [
  {
    name: 'Dr. Edivaldo Cavalcante',
    role: 'Sócio-Administrador',
    areas: ['Direito Digital', 'LGPD', 'Direito Civil', 'Licitações e Contratos', 'Direito Penal'],
    initials: 'EC',
    bio: '',
    oab: '',
    photoUrl: null as string | null,
  },
  {
    name: 'Dra. Gabrielly Melo',
    role: 'Sócia-Administradora',
    areas: ['Direito Tributário', 'Direito Imobiliário', 'Direito Civil'],
    initials: 'GM',
    bio: '',
    oab: '',
    photoUrl: null as string | null,
  },
]

interface AboutPartnersProps {
  cmsData?: {
    sectionTitle?: string
    sectionDescription?: string
    partnersList?: any[]
  } | null
}

export function AboutPartners({ cmsData }: AboutPartnersProps) {
  const sectionTitle = cmsData?.sectionTitle || 'Sócios Fundadores'
  const sectionDesc = cmsData?.sectionDescription || 'Profissionais comprometidos com a excelência, ética e resultados para nossos clientes.'

  const partners = cmsData?.partnersList?.length
    ? cmsData.partnersList.map((p: any) => ({
        name: p.name || '',
        role: p.role || '',
        areas: p.areas
          ? p.areas.split(/[,|]/).map((a: string) => a.trim()).filter(Boolean)
          : p.role.split(/[,|]/).map((a: string) => a.trim()).filter(Boolean),
        initials: getInitials(p.name || ''),
        bio: p.bio || '',
        oab: p.oab || '',
        photoUrl: p.photo?.url || null,
      }))
    : defaultPartners

  return (
    <section style={{ padding: '80px 16px', backgroundColor: 'white' }}>
      <div className="container-wide mx-auto">
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <span style={{ color: 'var(--color-brand-gold-dark)', fontSize: '12px', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.25em', display: 'block', marginBottom: '16px' }}>
            Quem Somos
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 600, color: 'var(--color-brand-navy)', marginBottom: '24px' }}>
            {sectionTitle}
          </h2>
          <p style={{ color: 'rgba(21,33,56,0.6)', fontFamily: 'var(--font-body)', fontSize: '18px', maxWidth: '40rem', margin: '0 auto', lineHeight: 1.6 }}>
            {sectionDesc}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px', maxWidth: '52rem', margin: '0 auto' }}>
          {partners.map((partner) => (
            <div key={partner.name} className="card-hover" style={{ background: 'var(--color-brand-cream)', borderRadius: '8px', padding: '32px', border: '1px solid rgba(196,169,106,0.1)', textAlign: 'center' }}>
              {partner.photoUrl ? (
                <img src={partner.photoUrl} alt={partner.name} style={{ width: '96px', height: '96px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 24px', display: 'block' }} />
              ) : (
                <div style={{ width: '96px', height: '96px', borderRadius: '50%', background: 'linear-gradient(135deg, #152138, #1c2d4a)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <span className="text-silver-gradient" style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 'bold' }}>
                    {partner.initials}
                  </span>
                </div>
              )}

              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 600, color: 'var(--color-brand-navy)', marginBottom: '4px' }}>
                {partner.name}
              </h3>
              <p style={{ color: 'var(--color-brand-gold-dark)', fontSize: '14px', fontFamily: 'var(--font-body)', fontWeight: 500, marginBottom: partner.oab ? '4px' : '16px' }}>
                {partner.role}
              </p>
              {partner.oab && (
                <p style={{ color: 'rgba(21,33,56,0.4)', fontSize: '12px', marginBottom: '16px' }}>{partner.oab}</p>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', marginBottom: partner.bio ? '20px' : '0' }}>
                {partner.areas.map((area: string) => (
                  <span key={area} style={{ fontSize: '10px', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(21,33,56,0.5)', background: 'white', padding: '4px 12px', borderRadius: '2px', border: '1px solid rgba(196,169,106,0.1)' }}>
                    {area}
                  </span>
                ))}
              </div>

              {partner.bio && (
                <p style={{ color: 'rgba(21,33,56,0.6)', fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.7 }}>
                  {partner.bio}
                </p>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link href="/sobre" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-brand-gold-dark)', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', textDecoration: 'none' }}>
            Conheça nossa história <ArrowRight style={{ width: '16px', height: '16px' }} />
          </Link>
        </div>
      </div>
    </section>
  )
}
