/**
 * Event Management Context and Hook
 * Centralized state management for events and venues data
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { logger } from '@/lib/logger'
import { db, Event, Venue } from '@/lib/db'

/**
 * Interface for the Event Context
 * Provides centralized access to events, venues, and related operations
 */
interface EventContextType {
  // Data
  /** Array of all events */
  events: DbEvent[]
  /** Array of all venues */
  venues: DbVenue[]
  /** Loading state for async operations */
  loading: boolean
  /** Error message if any operation failed */
  error: string | null

  // Actions
  /** Refreshes the events data from the API */
  refreshEvents: () => Promise<void>
  /** Refreshes the venues data from the database */
  refreshVenues: () => Promise<void>
  /** Creates a new event */
  createEvent: (eventData: CreateEventInput) => Promise<DbEvent | null>
  /** Updates an existing event */
  updateEvent: (eventId: string, eventData: Partial<DbEvent>) => Promise<DbEvent | null>
  /** Deletes an event by ID */
  deleteEvent: (eventId: string) => Promise<boolean>

  // Computed values
  /** Events that are upcoming (within next 9 events) */
  upcomingEvents: DbEvent[]
  /** Events marked as featured */
  featuredEvents: DbEvent[]
  /** Total number of events */
  totalEvents: number
  /** Number of published events */
  publishedEvents: number
}

/**
 * Input type for creating new events
 */
type CreateEventInput = {
  /** Event name */
  name: string
  /** URL-friendly slug for the event */
  slug: string
  /** Optional project ID this event belongs to */
  project_id?: string | null
  /** Optional start date in ISO string format */
  start_date?: string | null
  /** Optional end date in ISO string format */
  end_date?: string | null
  /** Event status ('draft' or 'published') */
  status: string
}

const EventContext = createContext<EventContextType | undefined>(undefined)

/**
 * Props for the EventProvider component
 */
interface EventProviderProps {
  /** Child components to render */
  children: ReactNode
  /** Optional initial events data */
  initialEvents?: DbEvent[]
  /** Optional initial venues data */
  initialVenues?: DbVenue[]
}

/**
 * EventProvider component that provides event management context to child components
 *
 * @param children - Child components to render
 * @param initialEvents - Optional initial events data to preload
 * @param initialVenues - Optional initial venues data to preload
 */
export function EventProvider({
  children,
  initialEvents = [],
  initialVenues = []
}: EventProviderProps) {
  const [events, setEvents] = useState<DbEvent[]>(initialEvents)
  const [venues, setVenues] = useState<DbVenue[]>(initialVenues)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshEvents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/v1/ghxstship/events?limit=100')
      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.status}`)
      }
      const data = await response.json()
      const eventsData = Array.isArray(data?.events) ? data.events as DbEvent[] : []
      setEvents(eventsData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load events'
      setError(errorMessage)
      logger.error('Failed to refresh events', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshVenues = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const venuesData = await db.getVenues({ limit: 200 })
      setVenues(venuesData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load venues'
      setError(errorMessage)
      logger.error('Failed to refresh venues', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const createEvent = useCallback(async (eventData: CreateEventInput): Promise<DbEvent | null> => {
    try {
      setError(null)
      const response = await fetch('/api/v1/ghxstship/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      })

      if (!response.ok) {
        throw new Error(`Create event failed: ${response.status}`)
      }

      const payload = await response.json()
      const created = payload?.event as DbEvent
      setEvents(prev => [created, ...prev])
      return created
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create event'
      setError(errorMessage)
      logger.error('Failed to create event', err)
      return null
    }
  }, [])

  const updateEvent = useCallback(async (eventId: string, eventData: Partial<DbEvent>): Promise<DbEvent | null> => {
    try {
      setError(null)
      const response = await fetch(`/api/v1/ghxstship/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      })

      if (!response.ok) {
        throw new Error(`Update event failed: ${response.status}`)
      }

      const payload = await response.json()
      const updated = (payload?.event) as DbEvent
      setEvents(prev => prev.map(e => e.id === eventId ? updated : e))
      return updated
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update event'
      setError(errorMessage)
      logger.error('Failed to update event', err)
      return null
    }
  }, [])

  const deleteEvent = useCallback(async (eventId: string): Promise<boolean> => {
    try {
      setError(null)
      const response = await fetch(`/api/v1/ghxstship/events/${eventId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error(`Delete event failed: ${response.status}`)
      }

      setEvents(prev => prev.filter(e => e.id !== eventId))
      return true
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete event'
      setError(errorMessage)
      logger.error('Failed to delete event', err)
      return false
    }
  }, [])

  // Computed values
  const upcomingEvents = events
    .filter(e => !!e.start_date)
    .filter(e => new Date(e.start_date as string).getTime() > Date.now())
    .slice(0, 9)

  const featuredEvents: DbEvent[] = []

  const totalEvents = events.length
  const publishedEvents = events.filter(e => e.status === 'published').length

  // Initial data load
  useEffect(() => {
    if (initialEvents.length === 0) {
      refreshEvents()
    }
    if (initialVenues.length === 0) {
      refreshVenues()
    }
  }, [initialEvents.length, initialVenues.length, refreshEvents, refreshVenues])

  const value: EventContextType = {
    events,
    venues,
    loading,
    error,
    refreshEvents,
    refreshVenues,
    createEvent,
    updateEvent,
    deleteEvent,
    upcomingEvents,
    featuredEvents,
    totalEvents,
    publishedEvents
  }

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  )
}

export function useEventContext(): EventContextType {
  const context = useContext(EventContext)
  if (context === undefined) {
    throw new Error('useEventContext must be used within an EventProvider')
  }
  return context
}

// Convenience hooks for specific data
export function useEvents() {
  const { events, refreshEvents } = useEventContext()
  return { events, refreshEvents }
}

export function useVenues() {
  const { venues, refreshVenues } = useEventContext()
  return { venues, refreshVenues }
}

export function useEventStats() {
  const { totalEvents, publishedEvents, upcomingEvents, featuredEvents } = useEventContext()
  return { totalEvents, publishedEvents, upcomingEvents, featuredEvents }
}
