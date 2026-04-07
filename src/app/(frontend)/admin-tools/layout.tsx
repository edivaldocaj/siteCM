'use client'

import { AdminAuthProvider, useAdminAuth } from '@/components/admin/AdminAuthContext'
import { AdminLoginGate } from '@/components/admin/AdminLoginGate'

function AdminGateWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAdminAuth()

  if (!isAuthenticated) {
    return <AdminLoginGate />
  }

  return <>{children}</>
}

export default function AdminToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminGateWrapper>
        {children}
      </AdminGateWrapper>
    </AdminAuthProvider>
  )
}
