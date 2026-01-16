
'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { logger } from "@/lib/logger"

interface Destination {
  name: string
  location: string
  type: string
  capacity: string
  description: string
  image: string
  slug?: string
}

export default function Destinations() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadDestinations = async () => {
      try {
        // Fetch destinations from proper API endpoint
        const res = await fetch('/api/v1/destinations?limit=20')
        if (res.ok) {
          const data = await res.json()
          const destinationsData = data.data?.destinations || data.destinations || []
          // Map to destination shape
          const mapped: Destination[] = destinationsData.map((d: { id?: string; name?: string; state?: string; country?: string; code?: string }) => ({
            name: String(d.name || 'Destination'),
            location: d.state ? `${d.state}, ${d.country || 'USA'}` : String(d.country || ''),
            type: 'Region',
            capacity: 'Various',
            description: `Explore experiences in ${d.name || 'this destination'}`,
            image: '/api/placeholder/400/300',
            slug: d.code || String(d.id)
          }))
          if (!cancelled) {
            setDestinations(mapped)
            setIsLoading(false)
          }
        } else {
          logger.error('Error fetching destinations: API returned non-OK status')
          if (!cancelled) {
            setDestinations([])
            setIsLoading(false)
          }
        }
      } catch (error) {
        logger.error('Error loading destinations:', error)
        if (!cancelled) {
          setDestinations([])
          setIsLoading(false)
        }
      }
    }

    loadDestinations()

    return () => {
      cancelled = true
    }
  }, [])
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Discover Amazing Destinations
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            From intimate theaters to massive festival grounds, find the perfect venue for your next unforgettable experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              Explore All Destinations
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              View Interactive Map
            </Button>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <div className="text-muted-foreground text-sm">
                    {destination.name}
                    <br/>
                    Image Placeholder
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="flex items-start justify-between">
                    <span>{destination.name}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {destination.type}
                    </span>
                  </CardTitle>
                  <CardDescription className="flex items-center justify-between">
                    <span>{destination.location}</span>
                    <span className="text-sm">
                      Capacity: {destination.capacity}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {destination.description}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1">
                      Book Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              Why Choose Our Destinations?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Curated venues and locations that deliver exceptional experiences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Vetted Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Every destination is thoroughly vetted for quality, safety, and operational excellence.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Global Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access to venues worldwide, from intimate theaters to massive festival grounds.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Expert Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Dedicated venue specialists and technical support for seamless productions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl font-display font-bold mb-4">
            Ready to Bring Your Vision to Life?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Connect with venue operators and start planning your next event.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              List Your Venue
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 G H X S T S H I P Industries LLC. ATLVS + GVTEWAY Super App.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
