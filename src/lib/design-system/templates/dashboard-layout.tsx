
'use client'

import { ReactNode } from 'react'
import { Header, Sidebar } from '@/lib/design-system'

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
  description?: string
}

export function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header showAuth={false} showDashboard={false}/>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar/>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-6 py-8">
            {/* Page Header */}
            {(title || description) && (
              <div className="mb-8">
                {title && (
                  <h1 className="text-3xl font-display font-bold text-foreground">
                    {title}
                  </h1>
                )}
                {description && (
                  <p className="mt-2 text-muted-foreground">
                    {description}
                  </p>
                )}
              </div>
            )}

            {/* Page Content */}
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
