import Link from 'next/link'
import { Landmark, Scale, Laptop, Building, Briefcase, ShieldAlert, ArrowRight } from 'lucide-react'

const iconMap: Record<string, any> = {
  landmark: Landmark,
  scale: Scale,
  laptop: Laptop,
  building: Building,
  briefcase: Briefcase,
  shield: ShieldAlert,
}

export function PracticeAreasGrid({ cmsAreas = [] }: { cmsAreas?: any[] }) {
  const areas = cmsAreas.length > 0 ? cmsAreas : [
    { title: 'Direito Tributário', slug: 'direito-tributario', short_description: 'Recuperação fiscal e defesa em execuções fiscais.', icon: 'landmark' },
    { title: 'Direito Civil', slug: 'direito-civil', short_description: 'Contratos, família, sucessões e responsabilidade civil.', icon: 'scale' },
    { title: 'Direito Digital e LGPD', slug: 'direito-digital', short_description: 'Adequação de empresas, marco civil e crimes cibernéticos.', icon: 'laptop' },
    { title: 'Direito Imobiliário', slug: 'direito-imobiliario', short_description: 'Regularização de imóveis, usucapião e distratos.', icon: 'building' },
    { title: 'Licitações', slug: 'licitacoes', short_description: 'Mandados de segurança, recursos administrativos e defesa prévia.', icon: 'briefcase' },
    { title: 'Direito Penal', slug: 'direito-penal', short_description: 'Defesa criminal estratégica e acompanhamento em delegacias.', icon: 'shield' },
  ]

  return (
    <section style={{ padding: '0 24px 80px', backgroundColor: 'transparent' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
          {areas.map((area, index) => {
            const IconComponent = iconMap[area.icon] || Scale
            
            return (
              <Link 
                key={index} 
                href={`/atuacao/${area.slug}`} 
                style={{ 
                  display: 'flex', flexDirection: 'column', 
                  background: '#ffffff', padding: '40px', borderRadius: '4px', 
                  textDecoration: 'none', borderTop: '4px solid transparent',
                  borderLeft: '1px solid #ede1c3',
                  boxShadow: '0 10px 40px rgba(21,33,56,0.05)',
                  transition: 'all 0.3s ease',
                }}
                className="practice-card-hover"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                  <div style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    width: '56px', height: '56px', backgroundColor: '#152138', 
                    borderRadius: '2px', flexShrink: 0 
                  }}>
                    <IconComponent style={{ width: '24px', height: '24px', color: '#ede1c3' }} strokeWidth={1.5} />
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#152138', margin: 0, lineHeight: 1.3 }}>
                    {area.title}
                  </h3>
                </div>
                
                <p style={{ color: '#4a5568', fontFamily: "'Source Sans 3', sans-serif", fontSize: '16px', lineHeight: 1.6, margin: '0 0 32px 0', flexGrow: 1, fontWeight: 300 }}>
                  {area.short_description || area.shortDescription}
                </p>
                
                <span style={{ color: '#152138', fontSize: '13px', fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Saber mais <ArrowRight style={{ width: '14px', height: '14px', color: '#ede1c3' }} />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
      
      {/* Pequeno CSS injetado para o efeito de Hover elegante */}
      <style dangerouslySetInnerHTML={{__html: `
        .practice-card-hover:hover {
          transform: translateY(-5px);
          border-top: 4px solid #152138 !important;
          box-shadow: 0 20px 40px rgba(21,33,56,0.1) !important;
        }
      `}} />
    </section>
  )
}