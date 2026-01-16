
"use client"

import type { ReactNode } from 'react'

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  project?: string
  projectId?: string
  type?: string
  status?: 'pending' | 'scheduled' | 'confirmed'
  priority?: 'low' | 'medium' | 'high'
  assignedTo?: string[]
  location?: string
  description?: string
}

interface CalendarProps {
  events: CalendarEvent[]
  onSelectEvent?: (event: CalendarEvent) => void
  onSelectSlot?: (slotInfo: { start: Date; end: Date; slots: Date[] }) => void
  onEventDrop?: (args: { event: CalendarEvent; start: Date; end: Date }) => void
  onEventResize?: (args: { event: CalendarEvent; start: Date; end: Date }) => void
  view?: string
  onView?: (view: string) => void
  date?: Date
  onNavigate?: (date: Date, view: string) => void
  className?: string
  children?: ReactNode
}

export function Calendar({
  events,
  onSelectEvent,
  onSelectSlot,
  view,
  onView,
  date = new Date(),
  onNavigate,
  className = ''
}: CalendarProps) {
  return (
    <div className={`h-full ${className}`}>
      {/* Calendar component disabled - react-big-calendar removed */}
      <div className="flex items-center justify-center h-full">
        <p>Calendar component temporarily disabled</p>
      </div>
    </div>
  )
}

export default Calendar
