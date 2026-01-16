'use client'

import { useEffect, useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Header } from '@/lib/design-system'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Search, Filter, MapPin, Calendar, Star, Users, Award, Heart, Share2, TrendingUp, ArrowUpDown, Grid, List } from "lucide-react"

interface EventApiResponse {
  id: string | number
  name?: string
  description?: string
  venue_name?: string
  location?: string
  category?: string
  tags?: string[]
  featured?: boolean
  trending?: boolean
  verified?: boolean
  distance?: string
  status?: string
  updated_at?: string
  created_at?: string
  rating?: number
  review_count?: number
  ticket_price?: number
  type?: string
  image?: string
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
  relevanceScore: number
  matchReasons: string[]
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
  relevanceScore: number
  matchReasons: string[]
}

function SearchResultsContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const type = searchParams.get('type') || 'all'

  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'relevance' | 'rating' | 'price' | 'distance'>('relevance')
  const [filters, setFilters] = useState({
    category: '',
    priceRange: [0, 1000] as [number, number],
    rating: 0,
    availability: 'all' as 'all' | 'available' | 'booked',
    verifiedOnly: false,
    featuredOnly: false,
  })
  const [currentPage, setCurrentPage] = useState(1)
  const resultsPerPage = 12

  useEffect(() => {
    let cancelled = false
    const loadResults = async () => {
      setLoading(true)
      try {
        const searchQuery = query ? `&search=${encodeURIComponent(query)}` : ''
        const typeFilter = type !== 'all' ? `&type=${type}` : ''
        const res = await fetch(`/api/v1/ghxstship/events?limit=20${searchQuery}${typeFilter}`)
        if (!res.ok) throw new Error('Failed to load results')
        const data = await res.json()
        const eventsData = Array.isArray(data.events) ? data.events : []
        const mapped: SearchResult[] = eventsData.map((e: EventApiResponse, index: number) => ({
          id: String(e.id),
          type: (e.type || 'experience') as SearchResult['type'],
          title: String(e.name || 'Result'),
          description: String(e.description || ''),
          image: e.image || '/placeholder-event.jpg',
          location: e.location || e.venue_name,
          rating: Number(e.rating) || 4.5,
          reviews: Number(e.review_count) || 0,
          price: e.ticket_price ? `From $${e.ticket_price}` : undefined,
          category: e.category,
          tags: Array.isArray(e.tags) ? e.tags : [],
          featured: Boolean(e.featured),
          trending: Boolean(e.trending),
          verified: Boolean(e.verified),
          distance: e.distance,
          available: e.status !== 'sold_out',
          lastUpdated: new Date(e.updated_at || e.created_at || Date.now()),
          relevanceScore: 1 - index * 0.05,
          matchReasons: ['Matched search query'],
        }))
        if (!cancelled) {
          setResults(mapped)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setResults([])
          setLoading(false)
        }
      }
    }
    loadResults()
    return () => {
      cancelled = true
    }
  }, [query, type])

  const filteredAndSortedResults = useMemo(() => {
    const filtered = results.filter((result) => {
      const matchesQuery =
        !query ||
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.description.toLowerCase().includes(query.toLowerCase()) ||
        result.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
      const matchesCategory = !filters.category || result.category === filters.category
      const price = result.price ? parseFloat(result.price.replace(/[^0-9.]/g, '')) : 0
      const matchesPrice = price >= filters.priceRange[0] && price <= filters.priceRange[1]
      const matchesRating = !filters.rating || (result.rating && result.rating >= filters.rating)
      const matchesAvailability =
        filters.availability === 'all' ||
        (filters.availability === 'available' && result.available) ||
        (filters.availability === 'booked' && !result.available)
      const matchesVerified = !filters.verifiedOnly || result.verified
      const matchesFeatured = !filters.featuredOnly || result.featured
      const matchesType = type === 'all' || result.type === type
      return (
        matchesQuery &&
        matchesCategory &&
        matchesPrice &&
        matchesRating &&
        matchesAvailability &&
        matchesVerified &&
        matchesFeatured &&
        matchesType
      )
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        case 'price': {
          const priceA = a.price ? parseFloat(a.price.replace(/[^0-9.]/g, '')) : 0
          const priceB = b.price ? parseFloat(b.price.replace(/[^0-9.]/g, '')) : 0
          return priceA - priceB
        }
        case 'distance': {
          const distA = a.distance ? parseFloat(a.distance.replace(/[^0-9.]/g, '')) : 999999
          const distB = b.distance ? parseFloat(b.distance.replace(/[^0-9.]/g, '')) : 999999
          return distA - distB
        }
        case 'relevance':
        default:
          return b.relevanceScore - a.relevanceScore
      }
    })

    return filtered
  }, [results, query, type, filters, sortBy])

  const totalPages = Math.ceil(filteredAndSortedResults.length / resultsPerPage)
  const paginatedResults = filteredAndSortedResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage,
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/3"></div>
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
      <Header />
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs">
                Search
              </Badge>
              <h1 className="text-3xl font-display font-bold tracking-tight">Discover Experiences</h1>
            </div>
            <p className="text-muted-foreground">
              Showing results for &quot;{query || 'All'}&quot; in {type === 'all' ? 'all categories' : type}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={sortBy}
              onValueChange={(v: 'relevance' | 'rating' | 'price' | 'distance') => setSortBy(v)}
            >
              <SelectTrigger className="w-[180px]">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price">Lowest Price</SelectItem>
                <SelectItem value="distance">Nearest</SelectItem>
              </SelectContent>
            </Select>
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex gap-8">
          <div className="w-80 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-3 block">Category</label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      <SelectItem value="adventure">Adventure</SelectItem>
                      <SelectItem value="wellness">Wellness</SelectItem>
                      <SelectItem value="food">Food & Culinary</SelectItem>
                      <SelectItem value="nature">Nature</SelectItem>
                      <SelectItem value="culture">Culture</SelectItem>
                      <SelectItem value="luxury">Luxury</SelectItem>
                      <SelectItem value="eco-tourism">Eco-Tourism</SelectItem>
                      <SelectItem value="music">Music & Arts</SelectItem>
                      <SelectItem value="photography">Photography</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Minimum Rating</label>
                  <Select
                    value={filters.rating.toString()}
                    onValueChange={(value) => setFilters((prev) => ({ ...prev, rating: parseFloat(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Any Rating</SelectItem>
                      <SelectItem value="3">3+ Stars</SelectItem>
                      <SelectItem value="4">4+ Stars</SelectItem>
                      <SelectItem value="4.5">4.5+ Stars</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Availability</label>
                  <Select
                    value={filters.availability}
                    onValueChange={(value: 'all' | 'available' | 'booked') =>
                      setFilters((prev) => ({ ...prev, availability: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="available">Available Now</SelectItem>
                      <SelectItem value="booked">Fully Booked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <Input
                      type="checkbox"
                      checked={filters.verifiedOnly}
                      onChange={(e) => setFilters((prev) => ({ ...prev, verifiedOnly: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Verified only</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <Input
                      type="checkbox"
                      checked={filters.featuredOnly}
                      onChange={(e) => setFilters((prev) => ({ ...prev, featuredOnly: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">Featured only</span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            {filteredAndSortedResults.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground">
                    Showing results for &quot;{query || 'All'}&quot; in {type === 'all' ? 'all categories' : type}
                  </p>
                  <Button
                    onClick={() => {
                      setFilters({
                        category: '',
                        priceRange: [0, 1000],
                        rating: 0,
                        availability: 'all',
                        verifiedOnly: false,
                        featuredOnly: false,
                      })
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {paginatedResults.map((result) => (
                      <Card key={result.id} className="overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer">
                        <div className="aspect-video bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 relative">
                          <div className="absolute top-3 left-3 z-10 flex gap-2">
                            <Badge className={getCategoryColor(result.category || '')}>{result.category}</Badge>
                            {result.verified && (
                              <Badge variant="secondary" className="bg-accent-primary/10 text-blue-800">
                                <Award className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          {result.trending && (
                            <div className="absolute top-3 right-3 z-10">
                              <Badge variant="secondary" className="bg-semantic-error/10 text-red-800">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Trending
                              </Badge>
                            </div>
                          )}
                          <div className="absolute bottom-3 left-3 z-10">
                            <Badge variant="secondary" className="bg-background/90 text-foreground">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span className="capitalize">{result.type}</span>
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
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{result.description}</p>
                          <div className="mb-3">
                            <div className="flex flex-wrap gap-1">
                              {result.matchReasons.slice(0, 2).map((reason, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {reason}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          {result.location && (
                            <div className="flex items-center text-xs text-muted-foreground mb-2">
                              <MapPin className="h-3 w-3 mr-1" />
                              {result.location}
                              {result.distance && <span className="ml-2">• {result.distance} away</span>}
                            </div>
                          )}
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              {result.rating && (
                                <>
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                  <span className="text-xs font-medium">{result.rating}</span>
                                  {result.reviews && (
                                    <span className="text-xs text-muted-foreground ml-1">({result.reviews})</span>
                                  )}
                                </>
                              )}
                            </div>
                            {result.price && <span className="text-xs font-medium text-accent-primary">{result.price}</span>}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">Popular choice</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                Updated {result.lastUpdated.toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paginatedResults.map((result) => (
                      <Card key={result.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex gap-6">
                            <div className="w-48 h-32 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 rounded-lg flex-shrink-0 relative">
                              <div className="absolute top-2 left-2 flex gap-1">
                                <Badge className={getCategoryColor(result.category || '')} variant="secondary">
                                  {result.category}
                                </Badge>
                                {result.verified && (
                                  <Badge className="bg-accent-primary/10 text-blue-800" variant="secondary">
                                    <Award className="h-3 w-3 mr-1" />
                                  </Badge>
                                )}
                              </div>
                              {result.trending && (
                                <div className="absolute top-2 right-2">
                                  <Badge className="bg-semantic-error/10 text-red-800" variant="secondary">
                                    <TrendingUp className="h-3 w-3" />
                                  </Badge>
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="text-xl font-semibold mb-1">{result.title}</h3>
                                  <p className="text-muted-foreground mb-3 line-clamp-2">{result.description}</p>
                                  <div className="mb-3">
                                    <div className="flex flex-wrap gap-1">
                                      {result.matchReasons.map((reason, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                          {reason}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="sm">
                                    <Heart className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Share2 className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm">View Details</Button>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center space-x-6">
                                  <span>by {result.location}</span>
                                  {result.rating && (
                                    <div className="flex items-center">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                      {result.rating} ({result.reviews} reviews)
                                    </div>
                                  )}
                                  {result.price && <span className="font-medium text-accent-primary">{result.price}</span>}
                                </div>
                                <div className="flex items-center space-x-2">
                                  <span>Updated {result.lastUpdated.toLocaleDateString()}</span>
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
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNumber = i + 1
                      return (
                        <Button
                          key={pageNumber}
                          variant={currentPage === pageNumber ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(pageNumber)}
                        >
                          {pageNumber}
                        </Button>
                      )
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 G H X S T S H I P Industries LLC. ATLVS + GVTEWAY Search Results.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <SearchResultsContent />
    </Suspense>
  )
}
