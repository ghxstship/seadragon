
'use client'

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/lib/design-system"
import { logger } from "@/lib/logger"
import { Search, Filter, MapPin, Calendar, Star, Users, Award, Heart, Share2, TrendingUp, History, X, Sparkles, Compass, Eye, ThumbsUp, BookOpen } from "lucide-react"

interface EventApiResponse {
  id: string | number
  slug?: string
  name?: string
  description?: string
  image_url?: string
  venue_name?: string
  location?: string
  ticket_price?: number
  category?: string
  tags?: string[]
  featured?: boolean
  updated_at?: string
  created_at?: string
}

interface SearchResult {
  id: string
  type: 'destination' | 'experience' | 'event' | 'guide' | 'profile' | 'article'
  title: string
  description: string
  image: string
  location?: string
  rating?: number
  reviews?: number
  price?: string
  category?: string
  tags: string[]
  featured: boolean
  trending: boolean
  verified: boolean
  distance?: string
  available: boolean
  lastUpdated: Date
  relevance: number
}

interface SearchSuggestion {
  id: string
  text: string
  type: 'query' | 'location' | 'category'
  count?: number
}

interface RecentSearch {
  id: string
  query: string
  type: string
  timestamp: Date
  resultCount: number
}

interface FilterOptions {
  category: string[]
  priceRange: [number, number]
  rating: number
  availability: 'all' | 'available' | 'booked'
  location: string
  verifiedOnly: boolean
  featuredOnly: boolean
}

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchSuggestions, setSearchSuggestions] = useState<SearchSuggestion[]>([])
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    category: [],
    priceRange: [0, 1000],
    rating: 0,
    availability: 'all',
    location: '',
    verifiedOnly: false,
    featuredOnly: false
  })
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'price' | 'distance'>('relevance')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Search suggestions - fetched dynamically based on query

  // Filtered and sorted results
  const filteredResults = useMemo(() => {
    let results = searchResults.filter(result => {
      // Text search
      const matchesQuery = !query ||
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase()) ||
        result.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))

      // Category filter
      const matchesCategory = filters.category.length === 0 || filters.category.includes(result.category || '')

      // Price filter
      const price = result.price ? parseFloat(result.price.replace(/[^0-9.]/g, '')) : 0
      const matchesPrice = price >= filters.priceRange[0] && price <= filters.priceRange[1]

      // Rating filter
      const matchesRating = !filters.rating || (result.rating && result.rating >= filters.rating)

      // Availability filter
      const matchesAvailability = filters.availability === 'all' ||
        (filters.availability === 'available' && result.available) ||
        (filters.availability === 'booked' && !result.available)

      // Location filter
      const matchesLocation = !filters.location ||
        result.location?.toLowerCase().includes(filters.location.toLowerCase())

      // Verification filter
      const matchesVerified = !filters.verifiedOnly || result.verified

      // Featured filter
      const matchesFeatured = !filters.featuredOnly || result.featured

      // Type filter
      const matchesType = activeTab === 'all' || result.type === activeTab

      return matchesQuery && matchesCategory && matchesPrice && matchesRating &&
             matchesAvailability && matchesLocation && matchesVerified && matchesFeatured && matchesType
    })

    // Sort results
    results.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'price':
          const priceA = a.price ? parseFloat(a.price.replace(/[^0-9.]/g, '')) : 0
          const priceB = b.price ? parseFloat(b.price.replace(/[^0-9.]/g, '')) : 0
          return priceA - priceB
        case 'distance':
          const distA = a.distance ? parseFloat(a.distance.replace(/[^0-9.]/g, '')) : 999999
          const distB = b.distance ? parseFloat(b.distance.replace(/[^0-9.]/g, '')) : 999999
          return distA - distB
        case 'relevance':
        default:
          return b.relevance - a.relevance
      }
    })

    return results
  }, [searchResults, query, filters, sortBy, activeTab])

  // Perform search
  const performSearch = async (searchQuery: string) => {
    setIsSearching(true)

    try {
      // Fetch real events from API
      const res = await fetch(`/api/v1/ghxstship/events?search=${encodeURIComponent(searchQuery)}&limit=20`)
      if (res.ok) {
        const data = await res.json()
        const events = Array.isArray(data.events) ? data.events : []
        // Map DB events to SearchResult shape
        const results: SearchResult[] = events.map((e: EventApiResponse) => ({
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
          verified: true,
          distance: undefined,
          available: true,
          lastUpdated: new Date(e.updated_at || e.created_at || Date.now()),
          relevance: 0.9
        }))
        setSearchResults(results)
      } else {
        setSearchResults([])
      }
    } catch (error) {
      logger.error('Error performing search:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Handle search input - suggestions are disabled until API endpoint is implemented
  useEffect(() => {
    if (query.length > 2) {
      setShowSuggestions(false)
      setSearchSuggestions([])
    } else {
      setShowSuggestions(false)
    }
  }, [query])

  // Handle search submission
  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    setShowSuggestions(false)
    performSearch(searchQuery)

    // Add to recent searches
    const newSearch: RecentSearch = {
      id: Date.now().toString(),
      query: searchQuery,
      type: activeTab,
      timestamp: new Date(),
      resultCount: filteredResults.length
    }
    setRecentSearches(prev => [newSearch, ...prev.slice(0, 4)])
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'destination': return <MapPin className="h-4 w-4"/>
      case 'experience': return <Star className="h-4 w-4"/>
      case 'event': return <Calendar className="h-4 w-4"/>
      case 'guide': return <BookOpen className="h-4 w-4"/>
      case 'profile': return <Users className="h-4 w-4"/>
      case 'article': return <Eye className="h-4 w-4"/>
      default: return <Search className="h-4 w-4"/>
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
      "music": "bg-pink-100 text-pink-800",
      "photography": "bg-indigo-100 text-indigo-800"
    }
    return colors[category] || "bg-neutral-100 text-neutral-800"
  }

  const tabs = [
    { id: "all", label: "All", icon: Compass },
    { id: "destination", label: "Destinations", icon: MapPin },
    { id: "experience", label: "Experiences", icon: Star },
    { id: "event", label: "Events", icon: Calendar },
    { id: "guide", label: "Guides", icon: BookOpen }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-accent-primary/10 via-accent-secondary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-primary/20 rounded-full mb-6">
              <Search className="h-10 w-10 text-accent-primary"/>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Discover Your Next Adventure
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Search through thousands of extraordinary destinations, unique experiences,
              and travel insights from our global community.
            </p>

            {/* Search Input */}
            <div className="relative max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground"/>
                <Input
                  placeholder="Search destinations, experiences, guides..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
                  className="pl-12 pr-12 py-6 text-lg rounded-full border-2 focus:border-accent-primary"/>
                {query && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuery("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4"/>
                  </Button>
                )}
              </div>

              {/* Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <Card className="absolute top-full mt-2 w-full z-50 max-h-80 overflow-y-auto">
                  <CardContent className="p-2">
                    {searchSuggestions.map((suggestion) => (
                      <Button
                        key={suggestion.id}
                        onClick={() => handleSearch(suggestion.text)}
                        className="w-full text-left px-3 py-2 rounded hover:bg-accent/10 transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          {suggestion.type === 'location' && <MapPin className="h-4 w-4 text-muted-foreground"/>}
                          {suggestion.type === 'category' && <Filter className="h-4 w-4 text-muted-foreground"/>}
                          {suggestion.type === 'query' && <Search className="h-4 w-4 text-muted-foreground"/>}
                          <span>{suggestion.text}</span>
                        </div>
                        {suggestion.count && (
                          <Badge variant="secondary" className="text-xs">
                            {suggestion.count.toLocaleString()}
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Quick Search Buttons */}
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {["Wellness Retreats", "Food Tours", "Adventure Travel", "Cultural Experiences"].map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSearch(term)}
                  className="rounded-full"
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Tabs and Filters */}
      <section className="py-8 px-4 border-b bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 w-full mb-6">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} className="text-xs lg:text-sm">
                  <tab.icon className="h-4 w-4 mr-2"/>
                  {tab.label}
                  {tab.id !== 'all' && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {filteredResults.filter(r => r.type === tab.id).length}
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              {/* Filters and Controls */}
              <div className="flex flex-col lg:flex-row gap-4 mb-8">
                <div className="flex-1 flex gap-4">
                  <Select value={filters.location} onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Location"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Locations</SelectItem>
                      <SelectItem value="asia">Asia</SelectItem>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="africa">Africa</SelectItem>
                      <SelectItem value="americas">Americas</SelectItem>
                      <SelectItem value="oceania">Oceania</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={(value: string) => setSortBy(value as typeof sortBy)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="price">Price</SelectItem>
                      <SelectItem value="distance">Distance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    List
                  </Button>
                </div>
              </div>

              {/* Results Summary */}
              {query && (
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-2">
                    {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} for &quot;{query}&quot;
                  </h2>
                  <p className="text-muted-foreground">
                    Discover amazing experiences and destinations
                  </p>
                </div>
              )}

              {/* Loading State */}
              {isSearching && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-primary mr-4"></div>
                  <span>Searching...</span>
                </div>
              )}

              {/* No Results */}
              {!isSearching && query && filteredResults.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground"/>
                    <h3 className="text-lg font-semibold mb-2">No results found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search terms or filters
                    </p>
                    <Button onClick={() => {
                      setQuery("")
                      setFilters({
                        category: [],
                        priceRange: [0, 1000],
                        rating: 0,
                        availability: 'all',
                        location: '',
                        verifiedOnly: false,
                        featuredOnly: false
                      })
                    }}>
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Results Grid */}
              {!isSearching && filteredResults.length > 0 && viewMode === "grid" && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResults.map((result) => (
                    <Card key={result.id} className="overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer">
                      <div className="aspect-video bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 relative">
                        <div className="absolute top-3 left-3 z-10 flex gap-2">
                          <Badge className={getCategoryColor(result.category || "")}>
                            {result.category}
                          </Badge>
                          {result.verified && (
                            <Badge variant="secondary" className="bg-accent-primary/10 text-blue-800">
                              <Award className="h-3 w-3 mr-1"/>
                              Verified
                            </Badge>
                          )}
                        </div>
                        {result.trending && (
                          <div className="absolute top-3 right-3 z-10">
                            <Badge variant="secondary" className="bg-semantic-error/10 text-red-800">
                              <TrendingUp className="h-3 w-3 mr-1"/>
                              Trending
                            </Badge>
                          </div>
                        )}
                        <div className="absolute bottom-3 left-3 z-10">
                          <Badge variant="secondary" className="bg-background/90 text-foreground">
                            {getTypeIcon(result.type)}
                            <span className="ml-1 capitalize">{result.type}</span>
                          </Badge>
                        </div>
                        <div className="absolute inset-0 bg-neutral-900/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="secondary" size="lg">
                            View Details
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 line-clamp-2">{result.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {result.description}
                        </p>
                        {result.location && (
                          <div className="flex items-center text-xs text-muted-foreground mb-2">
                            <MapPin className="h-3 w-3 mr-1"/>
                            {result.location}
                          </div>
                        )}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            {result.rating && (
                              <>
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1"/>
                                <span className="text-xs font-medium">{result.rating}</span>
                                {result.reviews && (
                                  <span className="text-xs text-muted-foreground ml-1">
                                    ({result.reviews})
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                          {result.price && (
                            <span className="text-xs font-medium text-accent-primary">
                              {result.price}
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
                            {result.tags.slice(0, 2).map((tag, index) => (
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
              )}

              {/* Results List */}
              {!isSearching && filteredResults.length > 0 && viewMode === "list" && (
                <div className="space-y-4">
                  {filteredResults.map((result) => (
                    <Card key={result.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex gap-6">
                          <div className="w-48 h-32 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 rounded-lg flex-shrink-0 relative">
                            <div className="absolute top-2 left-2 flex gap-1">
                              <Badge className={getCategoryColor(result.category || "")} variant="secondary">
                                {result.category}
                              </Badge>
                              {result.verified && (
                                <Badge className="bg-accent-primary/10 text-blue-800" variant="secondary">
                                  <Award className="h-3 w-3 mr-1"/>
                                </Badge>
                              )}
                            </div>
                            {result.trending && (
                              <div className="absolute top-2 right-2">
                                <Badge className="bg-semantic-error/10 text-red-800" variant="secondary">
                                  <TrendingUp className="h-3 w-3"/>
                                </Badge>
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-xl font-semibold mb-1">{result.title}</h3>
                                <p className="text-muted-foreground mb-3">{result.description}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Heart className="h-4 w-4"/>
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Share2 className="h-4 w-4"/>
                                </Button>
                                <Button size="sm">
                                  View Details
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center space-x-6">
                                <span>by {result.location}</span>
                                {result.rating && (
                                  <div className="flex items-center">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1"/>
                                    {result.rating} ({result.reviews} reviews)
                                  </div>
                                )}
                                {result.price && (
                                  <span className="font-medium text-accent-primary">
                                    {result.price}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2">
                                {result.tags.slice(0, 3).map((tag, index) => (
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

              {/* Recent Searches & Suggestions */}
              {!query && !isSearching && (
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Recent Searches */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <History className="h-5 w-5 mr-2"/>
                        Recent Searches
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {recentSearches.length > 0 ? (
                        <div className="space-y-3">
                          {recentSearches.map((search) => (
                            <Button
                              key={search.id}
                              onClick={() => handleSearch(search.query)}
                              className="w-full text-left p-3 rounded-lg hover:bg-accent/10 transition-colors flex items-center justify-between"
                            >
                              <div>
                                <div className="font-medium">{search.query}</div>
                                <div className="text-xs text-muted-foreground">
                                  {search.resultCount} results • {search.timestamp.toLocaleDateString()}
                                </div>
                              </div>
                              <Search className="h-4 w-4 text-muted-foreground"/>
                            </Button>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">
                          No recent searches yet. Start exploring!
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Popular Searches */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Sparkles className="h-5 w-5 mr-2"/>
                        Popular Searches
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {["Adventure Travel", "Wellness Retreats", "Food Tours", "Cultural Experiences", "Luxury Getaways"].map((term, index) => (
                          <Button
                            key={index}
                            onClick={() => handleSearch(term)}
                            className="w-full text-left p-3 rounded-lg hover:bg-accent/10 transition-colors flex items-center justify-between"
                          >
                            <span className="font-medium">{term}</span>
                            <TrendingUp className="h-4 w-4 text-muted-foreground"/>
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-accent-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <Compass className="h-16 w-16 mx-auto mb-6 text-accent-primary"/>
          <h2 className="text-4xl font-display font-bold mb-4">Can&apos;t Find What You&apos;re Looking For?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Our travel experts are here to help you discover personalized recommendations
            and create your perfect travel experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contact">
                <Users className="h-5 w-5 mr-2"/>
                Get Expert Help
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/discover/recommended">
                <Sparkles className="h-5 w-5 mr-2"/>
                Personalized Recommendations
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 G H X S T S H I P Industries LLC. ATLVS + GVTEWAY Search.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
