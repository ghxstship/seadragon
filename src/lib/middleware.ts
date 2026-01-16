
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'

// Extend globalThis with our custom properties
declare global {
  var currentUserId: string | undefined
  var currentUserRole: string | undefined
  var currentOrganizationId: string | undefined
}

// Organization context helpers
function setOrganizationContext(organizationId: string) {
  globalThis.currentOrganizationId = organizationId
}

function clearOrganizationContext() {
  globalThis.currentOrganizationId = undefined
}

export async function withOrganizationContext(
  handler: (request: NextRequest) => Promise<NextResponse> | NextResponse,
  options: { requireAuth?: boolean } = { requireAuth: true }
) {
  return async (request: NextRequest) => {
    try {
      const session = await auth()

      if (options.requireAuth && !session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      if (session?.user?.organizationId) {
        setOrganizationContext(session.user.organizationId)
        // Set user context for permission checking
        globalThis.currentUserId = session.user.id
        globalThis.currentUserRole = session.user.role
      }

      const response = await handler(request)

      // Clear context after request
      clearOrganizationContext()
      globalThis.currentUserId = undefined
      globalThis.currentUserRole = undefined

      return response
    } catch (error) {
      clearOrganizationContext()
      globalThis.currentUserId = undefined
      globalThis.currentUserRole = undefined
      throw error
    }
  }
}

// Higher-order function for API route handlers
export function withOrgContext(
  handler: (request: NextRequest, context?: unknown) => Promise<NextResponse> | NextResponse,
  options: { requireAuth?: boolean } = { requireAuth: true }
) {
  return async (request: NextRequest, context?: unknown) => {
    try {
      const session = await auth()

      if (options.requireAuth && !session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      if (session?.user?.organizationId) {
        setOrganizationContext(session.user.organizationId)
        // Set user context for permission checking
        globalThis.currentUserId = session.user.id
        globalThis.currentUserRole = session.user.role
      }

      const response = await handler(request, context)

      // Clear context after request
      clearOrganizationContext()
      globalThis.currentUserId = undefined
      globalThis.currentUserRole = undefined

      return response
    } catch (error) {
      clearOrganizationContext()
      globalThis.currentUserId = undefined
      globalThis.currentUserRole = undefined
      throw error
    }
  }
}
