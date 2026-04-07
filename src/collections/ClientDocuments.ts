import type { CollectionConfig } from 'payload'

export const ClientDocuments: CollectionConfig = {
  slug: 'client-documents',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'clientName', 'processNumber', 'documentType', 'uploadedBy', 'createdAt'],
    description: 'Documentos compartilhados entre escritório e clientes.',
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
        { name: 'title', type: 'text', required: true, label: 'Título do Documento' },
        {
          name: 'documentType',
          type: 'select',
          label: 'Tipo',
          defaultValue: 'other',
          options: [
            { label: 'Petição', value: 'petition' },
            { label: 'Procuração', value: 'power-of-attorney' },
            { label: 'Decisão / Sentença', value: 'decision' },
            { label: 'Contrato', value: 'contract' },
            { label: 'Comprovante', value: 'receipt' },
            { label: 'Documento Pessoal', value: 'personal-doc' },
            { label: 'Outro', value: 'other' },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'client',
          type: 'relationship',
          relationTo: 'clients' as any,
          label: 'Cliente',
          required: true,
        },
        { name: 'clientName', type: 'text', label: 'Nome do Cliente (cache)' },
      ],
    },
    { name: 'processNumber', type: 'text', label: 'Número do Processo (CNJ)' },
    { name: 'file', type: 'upload', relationTo: 'media' as any, label: 'Arquivo', required: true },
    {
      name: 'uploadedBy',
      type: 'select',
      label: 'Enviado por',
      defaultValue: 'attorney',
      options: [
        { label: 'Escritório', value: 'attorney' },
        { label: 'Cliente', value: 'client' },
      ],
    },
    {
      name: 'visibility',
      type: 'select',
      label: 'Visibilidade',
      defaultValue: 'client-visible',
      options: [
        { label: 'Visível ao cliente', value: 'client-visible' },
        { label: 'Interno (apenas escritório)', value: 'internal' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'notes', type: 'textarea', label: 'Observações' },
  ],
}
