
'use client'

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { logger } from "@/lib/logger"
import { ArrowLeft, MapPin, Calendar, Users, Star, Clock, DollarSign, CheckCircle } from "lucide-react"

interface DestinationProfile {
  handle: string
  name: string
  type: string
  location: string
  description: string
  highlights: string[]
  amenities: string[]
  capacity: { min: number; max: number; standard: number }
  pricing: { weekday: string; weekend: string; peakSeason: string }
  stats: { totalEvents: number; averageRating: number; yearsOperating: number; acres: number }
  contact: { phone: string; email: string; website: string }
}

interface DestinationAboutPageProps {
  params: Promise<{ handle: string }>
}

export default function DestinationAboutPage({ params }: DestinationAboutPageProps) {
  const { handle } = use(params)
  const [destination, setDestination] = useState<DestinationProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadDestination = async () => {
      try {
        const res = await fetch(`/api/v1/destinations/${handle}`)
        if (res.ok) {
          const data = await res.json()
          const d = data.destination || data
          if (!cancelled && d) {
            setDestination({
              handle: handle,
              name: String(d.name || handle),
              type: String(d.type || ''),
              location: String(d.location || ''),
              description: String(d.description || ''),
              highlights: Array.isArray(d.highlights) ? d.highlights : [],
              amenities: Array.isArray(d.amenities) ? d.amenities : [],
              capacity: d.capacity || { min: 0, max: 0, standard: 0 },
              pricing: d.pricing || { weekday: '', weekend: '', peakSeason: '' },
              stats: {
                totalEvents: Number(d.stats?.total_events || d.stats?.totalEvents || 0),
                averageRating: Number(d.stats?.average_rating || d.stats?.averageRating || 0),
                yearsOperating: Number(d.stats?.years_operating || d.stats?.yearsOperating || 0),
                acres: Number(d.stats?.acres || 0)
              },
              contact: d.contact || { phone: '', email: '', website: '' }
            })
          }
        }
      } catch (error) {
        logger.error('Error loading destination:', error)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadDestination()

    return () => { cancelled = true }
  }, [handle])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading destination...</div>
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Destination Header */}
      <section className="py-12 px-4 bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5">
        <div className="container mx-auto max-w-6xl">
          <Button variant="ghost" size="sm" asChild className="mb-6">
            <Link href={`/d/${handle}`}>
              <ArrowLeft className="h-4 w-4 mr-2"/>
              Back to {destination.name}
            </Link>
          </Button>

          <div className="flex items-center gap-4 mb-4">
            <Badge variant="secondary">{destination.type}</Badge>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1"/>
              {destination.location}
            </div>
          </div>

          <h1 className="text-4xl font-display font-bold mb-4">About {destination.name}</h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Description */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-line">{destination.description}</p>
                </CardContent>
              </Card>

              {destination.highlights.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Highlights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {destination.highlights.map((highlight: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-accent-primary mt-0.5"/>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {destination.amenities.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Amenities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-2">
                      {destination.amenities.map((amenity: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-accent-primary"/>
                          <span className="text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Rating</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1"/>
                      <span className="font-medium">{destination.stats.averageRating}</span>
                    </div>
                  </div>
                  <Separator/>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Events Hosted</span>
                    <span className="font-medium">{destination.stats.totalEvents}</span>
                  </div>
                  <Separator/>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Years Operating</span>
                    <span className="font-medium">{destination.stats.yearsOperating}</span>
                  </div>
                  <Separator/>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Capacity</span>
                    <span className="font-medium">{destination.capacity.min} - {destination.capacity.max}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {destination.contact.phone && (
                    <p className="text-sm">{destination.contact.phone}</p>
                  )}
                  {destination.contact.email && (
                    <p className="text-sm">{destination.contact.email}</p>
                  )}
                  {destination.contact.website && (
                    <Link href={destination.contact.website} className="text-sm text-accent-primary hover:underline">
                      {destination.contact.website}
                    </Link>
                  )}
                </CardContent>
              </Card>

              <Button className="w-full" asChild>
                <Link href={`/d/${handle}/inquire`}>Inquire Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
