import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ArrowLeft, Clock, User, Calendar } from 'lucide-react'

// Renderizador oficial do texto formatado (RichText)
import { RichText } from '@payloadcms/richtext-lexical/react'

export const revalidate = 60 // Atualiza a cada 60 segundos

const authorNames: Record<string, string> = { 
  edivaldo: 'Dr. Edivaldo Cavalcante', 
  gabrielly: 'Dra. Gabrielly Melo', 
  escritorio: 'Cavalcante & Melo' 
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const payload = await getPayload({ config: configPromise })
  
  // Busca o post no banco de dados com base na URL
  const { docs } = await (payload as any).find({
    collection: 'posts',
    where: { slug: { equals: params.slug } },
  })

  const post = docs[0]

  // A CORREÇÃO ESTÁ AQUI: Se o post não existir no banco, força o erro 404 (Página não encontrada)
  if (!post) {
    notFound()
  }

  // Formata a data de publicação
  const publishDate = post.publishedAt || post.createdAt
  const formattedDate = new Date(publishDate).toLocaleDateString('pt-BR', { 
    day: '2-digit', month: 'long', year: 'numeric' 
  })

  return (
    <div style={{ backgroundColor: '#faf8f5', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Cabeçalho do Artigo */}
      <section style={{ background: 'linear-gradient(135deg, #152138 0%, #1c2d4a 50%, #0e1628 100%)', paddingTop: '120px', paddingBottom: '100px', paddingLeft: '16px', paddingRight: '16px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Link href="/blog" style={{ color: '#c4a96a', fontSize: '14px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', width: 'fit-content' }}>
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            Voltar para o Blog
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
            <span style={{ color: '#c4a96a', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', background: 'rgba(196,169,106,0.1)', padding: '4px 12px', borderRadius: '4px' }}>
              {post.category}
            </span>
            {post.readTime && (
              <span style={{ color: 'rgba(184,191,200,0.6)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock style={{ width: '14px', height: '14px' }} /> {post.readTime} min de leitura
              </span>
            )}
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: '#f1eae2', lineHeight: 1.2, marginBottom: '24px' }}>
            {post.title}
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b8bfc8', fontSize: '14px' }}>
              <User style={{ width: '16px', height: '16px', color: '#c4a96a' }} />
              {authorNames[post.author] || 'Equipe Cavalcante & Melo'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b8bfc8', fontSize: '14px' }}>
              <Calendar style={{ width: '16px', height: '16px', color: '#c4a96a' }} />
              {formattedDate}
            </div>
          </div>
        </div>
      </section>

      {/* Conteúdo do Artigo */}
      <section style={{ maxWidth: '800px', margin: '-40px auto 0', position: 'relative', zIndex: 10, padding: '0 16px' }}>
        <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid rgba(21,33,56,0.05)' }}>
          
          <div style={{ color: 'rgba(21,33,56,0.8)', fontSize: '18px', lineHeight: 1.6, marginBottom: '32px', fontStyle: 'italic', borderLeft: '4px solid #c4a96a', paddingLeft: '16px' }}>
            {post.excerpt}
          </div>

          {/* O Renderizador que puxa os parágrafos diretos do CMS */}
          <div style={{ color: 'rgba(21,33,56,0.7)', fontSize: '16px', lineHeight: 1.8 }} className="cms-rich-text">
            {post.content ? (
              <RichText data={post.content} />
            ) : (
              <p>Conteúdo não disponível.</p>
            )}
          </div>
          
        </div>
      </section>
    </div>
  )
}