import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrStaff } from '../access'

export const Deadlines: CollectionConfig = {
  slug: 'deadlines',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'clientName', 'processNumber', 'deadlineDate', 'deadlineType', 'status', 'attorney'],
    description: 'Prazos processuais com alertas escalonados (7d, 3d, 1d).',
    group: 'EscritÃ³rio',
  },
  access: {
    read: adminOrStaff,
    create: adminOrStaff,
    update: adminOrStaff,
    delete: adminOnly,
  },
  fields: [
    { name: 'title', type: 'text', required: true, label: 'DescriÃ§Ã£o do Prazo' },
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
        { name: 'processNumber', type: 'text', label: 'NÃºmero do Processo' },
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
            { label: 'ContestaÃ§Ã£o', value: 'contestation' },
            { label: 'Recurso', value: 'appeal' },
            { label: 'ManifestaÃ§Ã£o', value: 'manifestation' },
            { label: 'AudiÃªncia', value: 'hearing' },
            { label: 'PerÃ­cia', value: 'expertise' },
            { label: 'Cumprimento de sentenÃ§a', value: 'sentence-compliance' },
            { label: 'Outro', value: 'other' },
          ],
        },
        {
          name: 'attorney',
          type: 'select',
          label: 'Advogado ResponsÃ¡vel',
          options: [
            { label: 'Dr. Edivaldo Cavalcante', value: 'edivaldo' },
            { label: 'Dra. Gabrielly Melo', value: 'gabrielly' },
          ],
        },
        {
          name: 'attorneyRef',
          type: 'relationship',
          relationTo: 'team',
          label: 'Advogado Responsável (Team)',
          filterOptions: { active: { equals: true } },
          admin: { description: 'Campo temporário para migração. Mantém attorney legado.' },
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      defaultValue: 'pending',
      options: [
        { label: 'â³ Pendente', value: 'pending' },
        { label: 'ðŸ”„ Em andamento', value: 'in-progress' },
        { label: 'âœ… Cumprido', value: 'completed' },
        { label: 'âŒ Perdido', value: 'missed' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'priority',
      type: 'select',
      label: 'Prioridade',
      defaultValue: 'normal',
      options: [
        { label: 'ðŸŸ¢ Normal', value: 'normal' },
        { label: 'ðŸŸ¡ AtenÃ§Ã£o', value: 'attention' },
        { label: 'ðŸ”´ CrÃ­tico', value: 'critical' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'notes', type: 'textarea', label: 'ObservaÃ§Ãµes' },
    {
      type: 'collapsible',
      label: 'Controle de Alertas (automÃ¡tico)',
      admin: { initCollapsed: true },
      fields: [
        { name: 'alertSent7d', type: 'checkbox', label: 'Alerta 7 dias enviado', defaultValue: false },
        { name: 'alertSent3d', type: 'checkbox', label: 'Alerta 3 dias enviado', defaultValue: false },
        { name: 'alertSent1d', type: 'checkbox', label: 'Alerta 1 dia enviado', defaultValue: false },
      ],
    },
  ],
}



