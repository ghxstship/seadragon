'use client'

import { ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { Role } from '@/config/navigation'

interface RoleGuardProps {
  allowed: Role[]
  children: ReactNode
}

export function RoleGuard({ allowed, children }: RoleGuardProps) {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="flex h-full w-full items-center justify-center py-12 text-sm text-muted-foreground">
        Checking access…
      </div>
    )
  }

  const role = (session?.user?.role as Role) || 'guest'
  if (!allowed.includes(role)) {
    return (
      <div className="flex h-full w-full items-center justify-center py-12 text-center text-sm text-muted-foreground">
        Access denied for your role.
      </div>
    )
  }

  return <>{children}</>
}
