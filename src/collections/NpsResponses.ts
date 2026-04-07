import type { CollectionConfig } from 'payload'

export const NpsResponses: CollectionConfig = {
  slug: 'nps-responses',
  admin: {
    useAsTitle: 'clientName',
    defaultColumns: ['clientName', 'score', 'attorney', 'status', 'createdAt'],
    description: 'Pesquisas de satisfação e NPS dos clientes.',
    group: 'Portal do Cliente',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
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
      ],
    },
    { name: 'feedback', type: 'textarea', label: 'Comentário do Cliente' },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'pending',
      options: [
        { label: '⏳ Pendente', value: 'pending' },
        { label: '✅ Revisado', value: 'reviewed' },
        { label: '🎉 Depoimento Aprovado', value: 'testimonial-approved' },
        { label: '❌ Descartado', value: 'discarded' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      type: 'collapsible',
      label: 'Depoimento (para NPS 9-10)',
      admin: { initCollapsed: true },
      fields: [
        { name: 'testimonialText', type: 'textarea', label: 'Texto do Depoimento' },
        { name: 'testimonialApproved', type: 'checkbox', label: 'Aprovado para publicação', defaultValue: false },
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
