import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrEditor, approvedOnly } from '../access'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  access: {
    read: approvedOnly,
    create: adminOrEditor,
    update: adminOrEditor,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'caseType', 'rating', 'approved', 'featured'],
    description: 'Depoimentos revisados antes de aparecerem no site.',
    group: 'Conteúdo do Site',
    listSearchableFields: ['authorName', 'caseType', 'text'],
  },
  fields: [
    { name: 'authorName', type: 'text', required: true, label: 'Nome do Cliente' },
    {
      name: 'text',
      type: 'textarea',
      required: true,
      label: 'Depoimento',
      admin: { description: 'Evite dados sensíveis, números de processo ou promessas de resultado.' },
    },
    { name: 'caseType', type: 'text', label: 'Tipo de Caso' },
    { name: 'rating', type: 'number', min: 1, max: 5, defaultValue: 5, label: 'Avaliação (1-5)', admin: { position: 'sidebar' } },
    { name: 'featured', type: 'checkbox', label: 'Destaque na Homepage', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'approved', type: 'checkbox', label: 'Aprovado para publicação', defaultValue: false, admin: { position: 'sidebar' } },
  ],
}
