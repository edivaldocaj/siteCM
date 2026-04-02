import Link from 'next/link'

export function HeroSection({ cmsData }: { cmsData?: any }) {
  const title = cmsData?.heroTitle || 'Defesa Especializada e Estratégica'
  const subtitle = cmsData?.heroSubtitle || 'Atuação ágil e combativa na proteção do seu patrimônio, liberdade e direitos.'
  const buttonText = cmsData?.heroButtonText || 'Fale com um Advogado'

  return (
    <section style={{ background: 'linear-gradient(135deg, #152138 0%, #1c2d4a 50%, #0e1628 100%)', minHeight: '90vh', display: 'flex', alignItems: 'center', padding: '120px 16px 80px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', opacity: 0.05, pointerEvents: 'none' }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '400px', fontWeight: 'bold', color: '#c4a96a' }}>§</span>
      </div>
      <div style={{ maxWidth: '80rem', margin: '0 auto', width: '100%', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '800px' }}>
          <span style={{ color: '#c4a96a', fontSize: '12px', fontFamily: "'Source Sans 3', sans-serif", textTransform: 'uppercase', letterSpacing: '0.25em', display: 'block', marginBottom: '24px' }}>
            Cavalcante & Melo Sociedade de Advogados
          </span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 600, color: '#f1eae2', lineHeight: 1.1, marginBottom: '32px' }}>
            {title}
          </h1>
          <p style={{ color: 'rgba(184,191,200,0.8)', fontFamily: "'Source Sans 3', sans-serif", fontSize: 'clamp(16px, 2vw, 20px)', lineHeight: 1.6, marginBottom: '48px', maxWidth: '600px' }}>
            {subtitle}
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/contato" style={{ background: '#c4a96a', color: '#152138', padding: '16px 32px', borderRadius: '4px', textDecoration: 'none', fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: '15px', transition: 'background-color 0.3s' }}>
              {buttonText}
            </Link>
            <Link href="/areas-de-atuacao" style={{ background: 'rgba(255,255,255,0.05)', color: '#f1eae2', border: '1px solid rgba(255,255,255,0.15)', padding: '16px 32px', borderRadius: '4px', textDecoration: 'none', fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, fontSize: '15px', transition: 'all 0.3s' }}>
              Nossas Áreas de Atuação
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
