'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface AdminAuthContextType {
  token: string
  isAuthenticated: boolean
  login: (secret: string) => void
  logout: () => void
  /** Helper: retorna headers com Authorization para fetch */
  authHeaders: () => Record<string, string>
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  token: '',
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
  authHeaders: () => ({}),
})

export function useAdminAuth() {
  return useContext(AdminAuthContext)
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const login = useCallback((secret: string) => {
    setToken(secret)
    setIsAuthenticated(true)
  }, [])

  const logout = useCallback(() => {
    setToken('')
    setIsAuthenticated(false)
  }, [])

  const authHeaders = useCallback(() => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }), [token])

  return (
    <AdminAuthContext.Provider value={{ token, isAuthenticated, login, logout, authHeaders }}>
      {children}
    </AdminAuthContext.Provider>
  )
}
