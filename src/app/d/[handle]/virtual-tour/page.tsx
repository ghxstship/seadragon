
'use client'

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/lib/design-system"
import { logger } from "@/lib/logger"
import { ArrowLeft, Play, Pause, Volume2, VolumeX, RotateCcw, RotateCw, MapPin, Clock, Eye, Smartphone } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface DestinationVirtualTourPageProps {
  params: Promise<{ handle: string }>
}

interface VirtualTourStop {
  id: string
  name: string
  description: string
  image: string
  video: string
  highlights: string[]
}

interface VirtualTourData {
  title: string
  description: string
  duration: string
  stops: VirtualTourStop[]
  features: string[]
  floorPlans: { name: string; file: string }[]
}

interface DestinationTourData {
  handle: string
  name: string
  virtualTour: VirtualTourData
}

// Default empty tour data
const defaultTourData: VirtualTourData = {
  title: 'Virtual Tour',
  description: 'Explore this destination',
  duration: '5 minutes',
  stops: [{
    id: 'default',
    name: 'Welcome',
    description: 'Welcome to our venue.',
    image: '/api/placeholder/800/600',
    video: '',
    highlights: ['Explore our spaces']
  }],
  features: ['360° Views', 'Interactive Navigation'],
  floorPlans: []
}

export default function DestinationVirtualTourPage({ params }: DestinationVirtualTourPageProps) {
  const { handle } = use(params)
  const [destination, setDestination] = useState<DestinationTourData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentStop, setCurrentStop] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showControls, setShowControls] = useState(true)

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
              virtualTour: dest.virtual_tour || {
                title: `Explore ${dest.name || 'Destination'}`,
                description: dest.description || 'Take a virtual tour of this venue.',
                duration: '5 minutes',
                stops: dest.tour_stops || defaultTourData.stops,
                features: dest.tour_features || defaultTourData.features,
                floorPlans: dest.floor_plans || defaultTourData.floorPlans
              }
            })
          }
        }
      } catch (error) {
        logger.error('Error fetching destination:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDestination()
  }, [handle])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading virtual tour...</div>
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

  const currentStopData = destination.virtualTour.stops[currentStop]

  const nextStop = () => {
    setCurrentStop((prev) => (prev + 1) % destination.virtualTour.stops.length)
  }

  const prevStop = () => {
    setCurrentStop((prev) => (prev - 1 + destination.virtualTour.stops.length) % destination.virtualTour.stops.length)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Virtual Tour Header */}
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
              <Eye className="h-8 w-8 text-accent-primary"/>
              <div>
                <h1 className="text-2xl font-display font-bold">{destination.virtualTour.title}</h1>
                <p className="text-muted-foreground">Interactive virtual tour • {destination.virtualTour.duration}</p>
              </div>
            </div>
            <Button asChild>
              <Link href={`/d/${handle}/inquire`}>
                Book Tour
              </Link>
            </Button>
          </div>

          {/* Tour Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                {destination.virtualTour.stops.length}
              </div>
              <div className="text-sm text-muted-foreground">Tour Stops</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                {destination.virtualTour.duration}
              </div>
              <div className="text-sm text-muted-foreground">Tour Length</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                4K
              </div>
              <div className="text-sm text-muted-foreground">Video Quality</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                <Smartphone className="h-6 w-6 mx-auto"/>
              </div>
              <div className="text-sm text-muted-foreground">Mobile Ready</div>
            </div>
          </div>
        </div>
      </section>

      {/* Virtual Tour Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <Tabs defaultValue="tour" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="tour">Virtual Tour</TabsTrigger>
              <TabsTrigger value="floor-plans">Floor Plans</TabsTrigger>
              <TabsTrigger value="specifications">Technical Specs</TabsTrigger>
            </TabsList>

            {/* Virtual Tour */}
            <TabsContent value="tour" className="space-y-8">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Tour Player */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardContent className="p-0">
                      {/* Tour Video/Image */}
                      <div
                        className="relative aspect-video bg-muted rounded-t-lg overflow-hidden cursor-pointer"
                        onMouseEnter={() => setShowControls(true)}
                        onMouseLeave={() => setShowControls(false)}
                      >
                        <img
                          src={currentStopData.image}
                          alt={currentStopData.name}
                          className="w-full h-full object-cover"/>

                        {/* Video Overlay Placeholder */}
                        <div className="absolute inset-0 bg-neutral-900/20 flex items-center justify-center">
                          <div className="text-center text-primary-foreground">
                            <Play className="h-16 w-16 mx-auto mb-4 opacity-80"/>
                            <p className="text-lg font-medium">Virtual Tour Video</p>
                            <p className="text-sm opacity-80">Interactive 360° experience</p>
                          </div>
                        </div>

                        {/* Controls Overlay */}
                        {showControls && (
                          <div className="absolute bottom-0 left-0 right-0 bg-neutral-900/60 text-primary-foreground p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setIsPlaying(!isPlaying)}
                                  className="text-primary-foreground hover:text-primary-foreground hover:bg-background/20"
                                >
                                  {isPlaying ? <Pause className="h-4 w-4"/> : <Play className="h-4 w-4"/>}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setIsMuted(!isMuted)}
                                  className="text-primary-foreground hover:text-primary-foreground hover:bg-background/20"
                                >
                                  {isMuted ? <VolumeX className="h-4 w-4"/> : <Volume2 className="h-4 w-4"/>}
                                </Button>
                                <span className="text-sm">
                                  {currentStop + 1} of {destination.virtualTour.stops.length}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={prevStop}
                                  className="text-primary-foreground hover:text-primary-foreground hover:bg-background/20"
                                >
                                  <RotateCcw className="h-4 w-4"/>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={nextStop}
                                  className="text-primary-foreground hover:text-primary-foreground hover:bg-background/20"
                                >
                                  <RotateCw className="h-4 w-4"/>
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Stop Information */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold mb-2">{currentStopData.name}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                              {currentStopData.description}
                            </p>
                          </div>
                        </div>

                        {/* Highlights */}
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Highlights</h4>
                          <div className="flex flex-wrap gap-2">
                            {currentStopData.highlights.map((highlight, index) => (
                              <Badge key={index} variant="secondary">
                                {highlight}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Navigation Dots */}
                        <div className="flex justify-center gap-2">
                          {destination.virtualTour.stops.map((_, index) => (
                            <Button
                              key={index}
                              onClick={() => setCurrentStop(index)}
                              className={`w-3 h-3 rounded-full ${
                                index === currentStop ? 'bg-accent-primary' : 'bg-muted-foreground/30'
                              }`}/>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Tour Stops Sidebar */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Tour Stops</CardTitle>
                      <CardDescription>Navigate through the venue</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {destination.virtualTour.stops.map((stop, index) => (
                          <div
                            key={stop.id}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                              index === currentStop
                                ? 'bg-accent-primary/10 border border-accent-primary'
                                : 'hover:bg-muted/50'
                            }`}
                            onClick={() => setCurrentStop(index)}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                index === currentStop
                                  ? 'bg-accent-primary text-primary-foreground'
                                  : 'bg-muted text-muted-foreground'
                              }`}>
                                {index + 1}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-sm">{stop.name}</div>
                                <div className="text-xs text-muted-foreground line-clamp-1">
                                  {stop.description}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="text-lg">Plan Your Visit</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button className="w-full" asChild>
                        <Link href={`/d/${handle}/inquire`}>
                          Schedule In-Person Tour
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/d/${handle}/pricing`}>
                          View Pricing
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={`/d/${handle}/availability`}>
                          Check Availability
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Floor Plans */}
            <TabsContent value="floor-plans" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Interactive Floor Plans</CardTitle>
                  <CardDescription>Explore our space layouts and configurations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {destination.floorPlans.map((floor, index) => (
                      <div key={index} className="border rounded-lg overflow-hidden">
                        <div className="p-4 bg-muted/50">
                          <h4 className="font-medium">{floor.name}</h4>
                        </div>
                        <div className="aspect-video bg-muted flex items-center justify-center">
                          <img
                            src={floor.file}
                            alt={`${floor.name} Floor Plan`}
                            className="w-full h-full object-cover"/>
                        </div>
                        <div className="p-4">
                          <Button variant="outline" size="sm">
                            <MapPin className="h-4 w-4 mr-2"/>
                            View Interactive Plan
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Technical Specifications */}
            <TabsContent value="specifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Technical Specifications</CardTitle>
                  <CardDescription>Virtual tour technical details and features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Video & Audio</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Video Quality:</span>
                          <span>{destination.virtualTour.technicalSpecs.videoQuality}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Audio:</span>
                          <span>{destination.virtualTour.technicalSpecs.audio}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Controls:</span>
                          <span>{destination.virtualTour.technicalSpecs.controls}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Compatibility</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Devices:</span>
                          <span>{destination.virtualTour.technicalSpecs.compatibility}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Loading Time:</span>
                          <span>{destination.virtualTour.technicalSpecs.loadingTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Offline Access:</span>
                          <span>{destination.virtualTour.technicalSpecs.offlineAccess}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6"/>

                  <div>
                    <h4 className="font-medium mb-3">Tour Features</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {destination.virtualTour.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 bg-accent-primary rounded-full"/>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
