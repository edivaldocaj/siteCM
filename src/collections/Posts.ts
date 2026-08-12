import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrEditor, publishedOnly } from '../access'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Artigo',
    plural: 'Artigos',
  },
  access: {
    read: publishedOnly,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'authorRef', 'publishedAt'],
    description: 'Artigos publicados no blog institucional.',
    group: 'Conteúdo do Site',
    listSearchableFields: ['title', 'excerpt', 'tags'],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Artigo',
          description: 'Conteúdo principal exibido no blog.',
          fields: [
            { name: 'title', type: 'text', required: true, label: 'Título' },
            {
              name: 'slug',
              type: 'text',
              required: true,
              unique: true,
              label: 'Slug da URL',
              admin: {
                position: 'sidebar',
                description: 'Usado em /blog/slug-do-artigo. Use letras minúsculas, números e hífens.',
              },
            },
            {
              name: 'excerpt',
              type: 'textarea',
              required: true,
              label: 'Resumo',
              maxLength: 300,
              admin: { description: 'Texto curto usado em cards, listagens e topo do artigo.' },
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Imagem Destaque',
              admin: { description: 'Imagem horizontal para card e compartilhamento editorial.' },
            },
            { name: 'content', type: 'richText', required: true, label: 'Conteúdo' },
          ],
        },
        {
          label: 'Classificação',
          description: 'Organização editorial e autoria do artigo.',
          fields: [
            {
              name: 'category',
              type: 'select',
              required: true,
              label: 'Categoria',
              options: [
                { label: 'Licitações e Contratos', value: 'licitacoes' },
                { label: 'Direito Digital', value: 'direito-digital' },
                { label: 'Direito Civil', value: 'direito-civil' },
                { label: 'Direito Penal', value: 'direito-penal' },
                { label: 'LGPD', value: 'lgpd' },
                { label: 'Direito do Consumidor', value: 'direito-consumidor' },
                { label: 'Direito Imobiliário', value: 'direito-imobiliario' },
                { label: 'Direito Tributário', value: 'direito-tributario' },
                { label: 'Geral', value: 'geral' },
              ],
              admin: { position: 'sidebar' },
            },
            {
              name: 'author',
              type: 'select',
              label: 'Autor legado',
              options: [
                { label: 'Dr. Edivaldo Cavalcante', value: 'edivaldo' },
                { label: 'Dra. Gabrielly Melo', value: 'gabrielly' },
                { label: 'Cavalcante Albuquerque', value: 'escritorio' },
              ],
              admin: { description: 'Mantido para conteúdo antigo. Prefira o campo Autor (Equipe).' },
            },
            {
              name: 'authorRef',
              type: 'relationship',
              relationTo: 'team',
              label: 'Autor (Equipe)',
              filterOptions: { active: { equals: true } },
              admin: { description: 'Autor cadastrado na collection Equipe.' },
            },
            {
              name: 'byFirm',
              type: 'checkbox',
              defaultValue: false,
              label: 'Autoria institucional',
              admin: { description: 'Marque quando o texto for assinado pelo escritório.' },
            },
            {
              name: 'tags',
              type: 'text',
              hasMany: true,
              label: 'Tags',
              admin: { description: 'Palavras-chave internas para organização editorial.' },
            },
            { name: 'readTime', type: 'number', label: 'Tempo de Leitura (min)', admin: { position: 'sidebar' } },
            { name: 'publishedAt', type: 'date', label: 'Data de Publicação', admin: { position: 'sidebar' } },
            {
              name: 'status',
              type: 'select',
              label: 'Status',
              options: [
                { label: 'Rascunho', value: 'draft' },
                { label: 'Publicado', value: 'published' },
              ],
              defaultValue: 'draft',
              admin: { position: 'sidebar' },
            },
            {
              name: 'linkedCampaign',
              type: 'text',
              label: 'Slug da Campanha Vinculada',
              admin: { description: 'Ex: fraudes-bancarias. Se preenchido, mostra link para a campanha no card do post.' },
            },
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
