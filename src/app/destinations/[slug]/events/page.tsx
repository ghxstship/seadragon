
'use client'

import { logger } from "@/lib/logger"
import { Search, Filter, Calendar as CalendarIcon, MapPin, Users, Star, Heart, Ticket, Music, Theater, Camera, Utensils } from "lucide-react"
import { format, isAfter, isBefore, startOfDay } from "date-fns"

interface EventApiResponse {
  id: string | number
  name?: string
  description?: string
  category?: string
  date?: string
  start_date?: string
  time?: string
  start_time?: string
  duration?: number
  venue?: string
  venue_name?: string
  location?: string
  price_min?: number
  price_max?: number
  ticket_price?: number
  currency?: string
  capacity?: number
  attendees?: number
  rating?: number
  review_count?: number
  image?: string
  featured?: boolean
  status?: string
  tags?: string[]
  organizer?: string
  website?: string
}

interface Event {
  id: string
  name: string
  description: string
  category: string
  date: string
  time: string
  duration: number
  venue: string
  location: string
  price: { min: number; max: number; currency: string }
  capacity: number
  attendees: number
  rating?: number
  reviewCount?: number
  image: string
  featured: boolean
  soldOut: boolean
  tags: string[]
  organizer: string
  website?: string
}

interface Event {
  id: string
  name: string
  description: string
  category: string
  date: string
  time: string
  duration: number
  venue: string
  location: string
  price: { min: number; max: number; currency: string }
  capacity: number
  attendees: number
  rating?: number
  reviewCount?: number
  image: string
  featured: boolean
  soldOut: boolean
  tags: string[]
  organizer: string
  website?: string
}

interface FilterOptions {
  category: string[]
  dateRange: {
    start: Date | undefined
    end: Date | undefined
  }
  priceRange: string
  venue: string[]
}

export default function Events({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const destinationName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterOptions>({
    category: [],
    dateRange: { start: undefined, end: undefined },
    priceRange: "all",
    venue: []
  })
  const [sortBy, setSortBy] = useState("date")
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const categories = [
    { value: "music", label: "Music & Concerts", icon: "" },
    { value: "theater", label: "Theater & Performing Arts", icon: "" },
    { value: "sports", label: "Sports & Recreation", icon: "" },
    { value: "food", label: "Food & Wine", icon: "️" },
    { value: "art", label: "Art & Culture", icon: "" },
    { value: "festival", label: "Festivals", icon: "" },
    { value: "cultural", label: "Cultural Events", icon: "️" },
    { value: "educational", label: "Educational", icon: "" }
  ]

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "free", label: "Free" },
    { value: "0-25", label: "$0 - $25" },
    { value: "25-50", label: "$25 - $50" },
    { value: "50-100", label: "$50 - $100" },
    { value: "100+", label: "$100+" }
  ]

  const sortOptions = [
    { value: "date", label: "Date (Soonest)" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "popularity", label: "Most Popular" }
  ]

  useEffect(() => {
    let cancelled = false

    const loadEvents = async () => {
      try {
        const res = await fetch(`/api/v1/destinations/${slug}/events`)
        if (res.ok) {
          const data = await res.json()
          const eventsData = Array.isArray(data.events) ? data.events : []
          const mapped: Event[] = eventsData.map((e: EventApiResponse) => ({
            id: String(e.id),
            name: String(e.name || 'Event'),
            description: String(e.description || ''),
            category: String(e.category || 'music'),
            date: e.date || e.start_date || new Date().toISOString().split('T')[0],
            time: e.time || e.start_time || '18:00',
            duration: Number(e.duration) || 120,
            venue: String(e.venue || e.venue_name || ''),
            location: String(e.location || ''),
            price: {
              min: Number(e.price_min || e.ticket_price || 0),
              max: Number(e.price_max || e.ticket_price || 0),
              currency: e.currency || 'USD'
            },
            capacity: Number(e.capacity) || 100,
            attendees: Number(e.attendees) || 0,
            rating: Number(e.rating) || undefined,
            reviewCount: Number(e.review_count) || undefined,
            image: e.image || '/placeholder-event.jpg',
            featured: Boolean(e.featured),
            soldOut: e.status === 'sold_out',
            tags: Array.isArray(e.tags) ? e.tags : [],
            organizer: String(e.organizer || ''),
            website: e.website
          }))
          if (!cancelled) {
            setEvents(mapped)
            setFilteredEvents(mapped)
          }
        } else {
          if (!cancelled) {
            setEvents([])
            setFilteredEvents([])
          }
        }
      } catch (error) {
        logger.error('Error loading events:', error)
        if (!cancelled) {
          setEvents([])
          setFilteredEvents([])
        }
      }
    }

    loadEvents()

    return () => { cancelled = true }
  }, [slug])

  // Apply filters and sorting
  useEffect(() => {
    let filtered = events

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (filters.category.length > 0) {
      filtered = filtered.filter(event => filters.category.includes(event.category))
    }

    // Date range filter
    if (filters.dateRange.start) {
      filtered = filtered.filter(event =>
        !isBefore(new Date(event.date), startOfDay(filters.dateRange.start!))
      )
    }
    if (filters.dateRange.end) {
      filtered = filtered.filter(event =>
        !isAfter(new Date(event.date), filters.dateRange.end!)
      )
    }

    // Price range filter
    if (filters.priceRange !== "all") {
      if (filters.priceRange === "free") {
        filtered = filtered.filter(event => event.price.min === 0)
      } else {
        const [min, max] = filters.priceRange.split('-').map(v => v === '+' ? Infinity : parseInt(v))
        filtered = filtered.filter(event => event.price.min >= min && event.price.max <= (max || Infinity))
      }
    }

    // Venue filter
    if (filters.venue.length > 0) {
      filtered = filtered.filter(event => filters.venue.includes(event.venue))
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case "price-low":
          return a.price.min - b.price.min
        case "price-high":
          return b.price.max - a.price.max
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        case "popularity":
          return (b.attendees || 0) - (a.attendees || 0)
        default:
          return 0
      }
    })

    setFilteredEvents(filtered)
  }, [events, searchQuery, filters, sortBy])

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      category: checked
        ? [...prev.category, category]
        : prev.category.filter(c => c !== category)
    }))
  }

  const handleVenueChange = (venue: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      venue: checked
        ? [...prev.venue, venue]
        : prev.venue.filter(v => v !== venue)
    }))
  }

  const toggleFavorite = (eventId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(eventId)) {
        newFavorites.delete(eventId)
      } else {
        newFavorites.add(eventId)
      }
      return newFavorites
    })
  }

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.value === category)
    return cat ? cat.icon : ""
  }

  const getPriceDisplay = (price: Event['price']) => {
    if (price.min === 0 && price.max === 0) return "Free"
    if (price.min === price.max) return `$${price.min}`
    return `$${price.min} - $${price.max}`
  }

  const getUniqueVenues = () => {
    return [...new Set(events.map(event => event.venue))]
  }

  const upcomingEvents = filteredEvents.filter(event =>
    new Date(event.date) >= new Date()
  ).slice(0, 6)

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
            <Link href="/destinations" className="hover:text-foreground">Destinations</Link>
            <span>/</span>
            <Link href={`/destinations/${slug}`} className="hover:text-foreground">{destinationName}</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Events</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-accent-secondary/10 via-accent-primary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Events in {destinationName}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover exciting events, festivals, and performances happening in {destinationName}.
              From music festivals to cultural celebrations, find your next memorable experience.
            </p>

            {/* Search and Quick Date Picker */}
            <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
                <Input
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"/>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4"/>
                    {selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date)
                      setFilters(prev => ({
                        ...prev,
                        dateRange: { start: date, end: date }
                      }))
                    }}
                    initialFocus/>
                </PopoverContent>
              </Popover>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="md:w-auto"
              >
                <Filter className="h-4 w-4 mr-2"/>
                {showFilters ? "Hide" : "Show"} Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Panel */}
      {showFilters && (
        <section className="px-4 py-6 border-b bg-muted/20">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Categories */}
              <div>
                <h3 className="font-semibold mb-3">Event Categories</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categories.map(category => (
                    <div key={category.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={category.value}
                        checked={filters.category.includes(category.value)}
                        onCheckedChange={(checked) => handleCategoryChange(category.value, checked as boolean)}/>
                      <label htmlFor={category.value} className="text-sm flex items-center">
                        <span className="mr-2">{typeof category.icon === 'string' ? category.icon : ''}</span>
                        {category.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <h3 className="font-semibold mb-3">Date Range</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-muted-foreground">From</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <CalendarIcon className="mr-2 h-3 w-3"/>
                          {filters.dateRange.start ? format(filters.dateRange.start, "MMM dd") : "Start date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.dateRange.start}
                          onSelect={(date) => setFilters(prev => ({
                            ...prev,
                            dateRange: { ...prev.dateRange, start: date }
                          }))}/>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">To</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <CalendarIcon className="mr-2 h-3 w-3"/>
                          {filters.dateRange.end ? format(filters.dateRange.end, "MMM dd") : "End date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={filters.dateRange.end}
                          onSelect={(date) => setFilters(prev => ({
                            ...prev,
                            dateRange: { ...prev.dateRange, end: date }
                          }))}/>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold mb-3">Price Range</h3>
                <Select value={filters.priceRange} onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}>
                  <SelectTrigger>
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map(range => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Venues */}
              <div>
                <h3 className="font-semibold mb-3">Venues</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {getUniqueVenues().map(venue => (
                    <div key={venue} className="flex items-center space-x-2">
                      <Checkbox
                        id={venue}
                        checked={filters.venue.includes(venue)}
                        onCheckedChange={(checked) => handleVenueChange(venue, checked as boolean)}/>
                      <label htmlFor={venue} className="text-sm">{venue}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-6 border-t">
              <Button variant="outline" onClick={() => setFilters({
                category: [],
                dateRange: { start: undefined, end: undefined },
                priceRange: "all",
                venue: []
              })}>
                Clear All Filters
              </Button>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
                </span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Events Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">
                {filteredEvents.length} Event{filteredEvents.length !== 1 ? 's' : ''} in {destinationName}
              </h2>
              <p className="text-muted-foreground">
                {upcomingEvents.length > 0
                  ? `${upcomingEvents.length} upcoming event${upcomingEvents.length !== 1 ? 's' : ''} to explore`
                  : "Check back later for upcoming events"
                }
              </p>
            </div>
          </div>

          {filteredEvents.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <CalendarIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground"/>
                <h3 className="text-lg font-semibold mb-2">No events found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters to find more events.
                </p>
                <Button onClick={() => {
                  setSearchQuery("")
                  setFilters({
                    category: [],
                    dateRange: { start: undefined, end: undefined },
                    priceRange: "all",
                    venue: []
                  })
                }}>
                  Clear Search & Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <Card key={event.id} className={`overflow-hidden hover:shadow-xl transition-shadow ${event.featured ? 'ring-2 ring-accent-primary/20' : ''}`}>
                  {/* Image */}
                  <div className="aspect-video bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 relative">
                    {event.featured && (
                      <Badge className="absolute top-3 left-3 bg-accent-primary">
                        Featured
                      </Badge>
                    )}
                    {event.soldOut && (
                      <Badge className="absolute top-3 right-3 bg-destructive">
                        Sold Out
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-3 right-3 bg-background/80 hover:bg-background"
                      onClick={() => toggleFavorite(event.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${favorites.has(event.id) ? 'fill-red-500 text-semantic-error' : 'text-muted-foreground'}`}/>
                    </Button>
                  </div>

                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg mb-1 line-clamp-2">{event.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {getCategoryIcon(event.category)} {event.category}
                        </Badge>
                      </div>

                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <CalendarIcon className="h-3 w-3 mr-1"/>
                        {format(new Date(event.date), "MMM dd, yyyy")} at {event.time}
                      </div>

                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <MapPin className="h-3 w-3 mr-1"/>
                        {event.venue}, {event.location}
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                        {event.description}
                      </p>

                      {/* Rating */}
                      {event.rating && (
                        <div className="flex items-center mb-3">
                          <div className="flex items-center mr-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${i < Math.floor(event.rating!) ? 'fill-accent-primary text-accent-primary' : 'text-muted-foreground'}`}/>
                            ))}
                          </div>
                          <span className="text-sm font-medium">{event.rating}</span>
                          {event.reviewCount && (
                            <span className="text-sm text-muted-foreground ml-1">
                              ({event.reviewCount} reviews)
                            </span>
                          )}
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {event.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Attendance */}
                      {event.attendees && event.capacity && (
                        <div className="flex items-center text-xs text-muted-foreground mb-3">
                          <Users className="h-3 w-3 mr-1"/>
                          {event.attendees} attending • {Math.round((event.attendees / event.capacity) * 100)}% capacity
                        </div>
                      )}
                    </div>

                    {/* Price and CTA */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <div className="text-xl font-bold text-accent-primary">
                          {getPriceDisplay(event.price)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {event.price.currency}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Heart className="h-4 w-4"/>
                        </Button>
                        {event.soldOut ? (
                          <Button disabled size="sm">
                            Sold Out
                          </Button>
                        ) : (
                          <Button size="sm">
                            <Ticket className="h-4 w-4 mr-1"/>
                            Get Tickets
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
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
