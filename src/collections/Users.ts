import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrSelf, fieldAdminOnly } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: {
    read: adminOnly,
    create: adminOnly,
    update: adminOrSelf,
    delete: adminOnly,
  },
  admin: { useAsTitle: 'email', group: 'Sistema' },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      options: ['admin', 'editor', 'staff', 'client'],
      defaultValue: ['client'],
      required: true,
      saveToJWT: true,
      access: { update: fieldAdminOnly },
    },
    {
      name: 'role',
      type: 'select',
      options: ['admin', 'editor'],
      defaultValue: 'editor',
      admin: { description: 'Campo legado. Use roles para novas permissões.' },
      access: { update: fieldAdminOnly },
    },
  ],
}


