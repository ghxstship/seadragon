
'use client'

import { logger } from '@/lib/logger'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Header } from "@/lib/design-system"
import { CommandBar } from "@/components/command-bar"
import { ViewsBar } from "@/components/views-bar"
import { Templates } from "@/components/templates/templates"
import { DatabaseViews } from "@/components/database/database-views"

interface EventApiResponse {
  id: string | number
  slug?: string
  name?: string
  description?: string
  start_date?: string
  end_date?: string
  venue?: string
  capacity?: number
  status?: string
  featured?: boolean
  ticket_price?: number
  images?: string[]
  categories?: string[]
  lineup?: string[]
}

interface EventData {
  slug: string
  name: string
  description: string
  date: string
  endDate?: string
  venue: string
  capacity: number
  status: string
  featured: boolean
  ticketPrice: number
  images: string[]
  categories: string[]
  lineup: string[]
}

interface EventData {
  slug: string
  name: string
  description: string
  date: string
  endDate?: string
  venue: string
  capacity: number
  status: string
  featured: boolean
  ticketPrice: number
  images: string[]
  categories: string[]
  lineup: string[]
}

export default function Events() {
  const [events, setEvents] = useState<EventData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadEvents = async () => {
      try {
        const res = await fetch('/api/v1/ghxstship/events?limit=50')
        if (res.ok) {
          const data = await res.json()
          const apiEvents = Array.isArray(data.events) ? data.events : []
          const mapped: EventData[] = apiEvents.map((e: EventApiResponse) => ({
            slug: String(e.slug || e.id),
            name: String(e.name || 'Untitled Event'),
            description: String(e.description || ''),
            date: e.start_date || '',
            endDate: e.end_date || undefined,
            venue: String(e.venue || ''),
            capacity: Number(e.capacity) || 100,
            status: String(e.status || 'upcoming'),
            featured: Boolean(e.featured),
            ticketPrice: Number(e.ticket_price) || 0,
            images: Array.isArray(e.images) ? e.images : [],
            categories: Array.isArray(e.categories) ? e.categories : [],
            lineup: Array.isArray(e.lineup) ? e.lineup : []
          }))
          if (!cancelled) {
            setEvents(mapped)
            setIsLoading(false)
          }
        } else {
          if (!cancelled) {
            setEvents([])
            setIsLoading(false)
          }
        }
      } catch (error) {
        logger.error('Error loading events:', error)
        if (!cancelled) {
          setEvents([])
          setIsLoading(false)
        }
      }
    }

    loadEvents()

    return () => {
      cancelled = true
    }
  }, [])

  const upcomingEvents = events.filter(event => !event.date || new Date(event.date) > new Date())
  const pastEvents = events.filter(event => event.date && new Date(event.date) <= new Date())

  return (
    <div className="min-h-screen bg-background">
      {/* Command Bar - Standardized across all pages */}
      <div className="sticky top-0 z-50">
        <CommandBar
          isGuest={true}
          currentPage="events"
          onSearch={(query) => logger.search(query, { page: 'events' })}
          onCreate={(type) => logger.action('create', { type, page: 'events' })}
          onNavigate={(path) => logger.navigate(path)}
          onSharePage={() => logger.action('share_page', { page: 'events' })}
          onBookmarkPage={() => logger.action('bookmark_page', { page: 'events' })}
          onPageSettings={() => logger.action('page_settings')}
          onProfile={() => logger.action('profile')}
          onSettings={() => logger.action('settings')}
          onLogout={() => logger.action('logout')}/>
      </div>

      {/* Header */}
      <Header/>

      {/* ViewsBar - Page-level command bar */}
      <ViewsBar
        currentView="calendar"
        availableViews={[
          { id: 'calendar', name: 'Calendar View', type: 'calendar' },
          { id: 'list', name: 'List View', type: 'list' },
          { id: 'grid', name: 'Grid View', type: 'list' },
          { id: 'timeline', name: 'Timeline View', type: 'timeline' }
        ]}
        onViewChange={(viewId) => logger.action('view_change', { viewId })}
        searchQuery=""
        onSearchChange={(query) => logger.search(query)}
        availableFilters={[
          { id: 'category', name: 'Category', type: 'select', options: [
            { label: 'Music', value: 'Music' },
            { label: 'Performing Arts', value: 'Performing Arts' },
            { label: 'Sports', value: 'Sports' },
            { label: 'Comedy', value: 'Comedy' },
            { label: 'Festival', value: 'Festival' }
          ]},
          { id: 'status', name: 'Status', type: 'select', options: [
            { label: 'Planning', value: 'planning' },
            { label: 'Confirmed', value: 'confirmed' },
            { label: 'Cancelled', value: 'cancelled' }
          ]},
          { id: 'price', name: 'Price Range', type: 'select', options: [
            { label: '$0 - $50', value: '0-50' },
            { label: '$50 - $100', value: '50-100' },
            { label: '$100 - $200', value: '100-200' },
            { label: '$200+', value: '200+' }
          ]},
          { id: 'featured', name: 'Featured Only', type: 'boolean' },
          { id: 'date', name: 'Date Range', type: 'date' }
        ]}
        availableSortFields={[
          { id: 'date', name: 'Date', type: 'date' },
          { id: 'name', name: 'Name', type: 'string' },
          { id: 'price', name: 'Price', type: 'number' },
          { id: 'venue', name: 'Venue', type: 'string' }
        ]}
        activeFilters={{}}
        activeSorting={null}
        activeGrouping=""
        onAdvancedFilterChange={(filters) => logger.action('filter_change', { filters })}
        onAdvancedSortChange={(sorting) => logger.action('sort_change', { sorting })}
        onAdvancedGroupChange={(grouping) => logger.action('group_change', { grouping })}
        onClearFilters={() => logger.action('clear_filters')}
        onSaveFilterPreset={(name, filters) => logger.action('save_filter_preset', { name, filters })}
        filterPresets={[
          { id: 'upcoming', name: 'Upcoming Events', filters: { date: 'upcoming' } },
          { id: 'featured', name: 'Featured Only', filters: { featured: true } },
          { id: 'music', name: 'Music Events', filters: { category: 'Music' } }
        ]}
        onCreateRecord={() => logger.action('create_record', { page: 'events' })}
        onImport={() => logger.action('import', { page: 'events' })}
        onExport={() => logger.action('export', { page: 'events' })}
        onScan={() => logger.action('scan', { page: 'events' })}
        availableFields={[
          { id: 'name', name: 'Name', visible: true },
          { id: 'date', name: 'Date', visible: true },
          { id: 'venue', name: 'Venue', visible: true },
          { id: 'price', name: 'Price', visible: true },
          { id: 'categories', name: 'Categories', visible: true },
          { id: 'lineup', name: 'Lineup', visible: false },
          { id: 'capacity', name: 'Capacity', visible: false }
        ]}
        isGuest={true}/>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            Live Events
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover and experience world-class live entertainment events from intimate concerts to massive festivals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              Browse All Events
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Create Your Event
            </Button>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="container mx-auto px-4 py-16">
        {/* Featured Events */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-bold mb-8">Featured Events</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.filter(event => event.featured).map((event) => (
              <Card key={event.slug} className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-video bg-muted relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"/>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {event.categories.slice(0, 2).map((category) => (
                        <Badge key={category} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                    <h3 className="text-primary-foreground font-semibold text-lg">{event.name}</h3>
                  </div>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{event.name}</CardTitle>
                      <CardDescription>{event.venue}</CardDescription>
                    </div>
                    <Badge variant={event.status === 'confirmed' ? 'default' : 'secondary'}>
                      {event.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          From ${event.ticketPrice}
                        </p>
                      </div>
                      <Button size="sm">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-bold mb-8">Upcoming Events</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <Card key={event.slug} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{event.name}</CardTitle>
                      <CardDescription>{event.venue}</CardDescription>
                    </div>
                    <Badge variant={event.status === 'confirmed' ? 'default' : 'secondary'}>
                      {event.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {event.categories.map((category) => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">
                          {new Date(event.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          From ${event.ticketPrice}
                        </p>
                      </div>
                      <Button size="sm">Get Tickets</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-16 bg-muted/50 rounded-lg">
          <h2 className="text-3xl font-display font-bold mb-4">
            Ready to Create Your Event?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of event creators using our platform to produce unforgettable experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">Start Planning</Button>
            <Button size="lg" variant="outline">View Pricing</Button>
          </div>
        </section>
      </main>
    </div>
  )
}
