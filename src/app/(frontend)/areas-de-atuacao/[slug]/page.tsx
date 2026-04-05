import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Phone, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

// Fallback estático caso CMS não retorne dados
const fallbackData: Record<string, { title: string; headline: string; description: string; cases: string[]; faq: { q: string; a: string }[] }> = {
  'direito-digital-lgpd': {
    title: 'Direito Digital e LGPD',
    headline: 'Proteção digital para sua empresa e seus dados',
    description: 'Assessoria completa em proteção de dados, adequação à LGPD, crimes cibernéticos e consultoria para empresas de tecnologia.',
    cases: ['Adequação à LGPD', 'Vazamento de dados', 'Crimes cibernéticos', 'Contratos digitais', 'Política de privacidade'],
    faq: [{ q: 'Minha empresa precisa se adequar à LGPD?', a: 'Sim. Toda empresa que coleta dados pessoais precisa estar em conformidade com a LGPD, independente do porte.' }],
  },
  'direito-civil': {
    title: 'Direito Civil', headline: 'Defesa dos seus direitos nas relações civis',
    description: 'Contratos, responsabilidade civil, família, sucessões e ações indenizatórias.',
    cases: ['Ações de indenização', 'Contratos', 'Direito de família', 'Inventário', 'Responsabilidade civil'],
    faq: [{ q: 'Quanto tempo demora uma ação de indenização?', a: 'Em média, 1 a 3 anos em primeira instância.' }],
  },
  'direito-consumidor': {
    title: 'Direito do Consumidor', headline: 'Seus direitos como consumidor protegidos',
    description: 'Fraudes bancárias, negativação indevida, revisão de juros e planos de saúde.',
    cases: ['Fraudes bancárias', 'Negativação indevida', 'Revisão de juros', 'Planos de saúde'],
    faq: [{ q: 'Fui negativado indevidamente. Tenho direito a indenização?', a: 'Sim. A negativação indevida gera dano moral presumido.' }],
  },
  'direito-imobiliario': {
    title: 'Direito Imobiliário', headline: 'Segurança jurídica nas transações imobiliárias',
    description: 'Compra e venda, usucapião, regularização fundiária e disputas de propriedade.',
    cases: ['Compra e venda', 'Usucapião', 'Regularização fundiária', 'Contratos de locação'],
    faq: [{ q: 'O que é usucapião?', a: 'Forma de adquirir propriedade pela posse prolongada e ininterrupta, atendidos os requisitos legais.' }],
  },
  'direito-tributario': {
    title: 'Direito Tributário', headline: 'Planejamento fiscal e defesa tributária',
    description: 'Planejamento fiscal, execuções fiscais, recuperação de tributos e consultoria.',
    cases: ['Planejamento fiscal', 'Execução fiscal', 'Recuperação de tributos', 'Consultoria tributária'],
    faq: [{ q: 'É possível reduzir a carga tributária?', a: 'Sim, através de planejamento tributário legal e identificação do melhor regime.' }],
  },
  'licitacoes-contratos': {
    title: 'Licitações e Contratos', headline: 'Assessoria completa em licitações públicas',
    description: 'Licitações, impugnações, contratos administrativos e defesa no TCE/TCU.',
    cases: ['Assessoria em licitações', 'Impugnação de edital', 'Contratos administrativos', 'Defesa no TCE/TCU'],
    faq: [{ q: 'Posso impugnar um edital de licitação?', a: 'Sim. Qualquer pessoa pode impugnar caso identifique irregularidades.' }],
  },
  'direito-penal': {
    title: 'Direito Penal', headline: 'Defesa criminal com atendimento 24 horas',
    description: 'Defesa criminal em todas as fases, habeas corpus, audiência de custódia. Atendimento imediato.',
    cases: ['Defesa em inquérito', 'Habeas corpus', 'Audiência de custódia', 'Prisão preventiva', 'Crimes de trânsito'],
    faq: [
      { q: 'Fui preso em flagrante. O que fazer?', a: 'Não preste declarações sem advogado. Entre em contato imediatamente — atendemos 24h.' },
      { q: 'O que é habeas corpus?', a: 'Instrumento que protege o direito de ir e vir quando há prisão ilegal ou abusiva.' },
    ],
  },
}

export default async function AreaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // Tentar buscar do CMS primeiro
  let area: any = null
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await (payload as any).find({
      collection: 'practice-areas',
      where: { slug: { equals: slug } },
    })
    if (docs?.[0]) area = docs[0]
  } catch {}

  // Se não achou no CMS, usar fallback
  const fallback = fallbackData[slug]
  if (!area && !fallback) notFound()

  const title = area?.title || fallback?.title || ''
  const headline = area?.heroHeadline || fallback?.headline || ''
  const description = area?.shortDescription || fallback?.description || ''
  const cases = area?.caseTypes?.map((c: any) => c.name) || fallback?.cases || []
  const faq = area?.faq || fallback?.faq?.map((f: any) => ({ question: f.q, answer: f.a })) || []
  const isPenal = slug === 'direito-penal' || area?.is24h === true

  return (
    <>
      <section style={{ background: isPenal ? 'linear-gradient(135deg, #0e1628, #152138)' : 'linear-gradient(135deg, #152138 0%, #1c2d4a 50%, #0e1628 100%)', paddingTop: '128px', paddingBottom: '80px', position: 'relative' }}>
        {isPenal && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #7a1b1b, #c4a96a, #7a1b1b)' }} />}
        <div className="container-wide mx-auto" style={{ padding: '0 24px' }}>
          <Link href="/areas-de-atuacao" style={{ color: 'rgba(184,191,200,0.5)', fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
            <ArrowLeft style={{ width: '16px', height: '16px' }} /> Áreas de Atuação
          </Link>
          {isPenal && (
            <span style={{ marginLeft: '16px', background: '#7a1b1b', color: 'white', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '4px 12px', borderRadius: '2px' }}>
              Atendimento 24h
            </span>
          )}
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 600, color: 'var(--color-brand-champagne)', lineHeight: 1.1, marginBottom: '16px' }}>
            {title}
          </h1>
          <p style={{ color: 'rgba(184,191,200,0.7)', fontFamily: 'var(--font-body)', fontSize: '20px', maxWidth: '40rem' }}>
            {headline}
          </p>
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
        <div className="container-narrow mx-auto">
          <p style={{ color: 'rgba(21,33,56,0.7)', fontFamily: 'var(--font-body)', fontSize: '18px', lineHeight: 1.7, marginBottom: '48px' }}>
            {description}
          </p>

          {cases.length > 0 && (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 600, color: 'var(--color-brand-navy)', marginBottom: '24px' }}>Tipos de Casos</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '48px' }} className="cases-grid">
                {cases.map((c: string) => (
                  <div key={c} style={{ background: 'white', borderRadius: '8px', padding: '16px', border: '1px solid rgba(196,169,106,0.1)', color: 'rgba(21,33,56,0.7)', fontFamily: 'var(--font-body)', fontSize: '14px' }}>{c}</div>
                ))}
              </div>
            </>
          )}

          {faq.length > 0 && (
            <>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 600, color: 'var(--color-brand-navy)', marginBottom: '24px' }}>Perguntas Frequentes</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '48px' }}>
                {faq.map((item: any) => (
                  <div key={item.question || item.q} style={{ background: 'white', borderRadius: '8px', padding: '24px', border: '1px solid rgba(196,169,106,0.1)' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, color: 'var(--color-brand-navy)', marginBottom: '12px' }}>{item.question || item.q}</h3>
                    <p style={{ color: 'rgba(21,33,56,0.6)', fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.6 }}>{item.answer || item.a}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          <div style={{ background: isPenal ? 'linear-gradient(135deg, #0e1628, #152138)' : 'linear-gradient(135deg, #152138, #1c2d4a)', borderRadius: '8px', padding: '48px 32px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', fontWeight: 600, color: 'var(--color-brand-champagne)', marginBottom: '16px' }}>
              {isPenal ? 'Precisa de ajuda urgente?' : 'Tem um caso nessa área?'}
            </h2>
            <p style={{ color: 'rgba(184,191,200,0.6)', fontFamily: 'var(--font-body)', marginBottom: '24px' }}>Fale com um advogado especialista agora mesmo.</p>
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985'}?text=${encodeURIComponent(`Olá! Preciso de orientação sobre ${title}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              <Phone style={{ width: '20px', height: '20px' }} />
              Falar com Advogado
            </a>
          </div>
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 640px) { .cases-grid { grid-template-columns: 1fr !important; } }
      `}} />
    </>
  )
}
