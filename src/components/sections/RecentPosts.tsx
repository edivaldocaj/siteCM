'use client'

import Link from 'next/link'
import { Clock, User, ArrowRight } from 'lucide-react'

const authorNames: Record<string, string> = {
  edivaldo: 'Dr. Edivaldo Cavalcante',
  gabrielly: 'Dra. Gabrielly Melo',
  escritorio: 'Cavalcante & Melo',
  both: 'Cavalcante & Melo',
}

const defaultPosts = [
  { title: 'O Guia Completo da LGPD para Empresas', slug: 'guia-lgpd-empresas', excerpt: 'Tudo sobre adequação à LGPD.', category: 'lgpd', author: 'edivaldo', readTime: 12 },
  { title: 'Negativação Indevida: Seus Direitos', slug: 'negativacao-indevida-direitos', excerpt: 'O que fazer quando negativado indevidamente.', category: 'consumidor', author: 'gabrielly', readTime: 8 },
  { title: '5 Direitos de Pessoa Presa em Flagrante', slug: 'direitos-preso-flagrante', excerpt: 'Direitos fundamentais na prisão em flagrante.', category: 'penal', author: 'edivaldo', readTime: 6 },
]

interface RecentPostsProps {
  cmsPosts?: any[]
}

export function RecentPosts({ cmsPosts = [] }: RecentPostsProps) {
  const posts = cmsPosts.length > 0 ? cmsPosts : defaultPosts

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--color-brand-cream)' }}>
      <div className="container-wide mx-auto">
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <span style={{ color: 'var(--color-brand-gold-dark)', fontSize: '12px', fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '0.25em', display: 'block', marginBottom: '16px' }}>
            Blog Jurídico
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: 600, color: 'var(--color-brand-navy)', marginBottom: '24px' }}>
            Artigos Recentes
          </h2>
          <p style={{ color: 'rgba(21,33,56,0.55)', fontFamily: 'var(--font-body)', fontSize: '17px', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
            Conteúdo jurídico atualizado para ajudar você a entender seus direitos.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {posts.slice(0, 3).map((post: any, i: number) => {
            const linkedCampaign = post.linkedCampaign || post.linked_campaign
            const readTime = post.readTime || post.read_time

            return (
              <div key={i} className="post-card" style={{ background: 'white', borderRadius: '4px', overflow: 'hidden', border: '1px solid rgba(237,225,195,0.3)', boxShadow: '0 4px 20px rgba(21,33,56,0.05)', transition: 'all 0.3s' }}>
                <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                  <div style={{ height: '180px', background: 'linear-gradient(135deg, #152138, #1c2d4a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ color: 'rgba(184,191,200,0.15)', fontFamily: 'var(--font-display)', fontSize: '56px', fontWeight: 'bold' }}>CM</span>
                  </div>
                </Link>

                <div style={{ padding: '28px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--color-brand-gold-dark)', background: 'rgba(196,169,106,0.1)', padding: '3px 8px', borderRadius: '2px', fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>
                      {post.category}
                    </span>
                    {readTime && (
                      <span style={{ color: 'rgba(21,33,56,0.3)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock style={{ width: '12px', height: '12px' }} />
                        {readTime} min
                      </span>
                    )}
                  </div>

                  <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, color: 'var(--color-brand-navy)', marginBottom: '12px', lineHeight: 1.3 }}>
                      {post.title}
                    </h3>
                  </Link>

                  <p style={{ color: 'rgba(21,33,56,0.5)', fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.6, marginBottom: '16px' }}>
                    {post.excerpt}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'rgba(21,33,56,0.3)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User style={{ width: '12px', height: '12px' }} />
                      {authorNames[post.author] || 'Cavalcante & Melo'}
                    </span>

                    {linkedCampaign && (
                      <Link href={`/campanhas/${linkedCampaign}`} style={{ color: 'var(--color-brand-gold-dark)', fontSize: '10px', fontFamily: 'var(--font-body)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', background: 'rgba(196,169,106,0.1)', padding: '3px 8px', borderRadius: '2px' }}>
                        Campanha <ArrowRight style={{ width: '10px', height: '10px' }} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '48px' }}>
          <Link href="/blog" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--color-brand-navy)', fontSize: '13px', fontFamily: 'var(--font-body)', fontWeight: 600, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.08em', border: '1px solid rgba(21,33,56,0.2)', padding: '12px 28px', borderRadius: '2px', transition: 'all 0.3s' }}>
            Ver todos os artigos <ArrowRight style={{ width: '14px', height: '14px' }} />
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `.post-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(21,33,56,0.1) !important; }` }} />
    </section>
  )
}
