import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { ArrowLeft, AlertCircle, Scale, CheckCircle, MessageCircle, Share2, Copy, ExternalLink } from 'lucide-react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { CampaignShareBar } from '@/components/campaigns/CampaignShareBar'
import { CampaignVideoHero } from '@/components/campaigns/CampaignVideoHero'
import { CampaignUrgencyBar } from '@/components/campaigns/CampaignUrgencyBar'
import { CampaignLeadForm } from '@/components/campaigns/CampaignLeadForm'
import { CampaignTracker } from '@/components/campaigns/CampaignTracker'

export const dynamic = 'force-dynamic'

/* ── SEO dinâmico por campanha ── */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const payload = await getPayload({ config: configPromise })
    const { docs } = await (payload as any).find({
      collection: 'campaigns',
      where: { slug: { equals: slug } },
    })
    const c = docs[0]
    if (!c) return {}

    const ogImageUrl = c.ogImage?.url || c.coverImage?.url || c.heroImage?.url || null
    const title = c.metaTitle || c.title
    const description = c.metaDescription || c.subtitle || ''

    return {
      title: `${title} | Cavalcante & Melo`,
      description,
      openGraph: {
        title,
        description,
        ...(ogImageUrl ? { images: [{ url: ogImageUrl, width: 1200, height: 630 }] } : {}),
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        ...(ogImageUrl ? { images: [ogImageUrl] } : {}),
      },
    }
  } catch {
    return {}
  }
}

/* ── Cor de destaque ── */
const accentColors: Record<string, { border: string; bg: string; text: string }> = {
  gold: { border: '#c4a96a', bg: 'rgba(196,169,106,0.08)', text: '#c4a96a' },
  red: { border: '#b91c1c', bg: 'rgba(185,28,28,0.06)', text: '#dc2626' },
  blue: { border: '#1e40af', bg: 'rgba(30,64,175,0.06)', text: '#2563eb' },
  green: { border: '#047857', bg: 'rgba(4,120,87,0.06)', text: '#059669' },
}

const categoryLabels: Record<string, string> = {
  consumidor: 'Consumidor / Cível',
  digital: 'Digital / LGPD',
  criminal: 'Criminal',
  imobiliario: 'Imobiliário',
  tributario: 'Tributário',
}

export default async function CampaignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const { docs } = await (payload as any).find({
    collection: 'campaigns',
    where: { slug: { equals: slug } },
  })

  const campaign = docs[0]
  if (!campaign) return notFound()

  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5584991243985'
  const message = campaign.whatsappMessage || `Olá! Gostaria de falar sobre: ${campaign.title}`
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

  const accent = accentColors[campaign.colorAccent || 'gold'] || accentColors.gold

  // Resolve media URLs
  const heroImageUrl = campaign.heroImage?.url || null
  const videoUrl = campaign.videoUrl || null
  const videoFileUrl = campaign.videoFile?.url || null
  const hasVideo = !!(videoUrl || videoFileUrl)
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://cavalcantemelo.adv.br'}/campanhas/${slug}`

  return (
    <div style={{ backgroundColor: '#f1eae2', minHeight: '100vh', fontFamily: "'Source Sans 3', sans-serif" }}>

      {/* ── Analytics Tracker ── */}
      <CampaignTracker campaignSlug={slug} />

      {/* ── Barra de urgência animada ── */}
      {campaign.urgencyText && (
        <CampaignUrgencyBar text={campaign.urgencyText} accentColor={accent.border} />
      )}

      {/* ── Hero com vídeo ou imagem ── */}
      <section style={{
        backgroundColor: '#152138',
        paddingTop: campaign.urgencyText ? '100px' : '140px',
        paddingBottom: hasVideo ? '60px' : '120px',
        paddingLeft: '24px',
        paddingRight: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background: imagem hero ou gradiente */}
        {heroImageUrl && !hasVideo && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${heroImageUrl})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: 0.15,
          }} />
        )}

        {/* CM watermark */}
        <div style={{ position: 'absolute', top: '-20%', right: '-5%', opacity: 0.03, pointerEvents: 'none' }}>
          <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '600px', fontWeight: 'bold', color: '#ede1c3' }}>CM</span>
        </div>

        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <Link href="/campanhas" style={{ color: '#ede1c3', fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '40px', width: 'fit-content' }}>
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
            fontWeight: 600,
          }}>
            {categoryLabels[campaign.category] || campaign.category}
          </span>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: '#f1eae2', lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-0.02em' }}>
            {campaign.title}
          </h1>

          <p style={{ color: 'rgba(241,234,226,0.7)', fontSize: '20px', lineHeight: 1.6, maxWidth: '640px', fontWeight: 300, marginBottom: hasVideo ? '48px' : '0' }}>
            {campaign.subtitle}
          </p>

          {/* Video Hero */}
          {hasVideo && (
            <CampaignVideoHero
              videoUrl={videoUrl}
              videoFileUrl={videoFileUrl}
              heroImageUrl={heroImageUrl}
            />
          )}
        </div>
      </section>

      {/* ── Conteúdo principal ── */}
      <section style={{ maxWidth: '800px', margin: '-60px auto 0', position: 'relative', zIndex: 20, padding: '0 24px', paddingBottom: '100px' }}>

        {/* Problema */}
        {campaign.problemDescription && (
          <div style={{
            background: '#ffffff',
            padding: '48px',
            borderRadius: '4px',
            boxShadow: '0 10px 40px rgba(21,33,56,0.08)',
            marginBottom: '32px',
            borderTop: `4px solid ${accent.border}`,
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

        {/* Direitos */}
        {campaign.rightsExplanation && (
          <div style={{
            background: '#ffffff',
            padding: '48px',
            borderRadius: '4px',
            boxShadow: '0 10px 40px rgba(21,33,56,0.05)',
            marginBottom: '32px',
            borderLeft: `3px solid ${accent.border}`,
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

        {/* Benefícios */}
        {campaign.benefits && (
          <div style={{
            background: '#ffffff',
            padding: '48px',
            borderRadius: '4px',
            boxShadow: '0 10px 40px rgba(21,33,56,0.05)',
            marginBottom: '48px',
            borderLeft: `3px solid ${accent.border}`,
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

        {/* Prova Social */}
        {campaign.socialProof && campaign.socialProof.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#152138', marginBottom: '24px' }}>
              O que nossos clientes dizem
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {campaign.socialProof.map((proof: any, i: number) => (
                <div key={i} style={{
                  background: '#ffffff', padding: '32px', borderRadius: '4px',
                  borderLeft: `3px solid ${accent.border}`,
                  boxShadow: '0 4px 16px rgba(21,33,56,0.04)',
                }}>
                  <p style={{ color: '#4a5568', fontSize: '16px', lineHeight: 1.7, fontStyle: 'italic', marginBottom: '16px', fontWeight: 300 }}>
                    &ldquo;{proof.text}&rdquo;
                  </p>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    {proof.author && (
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '14px', color: '#152138', fontWeight: 600 }}>
                        {proof.author}
                      </span>
                    )}
                    {proof.caseType && (
                      <span style={{ fontSize: '12px', color: accent.text }}>— {proof.caseType}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        {campaign.faq && campaign.faq.length > 0 && (
          <div style={{
            background: '#ffffff', padding: '48px', borderRadius: '4px',
            boxShadow: '0 10px 40px rgba(21,33,56,0.05)',
            marginBottom: '48px',
            borderLeft: `1px solid ${accent.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#152138" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#152138', margin: 0 }}>
                Perguntas Frequentes
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {campaign.faq.map((item: any, i: number) => (
                <div key={i} style={{ borderBottom: i < campaign.faq.length - 1 ? '1px solid rgba(21,33,56,0.08)' : 'none', paddingBottom: '24px' }}>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#152138', fontWeight: 600, marginBottom: '12px' }}>
                    {item.question}
                  </h3>
                  <p style={{ color: '#4a5568', fontSize: '15px', lineHeight: 1.7, fontWeight: 300 }}>
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Barra de Compartilhamento ── */}
        <CampaignShareBar
          title={campaign.title}
          subtitle={campaign.subtitle || ''}
          shareUrl={shareUrl}
          whatsappMessage={message}
          accentColor={accent.border}
        />

        {/* ── Formulário de Captação de Lead ── */}
        {campaign.showForm !== false && (
          <div style={{ marginTop: '32px' }}>
            <CampaignLeadForm
              campaignSlug={slug}
              campaignTitle={campaign.title}
              category={campaign.category || 'consumidor'}
              accentColor={accent.border}
              whatsappUrl={whatsappUrl}
            />
          </div>
        )}

        {/* ── CTA Final ── */}
        <div style={{
          background: 'linear-gradient(to right, #152138, #1c2d4a)',
          padding: '56px 40px',
          borderRadius: '4px',
          textAlign: 'center',
          borderBottom: `4px solid ${accent.border}`,
          marginTop: '32px',
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
              transition: 'transform 0.2s',
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
