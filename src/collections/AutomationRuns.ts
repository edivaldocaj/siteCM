import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrStaff } from '../access'

export const AutomationRuns: CollectionConfig = {
  slug: 'automation-runs',
  endpoints: false,
  graphQL: false,
  access: {
    read: adminOrStaff,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'task',
    defaultColumns: ['task', 'status', 'startedAt', 'finishedAt', 'itemsIn', 'itemsOut'],
    group: 'Operação',
  },
  fields: [
    { name: 'task', type: 'text', required: true, index: true },
    { name: 'status', type: 'text', required: true, defaultValue: 'pending', index: true },
    { name: 'startedAt', type: 'date', required: true, defaultValue: () => new Date().toISOString(), index: true },
    { name: 'finishedAt', type: 'date' },
    { name: 'itemsIn', type: 'number', defaultValue: 0 },
    { name: 'itemsOut', type: 'number', defaultValue: 0 },
    { name: 'errorMessage', type: 'textarea' },
    { name: 'payload', type: 'json', label: 'Resumo da execucao' },
  ],
}
