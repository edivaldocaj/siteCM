import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ArrowLeft, AlertCircle, Scale, CheckCircle, MessageCircle } from 'lucide-react'

// IMPORTANTE: O renderizador oficial do Payload para campos Lexical (RichText)
import { RichText } from '@payloadcms/richtext-lexical/react'

export const revalidate = 60 // Atualiza a página a cada 60 segundos

export default async function CampaignPage({ params }: { params: { slug: string } }) {
  const payload = await getPayload({ config: configPromise })
  
  // CORREÇÃO: Usando (payload as any) para evitar o erro de tipagem no Next.js build
  const { docs } = await (payload as any).find({
    collection: 'campaigns',
    where: { slug: { equals: params.slug } },
  })

  const campaign = docs[0]
  if (!campaign) return notFound()

  // Monta a URL do WhatsApp dinâmica (se configurada) ou a padrão
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584999999999'
  const message = campaign.whatsappMessage || `Olá! Gostaria de falar sobre: ${campaign.title}`
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

  return (
    <div style={{ backgroundColor: '#faf8f5', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Hero Header */}
      <section style={{ background: 'linear-gradient(135deg, #152138 0%, #1c2d4a 50%, #0e1628 100%)', paddingTop: '120px', paddingBottom: '80px', paddingLeft: '16px', paddingRight: '16px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Link href="/campanhas" style={{ color: '#c4a96a', fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', width: 'fit-content' }}>
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            Voltar para Campanhas
          </Link>

          <span style={{ color: '#c4a96a', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(196,169,106,0.1)', padding: '4px 12px', borderRadius: '4px', display: 'inline-block', marginBottom: '16px' }}>
            {campaign.category}
          </span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#f1eae2', lineHeight: 1.1, marginBottom: '24px' }}>
            {campaign.title}
          </h1>
          <p style={{ color: 'rgba(184,191,200,0.8)', fontSize: '18px', lineHeight: 1.6, maxWidth: '600px' }}>
            {campaign.subtitle}
          </p>
        </div>
      </section>

      {/* Conteúdo da Campanha gerenciado pelo CMS */}
      <section style={{ maxWidth: '800px', margin: '-40px auto 0', position: 'relative', zIndex: 10, padding: '0 16px' }}>
        
        {/* Bloco: Descrição do Problema */}
        {campaign.problemDescription && (
          <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '24px', border: '1px solid rgba(21,33,56,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(122,27,27,0.1)', padding: '12px', borderRadius: '8px' }}>
                <AlertCircle style={{ color: '#dc2626', width: '24px', height: '24px' }} />
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#152138', margin: 0 }}>O Problema</h2>
            </div>
            
            {/* RENDERIZADOR OFICIAL DO CMS */}
            <div style={{ color: 'rgba(21,33,56,0.7)', fontSize: '16px', lineHeight: 1.8 }} className="cms-rich-text">
              <RichText data={campaign.problemDescription} />
            </div>
          </div>
        )}

        {/* Bloco: Explicação dos Direitos */}
        {campaign.rightsExplanation && (
          <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '24px', border: '1px solid rgba(21,33,56,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(196,169,106,0.1)', padding: '12px', borderRadius: '8px' }}>
                <Scale style={{ color: '#c4a96a', width: '24px', height: '24px' }} />
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#152138', margin: 0 }}>Seus Direitos</h2>
            </div>
            
            {/* RENDERIZADOR OFICIAL DO CMS */}
            <div style={{ color: 'rgba(21,33,56,0.7)', fontSize: '16px', lineHeight: 1.8 }} className="cms-rich-text">
              <RichText data={campaign.rightsExplanation} />
            </div>
          </div>
        )}

        {/* Bloco: Benefícios da Atuação (Opcional no CMS) */}
        {campaign.benefits && (
          <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', marginBottom: '32px', border: '1px solid rgba(21,33,56,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(37,211,102,0.1)', padding: '12px', borderRadius: '8px' }}>
                <CheckCircle style={{ color: '#25D366', width: '24px', height: '24px' }} />
              </div>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#152138', margin: 0 }}>Como Podemos Ajudar</h2>
            </div>
            
            {/* RENDERIZADOR OFICIAL DO CMS */}
            <div style={{ color: 'rgba(21,33,56,0.7)', fontSize: '16px', lineHeight: 1.8 }} className="cms-rich-text">
              <RichText data={campaign.benefits} />
            </div>
          </div>
        )}

        {/* Chamada para Ação (CTA) */}
        <div style={{ background: '#152138', padding: '40px', borderRadius: '12px', textAlign: 'center' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#f1eae2', marginBottom: '16px' }}>
            {campaign.urgencyText || 'Fale com um especialista agora mesmo.'}
          </h3>
          <p style={{ color: 'rgba(184,191,200,0.8)', fontSize: '15px', marginBottom: '32px' }}>
            Nossa equipe fará uma análise inicial do seu caso de forma rápida e segura.
          </p>
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '12px', 
              background: '#25D366', color: '#ffffff', 
              padding: '16px 32px', borderRadius: '8px', 
              textDecoration: 'none', fontWeight: 'bold', fontSize: '16px',
              transition: 'transform 0.2s',
            }}
          >
            <MessageCircle style={{ width: '20px', height: '20px' }} />
            Falar pelo WhatsApp
          </a>
        </div>

      </section>
    </div>
  )
}