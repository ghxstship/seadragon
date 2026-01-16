
'use client'


import { logger } from '@/lib/logger'
import { Compass, TrendingUp, Star, MapPin, Calendar, Users, Heart, Share2, Search, Filter, Grid, List, Flame, Award, Sparkles, Globe, Camera, Music, Utensils, Mountain, Waves, BookOpen } from "lucide-react"

interface EventApiResponse {
  id: string | number
  slug?: string
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

interface DiscoveryItem {
  id: string
  type: 'destination' | 'experience' | 'event' | 'guide' | 'itinerary'
  title: string
  description: string
  image: string
  location?: string
  rating: number
  reviews: number
  price?: string
  category: string
  tags: string[]
  featured: boolean
  trending: boolean
  new: boolean
  popularity: number
  curated: boolean
}

interface CuratedCollection {
  id: string
  title: string
  description: string
  coverImage: string
  itemCount: number
  curator: string
  theme: string
}

interface TrendingTopic {
  id: string
  name: string
  growth: number
  posts: number
  icon: string
}

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [discoveryItems, setDiscoveryItems] = useState<DiscoveryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadDiscoveryItems = async () => {
      try {
        // Fetch real events from API
        const res = await fetch('/api/v1/ghxstship/events?limit=20')
        if (res.ok) {
          const data = await res.json()
          const events = Array.isArray(data.events) ? data.events : []
          // Map DB events to DiscoveryItem shape
          const mapped: DiscoveryItem[] = events.map((e: EventApiResponse) => ({
            id: String(e.id || e.slug),
            type: 'event' as const,
            title: String(e.name || 'Untitled Event'),
            description: String(e.description || ''),
            image: e.image_url || '/api/placeholder/400/300',
            location: String(e.venue_name || e.location || ''),
            rating: 4.5,
            reviews: 0,
            price: e.ticket_price ? `From $${e.ticket_price}` : undefined,
            category: String(e.category || 'event'),
            tags: Array.isArray(e.tags) ? e.tags : [],
            featured: Boolean(e.featured),
            trending: false,
            new: new Date(e.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            popularity: 80,
            curated: false
          }))
          if (!cancelled) {
            setDiscoveryItems(mapped)
            setLoading(false)
          }
        } else {
          if (!cancelled) {
            setDiscoveryItems([])
            setLoading(false)
          }
        }
      } catch (error) {
        logger.error('Error loading discovery items:', error)
        if (!cancelled) {
          setDiscoveryItems([])
          setLoading(false)
        }
      }
    }

    loadDiscoveryItems()

    return () => {
      cancelled = true
    }
  }, [])

  const filteredItems = discoveryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesLocation = selectedLocation === "all" || item.location?.includes(selectedLocation)
    const matchesType = activeTab === "all" || item.type === activeTab
    return matchesSearch && matchesCategory && matchesLocation && matchesType
  })

  const curatedCollections: CuratedCollection[] = [
    {
      id: "luxury-escapes",
      title: "Luxury Escapes",
      description: "The world's most exclusive and sophisticated travel experiences",
      coverImage: "/api/placeholder/300/200",
      itemCount: 24,
      curator: "Elite Travel Curator",
      theme: "luxury"
    },
    {
      id: "adventure-seekers",
      title: "Adventure Seekers",
      description: "Thrilling adventures for the bold and courageous traveler",
      coverImage: "/api/placeholder/300/200",
      itemCount: 31,
      curator: "Adventure Expert",
      theme: "adventure"
    },
    {
      id: "cultural-immersion",
      title: "Cultural Immersion",
      description: "Deep dive into local traditions, arts, and authentic experiences",
      coverImage: "/api/placeholder/300/200",
      itemCount: 18,
      curator: "Cultural Anthropologist",
      theme: "culture"
    }
  ]

  const trendingTopics: TrendingTopic[] = [
    { id: "sustainable-travel", name: "Sustainable Travel", growth: 45, posts: 1250, icon: "" },
    { id: "wellness-retreats", name: "Wellness Retreats", growth: 32, posts: 890, icon: "" },
    { id: "local-experiences", name: "Local Experiences", growth: 28, posts: 675, icon: "️" },
    { id: "luxury-camping", name: "Luxury Camping", growth: 56, posts: 432, icon: "" },
    { id: "food-tours", name: "Culinary Journeys", growth: 23, posts: 543, icon: "️" }
  ]

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "adventure", label: "Adventure" },
    { id: "wellness", label: "Wellness" },
    { id: "food", label: "Food & Culinary" },
    { id: "nature", label: "Nature" },
    { id: "culture", label: "Culture" },
    { id: "luxury", label: "Luxury" },
    { id: "eco-tourism", label: "Eco-Tourism" },
    { id: "music", label: "Music & Arts" }
  ]

  const locations = [
    { id: "all", label: "All Locations" },
    { id: "Asia", label: "Asia" },
    { id: "Europe", label: "Europe" },
    { id: "Africa", label: "Africa" },
    { id: "Americas", label: "Americas" },
    { id: "Oceania", label: "Oceania" }
  ]

  const tabs = [
    { id: "all", label: "All", icon: Compass },
    { id: "destination", label: "Destinations", icon: MapPin },
    { id: "experience", label: "Experiences", icon: Star },
    { id: "event", label: "Events", icon: Calendar },
    { id: "guide", label: "Guides", icon: BookOpen }
  ]

  const featuredItems = discoveryItems.filter(item => item.featured).slice(0, 3)
  const trendingItems = discoveryItems.filter(item => item.trending).slice(0, 4)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'destination': return <MapPin className="h-4 w-4"/>
      case 'experience': return <Star className="h-4 w-4"/>
      case 'event': return <Calendar className="h-4 w-4"/>
      case 'guide': return <BookOpen className="h-4 w-4"/>
      default: return <Compass className="h-4 w-4"/>
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "adventure": "bg-semantic-warning/10 text-orange-800",
      "wellness": "bg-accent-primary/10 text-purple-800",
      "food": "bg-semantic-error/10 text-red-800",
      "nature": "bg-semantic-success/10 text-green-800",
      "culture": "bg-accent-primary/10 text-blue-800",
      "luxury": "bg-semantic-warning/10 text-yellow-800",
      "eco-tourism": "bg-emerald-100 text-emerald-800",
      "music": "bg-pink-100 text-pink-800"
    }
    return colors[category] || "bg-neutral-100 text-neutral-800"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header/>
        <div className="container mx-auto px-4 py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded w-1/3 mx-auto"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-accent-primary/10 via-accent-secondary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-primary/20 rounded-full mb-6">
              <Compass className="h-10 w-10 text-accent-primary"/>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Discover Your Next Adventure
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Explore extraordinary destinations, unique experiences, and curated collections
              from travel experts around the world. Find inspiration for your perfect journey.
            </p>

            {/* Search and Filters */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                  <Input
                    placeholder="Search destinations, experiences..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"/>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category"/>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 justify-center">
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Region"/>
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map(loc => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4"/>
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4"/>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Type Tabs */}
      <section className="py-8 px-4 bg-muted/30 border-b">
        <div className="container mx-auto max-w-6xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 w-full mb-8">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} className="text-xs lg:text-sm">
                  <tab.icon className="h-4 w-4 mr-2"/>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              {/* Results Summary */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-display font-bold mb-2">
                    {activeTab === "all" ? "Discover Everything" : `${tabs.find(t => t.id === activeTab)?.label} Collection`}
                  </h2>
                  <p className="text-muted-foreground">
                    {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" asChild>
                    <Link href="/discover/trending">
                      <TrendingUp className="h-4 w-4 mr-2"/>
                      Trending
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/discover/recommended">
                      <Sparkles className="h-4 w-4 mr-2"/>
                      For You
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Content Grid/List */}
              {filteredItems.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Compass className="h-16 w-16 mx-auto mb-4 text-muted-foreground"/>
                    <h3 className="text-lg font-semibold mb-2">No discoveries found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search or filters to find more content.
                    </p>
                    <Button onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("all")
                      setSelectedLocation("all")
                      setActiveTab("all")
                    }}>
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              ) : viewMode === "grid" ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer">
                      <div className="aspect-video bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 relative">
                        <div className="absolute top-3 left-3 z-10 flex gap-2">
                          <Badge className={getCategoryColor(item.category)}>
                            {item.category}
                          </Badge>
                          {item.new && (
                            <Badge variant="secondary" className="bg-semantic-success/10 text-green-800">
                              New
                            </Badge>
                          )}
                        </div>
                        {item.trending && (
                          <div className="absolute top-3 right-3 z-10">
                            <Badge variant="secondary" className="bg-semantic-error/10 text-red-800">
                              <Flame className="h-3 w-3 mr-1"/>
                              Trending
                            </Badge>
                          </div>
                        )}
                        <div className="absolute bottom-3 left-3 z-10">
                          <Badge variant="secondary" className="bg-background/90 text-foreground">
                            {getTypeIcon(item.type)}
                            <span className="ml-1 capitalize">{item.type}</span>
                          </Badge>
                        </div>
                        <div className="absolute inset-0 bg-neutral-900/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="secondary" size="lg">
                            Explore
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 line-clamp-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {item.description}
                        </p>
                        {item.location && (
                          <div className="flex items-center text-xs text-muted-foreground mb-2">
                            <MapPin className="h-3 w-3 mr-1"/>
                            {item.location}
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1"/>
                            <span className="text-xs font-medium">{item.rating}</span>
                            <span className="text-xs text-muted-foreground ml-1">
                              ({item.reviews})
                            </span>
                          </div>
                          {item.price && (
                            <span className="text-xs font-medium text-accent-primary">
                              {item.price}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Heart className="h-4 w-4"/>
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4"/>
                            </Button>
                          </div>
                          <div className="flex gap-1">
                            {item.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          <div className="w-48 h-32 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 rounded-lg flex-shrink-0 relative">
                            <div className="absolute top-2 left-2 flex gap-1">
                              <Badge className={getCategoryColor(item.category)} variant="secondary">
                                {item.category}
                              </Badge>
                              {item.new && (
                                <Badge className="bg-semantic-success/10 text-green-800" variant="secondary">
                                  New
                                </Badge>
                              )}
                            </div>
                            {item.trending && (
                              <div className="absolute top-2 right-2">
                                <Badge className="bg-semantic-error/10 text-red-800" variant="secondary">
                                  <Flame className="h-3 w-3"/>
                                </Badge>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                                <p className="text-muted-foreground mb-3">{item.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Heart className="h-4 w-4"/>
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Share2 className="h-4 w-4"/>
                                </Button>
                                <Button size="sm">
                                  Explore
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center space-x-6">
                                <span>by {item.location}</span>
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1"/>
                                  {item.rating} ({item.reviews} reviews)
                                </div>
                                {item.price && (
                                  <span className="font-medium text-accent-primary">
                                    {item.price}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                {item.tags.slice(0, 3).map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Curated Collections</h2>
            <p className="text-lg text-muted-foreground">
              Hand-picked experiences and destinations curated by travel experts
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {curatedCollections.map((collection) => (
              <Card key={collection.id} className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
                <div className="aspect-video bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 relative">
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-background/90 text-foreground">
                      <Award className="h-3 w-3 mr-1"/>
                      Curated
                    </Badge>
                  </div>
                  <div className="absolute inset-0 bg-neutral-900/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary">View Collection</Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{collection.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {collection.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <span>{collection.itemCount} items</span>
                    <span>by {collection.curator}</span>
                  </div>
                  <Badge className={getCategoryColor(collection.theme)}>
                    {collection.theme}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Topics */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Trending Now</h2>
            <p className="text-lg text-muted-foreground">
              What&apos;s hot in travel right now
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {trendingTopics.map((topic) => (
              <Card key={topic.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">{topic.icon}</div>
                  <h3 className="font-semibold mb-2">{topic.name}</h3>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="h-3 w-3 text-semantic-success"/>
                    <span className="text-xs text-semantic-success">+{topic.growth}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {topic.posts.toLocaleString()} posts
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-accent-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <Globe className="h-16 w-16 mx-auto mb-6 text-accent-primary"/>
          <h2 className="text-4xl font-display font-bold mb-4">Start Your Discovery Journey</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Whether you&apos;re planning your next adventure or just browsing for inspiration,
            our discovery tools help you find exactly what you&apos;re looking for.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/discover/recommended">
                <Sparkles className="h-5 w-5 mr-2"/>
                Get Personalized Recommendations
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/discover/nearby">
                <MapPin className="h-5 w-5 mr-2"/>
                Explore Nearby
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 G H X S T S H I P Industries LLC. ATLVS + GVTEWAY Discovery Hub.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
