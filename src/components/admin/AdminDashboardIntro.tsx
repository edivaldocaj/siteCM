const primaryActions = [
  { label: 'Novo lead', href: '/admin/collections/leads/create' },
  { label: 'Nova campanha', href: '/admin/collections/campaigns/create' },
  { label: 'Novo artigo', href: '/admin/collections/posts/create' },
]

const quickLinks = [
  { eyebrow: 'Relacionamento', title: 'Leads', href: '/admin/collections/leads', text: 'Acompanhe contatos captados pelo site e campanhas.' },
  { eyebrow: 'Marketing', title: 'Campanhas', href: '/admin/collections/campaigns', text: 'Edite landing pages, provas sociais, FAQs e CTAs.' },
  { eyebrow: 'Editorial', title: 'Blog', href: '/admin/collections/posts', text: 'Publique artigos e vincule conteúdos às campanhas.' },
  { eyebrow: 'Institucional', title: 'Identidade', href: '/admin/globals/brand-config', text: 'Atualize marca, contatos, redes sociais e avisos jurídicos.' },
]

export default function AdminDashboardIntro() {
  return (
    <section className="ca-admin-dashboard" aria-labelledby="ca-admin-dashboard-title">
      <div className="ca-admin-dashboard__hero">
        <div>
          <span className="ca-admin-eyebrow">Painel editorial</span>
          <h1 id="ca-admin-dashboard-title">Cavalcante Albuquerque CMS</h1>
          <p>
            Central de gestão do site, campanhas, leads e conteúdo institucional. Comece pelos atalhos principais ou
            navegue pelos grupos abaixo.
          </p>
        </div>
        <div className="ca-admin-dashboard__actions" aria-label="Ações rápidas">
          {primaryActions.map((action) => (
            <a key={action.href} href={action.href}>
              {action.label}
            </a>
          ))}
        </div>
      </div>

      <div className="ca-admin-dashboard__grid">
        {quickLinks.map((link) => (
          <a key={link.href} href={link.href} className="ca-admin-dashboard__card">
            <span>{link.eyebrow}</span>
            <strong>{link.title}</strong>
            <p>{link.text}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
