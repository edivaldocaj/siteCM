import type { Access, FieldAccess } from 'payload'

type AccessArgs = Parameters<Access>[0]
type RoleCarrier = { role?: unknown; roles?: unknown }

const getRoles = (user: AccessArgs['req']['user']): string[] => {
  if (!user) return []

  const roleCarrier = user as RoleCarrier
  const roles = Array.isArray(roleCarrier.roles) ? roleCarrier.roles.filter((role): role is string => typeof role === 'string') : []
  const legacyRole = typeof roleCarrier.role === 'string' ? [roleCarrier.role] : []

  return [...roles, ...legacyRole]
}

export const anyone: Access = () => true

export const authenticated: Access = ({ req: { user } }) => Boolean(user)

export const adminOnly: Access = ({ req: { user } }) => getRoles(user).includes('admin')

export const fieldAdminOnly: FieldAccess = ({ req: { user } }) => getRoles(user).includes('admin')

export const adminOrEditor: Access = ({ req: { user } }) =>
  getRoles(user).some((role) => ['admin', 'editor'].includes(role))

export const adminOrStaff: Access = ({ req: { user } }) =>
  getRoles(user).some((role) => ['admin', 'staff'].includes(role))

export const fieldAdminOrStaff: FieldAccess = ({ req: { user } }) =>
  getRoles(user).some((role) => ['admin', 'staff'].includes(role))

export const adminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (getRoles(user).includes('admin')) return true

  return {
    id: {
      equals: user.id,
    },
  }
}

export const publishedOnly: Access = ({ req: { user } }) => {
  if (user) return true

  return {
    status: {
      equals: 'published',
    },
  }
}

export const approvedOnly: Access = ({ req: { user } }) => {
  if (user) return true

  return {
    approved: {
      equals: true,
    },
  }
}

export const activeCampaignOnly: Access = ({ req: { user } }) => {
  if (user) return true

  return {
    status: {
      equals: 'active',
    },
  }
}

export const ownClientData: Access = ({ req: { user } }) => {
  if (!user) return false
  if (getRoles(user).some((role) => ['admin', 'staff'].includes(role))) return true

  return {
    client: {
      equals: user.id,
    },
  }
}


