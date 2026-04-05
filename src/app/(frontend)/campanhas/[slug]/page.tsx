import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ArrowLeft, AlertCircle, Scale, CheckCircle, MessageCircle } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'


export const dynamic = 'force-dynamic'

export default async function CampaignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  
  const { docs } = await (payload as any).find({
    collection: 'campaigns',
    where: { slug: { equals: slug } },
  })

  const campaign = docs[0]
  if (!campaign) return notFound()

  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584999999999'
  const message = campaign.whatsappMessage || `Olá! Gostaria de falar sobre: ${campaign.title}`
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

  return (
    <div style={{ backgroundColor: '#f1eae2', minHeight: '100vh', paddingBottom: '100px', fontFamily: "'Source Sans 3', sans-serif" }}>
      
      {/* Hero Header Premium */}
      <section style={{ 
        backgroundColor: '#152138', 
        paddingTop: '140px', 
        paddingBottom: '120px', 
        paddingLeft: '24px', 
        paddingRight: '24px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Marca d'água sutil (Monograma CM) */}
        <div style={{ position: 'absolute', top: '-20%', right: '-5%', opacity: 0.03, pointerEvents: 'none' }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '600px', fontWeight: 'bold', color: '#ede1c3' }}>CM</span>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <Link href="/campanhas" style={{ color: '#ede1c3', fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', width: 'fit-content', transition: 'opacity 0.2s' }}>
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            Voltar para Campanhas
          </Link>

          <span style={{ 
            color: '#152138', 
            backgroundColor: '#ede1c3',
            fontSize: '11px', 
            textTransform: 'uppercase', 
            letterSpacing: '0.15em', 
            padding: '6px 16px', 
            borderRadius: '2px', 
            display: 'inline-block', 
            marginBottom: '24px',
            fontWeight: 600
          }}>
            {campaign.category}
          </span>
          
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#f1eae2', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.02em' }}>
            {campaign.title}
          </h1>
          
          <p style={{ color: 'rgba(241,234,226,0.7)', fontSize: '20px', lineHeight: 1.6, maxWidth: '640px', fontWeight: 300 }}>
            {campaign.subtitle}
          </p>
        </div>
      </section>

      {/* Conteúdo Gerido pelo CMS com Design Elegante */}
      <section style={{ maxWidth: '800px', margin: '-60px auto 0', position: 'relative', zIndex: 20, padding: '0 24px' }}>
        
        {/* Bloco: Descrição do Problema */}
        {campaign.problemDescription && (
          <div style={{ 
            background: '#ffffff', 
            padding: '48px', 
            borderRadius: '4px', 
            boxShadow: '0 10px 40px rgba(21,33,56,0.08)', 
            marginBottom: '32px', 
            borderTop: '4px solid #152138' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              <AlertCircle style={{ color: '#152138', width: '28px', height: '28px' }} strokeWidth={1.5} />
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#152138', margin: 0 }}>O Desafio</h2>
            </div>
            
            <div style={{ color: '#4a5568', fontSize: '17px', lineHeight: 1.8, fontWeight: 300 }} className="cms-rich-text">
              <RichText data={campaign.problemDescription} />
            </div>
          </div>
        )}

        {/* Bloco: Explicação dos Direitos */}
        {campaign.rightsExplanation && (
          <div style={{ 
            background: '#ffffff', 
            padding: '48px', 
            borderRadius: '4px', 
            boxShadow: '0 10px 40px rgba(21,33,56,0.05)', 
            marginBottom: '32px',
            borderLeft: '1px solid #ede1c3'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              <Scale style={{ color: '#152138', width: '28px', height: '28px' }} strokeWidth={1.5} />
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#152138', margin: 0 }}>Os Seus Direitos</h2>
            </div>
            
            <div style={{ color: '#4a5568', fontSize: '17px', lineHeight: 1.8, fontWeight: 300 }} className="cms-rich-text">
              <RichText data={campaign.rightsExplanation} />
            </div>
          </div>
        )}

        {/* Bloco: Benefícios da Atuação */}
        {campaign.benefits && (
          <div style={{ 
            background: '#ffffff', 
            padding: '48px', 
            borderRadius: '4px', 
            boxShadow: '0 10px 40px rgba(21,33,56,0.05)', 
            marginBottom: '48px',
            borderLeft: '1px solid #ede1c3'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              <CheckCircle style={{ color: '#152138', width: '28px', height: '28px' }} strokeWidth={1.5} />
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#152138', margin: 0 }}>A Nossa Solução</h2>
            </div>
            
            <div style={{ color: '#4a5568', fontSize: '17px', lineHeight: 1.8, fontWeight: 300 }} className="cms-rich-text">
              <RichText data={campaign.benefits} />
            </div>
          </div>
        )}

        {/* Call to Action (CTA) Elegante */}
        <div style={{ 
          background: 'linear-gradient(to right, #152138, #1c2d4a)', 
          padding: '56px 40px', 
          borderRadius: '4px', 
          textAlign: 'center',
          borderBottom: '4px solid #ede1c3'
        }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#f1eae2', marginBottom: '16px' }}>
            {campaign.urgencyText || 'Tome uma atitude pelo seu direito hoje.'}
          </h3>
          <p style={{ color: 'rgba(241,234,226,0.7)', fontSize: '16px', marginBottom: '40px', fontWeight: 300 }}>
            Oferecemos uma análise profissional, confidencial e sem compromisso.
          </p>
          <a 
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '12px', 
              backgroundColor: '#ede1c3', color: '#152138', 
              padding: '18px 40px', borderRadius: '2px', 
              textDecoration: 'none', fontWeight: 600, fontSize: '15px',
              textTransform: 'uppercase', letterSpacing: '0.05em',
              transition: 'transform 0.2s, backgroundColor 0.2s',
            }}
          >
            <MessageCircle style={{ width: '20px', height: '20px' }} />
            Conversar com Advogado
          </a>
        </div>

      </section>
    </div>
  )
}