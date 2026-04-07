import type { CollectionConfig } from 'payload'

export const Deadlines: CollectionConfig = {
  slug: 'deadlines',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'clientName', 'processNumber', 'deadlineDate', 'deadlineType', 'status', 'attorney'],
    description: 'Prazos processuais com alertas escalonados (7d, 3d, 1d).',
    group: 'Escritório',
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Descrição do Prazo' },
    {
      type: 'row',
      fields: [
        {
          name: 'client',
          type: 'relationship',
          relationTo: 'clients' as any,
          label: 'Cliente',
        },
        { name: 'clientName', type: 'text', label: 'Nome do Cliente' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'processNumber', type: 'text', label: 'Número do Processo' },
        {
          name: 'deadlineDate',
          type: 'date',
          required: true,
          label: 'Data do Prazo',
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'deadlineType',
          type: 'select',
          label: 'Tipo de Prazo',
          defaultValue: 'other',
          options: [
            { label: 'Contestação', value: 'contestation' },
            { label: 'Recurso', value: 'appeal' },
            { label: 'Manifestação', value: 'manifestation' },
            { label: 'Audiência', value: 'hearing' },
            { label: 'Perícia', value: 'expertise' },
            { label: 'Cumprimento de sentença', value: 'sentence-compliance' },
            { label: 'Outro', value: 'other' },
          ],
        },
        {
          name: 'attorney',
          type: 'select',
          label: 'Advogado Responsável',
          options: [
            { label: 'Dr. Edivaldo Cavalcante', value: 'edivaldo' },
            { label: 'Dra. Gabrielly Melo', value: 'gabrielly' },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'pending',
      options: [
        { label: '⏳ Pendente', value: 'pending' },
        { label: '🔄 Em andamento', value: 'in-progress' },
        { label: '✅ Cumprido', value: 'completed' },
        { label: '❌ Perdido', value: 'missed' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'priority',
      type: 'select',
      label: 'Prioridade',
      defaultValue: 'normal',
      options: [
        { label: '🟢 Normal', value: 'normal' },
        { label: '🟡 Atenção', value: 'attention' },
        { label: '🔴 Crítico', value: 'critical' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'notes', type: 'textarea', label: 'Observações' },
    {
      type: 'collapsible',
      label: 'Controle de Alertas (automático)',
      admin: { initCollapsed: true },
      fields: [
        { name: 'alertSent7d', type: 'checkbox', label: 'Alerta 7 dias enviado', defaultValue: false },
        { name: 'alertSent3d', type: 'checkbox', label: 'Alerta 3 dias enviado', defaultValue: false },
        { name: 'alertSent1d', type: 'checkbox', label: 'Alerta 1 dia enviado', defaultValue: false },
      ],
    },
  ],
}
