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
    description: 'Profissionais exibidos no site e usados como autores/responsáveis no CMS.',
    group: 'Escritório',
    listSearchableFields: ['name', 'shortName', 'oab', 'email'],
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
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Perfil',
          description: 'Informações públicas do profissional.',
          fields: [
            { name: 'name', type: 'text', required: true, label: 'Nome Completo' },
            { name: 'shortName', type: 'text', label: 'Nome Curto', admin: { description: 'Usado em cards e assinaturas compactas.' } },
            {
              name: 'slug',
              type: 'text',
              unique: true,
              index: true,
              required: true,
              label: 'Slug da URL',
              admin: { position: 'sidebar' },
            },
            { name: 'role', type: 'text', required: true, label: 'Cargo' },
            { name: 'oab', type: 'text', label: 'Inscrição OAB' },
            { name: 'bio', type: 'richText', label: 'Biografia' },
            {
              name: 'photo',
              type: 'upload',
              relationTo: 'media',
              label: 'Foto',
              admin: { description: 'Foto profissional em boa luz, preferencialmente vertical ou quadrada.' },
            },
          ],
        },
        {
          label: 'Contato e Links',
          description: 'Canais profissionais usados no site e internamente.',
          fields: [
            { name: 'email', type: 'email', label: 'E-mail' },
            { name: 'whatsapp', type: 'text', label: 'WhatsApp' },
            { name: 'linkedin', type: 'text', label: 'LinkedIn' },
            { name: 'lattes', type: 'text', label: 'Lattes' },
          ],
        },
        {
          label: 'Atuação',
          description: 'Relação com áreas do site e controle de exibição.',
          fields: [
            {
              name: 'practiceAreas',
              type: 'relationship',
              relationTo: 'practice-areas',
              hasMany: true,
              label: 'Áreas de Atuação',
            },
            { name: 'order', type: 'number', defaultValue: 0, label: 'Ordem', admin: { position: 'sidebar' } },
            { name: 'active', type: 'checkbox', defaultValue: true, index: true, label: 'Ativo', admin: { position: 'sidebar' } },
            { name: 'showOnSite', type: 'checkbox', defaultValue: true, label: 'Exibir no site', admin: { position: 'sidebar' } },
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
        },
      ],
    },
  ],
}
