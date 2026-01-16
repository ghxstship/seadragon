'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { logger } from './logger'
import { safeJsonParse } from './safe-json'
import { storage } from './storage'
import { useSession } from 'next-auth/react'

/// <reference path="../types/testing-library-matchers.d.ts" />

// Local interfaces for multi-tenancy
interface Organization {
  id: string
  name: string
  // Add other fields as needed
}

interface Workspace {
  id: string
  name: string
  // Add other fields as needed
}

interface Role {
  permissions: string | string[]
  // Add other fields as needed
}

interface UserOrganization extends Organization {
  id: string
  role: Role
  joinedAt: Date
  isActive: boolean
  branding?: {
    logo?: {
      primary?: string
      mark?: string
      favicon?: string
    }
  }
}

interface MultiTenancyContextType {
  currentOrganization: UserOrganization | null
  currentWorkspace: Workspace | null
  userOrganizations: UserOrganization[]
  availableWorkspaces: Workspace[]
  setCurrentOrganization: (org: UserOrganization) => void
  setCurrentWorkspace: (workspace: Workspace | null) => void
  refreshOrganizations: () => Promise<void>
  refreshWorkspaces: () => Promise<void>
  isLoading: boolean
}

const MultiTenancyContext = createContext<MultiTenancyContextType | undefined>(undefined)

export function MultiTenancyProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [currentOrganization, setCurrentOrganizationState] = useState<UserOrganization | null>(null)
  const [currentWorkspace, setCurrentWorkspaceState] = useState<Workspace | null>(null)
  const [userOrganizations, setUserOrganizations] = useState<UserOrganization[]>([])
  const [availableWorkspaces, setAvailableWorkspaces] = useState<Workspace[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadWorkspaces = useCallback(async (organizationId: string) => {
    try {
      const response = await fetch(`/api/organizations/${organizationId}/workspaces`)
      if (response.ok) {
        const workspaces: Workspace[] = await response.json()
        setAvailableWorkspaces(workspaces)

        // Set current workspace from session or default to first one
        if (session?.user?.organizationSlug) {
          // Try to find workspace based on some logic (could be stored in session)
          // For now, just set to null or first workspace
          if (workspaces.length > 0) {
            setCurrentWorkspaceState(workspaces[0])
          }
        }
      }
    } catch (error) {
      logger.error('Failed to load workspaces', error)
    }
  }, [session?.user?.organizationSlug])

  // Initialize organization and workspace from session
  const initializeFromSession = useCallback(async () => {
    try {
      setIsLoading(true)

      // Fetch user's organizations
      const orgsResponse = await fetch('/api/user/organizations')
      if (orgsResponse.ok) {
        const orgs: UserOrganization[] = await orgsResponse.json()
        setUserOrganizations(orgs)

        // Set current organization from session or default to first active one
        if (session?.user?.organizationId) {
          const currentOrg = orgs.find(org => org.id === session.user.organizationId && org.isActive)
          if (currentOrg) {
            setCurrentOrganizationState(currentOrg)
            await loadWorkspaces(currentOrg.id)
          }
        } else if (orgs.length > 0) {
          const defaultOrg = orgs.find(org => org.isActive) || orgs[0]
          setCurrentOrganizationState(defaultOrg)
          await loadWorkspaces(defaultOrg.id)
        }
      }
    } catch (error) {
      logger.error('Failed to initialize multi-tenancy context', error)
    } finally {
      setIsLoading(false)
    }
  }, [loadWorkspaces, session?.user?.organizationId])

  useEffect(() => {
    initializeFromSession()
  }, [initializeFromSession])

  const setCurrentOrganization = async (org: UserOrganization) => {
    setCurrentOrganizationState(org)
    setCurrentWorkspaceState(null) // Reset workspace when changing org

    // Update session with new organization
    await fetch('/api/auth/switch-organization', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organizationId: org.id })
    })

    await loadWorkspaces(org.id)
  }

  const setCurrentWorkspace = async (workspace: Workspace | null) => {
    setCurrentWorkspaceState(workspace)

    // Store workspace preference
    if (workspace) {
      storage.local.set('currentWorkspaceId', workspace.id)
    } else {
      storage.local.remove('currentWorkspaceId')
    }
  }

  const refreshOrganizations = async () => {
    try {
      const response = await fetch('/api/user/organizations')
      if (response.ok) {
        const orgs: UserOrganization[] = await response.json()
        setUserOrganizations(orgs)
      }
    } catch (error) {
      logger.error('Failed to refresh organizations', error)
    }
  }

  const refreshWorkspaces = async () => {
    if (currentOrganization) {
      await loadWorkspaces(currentOrganization.id)
    }
  }

  const value: MultiTenancyContextType = {
    currentOrganization,
    currentWorkspace,
    userOrganizations,
    availableWorkspaces,
    setCurrentOrganization,
    setCurrentWorkspace,
    refreshOrganizations,
    refreshWorkspaces,
    isLoading
  }

  return (
    <MultiTenancyContext.Provider value={value}>
      {children}
    </MultiTenancyContext.Provider>
  )
}

export function useMultiTenancy() {
  const context = useContext(MultiTenancyContext)
  if (context === undefined) {
    throw new Error('useMultiTenancy must be used within a MultiTenancyProvider')
  }
  return context
}

// Hook for checking permissions
export function usePermissions() {
  const { currentOrganization, userOrganizations } = useMultiTenancy()

  const hasPermission = (permission: string): boolean => {
    if (!currentOrganization) return false

    // Find user's role for current organization
    const userOrg = userOrganizations.find((org: UserOrganization) => org.id === currentOrganization.id)
    if (!userOrg?.role?.permissions) return false

    // Check if permission is in the role's permissions array
    const permissions = Array.isArray(userOrg.role.permissions)
      ? userOrg.role.permissions
      : safeJsonParse(userOrg.role.permissions || '[]') || []

    return permissions.includes(permission)
  }

  const hasAnyPermission = (permissions: string[]): boolean => {
    return permissions.some(permission => hasPermission(permission))
  }

  const hasAllPermissions = (permissions: string[]): boolean => {
    return permissions.every(permission => hasPermission(permission))
  }

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  }
}
