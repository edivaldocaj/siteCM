import Link from 'next/link'
import { Landmark, Scale, Laptop, Building, Briefcase, ShieldAlert, ArrowRight } from 'lucide-react'

const iconMap: Record<string, any> = {
  landmark: Landmark, scale: Scale, laptop: Laptop,
  building: Building, briefcase: Briefcase, shield: ShieldAlert,
}

interface PracticeAreasGridProps {
  cmsAreas?: any[]
  showTitle?: boolean
}

export function PracticeAreasGrid({ cmsAreas = [], showTitle = true }: PracticeAreasGridProps) {
  const areas = cmsAreas.length > 0 ? cmsAreas : [
    { title: 'Direito Tributário', slug: 'direito-tributario', short_description: 'Recuperação fiscal e defesa em execuções fiscais.', icon: 'landmark' },
    { title: 'Direito Civil', slug: 'direito-civil', short_description: 'Contratos, família, sucessões e responsabilidade civil.', icon: 'scale' },
    { title: 'Direito Digital e LGPD', slug: 'direito-digital-lgpd', short_description: 'Adequação de empresas, marco civil e crimes cibernéticos.', icon: 'laptop' },
    { title: 'Direito Imobiliário', slug: 'direito-imobiliario', short_description: 'Regularização de imóveis, usucapião e distratos.', icon: 'building' },
    { title: 'Licitações e Contratos', slug: 'licitacoes-contratos', short_description: 'Mandados de segurança, recursos administrativos e defesa prévia.', icon: 'briefcase' },
    { title: 'Direito Penal', slug: 'direito-penal', short_description: 'Defesa criminal estratégica e acompanhamento em delegacias.', icon: 'shield' },
  ]

  return (
    <section style={{ padding: showTitle ? '80px 24px' : '0 24px 80px', backgroundColor: '#faf8f5' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>

        {showTitle && (
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <span style={{ color: '#c4a96a', fontSize: '12px', fontFamily: "'Source Sans 3', sans-serif", textTransform: 'uppercase', letterSpacing: '0.25em', display: 'block', marginBottom: '16px' }}>
              Especialidades
            </span>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', color: '#152138', margin: '0 0 16px 0', lineHeight: 1.2 }}>
              Nossas Áreas de Atuação
            </h2>
            <p style={{ color: 'rgba(21,33,56,0.55)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '17px', maxWidth: '540px', margin: '0 auto', lineHeight: 1.6 }}>
              Especialistas nas áreas mais complexas do Direito, oferecendo soluções jurídicas inovadoras e seguras.
            </p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '28px' }}>
          {areas.map((area, index) => {
            const IconComponent = iconMap[area.icon] || Scale
            return (
              <Link key={index} href={`/areas-de-atuacao/${area.slug}`}
                style={{ display: 'flex', flexDirection: 'column', background: '#ffffff', padding: '40px', borderRadius: '4px', textDecoration: 'none', borderTop: '3px solid transparent', borderLeft: '1px solid rgba(237,225,195,0.5)', borderRight: '1px solid rgba(237,225,195,0.5)', borderBottom: '1px solid rgba(237,225,195,0.5)', boxShadow: '0 4px 24px rgba(21,33,56,0.06)', transition: 'all 0.3s ease' }}
                className="practice-card-hover">
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '52px', height: '52px', backgroundColor: '#152138', borderRadius: '2px', flexShrink: 0 }}>
                    <IconComponent style={{ width: '22px', height: '22px', color: '#c4a96a' }} strokeWidth={1.5} />
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#152138', margin: 0, lineHeight: 1.3 }}>{area.title}</h3>
                </div>
                <p style={{ color: 'rgba(21,33,56,0.6)', fontFamily: "'Source Sans 3', sans-serif", fontSize: '15px', lineHeight: 1.65, margin: '0 0 28px 0', flexGrow: 1 }}>
                  {area.short_description || area.shortDescription}
                </p>
                <span style={{ color: '#c4a96a', fontSize: '12px', fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Saber mais <ArrowRight style={{ width: '13px', height: '13px', color: '#c4a96a' }} />
                </span>
              </Link>
            )
          })}
        </div>

        {showTitle && (
          <div style={{ textAlign: 'center', marginTop: '48px' }}>
            <Link href="/areas-de-atuacao" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#152138', fontSize: '13px', fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.08em', border: '1px solid rgba(21,33,56,0.2)', padding: '12px 28px', borderRadius: '2px', transition: 'all 0.3s' }}
              className="see-all-link">
              Ver todas as áreas de atuação <ArrowRight style={{ width: '14px', height: '14px' }} />
            </Link>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .practice-card-hover:hover { transform: translateY(-4px); border-top: 3px solid #152138 !important; box-shadow: 0 16px 40px rgba(21,33,56,0.1) !important; }
        .see-all-link:hover { background: #152138 !important; color: #f1eae2 !important; border-color: #152138 !important; }
      `}} />
    </section>
  )
}
