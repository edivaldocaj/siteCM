import { NextRequest, NextResponse } from 'next/server'

export type AdminRole = 'admin' | 'editor' | 'staff'

type MeResponse = {
  user?: {
    id?: string | number
    role?: string
    roles?: string[]
  } | null
}

export const getPayloadUserFromRequest = async (req: NextRequest): Promise<MeResponse['user']> => {
  const meUrl = new URL('/api/users/me', req.nextUrl.origin)
  const response = await fetch(meUrl, {
    headers: {
      cookie: req.headers.get('cookie') || '',
    },
    cache: 'no-store',
  })

  if (!response.ok) return null

  const data = (await response.json()) as MeResponse
  return data.user || null
}

export const getUserRoles = (user: MeResponse['user']): string[] => {
  if (!user) return []

  const roles = Array.isArray(user.roles) ? user.roles : []
  const legacyRole = typeof user.role === 'string' ? [user.role] : []

  return [...roles, ...legacyRole]
}

export const requireAdminRole = async (
  req: NextRequest,
  allowedRoles: AdminRole[] = ['admin'],
): Promise<NextResponse | null> => {
  const user = await getPayloadUserFromRequest(req)
  if (!user) {
    return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
  }

  const roles = getUserRoles(user)
  if (!roles.some((role) => allowedRoles.includes(role as AdminRole))) {
    return NextResponse.json({ error: 'Acesso negado.' }, { status: 403 })
  }

  return null
}
