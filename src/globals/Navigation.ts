import type { GlobalConfig } from 'payload'
import { adminOnly, anyone } from '../access'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navegação',
  admin: { group: 'Configuração' },
  access: { read: anyone, update: adminOnly },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Cabeçalho',
          description: 'Links exibidos no menu principal do site.',
          fields: [
            {
              name: 'headerLinks',
              type: 'array',
              label: 'Links do cabeçalho',
              admin: {
                description: 'Mantenha poucos itens para preservar leitura e responsividade no mobile.',
              },
              fields: [
                { name: 'label', type: 'text', required: true, label: 'Rótulo' },
                { name: 'href', type: 'text', required: true, label: 'URL' },
                { name: 'highlight', type: 'checkbox', defaultValue: false, label: 'Destacar no menu' },
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
            { name: 'ctaLabel', type: 'text', label: 'Texto do CTA', defaultValue: 'Fale com um advogado' },
            {
              name: 'ctaHref',
              type: 'text',
              label: 'URL do CTA',
              admin: { description: 'Ex: /contato ou link direto para WhatsApp.' },
            },
          ],
        },
        {
          label: 'Rodapé',
          description: 'Colunas de navegação exibidas no final das páginas.',
          fields: [
            {
              name: 'footerColumns',
              type: 'array',
              label: 'Colunas do rodapé',
              admin: { description: 'Use grupos curtos, como Escritório, Conteúdo, Atendimento e Jurídico.' },
              fields: [
                { name: 'title', type: 'text', required: true, label: 'Título da coluna' },
                {
                  name: 'links',
                  type: 'array',
                  required: true,
                  label: 'Links',
                  fields: [
                    { name: 'label', type: 'text', required: true, label: 'Rótulo' },
                    { name: 'href', type: 'text', required: true, label: 'URL' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Jurídico',
          description: 'Links obrigatórios ou institucionais de conformidade.',
          fields: [
            {
              name: 'legalLinks',
              type: 'array',
              label: 'Links jurídicos',
              fields: [
                { name: 'label', type: 'text', required: true, label: 'Rótulo' },
                { name: 'href', type: 'text', required: true, label: 'URL' },
              ],
              defaultValue: [
                { label: 'Política de privacidade', href: '/privacidade' },
                { label: 'Termos de uso', href: '/termos-de-uso' },
                { label: 'Política de cookies', href: '/politica-de-cookies' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
