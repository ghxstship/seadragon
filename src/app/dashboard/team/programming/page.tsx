'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ViewSwitcher, ViewType } from '@/lib/design-system/patterns/view-switcher'
import { useSupabase } from '@/contexts/SupabaseContext'
import { useSession } from 'next-auth/react'
import {
  Plus,
  Search,
  Calendar,
  Music,
  Clock,
  MapPin,
  Users,
  CheckCircle,
  AlertTriangle,
  Play
} from 'lucide-react'

interface ProgrammingEvent {
  id: string
  name: string
  event_date: string
  event_time: string
  duration: any // interval
  venue_id?: string
  project_id: string
  project?: { name: string }
  venue?: { name: string }
  technical_requirements?: any
  status: string
  created_at: string
}

export default function ProgrammingPage() {
  const { supabase } = useSupabase()
  const { data: session } = useSession()
  const [events, setEvents] = useState<ProgrammingEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [currentView, setCurrentView] = useState<ViewType>('table')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [projectFilter, setProjectFilter] = useState('all')
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    const loadData = async () => {
      if (!session?.user?.organizationId) return

      const orgId = session.user.organizationId

      // Load programming events
      const { data: eventsData, error: eventsError } = await supabase
        .from('programming')
        .select(`
          *,
          project:projects(name),
          venue:places(name)
        `)
        .eq('organization_id', orgId)
        .order('event_date', { ascending: true })

      if (eventsError) {
        console.error('Error loading events:', eventsError)
      } else {
        setEvents(eventsData || [])
      }

      // Load projects for filtering
      const { data: projectsData } = await supabase
        .from('projects')
        .select('id, name')
        .eq('organization_id', orgId)
        .order('name')

      setProjects(projectsData || [])
      setLoading(false)
    }

    loadData()
  }, [session, supabase])

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter
    const matchesProject = projectFilter === 'all' || event.project_id === projectFilter

    return matchesSearch && matchesStatus && matchesProject
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'active': return <Play className="h-4 w-4 text-blue-500" />
      case 'planning': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'cancelled': return <AlertTriangle className="h-4 w-4 text-red-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const formatDuration = (duration: any) => {
    if (!duration) return 'TBD'
    // Handle PostgreSQL interval - simplified for now
    return duration.hours ? `${duration.hours}h` : 'TBD'
  }

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-4">Event</th>
            <th className="text-left p-4">Project</th>
            <th className="text-left p-4">Date & Time</th>
            <th className="text-left p-4">Duration</th>
            <th className="text-left p-4">Venue</th>
            <th className="text-left p-4">Status</th>
            <th className="text-left p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.map(event => (
            <tr key={event.id} className="border-b hover:bg-muted/50">
              <td className="p-4">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    <Music className="h-4 w-4" />
                    {event.name}
                  </div>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <span>{event.project?.name || 'No Project'}</span>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(event.event_date).toLocaleDateString()}</span>
                  <Clock className="h-4 w-4 ml-2" />
                  <span>{event.event_time}</span>
                </div>
              </td>
              <td className="p-4">
                <span>{formatDuration(event.duration)}</span>
              </td>
              <td className="p-4">
                {event.venue?.name ? (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.venue.name}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">TBD</span>
                )}
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(event.status)}
                  <span className="capitalize">{event.status}</span>
                </div>
              </td>
              <td className="p-4">
                <Button variant="ghost" size="sm">Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredEvents.map(event => (
        <Card key={event.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Music className="h-5 w-5" />
                <CardTitle className="text-lg">{event.name}</CardTitle>
              </div>
              {getStatusIcon(event.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Project:</span>
                <span className="text-muted-foreground">{event.project?.name || 'None'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Date:</span>
                <span className="text-muted-foreground">
                  {new Date(event.event_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Time:</span>
                <span className="text-muted-foreground">{event.event_time}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Duration:</span>
                <span className="text-muted-foreground">{formatDuration(event.duration)}</span>
              </div>
              {event.venue?.name && (
                <div className="flex justify-between text-sm">
                  <span>Venue:</span>
                  <span className="text-muted-foreground">{event.venue.name}</span>
                </div>
              )}
            </div>
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const getStats = () => {
    const total = events.length
    const upcoming = events.filter(e => new Date(e.event_date) > new Date()).length
    const completed = events.filter(e => e.status === 'completed').length
    const planning = events.filter(e => e.status === 'planning').length

    return { total, upcoming, completed, planning }
  }

  const stats = getStats()

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded"></div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Programming</h1>
          <p className="text-muted-foreground">
            Event programming and creative planning across projects
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Event
          </Button>
          <ViewSwitcher
            currentView={currentView}
            availableViews={['table', 'board', 'calendar']}
            onViewChange={setCurrentView}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold">{stats.upcoming}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">In Planning</p>
                <p className="text-2xl font-bold">{stats.planning}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={projectFilter} onValueChange={setProjectFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map(project => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardContent className="p-0">
          {currentView === 'table' && renderTableView()}
          {currentView === 'board' && renderCardView()}
          {currentView === 'calendar' && (
            <div className="p-6 text-center text-muted-foreground">
              Calendar view coming soon
            </div>
          )}
        </CardContent>
      </Card>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No events found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== 'all' || projectFilter !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first event to start programming'}
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>
      )}
    </div>
  )
}
