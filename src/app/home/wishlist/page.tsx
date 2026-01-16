
'use client'


import { logger } from '@/lib/logger'
import { Search, Filter, Heart, ShoppingCart, Star, MapPin, Calendar, Users, Trash2, Share, Download, Plus } from "lucide-react"

interface EventApiResponse {
  id: string | number
  name?: string
  description?: string
  venue_name?: string
  location?: string
  ticket_price?: number
  category?: string
  tags?: string[]
  featured?: boolean
  created_at?: string
  image_url?: string
  status?: string
}

interface WishlistItem {
  id: string
  type: 'experience' | 'destination' | 'product'
  name: string
  description: string
  location?: string
  price?: number
  originalPrice?: number
  currency?: string
  rating?: number
  reviewCount?: number
  image: string
  category: string
  tags: string[]
  dateAdded: string
  notes?: string
  availability?: string
  priority?: 'low' | 'medium' | 'high'
}

interface FilterOptions {
  category: string[]
  type: string
  priceRange: string
  priority: string
}

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [filteredItems, setFilteredItems] = useState<WishlistItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<FilterOptions>({
    category: [],
    type: "all",
    priceRange: "all",
    priority: "all"
  })
  const [sortBy, setSortBy] = useState("date-added")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTab, setSelectedTab] = useState("all")

  const categories = [
    { value: "adventure", label: "Adventure", icon: MapPin },
    { value: "culture", label: "Culture", icon: Users },
    { value: "food", label: "Food & Dining", icon: Star },
    { value: "nature", label: "Nature", icon: Heart },
    { value: "shopping", label: "Shopping", icon: ShoppingCart }
  ]

  const types = [
    { value: "all", label: "All Items" },
    { value: "experience", label: "Experiences" },
    { value: "destination", label: "Destinations" },
    { value: "product", label: "Products" }
  ]

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-100", label: "Under $100" },
    { value: "100-500", label: "$100 - $500" },
    { value: "500-1000", label: "$500 - $1,000" },
    { value: "1000+", label: "$1,000+" }
  ]

  const priorities = [
    { value: "all", label: "All Priorities" },
    { value: "high", label: "High Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "low", label: "Low Priority" }
  ]

  const sortOptions = [
    { value: "date-added", label: "Recently Added" },
    { value: "name", label: "Name A-Z" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "priority", label: "By Priority" }
  ]

  useEffect(() => {
    let cancelled = false

    const loadWishlistItems = async () => {
      try {
        // Fetch events as wishlist items (in a real app, this would be a user-specific wishlist API)
        const res = await fetch('/api/v1/ghxstship/events?limit=20')
        if (res.ok) {
          const data = await res.json()
          const events = Array.isArray(data.events) ? data.events : []
          // Map events to WishlistItem shape
          const mapped: WishlistItem[] = events.map((e: EventApiResponse) => ({
            id: String(e.id),
            type: 'experience' as const,
            name: String(e.name || 'Untitled'),
            description: String(e.description || ''),
            location: String(e.venue_name || e.location || ''),
            price: e.ticket_price ? Number(e.ticket_price) : undefined,
            currency: 'USD',
            rating: 4.5,
            reviewCount: 0,
            image: e.image_url || '/api/placeholder/400/300',
            category: String(e.category || 'adventure'),
            tags: Array.isArray(e.tags) ? e.tags : [],
            dateAdded: e.created_at || new Date().toISOString(),
            notes: '',
            availability: e.status === 'active' ? 'Available' : 'Limited',
            priority: 'medium' as const
          }))
          if (!cancelled) {
            setWishlistItems(mapped)
            setFilteredItems(mapped)
          }
        } else {
          if (!cancelled) {
            setWishlistItems([])
            setFilteredItems([])
          }
        }
      } catch (error) {
        logger.error('Error loading wishlist items:', error)
        if (!cancelled) {
          setWishlistItems([])
          setFilteredItems([])
        }
      }
    }

    loadWishlistItems()

    return () => {
      cancelled = true
    }
  }, [])

  // Apply filters and sorting
  useEffect(() => {
    let filtered = wishlistItems

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Type filter
    if (selectedTab !== "all") {
      filtered = filtered.filter(item => item.type === selectedTab)
    }

    // Additional filters
    if (filters.category.length > 0) {
      filtered = filtered.filter(item => filters.category.includes(item.category))
    }

    // Price range filter (only for items with prices)
    if (filters.priceRange !== "all") {
      if (filters.priceRange === "1000+") {
        filtered = filtered.filter(item => item.price && item.price >= 1000)
      } else {
        const [min, max] = filters.priceRange.split('-').map(v => parseInt(v))
        filtered = filtered.filter(item => item.price && item.price >= min && item.price <= max)
      }
    }

    // Priority filter
    if (filters.priority !== "all") {
      filtered = filtered.filter(item => item.priority === filters.priority)
    }

    // Sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "price-low":
          const aPrice = a.price || 0
          const bPrice = b.price || 0
          return aPrice - bPrice
        case "price-high":
          const aPriceHigh = a.price || 0
          const bPriceHigh = b.price || 0
          return bPriceHigh - aPriceHigh
        case "rating":
          const aRating = a.rating || 0
          const bRating = b.rating || 0
          return bRating - aRating
        case "priority":
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          const aPriority = priorityOrder[a.priority || 'low']
          const bPriority = priorityOrder[b.priority || 'low']
          return bPriority - aPriority
        case "date-added":
        default:
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      }
    })

    setFilteredItems(filtered)
  }, [wishlistItems, searchQuery, selectedTab, filters, sortBy])

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      category: checked
        ? [...prev.category, category]
        : prev.category.filter(c => c !== category)
    }))
  }

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId))
  }

  const updatePriority = (itemId: string, priority: 'low' | 'medium' | 'high') => {
    setWishlistItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, priority } : item
      )
    )
  }

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-semantic-error/10 text-red-800'
      case 'medium': return 'bg-semantic-warning/10 text-yellow-800'
      case 'low': return 'bg-semantic-success/10 text-green-800'
      default: return 'bg-neutral-100 text-neutral-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'experience': return <Calendar className="h-4 w-4"/>
      case 'destination': return <MapPin className="h-4 w-4"/>
      case 'product': return <ShoppingCart className="h-4 w-4"/>
      default: return <Heart className="h-4 w-4"/>
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return "Added today"
    if (diffDays < 7) return `Added ${diffDays} days ago`
    if (diffDays < 30) return `Added ${Math.ceil(diffDays / 7)} weeks ago`
    return `Added ${Math.ceil(diffDays / 30)} months ago`
  }

  const totalValue = wishlistItems.reduce((total, item) => {
    return total + (item.price || 0)
  }, 0)

  const experienceCount = wishlistItems.filter(item => item.type === 'experience').length
  const destinationCount = wishlistItems.filter(item => item.type === 'destination').length
  const productCount = wishlistItems.filter(item => item.type === 'product').length

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
            <Link href="/home" className="hover:text-foreground">Member Home</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Wishlist</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-accent-secondary/10 via-accent-primary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-primary/20 rounded-full mb-6">
              <Heart className="h-10 w-10 text-accent-primary"/>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              My Wishlist
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Curate your dream travel experiences, must-visit destinations, and favorite products.
              Your saved items are organized and ready whenever you're planning your next adventure.
            </p>

            {/* Wishlist Stats */}
            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-primary mb-1">{wishlistItems.length}</div>
                <div className="text-sm text-muted-foreground">Total Items</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-primary mb-1">{experienceCount}</div>
                <div className="text-sm text-muted-foreground">Experiences</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-primary mb-1">{destinationCount}</div>
                <div className="text-sm text-muted-foreground">Destinations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-primary mb-1">${totalValue.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Estimated Value</div>
              </div>
            </div>

            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
                <Input
                  placeholder="Search your wishlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"/>
              </div>
            </div>
          </div>

          {/* Type Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid grid-cols-4 w-full max-w-4xl mx-auto mb-8">
              <TabsTrigger value="all" className="text-xs">
                All ({wishlistItems.length})
              </TabsTrigger>
              <TabsTrigger value="experience" className="text-xs">
                <Calendar className="h-3 w-3 mr-1"/>
                Experiences ({experienceCount})
              </TabsTrigger>
              <TabsTrigger value="destination" className="text-xs">
                <MapPin className="h-3 w-3 mr-1"/>
                Destinations ({destinationCount})
              </TabsTrigger>
              <TabsTrigger value="product" className="text-xs">
                <ShoppingCart className="h-3 w-3 mr-1"/>
                Products ({productCount})
              </TabsTrigger>
            </TabsList>

            {/* Wishlist Grid */}
            <TabsContent value={selectedTab} className="mt-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-display font-bold mb-2">
                    {selectedTab === "all" ? "All Saved Items" : types.find(t => t.value === selectedTab)?.label}
                  </h2>
                  <p className="text-muted-foreground">
                    {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                <div className="flex items-center space-x-4">
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
                  <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                    <Filter className="h-4 w-4 mr-2"/>
                    Filters
                  </Button>
                </div>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-4 gap-6">
                      {/* Categories */}
                      <div>
                        <h3 className="font-semibold mb-3">Categories</h3>
                        <div className="space-y-2">
                          {categories.map(category => (
                            <div key={category.value} className="flex items-center space-x-2">
                              <Checkbox
                                id={category.value}
                                checked={filters.category.includes(category.value)}
                                onCheckedChange={(checked) => handleCategoryChange(category.value, checked as boolean)}/>
                              <label htmlFor={category.value} className="text-sm flex items-center">
                                <category.icon className="h-3 w-3 mr-2"/>
                                {category.label}
                              </label>
                            </div>
                          ))}
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

                      {/* Priority */}
                      <div>
                        <h3 className="font-semibold mb-3">Priority</h3>
                        <Select value={filters.priority} onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value }))}>
                          <SelectTrigger>
                            <SelectValue/>
                          </SelectTrigger>
                          <SelectContent>
                            {priorities.map(priority => (
                              <SelectItem key={priority.value} value={priority.value}>
                                {priority.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Actions */}
                      <div>
                        <h3 className="font-semibold mb-3">Actions</h3>
                        <div className="space-y-2">
                          <Button variant="outline" size="sm" className="w-full">
                            <Share className="h-4 w-4 mr-2"/>
                            Share List
                          </Button>
                          <Button variant="outline" size="sm" className="w-full">
                            <Download className="h-4 w-4 mr-2"/>
                            Export
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Items Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                    {/* Item Image */}
                    <div className="aspect-video bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 relative">
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="text-xs">
                          {getTypeIcon(item.type)}
                          <span className="ml-1 capitalize">{item.type}</span>
                        </Badge>
                      </div>
                      {item.priority && (
                        <div className="absolute top-3 right-3">
                          <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                            {item.priority} priority
                          </Badge>
                        </div>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-3 bg-background/80 hover:bg-background"
                        onClick={() => removeFromWishlist(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-semantic-error"/>
                      </Button>
                      <div className="absolute bottom-3 left-3 bg-neutral-900/80 text-primary-foreground px-2 py-1 rounded text-xs">
                        Added {formatDate(item.dateAdded)}
                      </div>
                    </div>

                    <CardContent className="p-6">
                      {/* Item Info */}
                      <div className="mb-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {categories.find(c => c.value === item.category)?.label}
                          </Badge>
                        </div>

                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.name}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                          {item.description}
                        </p>

                        {item.location && (
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4 mr-1"/>
                            {item.location}
                          </div>
                        )}

                        {/* Rating */}
                        {item.rating && (
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < Math.floor(item.rating!) ? 'fill-accent-primary text-accent-primary' : 'text-muted-foreground'}`}/>
                              ))}
                            </div>
                            <span className="text-sm font-medium">{item.rating}</span>
                            {item.reviewCount && (
                              <span className="text-sm text-muted-foreground">
                                ({item.reviewCount} reviews)
                              </span>
                            )}
                          </div>
                        )}

                        {/* Price */}
                        {item.price && (
                          <div className="flex items-center space-x-2 mb-4">
                            <span className="text-2xl font-bold text-accent-primary">
                              ${item.price.toLocaleString()}
                            </span>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${item.originalPrice.toLocaleString()}
                              </span>
                            )}
                            <span className="text-sm text-muted-foreground">{item.currency}</span>
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {item.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {item.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{item.tags.length - 3} more
                            </Badge>
                          )}
                        </div>

                        {/* Notes */}
                        {item.notes && (
                          <div className="bg-muted/50 rounded-lg p-3 mb-4">
                            <p className="text-xs text-muted-foreground">
                              <strong>Note:</strong> {item.notes}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Select
                          value={item.priority || "low"}
                          onValueChange={(value: 'low' | 'medium' | 'high') => updatePriority(item.id, value)}
                        >
                          <SelectTrigger className="flex-1">
                            <SelectValue/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">High Priority</SelectItem>
                            <SelectItem value="medium">Medium Priority</SelectItem>
                            <SelectItem value="low">Low Priority</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button size="sm" className="flex-1">
                          <Plus className="h-4 w-4 mr-1"/>
                          {item.type === 'product' ? 'Add to Cart' : 'Book Now'}
                        </Button>
                      </div>

                      {/* Availability */}
                      {item.availability && (
                        <div className="flex items-center justify-center mt-3 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1"/>
                          {item.availability}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredItems.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground"/>
                    <h3 className="text-lg font-semibold mb-2">
                      {searchQuery ? 'No items found' : 'Your wishlist is empty'}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery
                        ? 'Try adjusting your search criteria or filters to find more items.'
                        : 'Start building your wishlist by saving experiences, destinations, and products you love.'
                      }
                    </p>
                    <Button asChild>
                      <Link href="/discover">
                        <Plus className="h-4 w-4 mr-2"/>
                        Explore & Discover
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
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
