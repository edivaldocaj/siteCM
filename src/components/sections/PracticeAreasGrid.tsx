import Link from 'next/link'
import { Landmark, Scale, Laptop, Building, Briefcase, ShieldAlert } from 'lucide-react'

// Mapeamento de ícones
const iconMap: Record<string, any> = {
  landmark: Landmark,
  scale: Scale,
  laptop: Laptop,
  building: Building,
  briefcase: Briefcase,
  shield: ShieldAlert,
}

export function PracticeAreasGrid({ cmsAreas = [] }: { cmsAreas?: any[] }) {
  // Fallback para dados estáticos caso não sejam passados pelo CMS
  const areas = cmsAreas.length > 0 ? cmsAreas : [
    { title: 'Direito Tributário', slug: 'direito-tributario', short_description: 'Recuperação fiscal e defesa em execuções fiscais.', icon: 'landmark' },
    { title: 'Direito Civil', slug: 'direito-civil', short_description: 'Contratos, família, sucessões e responsabilidade civil.', icon: 'scale' },
    { title: 'Direito Digital e LGPD', slug: 'direito-digital', short_description: 'Adequação de empresas, marco civil e crimes cibernéticos.', icon: 'laptop' },
    { title: 'Direito Imobiliário', slug: 'direito-imobiliario', short_description: 'Regularização de imóveis, usucapião e distratos.', icon: 'building' },
    { title: 'Licitações', slug: 'licitacoes', short_description: 'Mandados de segurança, recursos administrativos e defesa prévia.', icon: 'briefcase' },
    { title: 'Direito Penal', slug: 'direito-penal', short_description: 'Defesa criminal estratégica e acompanhamento em delegacias.', icon: 'shield' },
  ]

  return (
    <section style={{ padding: '80px 16px', backgroundColor: '#ffffff' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        
        {/* CABEÇALHO DA SESSÃO - Correção de Alinhamento (Centralizado) */}
        <div style={{ textAlign: 'center', marginBottom: '56px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ color: '#c4a96a', fontSize: '12px', fontFamily: "'Source Sans 3', sans-serif", textTransform: 'uppercase', letterSpacing: '0.25em', display: 'block', marginBottom: '16px' }}>
            Nossas Especialidades
          </span>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 2.5rem)', color: '#152138', margin: 0, lineHeight: 1.2, maxWidth: '600px' }}>
            Áreas de Atuação
          </h2>
        </div>
        
        {/* GRID DE CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {areas.map((area, index) => {
            const IconComponent = iconMap[area.icon] || Scale
            
            return (
              <Link 
                key={index} 
                href={`/atuacao/${area.slug}`} 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  background: '#faf8f5', 
                  padding: '32px', 
                  borderRadius: '8px', 
                  textDecoration: 'none', 
                  border: '1px solid rgba(21,33,56,0.05)',
                  transition: 'transform 0.2s, boxShadow 0.2s'
                }}
              >
                {/* CONTAINER DO ÍCONE E TÍTULO - Correção do Ícone Torto */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  
                  {/* flexShrink: 0 impede que o ícone amasse quando o título é muito grande */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    width: '48px', 
                    height: '48px', 
                    backgroundColor: 'rgba(196,169,106,0.1)', 
                    borderRadius: '8px',
                    flexShrink: 0 
                  }}>
                    <IconComponent style={{ width: '24px', height: '24px', color: '#c4a96a' }} />
                  </div>
                  
                  <h3 style={{ 
                    fontFamily: "'Playfair Display', serif", 
                    fontSize: '20px', 
                    color: '#152138', 
                    margin: 0, 
                    lineHeight: 1.3 
                  }}>
                    {area.title}
                  </h3>
                </div>
                
                {/* DESCRIÇÃO E LINK */}
                <p style={{ 
                  color: 'rgba(21,33,56,0.6)', 
                  fontFamily: "'Source Sans 3', sans-serif", 
                  fontSize: '15px', 
                  lineHeight: 1.6, 
                  margin: '0 0 24px 0',
                  flexGrow: 1
                }}>
                  {area.short_description || area.shortDescription}
                </p>
                <span style={{ 
                  color: '#c4a96a', 
                  fontSize: '13px', 
                  fontFamily: "'Source Sans 3', sans-serif", 
                  fontWeight: 600,
                  display: 'inline-block'
                }}>
                  Saber mais &rarr;
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}