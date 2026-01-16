
'use client'


import { logger } from "@/lib/logger"
import { ImageIcon, Video, Heart, Share2, Download, Grid, List, Filter, Search, ChevronLeft, ChevronRight, X, Play, Pause } from "lucide-react"

interface GalleryItemApiResponse {
  id: string | number
  type?: string
  url?: string
  thumbnail?: string
  title?: string
  description?: string
  photographer?: string
  tags?: string[]
  likes?: number
  views?: number
  date_taken?: string
  created_at?: string
  category?: string
  is_official?: boolean
}

interface GalleryItem {
  id: string
  type: 'image' | 'video'
  url: string
  thumbnail: string
  title: string
  description?: string
  photographer?: string
  tags: string[]
  likes: number
  views: number
  dateTaken: Date
  category: string
  isOfficial: boolean
}

interface GalleryItem {
  id: string
  type: 'image' | 'video'
  url: string
  thumbnail: string
  title: string
  description?: string
  photographer?: string
  tags: string[]
  likes: number
  views: number
  dateTaken: Date
  category: string
  isOfficial: boolean
}

interface EventGalleryProps {
  params: Promise<{ slug: string }>
}

export default function Gallery({ params }: EventGalleryProps) {
  const { slug } = use(params)
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([])
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const eventName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "performance", label: "Performance" },
    { value: "crowd", label: "Crowd Shots" },
    { value: "backstage", label: "Backstage" },
    { value: "venue", label: "Venue" },
    { value: "fan", label: "Fan Photos" }
  ]

  const types = [
    { value: "all", label: "All Media" },
    { value: "image", label: "Photos" },
    { value: "video", label: "Videos" }
  ]

  useEffect(() => {
    let cancelled = false

    const loadGallery = async () => {
      try {
        const res = await fetch(`/api/v1/events/${slug}/gallery`)
        if (res.ok) {
          const data = await res.json()
          const items = Array.isArray(data.items) ? data.items : []
          const mapped: GalleryItem[] = items.map((item: GalleryItemApiResponse) => ({
            id: String(item.id),
            type: item.type === 'video' ? 'video' : 'image',
            url: String(item.url || ''),
            thumbnail: String(item.thumbnail || item.url || ''),
            title: String(item.title || ''),
            description: item.description,
            photographer: item.photographer,
            tags: Array.isArray(item.tags) ? item.tags : [],
            likes: Number(item.likes) || 0,
            views: Number(item.views) || 0,
            dateTaken: new Date(item.date_taken || item.created_at || new Date()),
            category: String(item.category || 'performance'),
            isOfficial: Boolean(item.is_official)
          }))
          if (!cancelled) {
            setGalleryItems(mapped)
            setFilteredItems(mapped)
          }
        } else {
          if (!cancelled) {
            setGalleryItems([])
            setFilteredItems([])
          }
        }
      } catch (error) {
        logger.error('Error loading gallery:', error)
        if (!cancelled) {
          setGalleryItems([])
          setFilteredItems([])
        }
      }
    }

    loadGallery()

    return () => { cancelled = true }
  }, [slug])

  // Filter items based on selected criteria
  useEffect(() => {
    let filtered = galleryItems

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter(item => item.type === selectedType)
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query)) ||
        item.photographer?.toLowerCase().includes(query)
      )
    }

    setFilteredItems(filtered)
  }, [galleryItems, selectedCategory, selectedType, searchQuery])

  const openLightbox = (item: GalleryItem) => {
    const index = filteredItems.findIndex(i => i.id === item.id)
    setSelectedItem(item)
    setLightboxIndex(index)
    setIsLightboxOpen(true)
  }

  const navigateLightbox = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'next'
      ? (lightboxIndex + 1) % filteredItems.length
      : (lightboxIndex - 1 + filteredItems.length) % filteredItems.length

    setLightboxIndex(newIndex)
    setSelectedItem(filteredItems[newIndex])
  }

  const handleLike = (itemId: string) => {
    setGalleryItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, likes: item.likes + 1 } : item
    ))
  }

  const handleShare = (item: GalleryItem) => {
    // In real app, this would open share dialog or copy link
    navigator.clipboard.writeText(`${window.location.origin}/events/${slug}/gallery/${item.id}`)
    alert("Link copied to clipboard!")
  }

  const totalItems = galleryItems.length
  const photoCount = galleryItems.filter(item => item.type === 'image').length
  const videoCount = galleryItems.filter(item => item.type === 'video').length
  const officialCount = galleryItems.filter(item => item.isOfficial).length
  const fanCount = galleryItems.filter(item => !item.isOfficial).length

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
            <Link href="/events" className="hover:text-foreground">Events</Link>
            <span>/</span>
            <Link href={`/events/${slug}`} className="hover:text-foreground">{eventName}</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Gallery</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-accent-secondary/10 via-accent-primary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-3 bg-accent-primary/20 rounded-full">
              <ImageIcon className="h-8 w-8 text-accent-primary"/>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
                {eventName} Gallery
              </h1>
              <p className="text-xl text-muted-foreground">
                Relive the magic through photos and videos from the event
              </p>
            </div>
          </div>

          {/* Gallery Stats */}
          <div className="grid md:grid-cols-5 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-accent-primary mb-1">{totalItems}</div>
                <div className="text-sm text-muted-foreground">Total Media</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <ImageIcon className="h-8 w-8 mx-auto mb-2 text-accent-primary"/>
                <div className="text-2xl font-bold mb-1">{photoCount}</div>
                <div className="text-sm text-muted-foreground">Photos</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Video className="h-8 w-8 mx-auto mb-2 text-semantic-success"/>
                <div className="text-2xl font-bold mb-1">{videoCount}</div>
                <div className="text-sm text-muted-foreground">Videos</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-semantic-warning/10 rounded-full mb-2">
                  <span className="text-semantic-warning font-bold text-sm"></span>
                </div>
                <div className="text-2xl font-bold mb-1">{officialCount}</div>
                <div className="text-sm text-muted-foreground">Official</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-8 h-8 bg-accent-primary/10 rounded-full mb-2">
                  <Heart className="h-4 w-4 text-accent-primary"/>
                </div>
                <div className="text-2xl font-bold mb-1">{fanCount}</div>
                <div className="text-sm text-muted-foreground">Fan Content</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5"/>
              <Input
                placeholder="Search gallery..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"/>
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-32">
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                {types.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
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

        {/* Gallery Content */}
        {filteredItems.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ImageIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground"/>
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? 'No media found' : 'Gallery is empty'}
              </h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? 'Try adjusting your search terms or filters.'
                  : 'Photos and videos will appear here after the event.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              : "space-y-4"
          }>
            {filteredItems.map((item) => (
              <Card key={item.id} className="group cursor-pointer hover:shadow-lg transition-all duration-200">
                <CardContent className="p-0">
                  <div
                    className="relative aspect-square overflow-hidden rounded-t-lg"
                    onClick={() => openLightbox(item)}
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"/>
                    {item.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-neutral-900/50 rounded-full p-3">
                          <Play className="h-6 w-6 text-primary-foreground"/>
                        </div>
                      </div>
                    )}
                    {item.isOfficial && (
                      <Badge className="absolute top-2 left-2 bg-semantic-warning text-primary-foreground">
                        Official
                      </Badge>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold mb-1 line-clamp-1">{item.title}</h3>
                    {item.photographer && (
                      <p className="text-sm text-muted-foreground mb-2">
                        by {item.photographer}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                      <span>{item.likes} likes</span>
                      <span>{item.views} views</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLike(item.id)
                        }}
                      >
                        <Heart className="h-4 w-4 mr-1"/>
                        Like
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleShare(item)
                        }}
                      >
                        <Share2 className="h-4 w-4 mr-1"/>
                        Share
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Download functionality
                          alert("Download functionality would be implemented here")
                        }}
                      >
                        <Download className="h-4 w-4"/>
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-3">
                      {item.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Lightbox */}
        <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] p-0">
            <div className="relative bg-neutral-900 rounded-lg overflow-hidden">
              {selectedItem && (
                <>
                  {/* Media Display */}
                  <div className="relative aspect-video bg-neutral-900">
                    {selectedItem.type === 'image' ? (
                      <img
                        src={selectedItem.url}
                        alt={selectedItem.title}
                        className="w-full h-full object-contain"/>
                    ) : (
                      <video
                        src={selectedItem.url}
                        className="w-full h-full object-contain"
                        controls
                        autoPlay={isPlaying}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}/>
                    )}
                  </div>

                  {/* Navigation */}
                  {filteredItems.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-primary-foreground hover:bg-background/20"
                        onClick={() => navigateLightbox('prev')}
                      >
                        <ChevronLeft className="h-6 w-6"/>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary-foreground hover:bg-background/20"
                        onClick={() => navigateLightbox('next')}
                      >
                        <ChevronRight className="h-6 w-6"/>
                      </Button>
                    </>
                  )}

                  {/* Close Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-primary-foreground hover:bg-background/20"
                    onClick={() => setIsLightboxOpen(false)}
                  >
                    <X className="h-6 w-6"/>
                  </Button>

                  {/* Info Panel */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <div className="text-primary-foreground">
                      <h3 className="text-xl font-semibold mb-2">{selectedItem.title}</h3>
                      {selectedItem.description && (
                        <p className="text-neutral-200 mb-3">{selectedItem.description}</p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm">
                          {selectedItem.photographer && (
                            <span>by {selectedItem.photographer}</span>
                          )}
                          <span>{selectedItem.likes} likes</span>
                          <span>{selectedItem.views} views</span>
                        </div>

                        <div className="flex space-x-2">
                          <Button variant="secondary" size="sm">
                            <Heart className="h-4 w-4 mr-1"/>
                            Like
                          </Button>
                          <Button variant="secondary" size="sm">
                            <Share2 className="h-4 w-4 mr-1"/>
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Share your own photos and videos from the event to be featured in the gallery.
            </p>
            <div className="flex justify-center space-x-6">
              <Button variant="outline" asChild>
                <Link href={`/events/${slug}`}>
                  <ChevronLeft className="h-4 w-4 mr-2"/>
                  Back to Event
                </Link>
              </Button>
              <Button>
                <Share2 className="h-4 w-4 mr-2"/>
                Share Your Photos
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
