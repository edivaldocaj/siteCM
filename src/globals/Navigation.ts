import type { GlobalConfig } from 'payload'
import { adminOnly, anyone } from '../access'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navegação',
  access: { read: anyone, update: adminOnly },
  fields: [
    {
      name: 'headerLinks',
      type: 'array',
      label: 'Links do cabeçalho',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
        { name: 'highlight', type: 'checkbox', defaultValue: false },
      ],
      defaultValue: [
        { label: 'Início', href: '/', highlight: false },
        { label: 'Sobre', href: '/sobre', highlight: false },
        { label: 'Áreas de atuação', href: '/areas-de-atuacao', highlight: false },
        { label: 'Campanhas', href: '/campanhas', highlight: false },
        { label: 'Blog', href: '/blog', highlight: false },
        { label: 'Contato', href: '/contato', highlight: false },
      ],
    },
    {
      name: 'footerColumns',
      type: 'array',
      label: 'Colunas do rodapé',
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          required: true,
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'legalLinks',
      type: 'array',
      label: 'Links jurídicos',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
      defaultValue: [
        { label: 'Política de privacidade', href: '/privacidade' },
        { label: 'Termos de uso', href: '/termos-de-uso' },
        { label: 'Política de cookies', href: '/politica-de-cookies' },
      ],
    },
    { name: 'ctaLabel', type: 'text', label: 'Texto do CTA', defaultValue: 'Fale com um advogado' },
    { name: 'ctaHref', type: 'text', label: 'URL do CTA' },
  ],
}