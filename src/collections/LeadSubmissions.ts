import type { CollectionConfig } from 'payload'
import { adminOnly } from '../access'

export const LeadSubmissions: CollectionConfig = {
  slug: 'lead-submissions',
  labels: { singular: 'Entrega de lead', plural: 'Entregas de leads' },
  admin: {
    defaultColumns: ['nome', 'telefone', 'origem', 'campanha', 'status', 'tentativas'],
    description: 'Caixa de saida dos formularios enviados ao n8n e ao EspoCRM.',
    group: 'Integração',
    useAsTitle: 'telefone',
  },
  access: { create: () => false, delete: () => false, read: adminOnly, update: adminOnly },
  fields: [
    { name: 'idempotencia', type: 'text', required: true, unique: true },
    { name: 'enviadoEm', type: 'date', required: true },
    { name: 'escritorio', type: 'select', options: [{ label: 'CA', value: 'CA' }], required: true },
    {
      name: 'telefone', type: 'text', required: true,
      validate: (value: unknown) => typeof value === 'string' && /^\d{10,15}$/.test(value) ? true : 'Informe o telefone em E.164 sem +.',
    },
    { name: 'nome', type: 'text', required: true },
    { name: 'email', type: 'email' },
    { name: 'campanha', type: 'text' },
    {
      name: 'origem', type: 'select', required: true,
      options: [{ label: 'Landing', value: 'landing' }, { label: 'Contato', value: 'contato' }],
    },
    {
      name: 'utm', type: 'group', fields: [
        { name: 'source', type: 'text' }, { name: 'medium', type: 'text' },
        { name: 'campaign', type: 'text' }, { name: 'content', type: 'text' }, { name: 'term', type: 'text' },
      ],
    },
    { name: 'referrer', type: 'text' },
    {
      name: 'respostas', type: 'array', fields: [
        { name: 'pergunta', type: 'text', required: true },
        { name: 'resposta', type: 'textarea', required: true },
      ],
    },
    { name: 'consentAceito', type: 'checkbox', required: true },
    { name: 'consentVersao', type: 'text', required: true },
    { name: 'consentEm', type: 'date', required: true },
    { name: 'consentIp', type: 'text' },
    {
      name: 'status', type: 'select', required: true, defaultValue: 'pendente',
      options: [
        { label: 'Pendente', value: 'pendente' }, { label: 'Entregue', value: 'entregue' },
        { label: 'Rejeitada', value: 'rejeitada' }, { label: 'Falha', value: 'falha' },
      ],
    },
    { name: 'tentativas', type: 'number', defaultValue: 0, min: 0 },
    { name: 'ultimoErro', type: 'textarea' },
    { name: 'leadIdCrm', type: 'text' },
  ],
}
