import { RichText } from '@payloadcms/richtext-lexical/react'

type LegalDocumentPageProps = {
  title: string
  description: string
  content?: any
  updatedAt?: string | null
}

export function LegalDocumentPage({ title, description, content, updatedAt }: LegalDocumentPageProps) {
  const formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
    : null

  return (
    <>
      <section className="ca-surface-dark" style={{ paddingTop: '128px', paddingBottom: '72px' }}>
        <div className="container-narrow mx-auto" style={{ padding: '0 24px' }}>
          <span className="ca-eyebrow">Documento legal</span>
          <h1 className="ca-heading-xl" style={{ color: 'var(--color-ca-platinum-100)', marginTop: '16px', marginBottom: '20px' }}>
            {title}
          </h1>
          <p className="ca-lead" style={{ color: 'color-mix(in srgb, var(--color-ca-platinum-100) 72%, transparent)' }}>
            {description}
          </p>
          {formattedDate && (
            <p style={{ color: 'var(--color-ca-steel-400)', fontSize: '14px', marginTop: '20px' }}>
              Ultima atualizacao: {formattedDate}
            </p>
          )}
        </div>
      </section>

      <section className="section-padding" style={{ backgroundColor: 'var(--color-ca-bone)' }}>
        <article className="container-narrow mx-auto" style={{ padding: '0 24px' }}>
          <div className="ca-panel cms-rich-text" style={{ background: '#fff', padding: 'clamp(28px, 5vw, 56px)' }}>
            {content ? (
              <RichText data={content} />
            ) : (
                            <div>
                <h2>Documento em consolidação</h2>
                <p>
                  Este documento será atualizado com a versão institucional completa. Até lá, os dados enviados pelos
                  formulários serão tratados apenas para atendimento jurídico, triagem de contato, cumprimento de
                  obrigações legais e segurança da comunicação.
                </p>
                <p>
                  Para exercer direitos previstos na LGPD ou solicitar informações sobre tratamento de dados, entre em
                  contato pelo e-mail cavalcantemelo.advs@gmail.com.
                </p>
              </div>
            )}
          </div>
        </article>
      </section>
    </>
  )
}
