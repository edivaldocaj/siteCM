import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrEditor, publishedOnly } from '../access'

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    read: publishedOnly,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOnly,
  },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', 'status', 'publishedAt'] },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'TÃ­tulo' },
    { name: 'slug', type: 'text', required: true, unique: true }, // Removido position: 'sidebar'
    { name: 'excerpt', type: 'textarea', required: true, label: 'Resumo', maxLength: 300 },
    { name: 'featuredImage', type: 'upload', relationTo: 'media', label: 'Imagem Destaque' },
    { name: 'content', type: 'richText', required: true, label: 'ConteÃºdo' },
    {
      name: 'category',
      type: 'select',
      required: true,
      label: 'Categoria',
      options: [
        { label: 'Direito Digital', value: 'direito-digital' },
        { label: 'Direito Civil', value: 'direito-civil' },
        { label: 'Direito do Consumidor', value: 'direito-consumidor' },
        { label: 'Direito ImobiliÃ¡rio', value: 'direito-imobiliario' },
        { label: 'Direito TributÃ¡rio', value: 'direito-tributario' },
        { label: 'LicitaÃ§Ãµes', value: 'licitacoes' },
        { label: 'Direito Penal', value: 'direito-penal' },
        { label: 'LGPD', value: 'lgpd' },
        { label: 'Geral', value: 'geral' },
      ],
    },
    {
      name: 'author',
      type: 'select',
      label: 'Autor',
      options: [
        { label: 'Dr. Edivaldo Cavalcante', value: 'edivaldo' },
        { label: 'Dra. Gabrielly Melo', value: 'gabrielly' },
        { label: 'Cavalcante Albuquerque', value: 'escritorio' },
      ],
    },    {
      name: 'authorRef',
      type: 'relationship',
      relationTo: 'team',
      label: 'Autor (novo cadastro Team)',
      admin: { description: 'Campo temporário para migração. Mantém author legado até validação do backfill.' },
    },
    {
      name: 'byFirm',
      type: 'checkbox',
      defaultValue: false,
      label: 'Autoria institucional',
      admin: { description: 'Usado quando author legado for escritorio.' },
    },
    { name: 'tags', type: 'text', hasMany: true, label: 'Tags' },
    { name: 'readTime', type: 'number', label: 'Tempo de Leitura (min)' }, // Removido position
    { name: 'publishedAt', type: 'date', label: 'Data de PublicaÃ§Ã£o' }, // Removido position
    { name: 'status', type: 'select', options: ['draft', 'published'], defaultValue: 'draft' }, // Removido position
    { name: 'linkedCampaign', type: 'text', label: 'Slug da Campanha Vinculada', admin: { description: 'Ex: fraudes-bancarias. Se preenchido, mostra link para a campanha no card do post.' } },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
      ],
    },
  ],
}

