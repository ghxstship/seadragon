'use client'


import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/lib/design-system"
import { logger } from "@/lib/logger"
import { Camera, Video, Play, Download, Heart, Share2, Eye, Calendar, MapPin, Search, Filter, Grid, List, Star, Award, Users, TrendingUp, Zap, Globe } from "lucide-react"

interface EventApiResponse {
  id: string | number
  name?: string
  description?: string
  venue_name?: string
  location?: string
  category?: string
  tags?: string[]
  featured?: boolean
  created_at?: string
  image_url?: string
}

interface MediaItem {
  id: string
  type: 'photo' | 'video' | 'live'
  title: string
  description: string
  thumbnail: string
  fullSize?: string
  category: string
  destination: string
  photographer?: string
  uploadDate: Date
  views: number
  likes: number
  duration?: number
  tags: string[]
  featured: boolean
}

interface GalleryCategory {
  id: string
  name: string
  icon: string
  count: number
  color: string
}

interface FeaturedAlbum {
  id: string
  title: string
  description: string
  coverImage: string
  itemCount: number
  photographer: string
  destination: string
  rating: number
}

export default function GalleryPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadMediaItems = async () => {
      try {
        // Fetch events/experiences as gallery items
        const res = await fetch('/api/v1/ghxstship/events?limit=20')
        if (res.ok) {
          const data = await res.json()
          const events = Array.isArray(data.events) ? data.events : []
          // Map events to MediaItem shape
          const mapped: MediaItem[] = events.map((e: EventApiResponse) => ({
            id: String(e.id),
            type: 'photo' as const,
            title: String(e.name || 'Untitled'),
            description: String(e.description || ''),
            thumbnail: e.image_url || '/api/placeholder/400/300',
            fullSize: e.image_url || '/api/placeholder/1200/800',
            category: String(e.category || 'event'),
            destination: String(e.venue_name || e.location || ''),
            photographer: 'Event Team',
            uploadDate: new Date(e.created_at || Date.now()),
            views: 0,
            likes: 0,
            tags: Array.isArray(e.tags) ? e.tags : [],
            featured: Boolean(e.featured)
          }))
          if (!cancelled) {
            setMediaItems(mapped)
            setFilteredItems(mapped)
            setLoading(false)
          }
        } else {
          if (!cancelled) {
            setMediaItems([])
            setFilteredItems([])
            setLoading(false)
          }
        }
      } catch (error) {
        logger.error('Error loading gallery items:', error)
        if (!cancelled) {
          setMediaItems([])
          setFilteredItems([])
          setLoading(false)
        }
      }
    }

    loadMediaItems()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let filtered = mediaItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
      const matchesType = selectedType === "all" || item.type === selectedType

      return matchesSearch && matchesCategory && matchesType
    })

    // Sort by featured first, then by upload date
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return b.uploadDate.getTime() - a.uploadDate.getTime()
    })

    setFilteredItems(filtered)
  }, [mediaItems, searchQuery, selectedCategory, selectedType])

  const galleryCategories: GalleryCategory[] = [
    { id: "all", name: "All Categories", icon: "", count: mediaItems.length, color: "bg-neutral-100" },
    { id: "landscapes", name: "Landscapes", icon: "️", count: mediaItems.filter(i => i.category === "landscapes").length, color: "bg-semantic-success/10" },
    { id: "urban", name: "Urban", icon: "️", count: mediaItems.filter(i => i.category === "urban").length, color: "bg-accent-primary/10" },
    { id: "nature", name: "Nature", icon: "", count: mediaItems.filter(i => i.category === "nature").length, color: "bg-emerald-100" },
    { id: "marine", name: "Marine", icon: "", count: mediaItems.filter(i => i.category === "marine").length, color: "bg-cyan-100" },
    { id: "adventure", name: "Adventure", icon: "", count: mediaItems.filter(i => i.category === "adventure").length, color: "bg-semantic-warning/10" },
    { id: "culture", name: "Culture", icon: "️", count: mediaItems.filter(i => i.category === "culture").length, color: "bg-accent-primary/10" }
  ]

  const featuredAlbums: FeaturedAlbum[] = [
    {
      id: "santorini-sunset-series",
      title: "Santorini Sunset Series",
      description: "A collection of breathtaking sunset photographs from the Greek islands",
      coverImage: "/api/placeholder/300/200",
      itemCount: 24,
      photographer: "Maria Rodriguez",
      destination: "Santorini, Greece",
      rating: 4.9
    },
    {
      id: "tokyo-street-life",
      title: "Tokyo Street Life",
      description: "Capturing the vibrant energy and culture of Tokyo's streets",
      coverImage: "/api/placeholder/300/200",
      itemCount: 18,
      photographer: "Kenji Tanaka",
      destination: "Tokyo, Japan",
      rating: 4.8
    },
    {
      id: "bali-spiritual-journey",
      title: "Bali Spiritual Journey",
      description: "Temples, ceremonies, and the peaceful spirituality of Bali",
      coverImage: "/api/placeholder/300/200",
      itemCount: 31,
      photographer: "Sarah Chen",
      destination: "Bali, Indonesia",
      rating: 4.7
    }
  ]

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
    return views.toString()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4"/>
      case 'live': return <Zap className="h-4 w-4"/>
      default: return <Camera className="h-4 w-4"/>
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-semantic-error/10 text-red-800'
      case 'live': return 'bg-semantic-success/10 text-green-800'
      default: return 'bg-accent-primary/10 text-blue-800'
    }
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
              <Camera className="h-10 w-10 text-accent-primary"/>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Visual Stories
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Immerse yourself in the beauty of travel through our curated collection of
              stunning photography, cinematic videos, and live experiences from around the world.
            </p>

            {/* Search and Filters */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                  <Input
                    placeholder="Search photos, videos, destinations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"/>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Category"/>
                  </SelectTrigger>
                  <SelectContent>
                    {galleryCategories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 justify-center">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Type"/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="photo">Photos</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
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

      {/* Gallery Categories */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {galleryCategories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-accent-primary text-primary-foreground'
                    : 'bg-background hover:bg-accent-primary/10'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Albums */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Featured Albums</h2>
            <p className="text-lg text-muted-foreground">
              Curated collections from our featured photographers
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredAlbums.map((album) => (
              <Card key={album.id} className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
                <div className="aspect-video bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 relative">
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-background/90 text-foreground">
                      Featured
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center bg-background/90 rounded px-2 py-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1"/>
                    <span className="text-xs font-medium">{album.rating}</span>
                  </div>
                  <div className="absolute inset-0 bg-neutral-900/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary">View Album</Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{album.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {album.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                    <span>{album.itemCount} items</span>
                    <span>by {album.photographer}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1"/>
                    {album.destination}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Gallery */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">
                {selectedCategory === "all" ? "Latest Media" : `${galleryCategories.find(c => c.id === selectedCategory)?.name} Gallery`}
              </h2>
              <p className="text-muted-foreground">
                {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <Link href="/gallery/upload">
                  <Camera className="h-4 w-4 mr-2"/>
                  Upload
                </Link>
              </Button>
              <Button asChild>
                <Link href="/gallery/live">
                  <Play className="h-4 w-4 mr-2"/>
                  Live Streams
                </Link>
              </Button>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground"/>
                <h3 className="text-lg font-semibold mb-2">No media found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filters to find more content.
                </p>
                <Button onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setSelectedType("all")
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
                    <div className="absolute top-3 left-3 z-10">
                      <Badge className={getTypeColor(item.type)}>
                        {getTypeIcon(item.type)}
                        <span className="ml-1 capitalize">{item.type}</span>
                      </Badge>
                    </div>
                    {item.featured && (
                      <div className="absolute top-3 right-3 z-10">
                        <Badge variant="secondary" className="bg-semantic-warning/10 text-yellow-800">
                          <Star className="h-3 w-3 mr-1"/>
                          Featured
                        </Badge>
                      </div>
                    )}
                    {item.duration && item.duration > 0 && (
                      <div className="absolute bottom-3 right-3 z-10 bg-neutral-900/70 text-primary-foreground px-2 py-1 rounded text-xs">
                        {formatDuration(item.duration)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-neutral-900/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" size="lg">
                        {item.type === 'video' || item.type === 'live' ? (
                          <Play className="h-6 w-6 mr-2"/>
                        ) : (
                          <Eye className="h-6 w-6 mr-2"/>
                        )}
                        View
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1"/>
                        {item.destination}
                      </div>
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1"/>
                        {formatViews(item.views)}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                        <span>by {item.photographer}</span>
                        <span>{item.uploadDate.toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Heart className="h-4 w-4"/>
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4"/>
                        </Button>
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
                        <div className="absolute top-2 left-2">
                          <Badge className={getTypeColor(item.type)}>
                            {getTypeIcon(item.type)}
                          </Badge>
                        </div>
                        {item.featured && (
                          <div className="absolute top-2 right-2">
                            <Badge variant="secondary" className="bg-semantic-warning/10 text-yellow-800">
                              <Star className="h-3 w-3"/>
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
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <Heart className="h-4 w-4"/>
                              {item.likes}
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Share2 className="h-4 w-4"/>
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center space-x-6">
                            <span>by {item.photographer}</span>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1"/>
                              {item.destination}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1"/>
                              {item.uploadDate.toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1"/>
                              {formatViews(item.views)} views
                            </div>
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
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-accent-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <Camera className="h-16 w-16 mx-auto mb-6 text-accent-primary"/>
          <h2 className="text-4xl font-display font-bold mb-4">Share Your Travel Stories</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join our community of photographers and videographers. Share your travel experiences
            and get featured in our gallery. Featured contributors receive exclusive perks and rewards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/gallery/upload">
                <Camera className="h-5 w-5 mr-2"/>
                Upload Your Content
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/gallery/contributors">
                <Award className="h-5 w-5 mr-2"/>
                Become a Contributor
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 G H X S T S H I P Industries LLC. ATLVS + GVTEWAY Media Gallery.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
