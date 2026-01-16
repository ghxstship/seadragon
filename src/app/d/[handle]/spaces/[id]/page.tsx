"use client"

import { db } from '@/lib/db'
import { logger } from '@/lib/logger'

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/lib/design-system"
import { ArrowLeft, Users, Square, Settings, Wifi, Car, ChefHat, CheckCircle, Calendar, DollarSign, Download } from "lucide-react"

interface DestinationSpacePageProps {
  params: Promise<{ handle: string; id: string }>
}

interface SpaceFeature {
  venue_features?: { name: string }
}

interface SpaceAmenity {
  venue_amenities?: { name: string }
}

interface Space {
  id: string
  name: string
  type: string
  venue: string
  capacity: Record<string, number>
  area: number
  dimensions: string
  ceilingHeight: string
  description: string
  features: string[]
  amenities: string[]
  technicalSpecs: string[]
  pricing: Record<string, number>
  images: string[]
  floorPlan: string
  virtualTour: string
  availability: string
  setupTime: string
  breakdownTime: string
  restrictions: string[]
}

// Fetch space data from database
async function getSpaceData(venueSlug: string, spaceSlug: string): Promise<Space | null> {
  try {
    // First get the venue by slug
    const venue = await db.getVenueBySlug(venueSlug)
    if (!venue) return null

    // Then get the space by venue ID and space slug
    const space = await db.getSpaceBySlug(venue.id, spaceSlug)
    if (!space) return null

    // Transform the data to match the expected format
    return {
      id: space.id,
      name: space.name,
      type: space.space_type,
      venue: venue.name,
      capacity: space.capacity || {},
      area: space.area_sqft,
      dimensions: space.dimensions,
      ceilingHeight: space.ceiling_height,
      description: space.description,
      features: space.space_features?.map((sf: SpaceFeature) => sf.venue_features?.name).filter(Boolean) || [],
      amenities: space.space_amenities?.map((sa: SpaceAmenity) => sa.venue_amenities?.name).filter(Boolean) || [],
      technicalSpecs: space.technical_specs ? Object.entries(space.technical_specs).map(([key, value]) => `${key}: ${value}`) : [],
      pricing: space.pricing || {},
      images: space.images || [],
      floorPlan: space.floor_plan_url,
      virtualTour: space.virtual_tour_url,
      availability: space.availability_notes || 'Available most dates with advance booking',
      setupTime: space.setup_breakdown_times?.setup || '4 hours included',
      breakdownTime: space.setup_breakdown_times?.breakdown || '2 hours included',
      restrictions: space.restrictions ? Object.values(space.restrictions) : []
    }
  } catch (error) {
    logger.error('Error fetching space data:', error)
    return null
  }
}

export default function DestinationSpacePage({ params }: DestinationSpacePageProps) {
  const { handle, id } = use(params)
  const [space, setSpace] = useState<Space | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const loadSpace = async () => {
      setIsLoading(true)
      const spaceData = await getSpaceData(handle, id)
      setSpace(spaceData)
      setIsLoading(false)
    }

    loadSpace()
  }, [handle, id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading space details...</div>
      </div>
    )
  }

  if (!space) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Space Header */}
      <section className="py-8 px-4 bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/d/${handle}/spaces`}>
                <ArrowLeft className="h-4 w-4 mr-2"/>
                Back to Spaces
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <Square className="h-8 w-8 text-accent-primary"/>
              <div>
                <h1 className="text-2xl font-display font-bold">{space.name}</h1>
                <p className="text-muted-foreground">{space.venue} • {space.type} Space</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Settings className="h-4 w-4 mr-2"/>
                Technical Specs
              </Button>
              <Button asChild>
                <Link href={`/d/${handle}/inquire?space=${space.id}`}>
                  Inquire Now
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Space Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Image Gallery */}
              <Card>
                <CardContent className="p-0">
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={space.images[selectedImage]}
                      alt={`${space.name} - Image ${selectedImage + 1}`}
                      className="w-full h-full object-cover"/>
                  </div>
                  {space.images.length > 1 && (
                    <div className="p-4 border-t">
                      <div className="flex gap-2 overflow-x-auto">
                        {space.images.map((image: string, index: number) => (
                          <Button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                              selectedImage === index ? 'border-accent-primary' : 'border-transparent'
                            }`}
                          >
                            <img
                              src={image}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"/>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">About This Space</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    {space.description.split('\n').map((paragraph: string, index: number) => (
                      <p key={index} className="mb-4 leading-relaxed">
                        {paragraph.trim()}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Capacity & Specifications */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Capacity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Theater</span>
                        <span className="font-medium">{space.capacity.theater}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Banquet</span>
                        <span className="font-medium">{space.capacity.banquet}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reception</span>
                        <span className="font-medium">{space.capacity.reception}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Classroom</span>
                        <span className="font-medium">{space.capacity.classroom}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Conference</span>
                        <span className="font-medium">{space.capacity.conference}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Specifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Area</span>
                        <span className="font-medium">{space.area.toLocaleString()} sq ft</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Dimensions</span>
                        <span className="font-medium">{space.dimensions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ceiling Height</span>
                        <span className="font-medium">{space.ceilingHeight}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Setup Time</span>
                        <span className="font-medium">{space.setupTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Breakdown Time</span>
                        <span className="font-medium">{space.breakdownTime}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Features & Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Key Features</h4>
                      <ul className="space-y-2">
                        {space.features.map((feature: string, index: number) => (
                          <li key={index} className="flex items-start gap-3 text-sm">
                            <CheckCircle className="h-4 w-4 text-accent-primary mt-0.5 flex-shrink-0"/>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Amenities</h4>
                      <ul className="space-y-2">
                        {space.amenities.map((amenity: string, index: number) => (
                          <li key={index} className="flex items-start gap-3 text-sm">
                            <CheckCircle className="h-4 w-4 text-accent-primary mt-0.5 flex-shrink-0"/>
                            {amenity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Technical Specifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Technical Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {space.technicalSpecs.map((spec: string, index: number) => (
                      <div key={index} className="flex justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm">{spec.split(':')[0]}</span>
                        <span className="text-sm font-medium">{spec.split(':')[1]}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Restrictions */}
              <Card className="border-amber-200 bg-amber-50">
                <CardHeader>
                  <CardTitle className="text-lg text-amber-900">Important Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {space.restrictions.map((restriction: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-amber-800">
                        <span className="w-1 h-1 rounded-full bg-amber-600 mt-2 flex-shrink-0"/>
                        {restriction}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pricing</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Weekday</span>
                      <span className="font-bold text-accent-primary">${space.pricing.weekday.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weekend</span>
                      <span className="font-bold text-accent-primary">${space.pricing.weekend.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Peak Season</span>
                      <span className="font-bold text-accent-primary">${space.pricing.peakSeason.toLocaleString()}</span>
                    </div>
                    <Separator/>
                    <div className="flex justify-between text-sm">
                      <span>Hourly Rate</span>
                      <span>${space.pricing.hourly.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Availability */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-accent-primary"/>
                      <span className="text-sm">{space.availability}</span>
                    </div>
                    <Button className="w-full" asChild>
                      <Link href={`/d/${handle}/availability?space=${space.id}`}>
                        Check Availability
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Floor Plan */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Floor Plan</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <img
                      src={space.floorPlan}
                      alt="Floor Plan"
                      className="w-full h-full object-cover rounded-lg"/>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3">
                    <Download className="h-4 w-4 mr-2"/>
                    Download Floor Plan
                  </Button>
                </CardContent>
              </Card>

              {/* Virtual Tour */}
              {space.virtualTour && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Virtual Tour</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      Take a virtual tour of this space
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                      <a href={space.virtualTour} target="_blank" rel="noopener noreferrer">
                        Start Virtual Tour
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Plan Your Event</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" asChild>
                    <Link href={`/d/${handle}/inquire?space=${space.id}`}>
                      Request Information
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/d/${handle}/pricing`}>
                      View Full Pricing
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/d/${handle}/specs`}>
                      Technical Specifications
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
