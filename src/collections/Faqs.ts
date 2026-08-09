import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrEditor, anyone } from '../access'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  access: {
    read: anyone,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'area', 'order', 'active'],
    group: 'Conteudo',
  },
  fields: [
    { name: 'question', type: 'text', required: true, label: 'Pergunta' },
    { name: 'answer', type: 'richText', required: true, label: 'Resposta' },
    { name: 'area', type: 'relationship', relationTo: 'practice-areas', label: 'Area relacionada' },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
    { name: 'active', type: 'checkbox', defaultValue: true, index: true, admin: { position: 'sidebar' } },
  ],
}