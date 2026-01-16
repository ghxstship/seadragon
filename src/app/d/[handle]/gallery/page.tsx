'use client'

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { logger } from "@/lib/logger"
import { ArrowLeft, Image, Download, Heart, Share2 } from "lucide-react"

interface DestinationGalleryPageProps {
  params: Promise<{ handle: string }>
}

interface Photo {
  id: string
  url: string
  caption: string
  likes: number
  tags: string[]
}

interface Album {
  id: string
  title: string
  description: string
  coverImage: string
  photoCount: number
  category: string
  featured: boolean
  photos: Photo[]
}

interface DestinationData {
  handle: string
  name: string
  albums: Album[]
  categories: string[]
  stats: {
    totalPhotos: number
    totalAlbums: number
    featuredAlbums: number
    totalLikes: number
  }
}

export default function DestinationGalleryPage({ params }: DestinationGalleryPageProps) {
  const { handle } = use(params)
  const [destination, setDestination] = useState<DestinationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  // Extract handle from params
  useEffect(() => {
  }, [params])

  // Fetch destination data from API
  useEffect(() => {
    if (!handle) return
    const fetchDestination = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/v1/destinations/${handle}`)
        if (res.ok) {
          const data = await res.json()
          const dest = data.destination || data.data?.destination
          if (dest) {
            const albums = dest.albums || []
            const totalPhotos = albums.reduce((sum: number, a: Album) => sum + (a.photos?.length || 0), 0)
            const totalLikes = albums.reduce((sum: number, a: Album) => 
              sum + (a.photos?.reduce((s: number, p: Photo) => s + (p.likes || 0), 0) || 0), 0)
            setDestination({
              handle: dest.handle || handle,
              name: dest.name || 'Destination',
              albums: albums,
              categories: [...new Set(albums.map((a: Album) => a.category).filter(Boolean))] as string[],
              stats: {
                totalPhotos,
                totalAlbums: albums.length,
                featuredAlbums: albums.filter((a: Album) => a.featured).length,
                totalLikes
              }
            })
          }
        }
      } catch (error) {
        logger.error('Error fetching destination gallery', error, { handle })
      } finally {
        setIsLoading(false)
      }
    }
    fetchDestination()
  }, [handle])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading gallery...</div>
      </div>
    )
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Destination Not Found</h1>
          <p className="text-muted-foreground">The destination @{handle} does not exist.</p>
          <Link href="/" className="text-accent-primary mt-4 inline-block">Go Home</Link>
        </div>
      </div>
    )
  }

  const featuredAlbums = destination.albums.filter(album => album.featured)
  const allPhotos = destination.albums.flatMap(album => album.photos)

  const openLightbox = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    setSelectedImage(null)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Gallery Header */}
      <section className="py-8 px-4 bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/d/${handle}`}>
                <ArrowLeft className="h-4 w-4 mr-2"/>
                Back to Destination
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <Image className="h-8 w-8 text-accent-primary"/>
              <div>
                <h1 className="text-2xl font-display font-bold">{destination.name} Gallery</h1>
                <p className="text-muted-foreground">Explore our venue through stunning photography</p>
              </div>
            </div>
            <Button>
              <Download className="h-4 w-4 mr-2"/>
              Download All
            </Button>
          </div>

          {/* Gallery Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                {destination.stats.totalPhotos}
              </div>
              <div className="text-sm text-muted-foreground">Photos</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                {destination.stats.totalAlbums}
              </div>
              <div className="text-sm text-muted-foreground">Albums</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                {(destination.stats.totalLikes / 1000).toFixed(1)}K
              </div>
              <div className="text-sm text-muted-foreground">Total Likes</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                {destination.stats.featuredAlbums}
              </div>
              <div className="text-sm text-muted-foreground">Featured Albums</div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <Tabs defaultValue="featured" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="featured">Featured ({featuredAlbums.length})</TabsTrigger>
              <TabsTrigger value="all">All Photos ({destination.stats.totalPhotos})</TabsTrigger>
              {destination.categories.slice(0, 3).map((category) => {
                const categoryAlbums = destination.albums.filter(album => album.category === category)
                const photoCount = categoryAlbums.reduce((sum, album) => sum + album.photoCount, 0)
                return (
                  <TabsTrigger key={handle} value={category.toLowerCase().replace(' ', '-')}>
                    {handle} ({photoCount})
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {/* Featured Albums */}
            <TabsContent value="featured" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Featured Albums</h2>
                <p className="text-muted-foreground">Curated highlights from our most beautiful spaces</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredAlbums.map((album) => (
                  <Card key={album.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={album.coverImage}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                        onClick={() => openLightbox(album.coverImage)}/>
                      <div className="absolute inset-0 bg-neutral-900/20 group-hover:bg-neutral-900/10 transition-colors"/>
                      <div className="absolute top-2 right-2 bg-neutral-900/80 text-primary-foreground text-xs px-2 py-1 rounded">
                        {album.photoCount} photos
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <CardTitle className="text-lg mb-2">
                        <Link
                          href={`/d/${handle}/gallery/${album.id}`}
                          className="hover:text-accent-primary transition-colors"
                        >
                          {album.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="text-sm line-clamp-2 mb-3">
                        {album.description}
                      </CardDescription>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <Badge variant="secondary">{album.category}</Badge>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/d/${handle}/gallery/${album.id}`}>
                            View Album
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* All Photos */}
            <TabsContent value="all" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">All Photos</h2>
                <p className="text-muted-foreground">Browse our complete photo collection</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allPhotos.map((photo) => (
                  <div key={photo.id} className="group cursor-pointer">
                    <div className="aspect-square overflow-hidden rounded-lg">
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onClick={() => openLightbox(photo.url)}/>
                      <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/20 transition-colors flex items-end">
                        <div className="p-3 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex items-center gap-2 text-sm">
                            <Heart className="h-3 w-3"/>
                            {photo.likes}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 p-2">
                      <p className="text-sm line-clamp-2 text-muted-foreground mb-1">
                        {photo.caption}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {photo.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Category Tabs */}
            {destination.categories.map((category) => {
              const categoryAlbums = destination.albums.filter(album => album.category === category)

              return (
                <TabsContent key={handle} value={category.toLowerCase().replace(' ', '-')} className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-2">{handle} Gallery</h2>
                    <p className="text-muted-foreground">
                      {categoryAlbums.length} album{categoryAlbums.length !== 1 ? 's' : ''} in this category
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryAlbums.map((album) => (
                      <Card key={album.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={album.coverImage}
                            alt={album.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                            onClick={() => openLightbox(album.coverImage)}/>
                          <div className="absolute inset-0 bg-neutral-900/20 group-hover:bg-neutral-900/10 transition-colors"/>
                          <div className="absolute top-2 right-2 bg-neutral-900/80 text-primary-foreground text-xs px-2 py-1 rounded">
                            {album.photoCount} photos
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <CardTitle className="text-lg mb-2">
                            <Link
                              href={`/d/${handle}/gallery/${album.id}`}
                              className="hover:text-accent-primary transition-colors"
                            >
                              {album.title}
                            </Link>
                          </CardTitle>
                          <CardDescription className="text-sm line-clamp-2 mb-3">
                            {album.description}
                          </CardDescription>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Heart className="h-3 w-3 mr-1"/>
                                {(album.photos.reduce((sum, photo) => sum + photo.likes, 0) / album.photos.length).toFixed(0)}
                              </Button>
                            </div>
                            <Button size="sm" asChild>
                              <Link href={`/d/${handle}/gallery/${album.id}`}>
                                View Album
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              )
            })}
          </Tabs>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && selectedImage && (
        <div className="fixed inset-0 bg-neutral-900/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-screen">
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-4 right-4 z-10"
              onClick={closeLightbox}
            >
              
            </Button>

            <img
              src={selectedImage}
              alt="Gallery photo"
              className="w-full h-full object-contain rounded-lg"/>

            <div className="absolute bottom-4 left-4 right-4 bg-neutral-900/80 text-primary-foreground p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="sm" className="text-primary-foreground border-white hover:bg-background hover:text-foreground">
                    <Heart className="h-3 w-3 mr-1"/>
                    Like
                  </Button>
                  <Button variant="outline" size="sm" className="text-primary-foreground border-white hover:bg-background hover:text-foreground">
                    <Share2 className="h-3 w-3 mr-1"/>
                    Share
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="text-primary-foreground border-white hover:bg-background hover:text-foreground">
                  <Download className="h-3 w-3 mr-1"/>
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
