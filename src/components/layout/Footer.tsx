import Image from 'next/image'
import Link from 'next/link'
import { Clock, Mail, MapPin, Phone } from 'lucide-react'

type LinkItem = { href: string; label: string }
type FooterColumn = { title: string; links?: LinkItem[] | null }

type FooterProps = {
  siteConfig?: any
  practiceAreas?: LinkItem[]
  navItems?: LinkItem[]
  footerColumns?: FooterColumn[] | null
  legalLinks?: LinkItem[] | null
}

const fallbackNavLinks: LinkItem[] = [
  { href: '/sobre', label: 'Sobre o escritório' },
  { href: '/campanhas', label: 'Campanhas jurídicas' },
  { href: '/blog', label: 'Blog jurídico' },
  { href: '/contato', label: 'Contato' },
]

const fallbackAreaLinks: LinkItem[] = [
  { href: '/areas-de-atuacao/licitacoes-e-contratos', label: 'Licitações e Contratos' },
  { href: '/areas-de-atuacao/direito-digital', label: 'Direito Digital' },
  { href: '/areas-de-atuacao/direito-civil', label: 'Direito Civil' },
  { href: '/areas-de-atuacao/direito-penal', label: 'Direito Penal' },
]

function normalizePhoneHref(value?: string | null) {
  const digits = value?.replace(/\D/g, '')
  if (!digits) return 'tel:+5584991243985'
  return `tel:+${digits.startsWith('55') ? digits : `55${digits}`}`
}

export function Footer({
  siteConfig,
  practiceAreas = [],
  navItems = fallbackNavLinks,
  footerColumns,
  legalLinks,
}: FooterProps) {
  const email = siteConfig?.contactEmail || 'contato@cavalcantealbuquerque.com.br'
  const phone = siteConfig?.contactPhone || '(84) 99124-3985'
  const address = siteConfig?.contactAddress || 'Rua Francisco Maia Sobrinho, 1950\nLagoa Nova - Natal/RN, 59062-250'
  const areaLinks = practiceAreas.length > 0 ? practiceAreas : fallbackAreaLinks
  const cmsFooterColumns = footerColumns?.filter((column) => column.title && column.links?.length)
  const navigationColumn = cmsFooterColumns?.[0] || { title: 'Navegação', links: navItems }
  const legalColumnLinks = legalLinks?.length
    ? legalLinks
    : [
        { href: '/privacidade', label: 'Política de privacidade' },
        { href: '/termos-de-uso', label: 'Termos de uso' },
        { href: '/politica-de-cookies', label: 'Política de cookies' },
      ]

  return (
    <footer className="ca-footer ca-surface-dark">
      <div className="ca-footer__inner">
        <div className="ca-footer__grid">
          <div className="ca-footer__brand-col">
            <Link href="/" className="ca-footer__brand-lockup" aria-label="Cavalcante Albuquerque">
              <Image
                src="/brand/brand-symbol-transparent.webp"
                alt=""
                width={58}
                height={58}
                className="ca-footer__symbol"
              />
              <span className="ca-footer__brand-text" aria-hidden="true">
                <strong>Cavalcante Albuquerque</strong>
                <span>Advocacia e Consultoria</span>
              </span>
            </Link>
            <p className="ca-footer__tagline">Advocacia com estratégia e solidez.</p>
            <p className="ca-footer__text">
              Advocacia e consultoria em Natal/RN com atendimento técnico, direto e orientado ao contexto de cada caso.
            </p>
          </div>

          <div>
            <h4 className="ca-footer__title">Áreas de atuação</h4>
            <ul className="ca-footer__list">
              {areaLinks.map((area) => (
                <li key={area.href}>
                  <Link href={area.href} className="ca-footer__link">
                    {area.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="ca-footer__title">{navigationColumn.title}</h4>
            <ul className="ca-footer__list">
              {navigationColumn.links?.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="ca-footer__link">
                    {link.label}
                  </Link>
                </li>
              ))}
              {legalColumnLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="ca-footer__link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="ca-footer__title">Contato</h4>
            <ul className="ca-footer__contact-list">
              <li><MapPin aria-hidden="true" /><span>{address}</span></li>
              <li><Phone aria-hidden="true" /><a href={normalizePhoneHref(phone)}>{phone}</a></li>
              <li><Mail aria-hidden="true" /><a href={`mailto:${email}`}>{email}</a></li>
              <li><Clock aria-hidden="true" /><span>Seg a Sex: 8h às 18h<br />Penal: atendimento 24h</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="ca-footer__bottom">
        <div className="ca-footer__bottom-inner">
          <p>© {new Date().getFullYear()} Cavalcante Albuquerque. Todos os direitos reservados.</p>
          <p>OAB/RN 10.734 · Natal/RN · Publicidade advocatícia informativa.</p>
        </div>
      </div>
    </footer>
  )
}
