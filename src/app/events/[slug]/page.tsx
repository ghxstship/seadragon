
'use client'

import { useState, useEffect, use } from "react"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { logger } from "@/lib/logger"

interface EventData {
  slug: string
  name: string
  description: string
  longDescription: string
  date: string
  endDate?: string
  venue: string
  address: string
  capacity: number
  status: string
  featured: boolean
  ticketPrice: number
  images: string[]
  categories: string[]
  lineup: string[]
  schedule: { day: string; time: string; artist: string; stage: string }[]
  tickets: { type: string; price: number; available: number }[]
}

interface EventPageProps {
  params: Promise<{ slug: string }>
}

export default function EventDetailPage({ params }: EventPageProps) {
  const { slug } = use(params)
  const [event, setEvent] = useState<EventData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFoundState, setNotFoundState] = useState(false)

  useEffect(() => {
    if (!slug) return
    let cancelled = false

    const loadEvent = async () => {
      try {
        const res = await fetch(`/api/v1/ghxstship/events/${slug}`)
        if (res.ok) {
          const data = await res.json()
          const e = data.event
          if (e && !cancelled) {
            const mapped: EventData = {
              slug: String(e.slug || slug),
              name: String(e.name || 'Untitled Event'),
              description: String(e.description || ''),
              longDescription: String(e.long_description || e.description || ''),
              date: e.start_date || '',
              endDate: e.end_date || undefined,
              venue: String(e.venue_name || ''),
              address: String(e.location || ''),
              capacity: Number(e.capacity) || 0,
              status: String(e.status || 'draft'),
              featured: Boolean(e.featured),
              ticketPrice: Number(e.ticket_price) || 0,
              images: Array.isArray(e.images) ? e.images : [],
              categories: Array.isArray(e.categories) ? e.categories : [],
              lineup: Array.isArray(e.lineup) ? e.lineup : [],
              schedule: Array.isArray(e.schedule) ? e.schedule : [],
              tickets: Array.isArray(e.tickets) ? e.tickets : []
            }
            setEvent(mapped)
            setIsLoading(false)
          } else if (!cancelled) {
            setNotFoundState(true)
            setIsLoading(false)
          }
        } else {
          if (!cancelled) {
            setNotFoundState(true)
            setIsLoading(false)
          }
        }
      } catch (error) {
        logger.error('Error loading event:', error)
        if (!cancelled) {
          setNotFoundState(true)
          setIsLoading(false)
        }
      }
    }

    loadEvent()

    return () => {
      cancelled = true
    }
  }, [slug])

  if (notFoundState) {
    notFound()
  }

  if (isLoading || !event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading event...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-display font-bold">ATLVS + GVTEWAY</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-sm font-medium hover:text-accent-primary">Home</a>
            <a href="/search" className="text-sm font-medium hover:text-accent-primary">Search</a>
            <a href="/destinations" className="text-sm font-medium hover:text-accent-primary">Destinations</a>
            <a href="/experiences" className="text-sm font-medium hover:text-accent-primary">Experiences</a>
            <a href="/events" className="text-sm font-medium hover:text-accent-primary">Events</a>
            <a href="/about" className="text-sm font-medium hover:text-accent-primary">About</a>
          </nav>
          <div className="flex items-center space-x-2">
            <Button variant="ghost">Sign In</Button>
            <Button>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20">
        <div className="absolute inset-0 bg-neutral-900/50"/>
        <div className="relative container mx-auto px-4 py-20 h-full flex items-center">
          <div className="max-w-4xl">
            <div className="flex flex-wrap gap-2 mb-4">
              {event.categories.map((category) => (
                <Badge key={slug} variant="secondary">
                  {slug}
                </Badge>
              ))}
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-primary-foreground mb-6">
              {event.name}
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl">
              {event.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90">
                Get Tickets - From ${event.ticketPrice}
              </Button>
              <Button size="lg" variant="outline" className="border-white text-primary-foreground hover:bg-background hover:text-foreground">
                View Lineup
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* About */}
            <section>
              <h2 className="text-3xl font-display font-bold mb-6">About This Event</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {event.longDescription || event.description}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This event brings together world-class entertainment with cutting-edge production
                  to create unforgettable experiences for all attendees. Join us for an evening
                  (or weekend) of exceptional live entertainment.
                </p>
              </div>
            </section>

            {/* Lineup */}
            <section>
              <h2 className="text-3xl font-display font-bold mb-6">Lineup</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {event.lineup.map((artist, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{artist}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video bg-muted rounded-lg mb-4"/>
                      <p className="text-sm text-muted-foreground">
                        World-renowned artist bringing their unique sound to the stage.
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Schedule */}
            <section>
              <h2 className="text-3xl font-display font-bold mb-6">Schedule</h2>
              <div className="space-y-6">
                {event.schedule?.map((item, index) => (
                  <div key={index} className="flex items-center space-x-6 p-4 border rounded-lg">
                    <div className="text-center min-w-0">
                      <p className="font-semibold text-lg">{item.time}</p>
                      <p className="text-sm text-muted-foreground">{item.day}</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{item.artist}</p>
                      <p className="text-sm text-muted-foreground">{item.stage}</p>
                    </div>
                    <Badge variant="outline">{item.stage}</Badge>
                  </div>
                ))}
              </div>
            </section>

            {/* Venue Info */}
            <section>
              <h2 className="text-3xl font-display font-bold mb-6">Venue Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Venue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold text-lg">{event.venue}</p>
                    <p className="text-sm text-muted-foreground">{event.address}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Capacity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-accent-primary">
                      {event.capacity?.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Total capacity</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Date & Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-semibold">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    {event.endDate && event.endDate !== event.date && (
                      <p className="text-sm text-muted-foreground">
                        to {new Date(event.endDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge variant={event.status === 'confirmed' ? 'default' : 'secondary'} className="text-base px-3 py-1">
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </Badge>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tickets */}
            <Card>
              <CardHeader>
                <CardTitle>Tickets</CardTitle>
                <CardDescription>Select your ticket type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.tickets?.map((ticket, index) => (
                  <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <p className="font-semibold">{ticket.type}</p>
                      <p className="text-sm text-muted-foreground">
                        {ticket.available.toLocaleString()} available
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${ticket.price}</p>
                      <Button size="sm" className="mt-2">Select</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Event Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full">Buy Tickets</Button>
                <Button variant="outline" className="w-full">Add to Calendar</Button>
                <Button variant="outline" className="w-full">Share Event</Button>
                <Button variant="outline" className="w-full">Download Poster</Button>
              </CardContent>
            </Card>

            {/* Event Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Total Capacity</span>
                  <span className="text-sm font-semibold">{event.capacity?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Artists</span>
                  <span className="text-sm font-semibold">{event.lineup?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Duration</span>
                  <span className="text-sm font-semibold">
                    {event.endDate && event.endDate !== event.date ? 'Multi-day' : 'Single day'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
