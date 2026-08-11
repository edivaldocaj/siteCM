import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrEditor, publishedOnly } from '../access'

export const NewsArticles: CollectionConfig = {
  slug: 'news-articles',
  access: {
    read: publishedOnly,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'source', 'category', 'relevanceScore', 'publishedAt', 'status'],
    description: 'Notícias jurídicas — alimentadas automaticamente via API e curadas manualmente.',
    group: 'Conteúdo do Site',
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Título' },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'excerpt', type: 'textarea', required: true, label: 'Resumo', maxLength: 400 },
    { name: 'content', type: 'richText', label: 'Conteúdo / Comentário do Escritório' },
    { name: 'sourceUrl', type: 'text', label: 'URL da Fonte Original' },
    { name: 'source', type: 'text', label: 'Nome da Fonte (ex: Conjur, STJ)' },
    { name: 'imageUrl', type: 'text', label: 'URL da Imagem' },
    {
      name: 'sourceHash',
      type: 'text',
      label: 'Hash da fonte',
      unique: true,
      index: true,
      admin: {
        description: 'Usado pelas automações para evitar importar a mesma notícia mais de uma vez.',
        position: 'sidebar',
        readOnly: true,
      },
    },
    {
      name: 'relevanceScore',
      type: 'number',
      label: 'Score de relevância',
      min: 0,
      max: 100,
      admin: {
        description: 'Pontuação calculada/curada para priorizar notícias relevantes ao escritório.',
        position: 'sidebar',
      },
    },
    {
      name: 'aiSummary',
      type: 'textarea',
      label: 'Resumo gerado por IA',
      maxLength: 1000,
      admin: {
        description: 'Rascunho interno para curadoria editorial. Revise antes de publicar.',
      },
    },
    {
      name: 'editorialNotes',
      type: 'textarea',
      label: 'Notas editoriais internas',
      admin: {
        description: 'Observações para revisão humana, vínculos com campanhas ou orientação de pauta.',
      },
    },
    {
      name: 'expiresAt',
      type: 'date',
      label: 'Expira em',
      admin: {
        description: 'Data usada por automações para arquivar ou limpar notícias pendentes antigas.',
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Categoria',
      options: [
        { label: 'Direito Digital', value: 'direito-digital' },
        { label: 'Direito Civil', value: 'direito-civil' },
        { label: 'Direito do Consumidor', value: 'direito-consumidor' },
        { label: 'Direito Imobiliário', value: 'direito-imobiliario' },
        { label: 'Direito Tributário', value: 'direito-tributario' },
        { label: 'Direito Penal', value: 'direito-penal' },
        { label: 'LGPD', value: 'lgpd' },
        { label: 'Legislação', value: 'legislacao' },
        { label: 'Licitações', value: 'licitacoes' },
        { label: 'STF / STJ', value: 'tribunais' },
        { label: 'Geral', value: 'geral' },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      options: [
        { label: 'Pendente (auto)', value: 'pending' },
        { label: 'Publicada', value: 'published' },
        { label: 'Rejeitada', value: 'rejected' },
      ],
      defaultValue: 'pending',
      admin: { position: 'sidebar' },
    },
    { name: 'autoImported', type: 'checkbox', label: 'Importada Automaticamente', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'publishedAt', type: 'date', label: 'Data de Publicação', admin: { position: 'sidebar' } },
    { name: 'linkedCampaign', type: 'text', label: 'Slug da Campanha Vinculada', admin: { position: 'sidebar' } },
  ],
}

