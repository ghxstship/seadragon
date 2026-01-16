
'use client'

import { logger } from '@/lib/logger'
import { Search, Filter, MapPin, Star, Clock, DollarSign, Utensils, Heart, Share2, Phone, ExternalLink, Award, ChefHat, Wine } from "lucide-react"

interface RestaurantApiResponse {
  id: string | number
  name?: string
  cuisine?: string[]
  price_range?: string
  rating?: number
  review_count?: number
  location?: string
  distance?: string
  description?: string
  images?: string[]
  features?: string[]
  hours?: Record<string, string>
  phone?: string
  website?: string
  reservation_required?: boolean
  featured?: boolean
  awards?: string[]
}

interface Restaurant {
  id: string
  name: string
  cuisine: string[]
  priceRange: '$' | '$$' | '$$$' | '$$$$'
  rating: number
  reviewCount: number
  location: string
  distance: string
  description: string
  images: string[]
  features: string[]
  hours: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
  phone?: string
  website?: string
  reservationRequired: boolean
  featured: boolean
  awards?: string[]
}

interface Restaurant {
  id: string
  name: string
  cuisine: string[]
  priceRange: '$' | '$$' | '$$$' | '$$$$'
  rating: number
  reviewCount: number
  location: string
  distance: string
  description: string
  images: string[]
  features: string[]
  hours: {
    monday: string
    tuesday: string
    wednesday: string
    thursday: string
    friday: string
    saturday: string
    sunday: string
  }
  phone?: string
  website?: string
  reservationRequired: boolean
  featured: boolean
  awards?: string[]
}

interface FilterOptions {
  cuisine: string[]
  priceRange: string[]
  rating: string
  features: string[]
}

export default function Dining({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const destinationName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterOptions>({
    cuisine: [],
    priceRange: [],
    rating: "all",
    features: []
  })
  const [sortBy, setSortBy] = useState("recommended")
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)

  const cuisineTypes = [
    "Italian", "French", "Japanese", "Chinese", "Mexican", "Indian", "Thai", "Mediterranean",
    "American", "Seafood", "Steakhouse", "Vegetarian", "Fusion", "Barbecue", "Sushi", "Pizza"
  ]

  const featureOptions = [
    { value: "reservation", label: "Reservations Available" },
    { value: "delivery", label: "Delivery" },
    { value: "takeout", label: "Takeout" },
    { value: "outdoor", label: "Outdoor Seating" },
    { value: "bar", label: "Full Bar" },
    { value: "wine", label: "Wine Selection" },
    { value: "live-music", label: "Live Music" },
    { value: "pet-friendly", label: "Pet Friendly" },
    { value: "wheelchair", label: "Accessibility Accessible" }
  ]

  const ratings = [
    { value: "all", label: "All Ratings" },
    { value: "4.5", label: "4.5+ Stars" },
    { value: "4.0", label: "4.0+ Stars" },
    { value: "3.5", label: "3.5+ Stars" }
  ]

  const sortOptions = [
    { value: "recommended", label: "Recommended" },
    { value: "rating", label: "Highest Rated" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "distance", label: "Nearest First" }
  ]

  useEffect(() => {
    let cancelled = false

    const loadRestaurants = async () => {
      try {
        const res = await fetch(`/api/v1/destinations/${slug}/dining`)
        if (res.ok) {
          const data = await res.json()
          const restaurantsData = Array.isArray(data.restaurants) ? data.restaurants : []
          const mapped: Restaurant[] = restaurantsData.map((r: RestaurantApiResponse) => ({
            id: String(r.id),
            name: String(r.name || 'Restaurant'),
            cuisine: Array.isArray(r.cuisine) ? r.cuisine : [],
            priceRange: (r.price_range as '$' | '$$' | '$$$' | '$$$$') || '$$',
            rating: Number(r.rating) || 4.0,
            reviewCount: Number(r.review_count) || 0,
            location: String(r.location || ''),
            distance: r.distance || '',
            description: String(r.description || ''),
            images: Array.isArray(r.images) ? r.images : ['/placeholder-restaurant.jpg'],
            features: Array.isArray(r.features) ? r.features : [],
            hours: r.hours || {},
            phone: r.phone,
            website: r.website,
            reservationRequired: Boolean(r.reservation_required),
            featured: Boolean(r.featured),
            awards: Array.isArray(r.awards) ? r.awards : undefined
          }))
          if (!cancelled) {
            setRestaurants(mapped)
            setFilteredRestaurants(mapped)
          }
        } else {
          if (!cancelled) {
            setRestaurants([])
            setFilteredRestaurants([])
          }
        }
      } catch (error) {
        logger.error('Error loading restaurants:', error)
        if (!cancelled) {
          setRestaurants([])
          setFilteredRestaurants([])
        }
      }
    }

    loadRestaurants()

    return () => { cancelled = true }
  }, [slug])

  // Apply filters and sorting
  useEffect(() => {
    let filtered = restaurants

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((restaurant: Restaurant) =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.cuisine.some((c: string) => c.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Cuisine filter
    if (filters.cuisine.length > 0) {
      filtered = filtered.filter((restaurant: Restaurant) =>
        filters.cuisine.some((cuisine: string) => restaurant.cuisine.includes(cuisine))
      )
    }

    // Price range filter
    if (filters.priceRange.length > 0) {
      filtered = filtered.filter((restaurant: Restaurant) => filters.priceRange.includes(restaurant.priceRange))
    }

    // Rating filter
    if (filters.rating !== "all") {
      const minRating = parseFloat(filters.rating)
      filtered = filtered.filter((restaurant: Restaurant) => restaurant.rating >= minRating)
    }

    // Features filter
    if (filters.features.length > 0) {
      filtered = filtered.filter((restaurant: Restaurant) =>
        filters.features.every((feature: string) => restaurant.features.includes(feature))
      )
    }

    // Sorting
    filtered.sort((a: Restaurant, b: Restaurant) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating
        case "price-low":
          return a.priceRange.length - b.priceRange.length
        case "price-high":
          return b.priceRange.length - a.priceRange.length
        case "distance":
          return parseFloat(a.distance) - parseFloat(b.distance)
        case "recommended":
        default:
          return a.featured ? -1 : b.featured ? 1 : 0
      }
    })

    setFilteredRestaurants(filtered)
  }, [restaurants, searchQuery, filters, sortBy])

  const handleCuisineChange = (cuisine: string, checked: boolean) => {
    setFilters((prev: FilterOptions) => ({
      ...prev,
      cuisine: checked
        ? [...prev.cuisine, cuisine]
        : prev.cuisine.filter((c: string) => c !== cuisine)
    }))
  }

  const handlePriceRangeChange = (priceRange: string, checked: boolean) => {
    setFilters((prev: FilterOptions) => ({
      ...prev,
      priceRange: checked
        ? [...prev.priceRange, priceRange]
        : prev.priceRange.filter((p: string) => p !== priceRange)
    }))
  }

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setFilters((prev: FilterOptions) => ({
      ...prev,
      features: checked
        ? [...prev.features, feature]
        : prev.features.filter((f: string) => f !== feature)
    }))
  }

  const toggleFavorite = (restaurantId: string) => {
    setFavorites((prev: Set<string>) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(restaurantId)) {
        newFavorites.delete(restaurantId)
      } else {
        newFavorites.add(restaurantId)
      }
      return newFavorites
    })
  }

  const getPriceRangeLabel = (range: string) => {
    switch (range) {
      case '$': return 'Budget-friendly'
      case '$$': return 'Moderate'
      case '$$$': return 'Upscale'
      case '$$$$': return 'Fine Dining'
      default: return range
    }
  }

  const getCurrentDayHours = (hours: Restaurant['hours']) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    const today = days[new Date().getDay()]
    return hours[today as keyof typeof hours]
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
            <Link href="/destinations" className="hover:text-foreground">Destinations</Link>
            <span>/</span>
            <Link href={`/destinations/${slug}`} className="hover:text-foreground">{destinationName}</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Dining</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-accent-secondary/10 via-accent-primary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Dining in {destinationName}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover exceptional restaurants, cafes, and culinary experiences.
              From fine dining to casual eateries, explore the vibrant food scene of {destinationName}.
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
                <Input
                  placeholder="Search restaurants, cuisine types..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"/>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Panel */}
      {showFilters && (
        <section className="px-4 py-6 border-b bg-muted/20">
          <div className="container mx-auto max-w-6xl">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Cuisine Types */}
              <div>
                <h3 className="font-semibold mb-3">Cuisine</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {cuisineTypes.map(cuisine => (
                    <div key={cuisine} className="flex items-center space-x-2">
                      <Checkbox
                        id={cuisine}
                        checked={filters.cuisine.includes(cuisine)}
                        onCheckedChange={(checked) => handleCuisineChange(cuisine, checked as boolean)}/>
                      <label htmlFor={cuisine} className="text-sm">{cuisine}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold mb-3">Price Range</h3>
                <div className="space-y-2">
                  {['$', '$$', '$$$', '$$$$'].map(range => (
                    <div key={range} className="flex items-center space-x-2">
                      <Checkbox
                        id={range}
                        checked={filters.priceRange.includes(range)}
                        onCheckedChange={(checked) => handlePriceRangeChange(range, checked as boolean)}/>
                      <label htmlFor={range} className="text-sm flex items-center">
                        <span className="mr-2">{range}</span>
                        {getPriceRangeLabel(range)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="font-semibold mb-3">Features</h3>
                <div className="space-y-2">
                  {featureOptions.map(feature => (
                    <div key={feature.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature.value}
                        checked={filters.features.includes(feature.value)}
                        onCheckedChange={(checked) => handleFeatureChange(feature.value, checked as boolean)}/>
                      <label htmlFor={feature.value} className="text-sm">{feature.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="font-semibold mb-3">Minimum Rating</h3>
                <Select value={filters.rating} onValueChange={(value) => setFilters(prev => ({ ...prev, rating: value }))}>
                  <SelectTrigger>
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    {ratings.map(rating => (
                      <SelectItem key={rating.value} value={rating.value}>
                        {rating.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-6 border-t">
              <Button variant="outline" onClick={() => setFilters({
                cuisine: [],
                priceRange: [],
                rating: "all",
                features: []
              })}>
                Clear All Filters
              </Button>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''} found
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

      {/* Restaurants Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">
                {filteredRestaurants.length} Restaurant{filteredRestaurants.length !== 1 ? 's' : ''} in {destinationName}
              </h2>
              <p className="text-muted-foreground">
                Discover the best dining experiences in the area
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:w-auto"
            >
              <Filter className="h-4 w-4 mr-2"/>
              {showFilters ? "Hide" : "Show"} Filters
            </Button>
          </div>

          {filteredRestaurants.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground"/>
                <h3 className="text-lg font-semibold mb-2">No restaurants found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters to find more dining options.
                </p>
                <Button onClick={() => {
                  setSearchQuery("")
                  setFilters({
                    cuisine: [],
                    priceRange: [],
                    rating: "all",
                    features: []
                  })
                }}>
                  Clear Search & Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRestaurants.map((restaurant) => (
                <Card key={restaurant.id} className={`overflow-hidden hover:shadow-xl transition-shadow ${restaurant.featured ? 'ring-2 ring-accent-primary/20' : ''}`}>
                  {/* Images */}
                  <div className="aspect-video bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 relative">
                    {restaurant.featured && (
                      <Badge className="absolute top-3 left-3 bg-accent-primary">
                        Featured
                      </Badge>
                    )}
                    {restaurant.awards && restaurant.awards.length > 0 && (
                      <div className="absolute top-3 right-3">
                        <Badge variant="secondary" className="bg-semantic-warning/20 text-semantic-warning">
                          <Award className="h-3 w-3 mr-1"/>
                          Award Winner
                        </Badge>
                      </div>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute bottom-3 right-3 bg-background/80 hover:bg-background"
                      onClick={() => toggleFavorite(restaurant.id)}
                    >
                      <Heart
                        className={`h-4 w-4 ${favorites.has(restaurant.id) ? 'fill-red-500 text-semantic-error' : 'text-muted-foreground'}`}/>
                    </Button>
                  </div>

                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-lg mb-1 line-clamp-2">{restaurant.name}</h3>
                        <div className="flex items-center space-x-1 ml-2">
                          <Star className="h-4 w-4 fill-accent-primary text-accent-primary"/>
                          <span className="text-sm font-medium">{restaurant.rating}</span>
                          <span className="text-sm text-muted-foreground">
                            ({restaurant.reviewCount})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3 mr-1"/>
                        {restaurant.location} • {restaurant.distance}
                      </div>

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex flex-wrap gap-1">
                          {restaurant.cuisine.slice(0, 2).map((cuisine, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {cuisine}
                            </Badge>
                          ))}
                          {restaurant.cuisine.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{restaurant.cuisine.length - 2}
                            </Badge>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {restaurant.priceRange}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {restaurant.description}
                      </p>

                      {/* Features */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {restaurant.features.slice(0, 3).map((feature, index) => {
                          const featureData = featureOptions.find(f => f.value === feature)
                          return featureData ? (
                            <Badge key={index} variant="outline" className="text-xs">
                              {featureData.label}
                            </Badge>
                          ) : null
                        })}
                        {restaurant.features.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{restaurant.features.length - 3} more
                          </Badge>
                        )}
                      </div>

                      {/* Hours */}
                      <div className="flex items-center text-xs text-muted-foreground mb-3">
                        <Clock className="h-3 w-3 mr-1"/>
                        Today: {getCurrentDayHours(restaurant.hours)}
                      </div>

                      {/* Awards */}
                      {restaurant.awards && restaurant.awards.length > 0 && (
                        <div className="flex items-center text-xs text-accent-primary mb-3">
                          <Award className="h-3 w-3 mr-1"/>
                          {restaurant.awards[0]}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Phone className="h-4 w-4 mr-1"/>
                        Call
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Share2 className="h-4 w-4 mr-1"/>
                        Share
                      </Button>
                      {restaurant.reservationRequired ? (
                        <Button size="sm" className="flex-1">
                          Reserve
                        </Button>
                      ) : (
                        <Button size="sm" className="flex-1">
                          <Utensils className="h-4 w-4 mr-1"/>
                          View Menu
                        </Button>
                      )}
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
