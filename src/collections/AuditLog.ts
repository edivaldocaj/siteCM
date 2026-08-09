import type { CollectionConfig } from 'payload'
import { adminOnly } from '../access'

export const AuditLog: CollectionConfig = {
  slug: 'audit-log',
  endpoints: false,
  graphQL: false,
  access: {
    read: adminOnly,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'action',
    defaultColumns: ['action', 'collectionSlug', 'documentId', 'user', 'createdAt'],
    group: 'Operacao',
  },
  fields: [
    { name: 'action', type: 'text', required: true, index: true },
    { name: 'collectionSlug', type: 'text', label: 'Collection', index: true },
    { name: 'documentId', type: 'text', label: 'ID do documento', index: true },
    { name: 'user', type: 'relationship', relationTo: 'users', label: 'Usuario' },
    { name: 'before', type: 'json', label: 'Antes' },
    { name: 'after', type: 'json', label: 'Depois' },
    { name: 'metadata', type: 'json', label: 'Metadados' },
  ],
}