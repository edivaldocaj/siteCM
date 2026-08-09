import type { CollectionConfig } from 'payload'
import { adminOnly } from '../access'

export const Team: CollectionConfig = {
  slug: 'team',
  labels: {
    singular: 'Advogado',
    plural: 'Equipe',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'oab', 'active', 'showOnSite'],
    group: 'Escritório',
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true

      return {
        showOnSite: {
          equals: true,
        },
      }
    },
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    { name: 'name', type: 'text', required: true, label: 'Nome Completo' },
    { name: 'shortName', type: 'text', label: 'Nome Curto' },
    { name: 'slug', type: 'text', unique: true, index: true, required: true },
    { name: 'role', type: 'text', required: true, label: 'Cargo' },
    { name: 'oab', type: 'text', label: 'Inscrição OAB' },
    { name: 'email', type: 'email', label: 'E-mail' },
    { name: 'whatsapp', type: 'text', label: 'WhatsApp' },
    { name: 'bio', type: 'richText', label: 'Biografia' },
    { name: 'photo', type: 'upload', relationTo: 'media', label: 'Foto' },
    {
      name: 'practiceAreas',
      type: 'relationship',
      relationTo: 'practice-areas',
      hasMany: true,
      label: 'Áreas de Atuação',
    },
    { name: 'linkedin', type: 'text', label: 'LinkedIn' },
    { name: 'lattes', type: 'text', label: 'Lattes' },
    { name: 'order', type: 'number', defaultValue: 0, label: 'Ordem' },
    { name: 'active', type: 'checkbox', defaultValue: true, index: true, label: 'Ativo' },
    { name: 'showOnSite', type: 'checkbox', defaultValue: true, label: 'Exibir no site' },
    {
      name: 'formerMember',
      type: 'checkbox',
      defaultValue: false,
      label: 'Ex-integrante',
      admin: {
        description: 'Mantém autoria histórica em conteúdo antigo sem exibir no site.',
      },
    },
  ],
}
