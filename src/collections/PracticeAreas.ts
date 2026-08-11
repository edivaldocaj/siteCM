import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrEditor, anyone } from '../access'

export const PracticeAreas: CollectionConfig = {
  slug: 'practice-areas',
  access: {
    read: anyone,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order'],
    description: 'Áreas principais exibidas no site institucional.',
    group: 'Conteúdo do Site',
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Nome da Área' },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'shortDescription', type: 'textarea', label: 'Descrição Curta', maxLength: 300 },
    {
      name: 'icon',
      type: 'select',
      label: 'Ícone',
      defaultValue: 'scale',
      options: [
        { label: 'Escudo (Digital)', value: 'shield' },
        { label: 'Balança (Civil)', value: 'scale' },
        { label: 'Sacola (Consumidor)', value: 'shopping-bag' },
        { label: 'Casa (Imobiliário)', value: 'home' },
        { label: 'Recibo (Tributário)', value: 'receipt' },
        { label: 'Documento (Licitações)', value: 'file-text' },
        { label: 'Martelo (Penal)', value: 'gavel' },
        { label: 'Laptop (Digital)', value: 'laptop' },
        { label: 'Prédio', value: 'building' },
        { label: 'Maleta', value: 'briefcase' },
      ],
    },
    { name: 'heroHeadline', type: 'text', label: 'Headline da Página' },
    { name: 'content', type: 'richText', label: 'Conteúdo Completo' },
    { name: 'caseTypes', type: 'array', label: 'Tipos de Casos', fields: [{ name: 'name', type: 'text', required: true }] },
    { name: 'faq', type: 'array', label: 'FAQ', fields: [
      { name: 'question', type: 'text', required: true },
      { name: 'answer', type: 'textarea', required: true },
    ]},
    { name: 'attorney', type: 'select', label: 'Advogado Responsável', options: [
      { label: 'Dr. Edivaldo Cavalcante', value: 'edivaldo' },
      { label: 'Dra. Gabrielly Melo', value: 'gabrielly' },
      { label: 'Ambos', value: 'both' },
    ]},
    {
      name: 'responsibleRef',
      type: 'relationship',
      relationTo: 'team',
      label: 'Responsável (Team)',
      filterOptions: { active: { equals: true } },
      admin: { description: 'Campo temporário para migração. Mantém attorney legado.' },
    },
    { name: 'byFirm', type: 'checkbox', defaultValue: false, label: 'Área do escritório' },
    { name: 'is24h', type: 'checkbox', label: 'Atendimento 24h', defaultValue: false },
    { name: 'order', type: 'number', label: 'Ordem', admin: { position: 'sidebar' } },
    { name: 'seo', type: 'group', label: 'SEO', fields: [
      { name: 'metaTitle', type: 'text' },
      { name: 'metaDescription', type: 'textarea' },
    ]},
  ],
}




