import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrEditor, anyone } from '../access'

export const PracticeAreas: CollectionConfig = {
  slug: 'practice-areas',
  labels: {
    singular: 'Área de atuação',
    plural: 'Áreas de atuação',
  },
  access: {
    read: anyone,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'responsibleRef', 'order'],
    description: 'Áreas principais exibidas no site institucional.',
    group: 'Conteúdo do Site',
    listSearchableFields: ['title', 'shortDescription'],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Página',
          description: 'Conteúdo principal da página da área de atuação.',
          fields: [
            { name: 'title', type: 'text', required: true, label: 'Nome da Área' },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              label: 'Slug da URL',
              admin: {
                position: 'sidebar',
                description: 'Usado em /areas-de-atuacao/slug-da-area.',
              },
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              label: 'Descrição Curta',
              maxLength: 300,
              admin: { description: 'Resumo usado em cards e listagens.' },
            },
            { name: 'heroHeadline', type: 'text', label: 'Headline da Página' },
            { name: 'content', type: 'richText', label: 'Conteúdo Completo' },
          ],
        },
        {
          label: 'Serviços e Dúvidas',
          description: 'Itens práticos que ajudam o visitante a entender a atuação.',
          fields: [
            {
              name: 'caseTypes',
              type: 'array',
              label: 'Tipos de Casos',
              fields: [{ name: 'name', type: 'text', required: true, label: 'Tipo de caso' }],
            },
            {
              name: 'faq',
              type: 'array',
              label: 'FAQ',
              fields: [
                { name: 'question', type: 'text', required: true, label: 'Pergunta' },
                { name: 'answer', type: 'textarea', required: true, label: 'Resposta' },
              ],
            },
          ],
        },
        {
          label: 'Configuração',
          description: 'Ícone, responsável e posição da área no site.',
          fields: [
            {
              name: 'icon',
              type: 'select',
              label: 'Ícone',
              defaultValue: 'scale',
              options: [
                { label: 'Documento (Licitações)', value: 'file-text' },
                { label: 'Laptop (Digital)', value: 'laptop' },
                { label: 'Balança (Civil)', value: 'scale' },
                { label: 'Martelo (Penal)', value: 'gavel' },
                { label: 'Escudo (Digital)', value: 'shield' },
                { label: 'Sacola (Consumidor)', value: 'shopping-bag' },
                { label: 'Casa (Imobiliário)', value: 'home' },
                { label: 'Recibo (Tributário)', value: 'receipt' },
                { label: 'Prédio', value: 'building' },
                { label: 'Maleta', value: 'briefcase' },
              ],
              admin: { position: 'sidebar' },
            },
            {
              name: 'attorney',
              type: 'select',
              label: 'Advogado Responsável legado',
              options: [
                { label: 'Dr. Edivaldo Cavalcante', value: 'edivaldo' },
                { label: 'Dra. Gabrielly Melo', value: 'gabrielly' },
                { label: 'Ambos', value: 'both' },
              ],
              admin: { description: 'Mantido para conteúdo antigo. Prefira o campo Responsável (Equipe).' },
            },
            {
              name: 'responsibleRef',
              type: 'relationship',
              relationTo: 'team',
              label: 'Responsável (Equipe)',
              filterOptions: { active: { equals: true } },
              admin: { description: 'Advogado ou profissional responsável cadastrado em Equipe.' },
            },
            { name: 'byFirm', type: 'checkbox', defaultValue: false, label: 'Área do escritório' },
            { name: 'is24h', type: 'checkbox', label: 'Atendimento 24h', defaultValue: false, admin: { position: 'sidebar' } },
            { name: 'order', type: 'number', label: 'Ordem', admin: { position: 'sidebar' } },
          ],
        },
        {
          label: 'SEO',
          description: 'Informações para buscadores e compartilhamentos.',
          fields: [
            {
              name: 'seo',
              type: 'group',
              label: 'SEO',
              fields: [
                { name: 'metaTitle', type: 'text', label: 'Meta Title' },
                { name: 'metaDescription', type: 'textarea', label: 'Meta Description' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
