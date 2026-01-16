
/**
 * React Hooks for Database Access
 * Replaces mock data hooks with real Supabase queries
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { db, User, Organization, Profile, Event, Project, Task, Workspace, Notification } from './index'

// ============================================================================
// GENERIC HOOK TYPES
// ============================================================================

interface UseQueryResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

interface UseListResult<T> {
  data: T[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

// ============================================================================
// USER HOOKS
// ============================================================================

export function useUsers(options?: { organizationId?: string; limit?: number }): UseListResult<User> {
  const [data, setData] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const users = await db.getUsers(options)
      setData(users)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch users'))
    } finally {
      setLoading(false)
    }
  }, [options])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, loading, error, refetch: fetch }
}

export function useUser(id: string | null): UseQueryResult<User> {
  const [data, setData] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async () => {
    if (!id) {
      setData(null)
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const user = await db.getUserById(id)
      setData(user)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch user'))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, loading, error, refetch: fetch }
}

// ============================================================================
// ORGANIZATION HOOKS
// ============================================================================

export function useOrganizations(options?: { limit?: number }): UseListResult<Organization> {
  const [data, setData] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const orgs = await db.getOrganizations(options)
      setData(orgs)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch organizations'))
    } finally {
      setLoading(false)
    }
  }, [options])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, loading, error, refetch: fetch }
}

export function useOrganization(id: string | null): UseQueryResult<Organization> {
  const [data, setData] = useState<Organization | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async () => {
    if (!id) {
      setData(null)
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const org = await db.getOrganizationById(id)
      setData(org)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch organization'))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, loading, error, refetch: fetch }
}

// ============================================================================
// PROFILE HOOKS
// ============================================================================

export function useProfiles(options?: { type?: string; limit?: number }): UseListResult<Profile> {
  const [data, setData] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const profiles = await db.getProfiles(options)
      setData(profiles)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch profiles'))
    } finally {
      setLoading(false)
    }
  }, [options])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, loading, error, refetch: fetch }
}

export function useProfile(id: string | null): UseQueryResult<Profile> {
  const [data, setData] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async () => {
    if (!id) {
      setData(null)
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const profile = await db.getProfileById(id)
      setData(profile)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, loading, error, refetch: fetch }
}

export function useProfileByHandle(handle: string | null): UseQueryResult<Profile> {
  const [data, setData] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async () => {
    if (!handle) {
      setData(null)
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const profile = await db.getProfileByHandle(handle)
      setData(profile)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'))
    } finally {
      setLoading(false)
    }
  }, [handle])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, loading, error, refetch: fetch }
}

// ============================================================================
// EVENT HOOKS
// ============================================================================

export function useEvents(options?: { status?: string; projectId?: string; limit?: number }): UseListResult<Event> {
  const [data, setData] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const events = await db.getEvents(options)
      setData(events)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch events'))
    } finally {
      setLoading(false)
    }
  }, [options])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, loading, error, refetch: fetch }
}

export function useEvent(id: string | null): UseQueryResult<Event> {
  const [data, setData] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async () => {
    if (!id) {
      setData(null)
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const event = await db.getEventById(id)
      setData(event)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch event'))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, loading, error, refetch: fetch }
}

export function useUpcomingEvents(limit = 10): UseListResult<Event> {
  const [data, setData] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const events = await db.getUpcomingEvents(limit)
      setData(events)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch upcoming events'))
    } finally {
      setLoading(false)
    }
  }, [limit])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, loading, error, refetch: fetch }
}

// ============================================================================
// PROJECT HOOKS
// ============================================================================

export function useProjects(options?: { organizationId?: string; phase?: string; limit?: number }): UseListResult<Project> {
  const [data, setData] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const projects = await db.getProjects(options)
      setData(projects)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch projects'))
    } finally {
      setLoading(false)
    }
  }, [options])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, loading, error, refetch: fetch }
}

export function useProject(id: string | null): UseQueryResult<Project> {
  const [data, setData] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async () => {
    if (!id) {
      setData(null)
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const project = await db.getProjectById(id)
      setData(project)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch project'))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, loading, error, refetch: fetch }
}

// ============================================================================
// TASK HOOKS
// ============================================================================

export function useTasks(options?: { 
  organizationId?: string
  projectId?: string
  assignedTo?: string
  status?: string
  limit?: number 
}): UseListResult<Task> {
  const [data, setData] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const tasks = await db.getTasks(options)
      setData(tasks)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch tasks'))
    } finally {
      setLoading(false)
    }
  }, [options])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, loading, error, refetch: fetch }
}

export function useTask(id: string | null): UseQueryResult<Task> {
  const [data, setData] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async () => {
    if (!id) {
      setData(null)
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const task = await db.getTaskById(id)
      setData(task)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch task'))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, loading, error, refetch: fetch }
}

// ============================================================================
// WORKSPACE HOOKS
// ============================================================================

export function useWorkspaces(options?: { organizationId?: string; limit?: number }): UseListResult<Workspace> {
  const [data, setData] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const workspaces = await db.getWorkspaces(options)
      setData(workspaces)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch workspaces'))
    } finally {
      setLoading(false)
    }
  }, [options])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, loading, error, refetch: fetch }
}

export function useWorkspace(id: string | null): UseQueryResult<Workspace> {
  const [data, setData] = useState<Workspace | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async () => {
    if (!id) {
      setData(null)
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      setError(null)
      const workspace = await db.getWorkspaceById(id)
      setData(workspace)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch workspace'))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetch()
  }, [fetch])

  return { data, loading, error, refetch: fetch }
}

// ============================================================================
// NOTIFICATION HOOKS
// ============================================================================

export function useNotifications(options?: { userId?: string; unreadOnly?: boolean; limit?: number }): UseListResult<Notification> & {
  markRead: (id: string) => Promise<void>
  markAllRead: () => Promise<void>
  unreadCount: number
} {
  const [data, setData] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const notifications = await db.getNotifications(options)
      setData(notifications)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch notifications'))
    } finally {
      setLoading(false)
    }
  }, [options])

  useEffect(() => {
    fetch()
  }, [fetch])

  const markRead = useCallback(async (id: string) => {
    await db.markNotificationRead(id)
    setData(prev => prev.map(n => n.id === id ? { ...n, is_read: true, read_at: new Date().toISOString() } : n))
  }, [])

  const markAllRead = useCallback(async () => {
    if (options?.userId) {
      await db.markAllNotificationsRead(options.userId)
      setData(prev => prev.map(n => ({ ...n, is_read: true, read_at: new Date().toISOString() })))
    }
  }, [options?.userId])

  const unreadCount = data.filter(n => !n.is_read).length

  return { data, loading, error, refetch: fetch, markRead, markAllRead, unreadCount }
}
