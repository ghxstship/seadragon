'use client'

import { useState, useCallback, useMemo, memo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Calendar as CalendarIcon,
  CheckCircle,
  Plus,
  Users,
  DollarSign,
  AlertCircle,
  MapPin,
  Ticket
} from 'lucide-react'
import { Edit, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

import { db, Event as DbEvent } from '@/lib/db'
import { logger } from '@/lib/logger'
import { ErrorBoundary } from '@/lib/error-handling'
import { useEventContext } from '@/lib/contexts/EventContext'

type CreateEventInput = {
  name: string
  slug: string
  project_id?: string | null
  start_date?: string | null
  end_date?: string | null
  status: string
}

interface EventManagerProps {
  initialEvents?: DbEvent[]
  onEventCreate?: (event: DbEvent) => void
  onEventUpdate?: (event: DbEvent) => void
  onEventDelete?: (eventId: string) => void
}

export function EventManager({
  initialEvents = [],
  onEventCreate,
  onEventUpdate,
  onEventDelete
}: EventManagerProps) {

  const supabase = createClient()

  const props: Partial<EventManagerProps> = { initialEvents }
  if (onEventCreate) props.onEventCreate = onEventCreate
  if (onEventUpdate) props.onEventUpdate = onEventUpdate
  if (onEventDelete) props.onEventDelete = onEventDelete

  return (
    <ErrorBoundary>
      <EventManagerInner {...(props as EventManagerProps)} />
    </ErrorBoundary>
  )
}

function EventManagerInner({
  initialEvents,
  onEventCreate,
  onEventUpdate,
  onEventDelete
}: EventManagerProps) {
  const {
    events,
    venues,
    loading,
    error,
    createEvent: contextCreateEvent,
    updateEvent: contextUpdateEvent,
    deleteEvent: contextDeleteEvent,
    upcomingEvents,
    featuredEvents,
    totalEvents,
    publishedEvents
  } = useEventContext()

  const [activeTab, setActiveTab] = useState('overview')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<DbEvent | null>(null)
  const [newEvent, setNewEvent] = useState<CreateEventInput>({
    name: '',
    slug: '',
    start_date: null,
    end_date: null,
    status: 'draft'
  })

  // Memoized computed values for performance
  const memoizedUpcomingEvents = useMemo(() => events
    .filter(e => !!e.start_date)
    .filter(e => new Date(e.start_date as string).getTime() > Date.now())
    .slice(0, 9), [events])

  const localFeaturedEvents: DbEvent[] = []

  const localTotalEvents = events.length
  const publishedEventsMemo = useMemo(() => events.filter(e => e.status === 'published').length, [events])

  // Memoized event handlers for performance
  const handleCreateEvent = useCallback(async () => {
    const created = await contextCreateEvent(newEvent)
    if (created) {
      setShowCreateDialog(false)
      setNewEvent({ name: '', slug: '', status: 'draft' })
      onEventCreate?.(created)
    }
  }, [contextCreateEvent, newEvent, onEventCreate])

  const handleUpdateEvent = useCallback(async (event: DbEvent) => {
    const updated = await contextUpdateEvent(event.id, event)
    if (updated) {
      setShowEditDialog(false)
      setSelectedEvent(null)
      onEventUpdate?.(updated)
    }
  }, [contextUpdateEvent, onEventUpdate])

  const handleDeleteEvent = useCallback(async (eventId: string) => {
    const success = await contextDeleteEvent(eventId)
    if (success) {
      if (selectedEvent?.id === eventId) {
        setSelectedEvent(null)
      }
      onEventDelete?.(eventId)
    }
  }, [contextDeleteEvent, selectedEvent?.id, onEventDelete])

  const getTotalTicketsSold = (_event: DbEvent) => 0

  const getTotalRevenue = (_event: DbEvent) => 0

  const EventCard = ({ event }: { event: DbEvent }) => (
    <Card>
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4 text-muted-foreground"/>
              <span className="text-sm text-muted-foreground">
                {event.start_date ? new Date(event.start_date).toLocaleDateString() : 'TBD'} - 
                {event.end_date ? new Date(event.end_date).toLocaleDateString() : 'TBD'}
              </span>
            </div>
            <Badge variant={event.status === 'published' ? 'default' : 'secondary'}>{event.status}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6" role="main" aria-labelledby="event-manager-heading">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 id="event-manager-heading" className="text-3xl font-display font-bold">G H X S T S H I P Event Management</h1>
          <p className="text-muted-foreground">Manage ATLVS 3.0 festival events and venues</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button aria-label="Create new G H X S T S H I P event">
              <Plus className="h-4 w-4 mr-2" aria-hidden="true"/>
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New G H X S T S H I P Event</DialogTitle>
              <DialogDescription>
                Add a new event to the ATLVS 3.0 festival portfolio
              </DialogDescription>
            </DialogHeader>
            <CreateEventForm
              event={newEvent}
              onChange={setNewEvent}
              onSave={handleCreateEvent}
              onCancel={() => setShowCreateDialog(false)}/>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{events.length}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-accent-primary"/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">On Sale</p>
                <p className="text-2xl font-bold">{events.filter(e => e.status === 'published').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-semantic-success"/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Capacity</p>
                <p className="text-2xl font-bold">
                  0
                </p>
              </div>
              <Users className="h-8 w-8 text-accent-primary"/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Projected Revenue</p>
                <p className="text-2xl font-bold">
                  ${events.reduce((total, event) => total + getTotalRevenue(event), 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-semantic-success"/>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">All Events</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All G H X S T S H I P Events</CardTitle>
              <CardDescription>Complete ATLVS 3.0 festival portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4"/>
                  <h3 className="text-xl font-semibold mb-2">No events yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first G H X S T S H I P event to start building the ATLVS 3.0 festival portfolio.
                  </p>
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2"/>
                    Create First Event
                  </Button>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {events.map(event => (
                    <EventCard key={event.id} event={event}/>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Events happening soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event) => (
                  <EventCard key={event.id} event={event}/>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="featured" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Featured Events</CardTitle>
              <CardDescription>Highlighted ATLVS 3.0 festivals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredEvents.map((event) => (
                  <EventCard key={event.id} event={event}/>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="planning" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Events in Planning</CardTitle>
              <CardDescription>Events currently being developed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.filter(e => e.status === 'draft').map(event => (
                  <EventCard key={event.id} event={event}/>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Event Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit G H X S T S H I P Event</DialogTitle>
            <DialogDescription>
              Update event details for the ATLVS 3.0 portfolio
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <EditEventForm
              event={selectedEvent}
              onChange={setSelectedEvent}
              onSave={() => handleUpdateEvent(selectedEvent)}
              onCancel={() => setShowEditDialog(false)}
              isEditing/>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Create Event Form Component
interface CreateEventFormProps {
  event: CreateEventInput
  onChange: (event: CreateEventInput) => void
  onSave: () => void
  onCancel: () => void
}

function CreateEventForm({ event, onChange, onSave, onCancel }: CreateEventFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Event Name *</Label>
          <Input
            id="name"
            value={event.name}
            onChange={(e) => onChange({ ...event, name: e.target.value })}
            placeholder="Enter event name"/>
        </div>

        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={event.slug}
            onChange={(e) => onChange({ ...event, slug: e.target.value })}
            placeholder="my-event-slug"/>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Start Date</Label>
            <Input
              type="datetime-local"
              value={event.start_date ?? ''}
              onChange={(e) => onChange({ ...event, start_date: e.target.value || null })}
            />
          </div>
          <div>
            <Label>End Date</Label>
            <Input
              type="datetime-local"
              value={event.end_date ?? ''}
              onChange={(e) => onChange({ ...event, end_date: e.target.value || null })}
            />
          </div>
        </div>

        <div>
          <Label>Status</Label>
          <Select value={event.status} onValueChange={(value) => onChange({ ...event, status: value })}>
            <SelectTrigger>
              <SelectValue/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={onSave}>Create Event</Button>
      </DialogFooter>
    </div>
  )
}

// Edit Event Form Component
interface EditEventFormProps {
  event: DbEvent
  onChange: (event: DbEvent) => void
  onSave: () => void
  onCancel: () => void
  isEditing?: boolean
}

function EditEventForm({ event, onChange, onSave, onCancel, isEditing }: EditEventFormProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(event.start_date ? new Date(event.start_date) : undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(event.end_date ? new Date(event.end_date) : undefined)

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="dates">Dates & Status</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div>
            <Label htmlFor="name">Event Name *</Label>
            <Input
              id="name"
              value={event.name || ''}
              onChange={(e) => onChange({ ...event, name: e.target.value })}
              placeholder="Enter event name"/>
          </div>

          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={event.slug || ''}
              onChange={(e) => onChange({ ...event, slug: e.target.value })}
              placeholder="my-event-slug"/>
          </div>
        </TabsContent>

        <TabsContent value="dates" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4"/>
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={(date) => {
                      setStartDate(date)
                      onChange({
                        ...event,
                        start_date: (date ?? new Date()).toISOString(),
                      })
                    }}
                    initialFocus/>
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4"/>
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      setEndDate(date)
                      onChange({
                        ...event,
                        end_date: (date ?? new Date()).toISOString(),
                      })
                    }}
                    initialFocus/>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <div>
            <Label>Status</Label>
            <Select value={event.status} onValueChange={(value) => onChange({ ...event, status: value })}>
              <SelectTrigger>
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
            <h3 className="text-lg font-semibold mb-2">Ticket Tier Management</h3>
            <p className="text-muted-foreground mb-4">
              Advanced ticket management with pricing, availability, and sales tracking will be available in the full version.
            </p>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2"/>
              Add Ticket Tier
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onSave}>
          {isEditing ? 'Update Event' : 'Create Event'}
        </Button>
      </DialogFooter>
    </div>
  )
}
