'use client'

import { useState, useEffect, use } from "react"
import { ArrowLeft, MapPin, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { logger } from "@/lib/logger"

interface DestinationSpacesPageProps {
  params: Promise<{ handle: string }>
}

interface SpaceData {
  id: string
  name: string
  type: string
  capacity: { theater: number; banquet: number; reception: number }
  area: number
  description: string
  features: string[]
  amenities: string[]
  pricing: { weekday?: number; weekend?: number; daily?: number }
  images: string[]
}

interface DestinationData {
  handle: string
  name: string
  spaces: SpaceData[]
  spaceTypes: string[]
  stats: { totalSpaces: number; totalCapacity: number; indoorSpaces: number; outdoorSpaces: number }
}

export default function DestinationSpacesPage({ params }: DestinationSpacesPageProps) {
  const { handle } = use(params)
  const [destination, setDestination] = useState<DestinationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
            setDestination({
              handle: dest.handle || dest.slug || handle,
              name: dest.name || 'Destination',
              spaces: dest.spaces || [],
              spaceTypes: dest.space_types || ['Indoor', 'Outdoor'],
              stats: {
                totalSpaces: dest.spaces?.length || 0,
                totalCapacity: dest.total_capacity || 0,
                indoorSpaces: dest.spaces?.filter((s: SpaceData) => s.type === 'Indoor').length || 0,
                outdoorSpaces: dest.spaces?.filter((s: SpaceData) => s.type === 'Outdoor').length || 0
              }
            })
          }
        }
      } catch (error) {
        logger.error('Error fetching destination spaces', error, { handle })
      } finally {
        setIsLoading(false)
      }
    }
    fetchDestination()
  }, [handle])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading spaces...</div>
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

  // Group spaces by type
  const spacesByType = destination.spaces.reduce((acc: Record<string, SpaceData[]>, space: SpaceData) => {
    if (!acc[space.type]) {
      acc[space.type] = []
    }
    acc[space.type]!.push(space)
    return acc
  }, {} as Record<string, SpaceData[]>)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Spaces Header */}
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
              <MapPin className="h-8 w-8 text-accent-primary"/>
              <div>
                <h1 className="text-2xl font-display font-bold">{destination.name} Spaces</h1>
                <p className="text-muted-foreground">Explore our event venues and facilities</p>
              </div>
            </div>
            <Button>
              <Settings className="h-4 w-4 mr-2"/>
              Venue Specs
            </Button>
          </div>

          {/* Spaces Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                {destination.stats.totalSpaces}
              </div>
              <div className="text-sm text-muted-foreground">Total Spaces</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                {destination.stats.totalCapacity.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Capacity</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                {destination.stats.indoorSpaces}
              </div>
              <div className="text-sm text-muted-foreground">Indoor Spaces</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                {destination.stats.outdoorSpaces || 0}
              </div>
              <div className="text-sm text-muted-foreground">Outdoor Spaces</div>
            </div>
          </div>
        </div>
      </section>

      {/* Spaces Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="all">All Spaces ({destination.spaces.length})</TabsTrigger>
              {destination.spaceTypes.slice(0, 4).map((type) => {
                const typeSpaces = spacesByType[type] || []
                return (
                  <TabsTrigger key={handle} value={type.toLowerCase().replace(' ', '-')}>
                    {handle} ({typeSpaces.length})
                  </TabsTrigger>
                )
              })}
            </TabsList>

            {/* All Spaces */}
            <TabsContent value="all" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">All Event Spaces</h2>
                <p className="text-muted-foreground">Choose the perfect venue for your event</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {destination.spaces.map((space) => (
                  <Card key={space.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={space.images[0]}
                        alt={space.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                      <div className="absolute top-2 left-2">
                        <Badge variant="secondary">{space.type}</Badge>
                      </div>
                      <div className="absolute top-2 right-2 bg-neutral-900/80 text-primary-foreground text-xs px-2 py-1 rounded">
                        Up to {space.capacity.theater} guests
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">
                            <Link
                              href={`/d/${handle}/spaces/${space.id}`}
                              className="hover:text-accent-primary transition-colors"
                            >
                              {space.name}
                            </Link>
                          </h3>
                          <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                            {space.description}
                          </p>
                        </div>
                      </div>

                      {/* Capacity */}
                      <div className="mb-4">
                        <h4 className="font-medium text-sm mb-2">Capacity</h4>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center p-2 bg-muted/50 rounded">
                            <div className="font-medium">{space.capacity.theater}</div>
                            <div className="text-muted-foreground">Theater</div>
                          </div>
                          <div className="text-center p-2 bg-muted/50 rounded">
                            <div className="font-medium">{space.capacity.banquet}</div>
                            <div className="text-muted-foreground">Banquet</div>
                          </div>
                          <div className="text-center p-2 bg-muted/50 rounded">
                            <div className="font-medium">{space.capacity.reception}</div>
                            <div className="text-muted-foreground">Reception</div>
                          </div>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="mb-4">
                        <h4 className="font-medium text-sm mb-2">Key Features</h4>
                        <div className="flex flex-wrap gap-1">
                          {space.features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Pricing & Actions */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-bold text-accent-primary">
                            ${(space.pricing as any).weekday?.toLocaleString() || (space.pricing as any).daily?.toLocaleString() || 'Contact for pricing'}
                          </div>
                          <div className="text-xs text-muted-foreground">Starting price</div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/d/${handle}/spaces/${space.id}`}>
                              View Details
                            </Link>
                          </Button>
                          <Button size="sm" asChild>
                            <Link href={`/d/${handle}/inquire?space=${space.id}`}>
                              Inquire
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Type Tabs */}
            {destination.spaceTypes.map((type) => {
              const typeSpaces = spacesByType[type] || []

              return (
                <TabsContent key={handle} value={type.toLowerCase().replace(' ', '-')} className="space-y-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold mb-2">{handle} Spaces</h2>
                    <p className="text-muted-foreground">
                      {typeSpaces.length} {type.toLowerCase()} venue{typeSpaces.length !== 1 ? 's' : ''} available
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {typeSpaces.map((space) => (
                      <Card key={space.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={space.images[0]}
                            alt={space.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                          <div className="absolute top-2 right-2 bg-neutral-900/80 text-primary-foreground text-xs px-2 py-1 rounded">
                            Up to {space.capacity.theater} guests
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold mb-2">
                                <Link
                                  href={`/d/${handle}/spaces/${space.id}`}
                                  className="hover:text-accent-primary transition-colors"
                                >
                                  {space.name}
                                </Link>
                              </h3>
                              <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                                {space.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-lg font-bold text-accent-primary">
                                ${space.pricing?.weekday?.toLocaleString() || space.pricing?.daily?.toLocaleString() || 'Contact for pricing'}
                              </div>
                              <div className="text-xs text-muted-foreground">Starting price</div>
                            </div>
                            <Button asChild>
                              <Link href={`/d/${handle}/spaces/${space.id}`}>
                                View Space
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
    </div>
  )
}
