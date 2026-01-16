'use client'

import { ReactNode } from 'react'
import { Header } from '@/lib/design-system/patterns/header'
import { Sidebar } from '@/lib/design-system/patterns/sidebar'
import { AppBreadcrumbs } from '@/components/app/Breadcrumbs'
import { RoleGuard } from '@/components/app/RoleGuard'
import { Role } from '@/config/navigation'

interface DashboardShellProps {
  children: ReactNode
  allowed?: Role[]
}

export function DashboardShell({ children, allowed = ['member', 'manager', 'admin', 'super_admin', 'platform_dev'] }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header showAuth={false}/>
      <div className="flex">
        <Sidebar/>
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 py-6 space-y-4">
            <AppBreadcrumbs />
            <RoleGuard allowed={allowed}>
              {children}
            </RoleGuard>
          </div>
        </main>
      </div>
    </div>
  )
}
