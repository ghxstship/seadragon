
'use client'

import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { Header } from '@/lib/design-system'
import { logger } from '@/lib/logger'
import { MapPin, Calendar, Star, Users, Heart, Share2, HelpCircle, MessageSquare } from 'lucide-react'
import { useState, useEffect, use } from 'react'

interface Experience {
  id: string
  name: string
  image: string
  type: string
  rating: number
  reviewCount: number
  price: number
  duration: string
}

interface Event {
  id: string
  name: string
  date: string
  venue: string
  type: string
  price: string
}

interface DestinationData {
  slug: string
  name: string
  description: string
  longDescription: string
  category: string
  capacity: number
  rating: number
  reviewCount: number
  bestTimeToVisit: string
  weather: string
  transportation: string
  address: string
  highlights: string[]
  amenities: string[]
  nearbyAttractions: { name: string; distance: string; type: string }[]
}

interface DestinationDetailPageProps {
  params: Promise<{ slug: string }>
}

export default function DestinationDetailPage({ params }: DestinationDetailPageProps) {
  const { slug } = use(params)
  const [destination, setDestination] = useState<DestinationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('about')
  const [isFavorited, setIsFavorited] = useState(false)
  const [experiences, setExperiences] = useState<Experience[]>([])

  useEffect(() => {
    if (!slug) return
    let cancelled = false

    const loadDestination = async () => {
      try {
        // Fetch destination from events API (destinations could be venues)
        const res = await fetch(`/api/v1/ghxstship/events/${slug}`)
        if (res.ok) {
          const data = await res.json()
          const e = data.event
          if (e && !cancelled) {
            const mapped: DestinationData = {
              slug: String(e.slug || slug),
              name: String(e.name || e.venue_name || 'Destination'),
              description: String(e.description || ''),
              longDescription: String(e.long_description || e.description || ''),
              category: String(e.category || 'Venue'),
              capacity: Number(e.capacity) || 0,
              rating: 4.5,
              reviewCount: 0,
              bestTimeToVisit: 'Year-round',
              weather: 'Varies',
              transportation: 'Various options available',
              address: String(e.location || ''),
              highlights: Array.isArray(e.highlights) ? e.highlights : [],
              amenities: Array.isArray(e.amenities) ? e.amenities : [],
              nearbyAttractions: []
            }
            setDestination(mapped)
            setIsLoading(false)
          } else if (!cancelled) {
            // Fallback destination
            setDestination({
              slug: slug,
              name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              description: 'Explore this amazing destination.',
              longDescription: 'Discover unique experiences and attractions at this destination.',
              category: 'Destination',
              capacity: 0,
              rating: 4.5,
              reviewCount: 0,
              bestTimeToVisit: 'Year-round',
              weather: 'Varies by season',
              transportation: 'Various options available',
              address: '',
              highlights: [],
              amenities: [],
              nearbyAttractions: []
            })
            setIsLoading(false)
          }
        } else {
          if (!cancelled) {
            // Fallback destination
            setDestination({
              slug: slug,
              name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              description: 'Explore this amazing destination.',
              longDescription: 'Discover unique experiences and attractions at this destination.',
              category: 'Destination',
              capacity: 0,
              rating: 4.5,
              reviewCount: 0,
              bestTimeToVisit: 'Year-round',
              weather: 'Varies by season',
              transportation: 'Various options available',
              address: '',
              highlights: [],
              amenities: [],
              nearbyAttractions: []
            })
            setIsLoading(false)
          }
        }
      } catch (error) {
        logger.error('Error loading destination:', error)
        if (!cancelled) {
          setDestination({
            slug: slug,
            name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            description: 'Explore this amazing destination.',
            longDescription: 'Discover unique experiences and attractions at this destination.',
            category: 'Destination',
            capacity: 0,
            rating: 4.5,
            reviewCount: 0,
            bestTimeToVisit: 'Year-round',
            weather: 'Varies by season',
            transportation: 'Various options available',
            address: '',
            highlights: [],
            amenities: [],
            nearbyAttractions: []
          })
          setIsLoading(false)
        }
      }
    }

    loadDestination()

    return () => {
      cancelled = true
    }
  }, [slug])

  if (isLoading || !destination) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading destination...</div>
      </div>
    )
  }

  const destinationSlug = destination.slug

  const experiencesList: Experience[] = []

  const upcomingEvents: Event[] = []

  const faqs = slug === 'miami-beach'
    ? [
        { question: 'What\'s the best time to visit Miami Beach?', answer: 'December through April offers the best weather with mild temperatures and lower humidity. Avoid June through November during hurricane season.' },
        { question: 'How do I get around Miami Beach?', answer: 'Miami Beach has extensive public transportation including buses and the Metrorail. Rideshares like Uber and Lyft are also very popular.' },
        { question: 'Are there nude beaches in Miami Beach?', answer: 'Yes, Haulover Beach offers clothing-optional areas. Check local regulations and be respectful of others.' },
        { question: 'What\'s the nightlife like?', answer: 'Miami Beach has one of the best nightlife scenes in the world, especially in South Beach with clubs, bars, and live music venues.' }
      ]
    : slug === 'red-rocks-amphitheatre'
    ? [
        { question: 'Can I bring my own food and drinks?', answer: 'No outside food or drinks are allowed. The venue offers a variety of concession stands with food and beverages.' },
        { question: 'What should I wear to a concert?', answer: 'Dress for the weather - concerts can be outdoors in variable mountain conditions. Comfortable shoes are essential.' },
        { question: 'Are there ADA accessible seating options?', answer: 'Yes, Red Rocks offers accessible seating and facilities. Contact the venue for specific accommodations.' },
        { question: 'What\'s the best way to arrive?', answer: 'Parking is limited. Consider rideshares, public transit, or parking at nearby lots with shuttle service.' }
      ]
    : [
        { question: 'What\'s the best time to visit Austin for live music?', answer: 'Austin is vibrant year-round, but spring (March-May) and fall (September-November) offer the best weather. March is particularly exciting with SXSW.' },
        { question: 'How do I get around Austin?', answer: 'Capital Metro provides bus and light rail service. Ride-sharing (Uber/Lyft) and biking are popular. The city is very walkable downtown.' },
        { question: 'Are there age restrictions for venues?', answer: 'Most music venues are 21+ after 10 PM. Some daytime events and outdoor venues have no age restrictions.' },
        { question: 'What\'s the parking situation like?', answer: 'Parking can be challenging downtown and during events. Use public transit, rideshares, or park-and-ride options when possible.' }
      ]

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
            <Link href="/destinations" className="hover:text-foreground">Destinations</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{destination.name}</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative">
        <div className="h-96 bg-gradient-to-r from-accent-primary to-accent-secondary relative overflow-hidden">
          <div className="absolute inset-0 bg-neutral-900/30"/>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-primary-foreground">
              <h1 className="text-5xl font-display font-bold mb-4">{destination.name}</h1>
              <p className="text-xl max-w-2xl mx-auto">{destination.description}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsFavorited(!isFavorited)}
            className="bg-background/20 hover:bg-background/30"
          >
            <Heart className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-red-500 text-semantic-error' : ''}`}/>
            Save
          </Button>
          <Button variant="secondary" size="sm" className="bg-background/20 hover:bg-background/30">
            <Share2 className="h-4 w-4 mr-2"/>
            Share
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <MapPin className="h-8 w-8 text-accent-primary mx-auto mb-2"/>
              <div className="text-2xl font-bold">{destination.capacity.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">{destination.category === 'Outdoor Venue' ? 'Capacity' : 'Population'}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Star className="h-8 w-8 text-semantic-warning mx-auto mb-2"/>
              <div className="text-2xl font-bold">{destination.rating}</div>
              <div className="text-sm text-muted-foreground">{destination.reviewCount} reviews</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Calendar className="h-8 w-8 text-accent-secondary mx-auto mb-2"/>
              <div className="text-lg font-bold">{destination.bestTimeToVisit.split(' ')[0]}</div>
              <div className="text-sm text-muted-foreground">Best Time to Visit</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="h-8 w-8 text-accent-tertiary mx-auto mb-2"/>
              <div className="text-lg font-bold">{destination.category}</div>
              <div className="text-sm text-muted-foreground">Destination Type</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="experiences">Experiences</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-8">
            {/* Overview */}
            <Card>
              <CardHeader>
                <CardTitle>About {destination.name}</CardTitle>
                <CardDescription>
                  Discover what makes this destination special
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-lg leading-relaxed">{destination.longDescription}</p>

                <div>
                  <h3 className="font-semibold mb-3">Highlights</h3>
                  <div className="flex flex-wrap gap-2">
                    {destination.highlights.map((highlight: string, index: number) => (
                      <Badge key={index} variant="secondary">{highlight}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {destination.amenities.map((amenity: string, index: number) => (
                      <Badge key={index} variant="outline">{amenity}</Badge>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Best Time to Visit</h3>
                    <p className="text-muted-foreground">{destination.bestTimeToVisit}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Weather</h3>
                    <p className="text-muted-foreground">{destination.weather}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Getting There</h3>
                    <p className="text-muted-foreground">{destination.transportation}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Address</h3>
                    <p className="text-muted-foreground">{destination.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Nearby Attractions */}
            <Card>
              <CardHeader>
                <CardTitle>Nearby Attractions</CardTitle>
                <CardDescription>
                  Explore what&apos;s nearby
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {destination.nearbyAttractions.map((attraction: { name: string; distance: string; type: string }, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <MapPin className="h-5 w-5 text-accent-primary"/>
                      <div>
                        <div className="font-medium">{attraction.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {attraction.distance} • {attraction.type}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experiences" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-display font-bold">Things to Do</h2>
                <p className="text-muted-foreground">Discover amazing experiences in {destination.name}</p>
              </div>
              <Button>
                <Link href={`/destinations/${slug}/experiences`}>View All Experiences</Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {experiences.map((experience) => (
                <Card key={experience.id}>
                  <CardHeader className="p-0">
                    <img
                      src={experience.image}
                      alt={experience.name}
                      className="w-full h-48 object-cover rounded-t-lg"/>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{experience.name}</h3>
                      <Badge variant="outline">{experience.type}</Badge>
                    </div>
                    <div className="flex items-center space-x-1 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400"/>
                      <span className="text-sm">{experience.rating}</span>
                      <span className="text-sm text-muted-foreground">({experience.reviewCount})</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold">${experience.price}</div>
                        <div className="text-sm text-muted-foreground">{experience.duration}</div>
                      </div>
                      <Button size="sm">Book Now</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-display font-bold">Upcoming Events</h2>
                <p className="text-muted-foreground">
                  Don't miss these exciting events in {destination.name}
                </p>
              </div>
              <Button>
                <Link href={`/destinations/${slug}/events`}>View Event Calendar</Link>
              </Button>
            </div>

            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1"/>
                            {new Date(event.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1"/>
                            {event.venue}
                          </div>
                        </div>
                        <Badge variant="secondary">{event.type}</Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-accent-primary mb-2">{event.price}</div>
                        <Button size="sm">Get Tickets</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="faq" className="space-y-6">
            <div>
              <h2 className="text-2xl font-display font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">Common questions about visiting {destination.name}</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="p-6 text-center">
                <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
                <h3 className="text-lg font-semibold mb-2">Still have questions?</h3>
                <p className="text-muted-foreground mb-4">
                  Can&apos;t find the answer you&apos;re looking for? Contact our support team.
                </p>
                <Button>Contact Support</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-display font-bold">Guest Reviews</h2>
                <p className="text-muted-foreground">
                  What visitors are saying about {destination.name}
                </p>
              </div>
              <Button>
                <Link href={`/destinations/${slug}/reviews`}>Write a Review</Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-accent-primary mb-2">{destination.rating}</div>
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i: number) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(destination.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}`}/>
                    ))}
                  </div>
                  <div className="text-muted-foreground">
                    Based on {destination.reviewCount} reviews
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Rating Breakdown</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Overall Experience', rating: 4.8 },
                      { label: 'Entertainment', rating: 4.9 },
                      { label: 'Food & Dining', rating: 4.7 },
                      { label: 'Accommodations', rating: 4.5 },
                      { label: 'Value for Money', rating: 4.6 }
                    ].map((item, index: number) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm">{item.label}</span>
                        <div className="flex items-center space-x-1">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div
                              className="bg-accent-primary h-2 rounded-full"
                              style={{ width: `${(item.rating / 5) * 100}%` }}/>
                          </div>
                          <span className="text-sm font-medium w-8">{item.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold">Sarah M.</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i: number) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < 5 ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}`}/>
                          ))}
                        </div>
                      </div>
                      <h4 className="font-medium mb-2">Incredible Experience</h4>
                      <p className="text-muted-foreground mb-3">This destination exceeded all my expectations! The entertainment options are world-class and the local culture is vibrant and welcoming.</p>
                      <div className="text-sm text-muted-foreground">
                        January 15, 2026 • 12 people found this helpful
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <Button variant="outline" size="sm">Helpful</Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2"/>
                      Reply
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold">Mike R.</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i: number) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}`}/>
                          ))}
                        </div>
                      </div>
                      <h4 className="font-medium mb-2">Great Value for Money</h4>
                      <p className="text-muted-foreground mb-3">Amazing entertainment experiences at reasonable prices. The local scene is authentic and the hospitality is top-notch.</p>
                      <div className="text-sm text-muted-foreground">
                        January 8, 2026 • 8 people found this helpful
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <Button variant="outline" size="sm">Helpful</Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4 mr-2"/>
                      Reply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
