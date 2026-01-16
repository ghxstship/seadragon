
"use client"

import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/lib/design-system"
import { Camera, Play, Users, MapPin, Star, Eye, Download, Share2, ZoomIn, Heart, Grid3X3, List as ListIcon, Filter } from "lucide-react"

interface GalleryItem {
  id: string
  type: "image" | "video"
  title: string
  description: string
  url: string
  thumbnailUrl: string
  photographer?: string
  location?: string
  dateTaken: string
  tags: string[]
  likes: number
  views: number
  downloads: number
  featured: boolean
}

interface GalleryCategory {
  id: string
  name: string
  description: string
  count: number
  icon: React.ComponentType<{ className?: string }>
}

export default function EventGalleryPage() {
  const [selectedTab, setSelectedTab] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [filterCategory, setFilterCategory] = useState("all")

  const galleryCategories: GalleryCategory[] = [
    {
      id: "all",
      name: "All Media",
      description: "Complete event gallery",
      count: 247,
      icon: Camera
    },
    {
      id: "performances",
      name: "Performances",
      description: "Live music and entertainment",
      count: 89,
      icon: Play
    },
    {
      id: "crowd",
      name: "Crowd Shots",
      description: "Festival atmosphere and attendees",
      count: 67,
      icon: Users
    },
    {
      id: "venue",
      name: "Venue",
      description: "Stage, lighting, and production",
      count: 45,
      icon: MapPin
    },
    {
      id: "behind-scenes",
      name: "Behind the Scenes",
      description: "Preparation and backstage",
      count: 32,
      icon: Star
    },
    {
      id: "landscapes",
      name: "Landscapes",
      description: "Natural and urban surroundings",
      count: 14,
      icon: Eye
    }
  ]

  const galleryItems: GalleryItem[] = [
    {
      id: "1",
      type: "image",
      title: "Aurora Sound Main Stage Performance",
      description: "Headliner Aurora Sound delivering an incredible set with stunning light show",
      url: "/api/placeholder/1200/800",
      thumbnailUrl: "/api/placeholder/400/300",
      photographer: "Alex Chen",
      location: "Main Stage",
      dateTaken: "2026-07-15T21:30:00Z",
      tags: ["aurora sound", "main stage", "performance", "lights"],
      likes: 1247,
      views: 8934,
      downloads: 234,
      featured: true
    },
    {
      id: "2",
      type: "video",
      title: "Crowd Reaction to Finale",
      description: "Incredible crowd energy during the final performance of the night",
      url: "/api/placeholder/1200/800",
      thumbnailUrl: "/api/placeholder/400/300",
      photographer: "Sarah Johnson",
      location: "General Admission Area",
      dateTaken: "2026-07-15T23:45:00Z",
      tags: ["crowd", "energy", "finale", "reaction"],
      likes: 892,
      views: 5673,
      downloads: 145,
      featured: true
    },
    {
      id: "3",
      type: "image",
      title: "Sunset Over the Amphitheater",
      description: "Beautiful golden hour lighting over the mountain venue",
      url: "/api/placeholder/1200/800",
      thumbnailUrl: "/api/placeholder/400/300",
      photographer: "Mike Rodriguez",
      location: "Mountain View Amphitheater",
      dateTaken: "2026-07-15T19:15:00Z",
      tags: ["sunset", "venue", "landscape", "golden hour"],
      likes: 654,
      views: 4321,
      downloads: 98,
      featured: false
    },
    {
      id: "4",
      type: "image",
      title: "VIP Lounge Atmosphere",
      description: "Exclusive VIP area with premium amenities and views",
      url: "/api/placeholder/1200/800",
      thumbnailUrl: "/api/placeholder/400/300",
      photographer: "Emma Wilson",
      location: "VIP Lounge",
      dateTaken: "2026-07-15T20:30:00Z",
      tags: ["vip", "lounge", "premium", "atmosphere"],
      likes: 423,
      views: 2890,
      downloads: 76,
      featured: false
    },
    {
      id: "5",
      type: "video",
      title: "The Mountain Echoes Sound Check",
      description: "Band preparing for their evening performance",
      url: "/api/placeholder/1200/800",
      thumbnailUrl: "/api/placeholder/400/300",
      photographer: "David Kim",
      location: "Side Stage",
      dateTaken: "2026-07-15T16:00:00Z",
      tags: ["mountain echoes", "sound check", "preparation", "behind scenes"],
      likes: 387,
      views: 2156,
      downloads: 54,
      featured: false
    },
    {
      id: "6",
      type: "image",
      title: "Festival Food Court",
      description: "Diverse food options and vibrant dining area",
      url: "/api/placeholder/1200/800",
      thumbnailUrl: "/api/placeholder/400/300",
      photographer: "Lisa Park",
      location: "Food Court",
      dateTaken: "2026-07-15T18:45:00Z",
      tags: ["food", "dining", "variety", "festival life"],
      likes: 298,
      views: 1876,
      downloads: 43,
      featured: false
    }
  ]

  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = filterCategory === "all" ||
      item.tags.some(tag => tag.toLowerCase().includes(filterCategory.toLowerCase()))

    return matchesSearch && matchesCategory
  }).sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.dateTaken).getTime() - new Date(a.dateTaken).getTime()
      case "oldest":
        return new Date(a.dateTaken).getTime() - new Date(b.dateTaken).getTime()
      case "popular":
        return b.likes - a.likes
      case "views":
        return b.views - a.views
      default:
        return 0
    }
  })

  const featuredItems = galleryItems.filter(item => item.featured)

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
              Event Gallery
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Relive the magic of our events through stunning photography and videos
              captured by our professional team.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                <Download className="h-5 w-5 mr-2"/>
                Download Photos
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Share2 className="h-5 w-5 mr-2"/>
                Share Gallery
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Featured Gallery */}
        <section className="mb-12">
          <h2 className="text-3xl font-display font-bold mb-6">Featured Highlights</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative aspect-video">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-neutral-900/0 hover:bg-neutral-900/20 transition-colors flex items-center justify-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="secondary"
                          size="lg"
                          className="opacity-0 hover:opacity-100 transition-opacity"
                          onClick={() => setSelectedItem(item)}
                        >
                          {item.type === 'video' ? (
                            <Play className="h-6 w-6 mr-2"/>
                          ) : (
                            <ZoomIn className="h-6 w-6 mr-2"/>
                          )}
                          View {item.type === 'video' ? 'Video' : 'Image'}
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </div>
                  <Badge className="absolute top-2 left-2 bg-accent-primary">
                    Featured
                  </Badge>
                  {item.type === 'video' && (
                    <Badge className="absolute top-2 right-2 bg-accent-primary">
                      <Play className="h-3 w-3 mr-1"/>
                      Video
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{item.photographer}</span>
                    <span>{new Date(item.dateTaken).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Gallery Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search gallery..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
          </div>

          <div className="flex gap-2">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2"/>
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                {galleryCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32">
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="views">Most Viewed</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="h-4 w-4"/>
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <ListIcon className="h-4 w-4"/>
              </Button>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-6">
            {galleryCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs">
                {category.name}
                <Badge variant="secondary" className="ml-1 text-xs">
                  {category.count}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Gallery Grid */}
        <div className={`${
          viewMode === 'grid'
            ? 'grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }`}>
          {filteredItems.map((item) => (
            viewMode === 'grid' ? (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative aspect-video">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                  <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/40 transition-colors flex items-center justify-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="secondary"
                          size="lg"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setSelectedItem(item)}
                        >
                          {item.type === 'video' ? (
                            <Play className="h-6 w-6 mr-2"/>
                          ) : (
                            <ZoomIn className="h-6 w-6 mr-2"/>
                          )}
                          View
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </div>
                  {item.type === 'video' && (
                    <Badge className="absolute top-2 right-2 bg-accent-primary">
                      <Play className="h-3 w-3 mr-1"/>
                      Video
                    </Badge>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{item.photographer}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Heart className="h-3 w-3"/>
                        {item.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3"/>
                        {item.views}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative w-32 h-20 flex-shrink-0">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="w-full h-full object-cover rounded"/>
                      {item.type === 'video' && (
                        <Badge className="absolute top-1 right-1 bg-accent-primary">
                          <Play className="h-2 w-2"/>
                        </Badge>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.description}
                          </p>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedItem(item)}>
                              {item.type === 'video' ? 'Watch' : 'View'}
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{item.photographer}</span>
                        <span>{item.location}</span>
                        <span>{new Date(item.dateTaken).toLocaleDateString()}</span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3"/>
                            {item.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3"/>
                            {item.views}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="h-3 w-3"/>
                            {item.downloads}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {item.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{item.tags.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          ))}
        </div>

        {/* Media Detail Dialog */}
        <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedItem && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {selectedItem.type === 'video' ? (
                      <Play className="h-5 w-5"/>
                    ) : (
                      <Camera className="h-5 w-5"/>
                    )}
                    {selectedItem.title}
                  </DialogTitle>
                  <DialogDescription>{selectedItem.description}</DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Media Display */}
                  <div className="relative aspect-video bg-neutral-900 rounded-lg overflow-hidden">
                    <img
                      src={selectedItem.url}
                      alt={selectedItem.title}
                      className="w-full h-full object-contain"/>
                    {selectedItem.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button size="lg" className="bg-background/20 hover:bg-background/30 text-primary-foreground">
                          <Play className="h-8 w-8 mr-2"/>
                          Play Video
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Media Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Photographer:</span>
                            <span>{selectedItem.photographer}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Location:</span>
                            <span>{selectedItem.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Date:</span>
                            <span>{new Date(selectedItem.dateTaken).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Statistics</h4>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-2xl font-bold text-accent-primary">{selectedItem.likes}</div>
                            <div className="text-xs text-muted-foreground">Likes</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-accent-secondary">{selectedItem.views}</div>
                            <div className="text-xs text-muted-foreground">Views</div>
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-accent-tertiary">{selectedItem.downloads}</div>
                            <div className="text-xs text-muted-foreground">Downloads</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Tags</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedItem.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1">
                          <Download className="h-4 w-4 mr-2"/>
                          Download
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <Share2 className="h-4 w-4 mr-2"/>
                          Share
                        </Button>
                        <Button variant="outline" size="icon">
                          <Heart className="h-4 w-4"/>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Load More */}
        {filteredItems.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Photos
            </Button>
          </div>
        )}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Camera className="h-16 w-16 mx-auto mb-4 text-muted-foreground"/>
            <h3 className="text-xl font-semibold mb-2">No photos found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t py-12 px-4 mt-16">
        <div className="container mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 G H X S T S H I P Industries LLC. ATLVS + GVTEWAY Events.</p>
            <p className="text-sm mt-2">
              Capturing memories that last a lifetime.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
