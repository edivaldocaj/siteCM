import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrStaff, anyone } from '../access'

export const NpsResponses: CollectionConfig = {
  slug: 'nps-responses',
  endpoints: false,
  graphQL: false,
  admin: {
    useAsTitle: 'clientName',
    defaultColumns: ['clientName', 'score', 'attorney', 'status', 'createdAt'],
    description: 'Pesquisas de satisfaÃ§Ã£o e NPS dos clientes.',
    group: 'Portal do Cliente',
  },
  access: {
    read: adminOrStaff,
    create: anyone,
    update: adminOrStaff,
    delete: adminOnly,
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'client',
          type: 'relationship',
          relationTo: 'clients' as any,
          label: 'Cliente',
        },
        { name: 'clientName', type: 'text', required: true, label: 'Nome do Cliente' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'score',
          type: 'number',
          required: true,
          min: 0,
          max: 10,
          label: 'Nota NPS (0-10)',
        },
        { name: 'processNumber', type: 'text', label: 'Processo Relacionado' },
        {
          name: 'attorney',
          type: 'select',
          label: 'Advogado',
          options: [
            { label: 'Dr. Edivaldo Cavalcante', value: 'edivaldo' },
            { label: 'Dra. Gabrielly Melo', value: 'gabrielly' },
          ],
        },
        {
          name: 'attorneyRef',
          type: 'relationship',
          relationTo: 'team',
          label: 'Advogado (Team)',
          filterOptions: { active: { equals: true } },
          admin: { description: 'Campo temporário para migração. Mantém attorney legado.' },
        },
      ],
    },
    { name: 'feedback', type: 'textarea', label: 'ComentÃ¡rio do Cliente' },
    { name: 'consentText', type: 'textarea', label: 'Texto do Consentimento', admin: { readOnly: true } },
    { name: 'consentedAt', type: 'date', label: 'Consentido em', admin: { readOnly: true } },
    { name: 'ip', type: 'text', label: 'IP', admin: { readOnly: true } },
    { name: 'userAgent', type: 'textarea', label: 'User Agent', admin: { readOnly: true } },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'pending',
      options: [
        { label: 'â³ Pendente', value: 'pending' },
        { label: 'âœ… Revisado', value: 'reviewed' },
        { label: 'ðŸŽ‰ Depoimento Aprovado', value: 'testimonial-approved' },
        { label: 'âŒ Descartado', value: 'discarded' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      type: 'collapsible',
      label: 'Depoimento (para NPS 9-10)',
      admin: { initCollapsed: true },
      fields: [
        { name: 'testimonialText', type: 'textarea', label: 'Texto do Depoimento' },
        { name: 'testimonialApproved', type: 'checkbox', label: 'Aprovado para publicaÃ§Ã£o', defaultValue: false },
      ],
    },
  ],
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-prompt for testimonial if score >= 9
        if (data && data.score >= 9 && !data.testimonialText) {
          if (!data.notes) {
            data.notes = []
          }
        }
        return data
      },
    ],
  },
}




