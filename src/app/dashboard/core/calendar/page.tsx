'use client'

import { useState, useEffect } from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { ViewSwitcher } from '@/lib/design-system/patterns/view-switcher'
import { useSupabase } from '@/contexts/SupabaseContext'
import { useSession } from 'next-auth/react'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: {
    'en-US': enUS,
  },
})

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  resource: {
    type: 'task' | 'programming' | 'work_order' | 'asset_booking' | 'people_availability'
    entityId: string
    status: string
    priority?: string
  }
}

interface ProgrammingRecord {
  id: string
  name: string
  event_date: string
  event_time: string
  duration?: {
    hours: number
  }
}

interface WorkOrderRecord {
  id: string
  title: string
  start_date: string
  end_date?: string
  status: string
}

interface CalendarEventRecord {
  id: string
  title: string
  start_time: string
  end_time: string
  event_type: string
  entity_id: string
  status: string
}

const eventTypeColors = {
  task: '#3b82f6', // blue
  programming: '#10b981', // green
  work_order: '#f59e0b', // amber
  asset_booking: '#8b5cf6', // purple
  people_availability: '#06b6d4', // cyan
}

export default function CalendarPage() {
  const { supabase } = useSupabase()
  const { data: session } = useSession()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleTypes, setVisibleTypes] = useState({
    task: true,
    programming: true,
    work_order: true,
    asset_booking: true,
    people_availability: true,
  })

  useEffect(() => {
    const loadEvents = async () => {
      if (!session?.user?.organizationId) return

      const orgId = session.user.organizationId

      // Load calendar events
      const { data: calendarEvents } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('organization_id', orgId)

      // Load tasks with dates
      const { data: tasks } = await supabase
        .from('tasks')
        .select('id, title, due_date, created_at, status, priority')
        .eq('organization_id', orgId)
        .not('due_date', 'is', null)

      // Load programming events
      const { data: programming } = await supabase
        .from('programming')
        .select('id, name, event_date, event_time, duration')
        .eq('organization_id', orgId)

      // Load work orders with dates
      const { data: workOrders } = await supabase
        .from('work_orders')
        .select('id, title, start_date, end_date, status')
        .eq('organization_id', orgId)
        .not('start_date', 'is', null)

      const allEvents: CalendarEvent[] = []

      // Convert tasks to events
      tasks?.forEach((task: any) => {
        allEvents.push({
          id: `task-${task.id}`,
          title: task.title,
          start: new Date(task.due_date),
          end: new Date(task.due_date),
          resource: {
            type: 'task',
            entityId: task.id,
            status: task.status,
            priority: task.priority
          }
        })
      })

      // Convert programming to events
      programming?.forEach((event: ProgrammingRecord) => {
        const startDateTime = new Date(`${event.event_date}T${event.event_time}`)
        const endDateTime = new Date(startDateTime.getTime() + (event.duration?.hours || 2) * 60 * 60 * 1000)

        allEvents.push({
          id: `programming-${event.id}`,
          title: event.name,
          start: startDateTime,
          end: endDateTime,
          resource: {
            type: 'programming',
            entityId: event.id,
            status: 'scheduled'
          }
        })
      })

      // Convert work orders to events
      workOrders?.forEach((wo: WorkOrderRecord) => {
        allEvents.push({
          id: `work_order-${wo.id}`,
          title: wo.title,
          start: new Date(wo.start_date),
          end: wo.end_date ? new Date(wo.end_date) : new Date(wo.start_date),
          resource: {
            type: 'work_order',
            entityId: wo.id,
            status: wo.status
          }
        })
      })

      // Convert calendar events
      calendarEvents?.forEach((event: CalendarEventRecord) => {
        allEvents.push({
          id: event.id,
          title: event.title,
          start: new Date(event.start_time),
          end: new Date(event.end_time),
          resource: {
            type: event.event_type as 'task' | 'programming' | 'work_order' | 'asset_booking' | 'people_availability',
            entityId: event.entity_id,
            status: event.status
          }
        })
      })

      setEvents(allEvents)
      setLoading(false)
    }

    loadEvents()
  }, [session, supabase])

  const filteredEvents = events.filter(event =>
    visibleTypes[event.resource.type]
  )

  const eventStyleGetter = (event: CalendarEvent) => {
    const color = eventTypeColors[event.resource.type]
    return {
      style: {
        backgroundColor: color,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    }
  }

  const EventComponent = ({ event }: { event: CalendarEvent }) => {
    return (
      <div className="text-xs p-1">
        <div className="font-medium truncate">{event.title}</div>
        <div className="flex items-center gap-1 mt-1">
          <Badge variant="secondary" className="text-xs px-1 py-0">
            {event.resource.type}
          </Badge>
          {event.resource.priority && (
            <Badge variant="outline" className="text-xs px-1 py-0">
              {event.resource.priority}
            </Badge>
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded mb-4"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-muted-foreground">
            Unified scheduling for all your organization&apos;s activities
          </p>
        </div>
        <ViewSwitcher
          currentView="calendar"
          availableViews={['calendar', 'list', 'table']}
          onViewChange={(_view) => {
            // Handle view switching - for now just calendar
          }}
        />
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Event Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {Object.entries(visibleTypes).map(([type, visible]) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={visible}
                  onCheckedChange={(checked) =>
                    setVisibleTypes(prev => ({ ...prev, [type]: checked }))
                  }
                />
                <label
                  htmlFor={type}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                  style={{ color: eventTypeColors[type as keyof typeof eventTypeColors] }}
                >
                  {type.replace('_', ' ')}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Calendar */}
      <Card>
        <CardContent className="p-0">
          <div style={{ height: '600px' }}>
            <Calendar
              localizer={localizer}
              events={filteredEvents}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              eventPropGetter={eventStyleGetter}
              components={{
                event: EventComponent
              }}
              views={['month', 'week', 'day', 'agenda']}
              defaultView="month"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
