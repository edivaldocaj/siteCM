'use client'

import { Award, Heart, MapPin, Phone, Scale, Shield, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const valueIconMap: Record<string, LucideIcon> = {
  scale: Scale,
  users: Users,
  award: Award,
  shield: Shield,
  heart: Heart,
}

export function AboutPageClient({ homepage, siteConfig }: { homepage: any; siteConfig: any }) {
  const aboutTitle = siteConfig?.aboutTitle || 'Sobre o Escritorio'
  const aboutSubtitle = siteConfig?.aboutSubtitle || 'Advocacia com estrategia e solidez.'
  const aboutHistory = siteConfig?.aboutHistory || ''

  const timeline = siteConfig?.aboutTimeline?.length
    ? siteConfig.aboutTimeline.map((t: any) => ({
        year: t.year,
        title: t.title,
        description: t.description,
      }))
    : []

  const values = siteConfig?.aboutValues?.length
    ? siteConfig.aboutValues.map((v: any) => ({
        icon: v.icon || 'scale',
        title: v.title,
        description: v.description,
      }))
    : []

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
        areas: (p.areas || p.role || '').split(/[,|]/).map((a: string) => a.trim()).filter(Boolean),
        photoUrl: p.photo?.url || null,
      }))
    : []

  const contactAddress = siteConfig?.contactAddress || ''

  return (
    <>
      <section style={{ background: 'linear-gradient(135deg, var(--color-ca-navy-950) 0%, var(--color-ca-navy-800) 50%, var(--color-ca-navy-900) 100%)', padding: '140px 24px 80px' }}>
        <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
          <span style={{ color: 'var(--color-brand-gold-dark)', fontSize: '12px', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.25em', display: 'block', marginBottom: '16px' }}>
            Quem somos
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 600, color: 'var(--color-brand-champagne)', lineHeight: 1.1, marginBottom: '24px' }}>
            {aboutTitle}
          </h1>
          <p style={{ color: 'color-mix(in srgb, var(--color-ca-steel-400) 70%, transparent)', fontFamily: 'var(--font-body)', fontSize: '18px', lineHeight: 1.6, maxWidth: '600px' }}>
            {aboutSubtitle}
          </p>
        </div>
      </section>

      {(aboutHistory || timeline.length > 0) && (
        <section style={{ padding: '80px 24px', backgroundColor: 'var(--color-brand-cream)' }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
            {aboutHistory && (
              <>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: 'var(--color-brand-navy)', marginBottom: '24px' }}>
                  Nossa historia
                </h2>
                <p style={{ color: 'color-mix(in srgb, var(--color-ca-navy-950) 70%, transparent)', fontFamily: 'var(--font-body)', fontSize: '16px', lineHeight: 1.8, maxWidth: '900px', marginBottom: timeline.length > 0 ? '48px' : 0, whiteSpace: 'pre-line' }}>
                  {aboutHistory}
                </p>
              </>
            )}

            {timeline.length > 0 && (
              <div style={{ position: 'relative', paddingLeft: '32px', borderLeft: '2px solid color-mix(in srgb, var(--color-ca-steel-500) 20%, transparent)' }}>
                {timeline.map((item: any, i: number) => (
                  <div key={`${item.year}-${item.title}`} style={{ marginBottom: i < timeline.length - 1 ? '40px' : '0', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-41px', top: '4px', width: '18px', height: '18px', borderRadius: '50%', background: 'var(--color-brand-gold-dark)', border: '3px solid var(--color-brand-cream)' }} />
                    <span style={{ color: 'var(--color-brand-gold-dark)', fontSize: '14px', fontFamily: 'var(--font-body)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                      {item.year}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--color-brand-navy)', fontWeight: 600, marginBottom: '8px' }}>
                      {item.title}
                    </h3>
                    <p style={{ color: 'color-mix(in srgb, var(--color-ca-navy-950) 60%, transparent)', fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.6 }}>
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {values.length > 0 && (
        <section style={{ padding: '80px 24px', backgroundColor: 'white' }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: 'var(--color-brand-navy)', textAlign: 'center', marginBottom: '48px' }}>
              Nossos valores
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(values.length, 3)}, 1fr)`, gap: '24px' }} className="values-grid">
              {values.map((v: any) => {
                const IconComp = valueIconMap[v.icon] || Scale
                return (
                  <div key={v.title} style={{ backgroundColor: 'var(--color-brand-cream)', borderRadius: '8px', padding: '40px 32px', textAlign: 'center' }}>
                    <IconComp style={{ width: '40px', height: '40px', color: 'var(--color-brand-gold-dark)', margin: '0 auto 20px' }} strokeWidth={1.5} />
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--color-brand-navy)', fontWeight: 600, marginBottom: '12px' }}>
                      {v.title}
                    </h3>
                    <p style={{ color: 'color-mix(in srgb, var(--color-ca-navy-950) 60%, transparent)', fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.6 }}>
                      {v.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {partners.length > 0 && (
        <section style={{ padding: '80px 24px', backgroundColor: 'var(--color-brand-cream)' }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', color: 'var(--color-brand-navy)', textAlign: 'center', marginBottom: '48px' }}>
              Quem conduz o seu caso
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px', maxWidth: '900px', margin: '0 auto' }} className="partners-grid">
              {partners.map((p: any) => (
                <div key={p.name} style={{ backgroundColor: 'white', borderRadius: '8px', padding: '40px 32px', border: '1px solid color-mix(in srgb, var(--color-ca-steel-500) 12%, transparent)' }}>
                  {p.photoUrl ? (
                    <img src={p.photoUrl} alt={p.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '20px' }} />
                  ) : (
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-ca-navy-950), var(--color-ca-navy-800))', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                      <span className="text-silver-gradient" style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 600 }}>{p.initials}</span>
                    </div>
                  )}
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: 600, color: 'var(--color-brand-navy)', marginBottom: '4px' }}>
                    {p.name}
                  </h3>
                  <p style={{ color: 'var(--color-brand-gold-dark)', fontSize: '14px', fontFamily: 'var(--font-body)', fontWeight: 500, marginBottom: '16px' }}>
                    {p.role}
                  </p>
                  {p.oab && <p style={{ color: 'color-mix(in srgb, var(--color-ca-navy-950) 40%, transparent)', fontSize: '12px', fontFamily: 'var(--font-body)', marginBottom: '12px' }}>{p.oab}</p>}
                  {p.bio && <p style={{ color: 'color-mix(in srgb, var(--color-ca-navy-950) 60%, transparent)', fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.7, marginBottom: '20px' }}>{p.bio}</p>}
                  {p.areas.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {p.areas.map((area: string) => (
                        <span key={area} style={{ fontSize: '10px', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'color-mix(in srgb, var(--color-ca-navy-950) 50%, transparent)', background: 'var(--color-brand-cream)', padding: '4px 12px', borderRadius: '2px', border: '1px solid color-mix(in srgb, var(--color-ca-steel-500) 10%, transparent)' }}>
                          {area}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {contactAddress && (
        <section style={{ padding: '64px 24px', background: 'linear-gradient(135deg, var(--color-ca-navy-950) 0%, var(--color-ca-navy-800) 50%, var(--color-ca-navy-900) 100%)', textAlign: 'center' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <MapPin style={{ width: '32px', height: '32px', color: 'var(--color-brand-gold-dark)', margin: '0 auto 16px' }} />
            <p style={{ color: 'color-mix(in srgb, var(--color-ca-steel-400) 70%, transparent)', fontFamily: 'var(--font-body)', fontSize: '16px', marginBottom: '24px', whiteSpace: 'pre-line' }}>
              {contactAddress}
            </p>
            <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985'}`} target="_blank" rel="noopener noreferrer" className="btn-primary">
              <Phone style={{ width: '16px', height: '16px' }} />
              Fale com um advogado
            </a>
          </div>
        </section>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .values-grid { grid-template-columns: 1fr !important; }
          .partners-grid { grid-template-columns: 1fr !important; }
        }
      `}} />
    </>
  )
}