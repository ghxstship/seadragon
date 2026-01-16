
'use client'

import { storage } from '@/lib/storage'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { Search, Calendar, MapPin, Ticket } from "lucide-react"

interface EventApiResponse {
  id: string | number
  name?: string
  venue?: string
  venue_name?: string
  start_date?: string
  date?: string
  created_at?: string
  genre?: string
  description?: string
  image_url?: string
  featured?: boolean
  status?: string
  sold_out?: boolean
}

interface Event {
  id: string
  name: string
  venue: string
  date: string
  time: string
  genre: string
  description: string
  image?: string
  ticketTiers: TicketTier[]
  featured: boolean
  soldOut: boolean
}

interface Event {
  id: string
  name: string
  venue: string
  date: string
  time: string
  genre: string
  description: string
  image?: string
  ticketTiers: TicketTier[]
  featured: boolean
  soldOut: boolean
}

interface TicketTier {
  id: string
  name: string
  price: number
  currency: string
  available: number
  total: number
  description: string
  perks?: string[]
}

export default function Tickets() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [selectedTickets, setSelectedTickets] = useState<{ [tierId: string]: number }>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [selectedDateRange, setSelectedDateRange] = useState("all")
  const [loading, setLoading] = useState(true)

  const genres = ["all", "Music", "Comedy", "Theater", "Sports", "Festival", "Other"]
  const dateRanges = [
    { value: "all", label: "All Dates" },
    { value: "today", label: "Today" },
    { value: "weekend", label: "This Weekend" },
    { value: "month", label: "This Month" },
    { value: "next-month", label: "Next Month" }
  ]

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const res = await fetch('/api/v1/ghxstship/events?limit=50')
        if (!res.ok) {
          if (!cancelled) setLoading(false)
          return
        }

        const data = await res.json()
        const apiEvents = Array.isArray(data.events) ? data.events : []

        const mapped: Event[] = apiEvents.map((e: EventApiResponse) => {
          const dateIso = e.start_date || e.date || e.created_at

          return {
            id: String(e.id),
            name: String(e.name || 'Untitled Event'),
            venue: String(e.venue || e.venue_name || ''),
            date: dateIso ? String(dateIso).slice(0, 10) : '',
            time: '',
            genre: String(e.genre || 'Other'),
            description: String(e.description || ''),
            image: e.image_url ? String(e.image_url) : undefined,
            ticketTiers: [],
            featured: Boolean(e.featured) || e.status === 'featured',
            soldOut: Boolean(e.sold_out)
          }
        })

        if (!cancelled) {
          setEvents(mapped)
          setFilteredEvents(mapped)
          setLoading(false)
        }
      } catch {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [])

  // Filter events based on search and filters
  useEffect(() => {
    let filtered = events

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.genre.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Genre filter
    if (selectedGenre !== "all") {
      filtered = filtered.filter(event => event.genre === selectedGenre)
    }

    // Date range filter (simplified)
    if (selectedDateRange !== "all") {
      const now = new Date()
      let dateFilter = now

      switch (selectedDateRange) {
        case "today":
          dateFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case "weekend":
          const dayOfWeek = now.getDay()
          const daysUntilWeekend = dayOfWeek === 0 ? 0 : dayOfWeek === 6 ? 1 : 6 - dayOfWeek
          dateFilter = new Date(now.getTime() + daysUntilWeekend * 24 * 60 * 60 * 1000)
          break
        case "month":
          dateFilter = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case "next-month":
          dateFilter = new Date(now.getFullYear(), now.getMonth() + 1, 1)
          break
      }

      filtered = filtered.filter(event => new Date(event.date) >= dateFilter)
    }

    setFilteredEvents(filtered)
  }, [events, searchQuery, selectedGenre, selectedDateRange])

  const handleTicketQuantityChange = (tierId: string, quantity: number) => {
    setSelectedTickets(prev => ({
      ...prev,
      [tierId]: Math.max(0, quantity)
    }))
  }

  const getTotalTickets = () => {
    return Object.values(selectedTickets).reduce((sum, qty) => sum + qty, 0)
  }

  const getTotalPrice = () => {
    if (!selectedEvent) return 0

    return Object.entries(selectedTickets).reduce((total, [tierId, quantity]) => {
      const tier = selectedEvent.ticketTiers.find(t => t.id === tierId)
      return total + (tier ? tier.price * quantity : 0)
    }, 0)
  }

  const handleAddToCart = () => {
    if (!selectedEvent || getTotalTickets() === 0) return

    // In a real app, this would add to cart and redirect to checkout
    const cartItems = Object.entries(selectedTickets)
      .filter(([, quantity]) => quantity > 0)
      .map(([tierId, quantity]) => {
        const tier = selectedEvent.ticketTiers.find(t => t.id === tierId)!
        return {
          id: `${selectedEvent.id}-${tierId}`,
          type: 'ticket' as const,
          name: `${selectedEvent.name} - ${tier.name}`,
          description: tier.description,
          price: tier.price,
          currency: tier.currency,
          quantity,
          metadata: {
            date: selectedEvent.date,
            venue: selectedEvent.venue,
            category: selectedEvent.genre
          }
        }
      })

    // Add to cart storage
    const existingCart = storage.local.get<typeof cartItems>('cart') || []
    const updatedCart = [...existingCart, ...cartItems]
    storage.local.set('cart', updatedCart)

    // Redirect to cart
    window.location.href = '/book/cart'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header/>
        <div className="container mx-auto px-4 py-20">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-muted rounded w-1/2 mx-auto"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Breadcrumb */}
      <nav className="bg-muted/50 px-4 py-3">
        <div className="container mx-auto">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/book" className="hover:text-foreground">Book</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Tickets</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 px-4 border-b">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Buy Event Tickets
          </h1>
          <p className="text-muted-foreground mb-8">
            Discover and purchase tickets for the best live entertainment experiences.
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
              <Input
                placeholder="Search events, venues, or artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"/>
            </div>
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Genre"/>
              </SelectTrigger>
              <SelectContent>
                {genres.map(genre => (
                  <SelectItem key={genre} value={genre}>
                    {genre.charAt(0).toUpperCase() + genre.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDateRange} onValueChange={setSelectedDateRange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Date Range"/>
              </SelectTrigger>
              <SelectContent>
                {dateRanges.map(range => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <Tabs value={selectedEvent ? "select-tickets" : "browse-events"} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="browse-events">Browse Events</TabsTrigger>
              <TabsTrigger value="select-tickets" disabled={!selectedEvent}>
                Select Tickets {selectedEvent && `for ${selectedEvent.name}`}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="browse-events" className="space-y-6">
              {/* Featured Events */}
              {filteredEvents.some(event => event.featured) && (
                <div>
                  <h2 className="text-2xl font-display font-bold mb-6">Featured Events</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {filteredEvents.filter(event => event.featured).map((event) => (
                      <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-video bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10 relative">
                          <div className="absolute top-4 left-4">
                            <Badge className="bg-accent-primary">Featured</Badge>
                          </div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="text-xl font-semibold text-primary-foreground mb-2">{event.name}</h3>
                            <div className="flex items-center text-primary-foreground/80 text-sm space-x-4">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1"/>
                                {new Date(event.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1"/>
                                {event.venue}
                              </div>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <p className="text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                              {event.ticketTiers.length > 0
                                ? `From $${Math.min(...event.ticketTiers.map(t => t.price)).toFixed(2)}`
                                : 'Pricing coming soon'}
                            </div>
                            <Button onClick={() => setSelectedEvent(event)}>
                              Select Tickets
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* All Events */}
              <div>
                <h2 className="text-2xl font-display font-bold mb-6">All Events</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map((event) => (
                    <Card key={event.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{event.name}</h3>
                            <Badge variant="secondary" className="text-xs">{event.genre}</Badge>
                          </div>
                          {event.soldOut && (
                            <Badge variant="destructive">Sold Out</Badge>
                          )}
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2"/>
                            {new Date(event.date).toLocaleDateString()} at {event.time}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2"/>
                            {event.venue}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {event.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium">
                              {event.ticketTiers.length > 0
                                ? `From $${Math.min(...event.ticketTiers.map(t => t.price)).toFixed(2)}`
                                : 'Pricing coming soon'}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => setSelectedEvent(event)}
                            disabled={event.soldOut || event.ticketTiers.length === 0}
                          >
                            {event.soldOut ? 'Sold Out' : event.ticketTiers.length === 0 ? 'Unavailable' : 'Get Tickets'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="select-tickets" className="space-y-6">
              {selectedEvent && (
                <>
                  {/* Event Header */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h2 className="text-2xl font-display font-bold mb-2">{selectedEvent.name}</h2>
                          <div className="flex items-center space-x-6 text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1"/>
                              {new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.time}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1"/>
                              {selectedEvent.venue}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                          Change Event
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Ticket Selection */}
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Ticket Tiers */}
                    <div className="lg:col-span-2 space-y-4">
                      {selectedEvent.ticketTiers.length === 0 ? (
                        <Card>
                          <CardContent className="p-6">
                            <h3 className="text-lg font-semibold mb-2">Tickets not available yet</h3>
                            <p className="text-muted-foreground">
                              This event is coming from the live database, but ticket tiers haven’t been configured yet.
                            </p>
                          </CardContent>
                        </Card>
                      ) : (
                        selectedEvent.ticketTiers.map((tier) => (
                          <Card key={tier.id} className="border-2 hover:border-accent-primary/50 transition-colors">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div>
                                  <h3 className="text-xl font-semibold mb-2">{tier.name}</h3>
                                  <p className="text-muted-foreground mb-3">{tier.description}</p>
                                  {tier.perks && (
                                    <div className="flex flex-wrap gap-2 mb-4">
                                      {tier.perks.map((perk, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {perk}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-accent-primary">
                                    ${tier.price.toFixed(2)}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {tier.available} left
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleTicketQuantityChange(tier.id, (selectedTickets[tier.id] || 0) - 1)}
                                    disabled={(selectedTickets[tier.id] || 0) <= 0}
                                  >
                                    -
                                  </Button>
                                  <span className="w-12 text-center font-medium">
                                    {selectedTickets[tier.id] || 0}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleTicketQuantityChange(tier.id, (selectedTickets[tier.id] || 0) + 1)}
                                    disabled={(selectedTickets[tier.id] || 0) >= tier.available}
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {Object.entries(selectedTickets)
                            .filter(([, quantity]) => quantity > 0)
                            .map(([tierId, quantity]) => {
                              const tier = selectedEvent.ticketTiers.find(t => t.id === tierId)!
                              return (
                                <div key={tierId} className="flex justify-between text-sm">
                                  <span>{tier.name} × {quantity}</span>
                                  <span>${(tier.price * quantity).toFixed(2)}</span>
                                </div>
                              )
                            })}

                          <div className="border-t pt-4">
                            <div className="flex justify-between text-lg font-semibold">
                              <span>Total ({getTotalTickets()} ticket{getTotalTickets() !== 1 ? 's' : ''})</span>
                              <span>${getTotalPrice().toFixed(2)}</span>
                            </div>
                          </div>

                          <Button
                            className="w-full"
                            size="lg"
                            onClick={handleAddToCart}
                            disabled={getTotalTickets() === 0}
                          >
                            <Ticket className="h-4 w-4 mr-2"/>
                            Add to Cart
                          </Button>

                          <p className="text-xs text-muted-foreground text-center">
                            No hidden fees • Instant confirmation
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="space-y-3 text-sm">
                            <div className="flex items-center">
                              <span className="text-success mr-2"></span>
                              Mobile tickets
                            </div>
                            <div className="flex items-center">
                              <span className="text-success mr-2"></span>
                              Free cancellation up to 24h
                            </div>
                            <div className="flex items-center">
                              <span className="text-success mr-2"></span>
                              Secure payment
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 G H X S T S H I P Industries LLC. ATLVS + GVTEWAY Super App.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
