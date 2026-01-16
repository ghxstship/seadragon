
'use client'

import { useState, useEffect, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/lib/design-system'
import { logger } from '@/lib/logger'
import { MapPin, Calendar, Star, Users, Building2, Award, Globe, Phone, Heart, Share2, Sun, Waves, Mountain } from 'lucide-react'

interface DestinationProfile {
  handle: string
  name: string
  type: string
  tagline: string
  description: string
  logo: string
  cover_image: string
  location: string
  website: string
  phone: string
  founded: string
  verified: boolean
  badges: string[]
  stats: {
    visitors: number
    events: number
    attractions: number
    rating: number
    reviews: number
  }
  highlights: { name: string; description: string; icon: string }[]
  featured_experiences: { id: number; name: string; category: string; rating: number; reviews: number; image: string }[]
}

interface DestinationProfilePageProps {
  params: Promise<{ handle: string }>
}

export default function DestinationProfilePage({ params }: DestinationProfilePageProps) {
  const { handle } = use(params)
  const [activeTab, setActiveTab] = useState('overview')
  const [destination, setDestination] = useState<DestinationProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Extract handle from params
  useEffect(() => {
  }, [params])

  // Fetch destination profile from API
  useEffect(() => {
    if (!handle) return
    const fetchDestination = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/v1/destinations/${handle}`)
        if (res.ok) {
          const data = await res.json()
          setDestination(data.destination || null)
        }
      } catch (error) {
        logger.error('Error fetching destination profile:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDestination()
  }, [handle])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading destination...</div>
      </div>
    )
  }

  // Show not found state
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

  // Data comes from API - use empty arrays as fallback
  const featuredExperiences = destination.featured_experiences || []
  const upcomingEvents: { id: number; name: string; date: string; venue: string; type: string; attendees: number }[] = []
  const seasons: { name: string; description: string; bestFor: string }[] = []

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-accent-primary to-accent-secondary relative">
        <img
          src={destination.cover_image}
          alt={`${destination.name} cover`}
          className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-neutral-900/20"/>
      </div>

      {/* Profile Header */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-background rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-32 h-32 bg-background rounded-lg border-4 border-background flex items-center justify-center">
              <img
                src={destination.logo}
                alt={destination.name}
                className="w-24 h-24 object-contain"/>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-3xl font-display font-bold">{destination.name}</h1>
                {destination.verified && (
                  <Badge variant="secondary" className="bg-accent-primary text-primary-foreground">
                    <Award className="h-3 w-3 mr-1"/>
                    Official Destination
                  </Badge>
                )}
              </div>

              <p className="text-lg text-accent-primary font-medium mb-2">{destination.tagline}</p>

              <div className="flex items-center space-x-4 text-muted-foreground mb-3">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1"/>
                  {destination.location}
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-1"/>
                  Established {destination.founded}
                </div>
              </div>

              <p className="text-muted-foreground mb-4 max-w-2xl">{destination.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {destination.badges.map((badge, index) => (
                  <Badge key={index} variant="outline">
                    {badge === 'Live Music Capital' && <Award className="h-3 w-3 mr-1"/>}
                    {badge === 'Beach Destination' && <Sun className="h-3 w-3 mr-1"/>}
                    {badge === 'Natural Wonder' && <Mountain className="h-3 w-3 mr-1"/>}
                    {badge}
                  </Badge>
                ))}
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 mb-4">
                {destination.website && (
                  <a
                    href={destination.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-accent-primary hover:underline"
                  >
                    <Globe className="h-4 w-4 mr-1"/>
                    Official Website
                  </a>
                )}
                {destination.phone && (
                  <div className="flex items-center text-muted-foreground">
                    <Phone className="h-4 w-4 mr-1"/>
                    {destination.phone}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button>
                  <Calendar className="h-4 w-4 mr-2"/>
                  Plan Your Visit
                </Button>
                <Button variant="outline">
                  <Heart className="h-4 w-4 mr-2"/>
                  Save Destination
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2"/>
                  Share
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-primary">{destination.stats.rating}</div>
                <div className="flex justify-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(destination.stats.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}`}/>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">{destination.stats.reviews.toLocaleString()} reviews</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-primary">{(destination.stats.visitors / 1000000).toFixed(1)}M</div>
                <div className="text-sm text-muted-foreground">Annual Visitors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-primary">{destination.stats.events.toLocaleString()}+</div>
                <div className="text-sm text-muted-foreground">Yearly Events</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-primary">{destination.stats.attractions}</div>
                <div className="text-sm text-muted-foreground">Attractions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="experiences">Experiences</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="seasons">Visit Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Top Highlights */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Highlights</CardTitle>
                  <CardDescription>Don't miss these must-see attractions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {destination.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="w-10 h-10 bg-accent-primary/10 rounded flex items-center justify-center flex-shrink-0">
                        {highlight.icon === 'waves' && <Waves className="h-5 w-5 text-accent-primary"/>}
                        {highlight.icon === 'music' && <Award className="h-5 w-5 text-accent-primary"/>}
                        {highlight.icon === 'building' && <Building2 className="h-5 w-5 text-accent-primary"/>}
                        {highlight.icon === 'sun' && <Sun className="h-5 w-5 text-accent-primary"/>}
                        {highlight.icon === 'mountain' && <Mountain className="h-5 w-5 text-accent-primary"/>}
                      </div>
                      <div>
                        <h4 className="font-medium">{highlight.name}</h4>
                        <p className="text-sm text-muted-foreground">{highlight.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Visitor Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Visitor Information</CardTitle>
                  <CardDescription>Plan your perfect trip</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Getting Here</h3>
                    <p className="text-sm text-muted-foreground">
                      {destination.handle === 'visit-austin' && 'Fly into Austin-Bergstrom International Airport (AUS) or drive via major highways. Public transit and rideshares available.'}
                      {destination.handle === 'red-rocks-park' && 'Fly into Denver International Airport (DEN) or drive via I-25. Limited parking at venue - consider rideshares.'}
                      {destination.handle === 'miami-beach' && 'Fly into Miami International Airport (MIA) or Fort Lauderdale (FLL). Extensive public transit and rideshare options.'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Best Time to Visit</h3>
                    <p className="text-sm text-muted-foreground">
                      {destination.handle === 'visit-austin' && 'Year-round, but spring (March-May) and fall (September-November) offer the best weather.'}
                      {destination.handle === 'red-rocks-park' && 'May-September for outdoor concerts and activities. Winter offers a different mountain experience.'}
                      {destination.handle === 'miami-beach' && 'December-April for perfect weather and fewer crowds. Summer for vibrant festivals.'}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Local Tips</h3>
                    <p className="text-sm text-muted-foreground">
                      {destination.handle === 'visit-austin' && 'Embrace "Keep Austin Weird" - try local BBQ, live music, and outdoor activities.'}
                      {destination.handle === 'red-rocks-park' && 'Arrive early for concerts. Bring layers - mountain weather changes quickly.'}
                      {destination.handle === 'miami-beach' && 'Visit during the day for beaches, evenings for nightlife. Art Deco district is a must-see.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Destination Mission */}
            <Card>
              <CardHeader>
                <CardTitle>Our Mission</CardTitle>
                <CardDescription>Why this destination matters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {destination.name} is committed to showcasing the unique character and cultural richness that makes our destination special.
                    {destination.handle === 'visit-austin'
                      ? ' We celebrate Austin\'s blend of live music heritage, technological innovation, and natural beauty while preserving the authentic spirit that makes Austin unlike anywhere else.'
                      : destination.handle === 'red-rocks-park'
                      ? ' We honor the natural wonder of Red Rocks while bringing world-class entertainment to our stunning mountain amphitheatre, creating unforgettable experiences for music lovers and nature enthusiasts alike.'
                      : ' We promote Miami Beach as a vibrant coastal paradise, embracing our diverse cultural heritage while providing exceptional experiences for visitors from around the world.'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experiences" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-display font-bold">Featured Experiences</h2>
                <p className="text-muted-foreground">Curated activities and tours in {destination.name}</p>
              </div>
              <Button>
                <Link href={`/d/${handle}/experiences`}>View All Experiences</Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destination.featuredExperiences.map((experience) => (
                <Card key={experience.id}>
                  <CardHeader className="p-0">
                    <Image
                      src={experience.image}
                      alt={experience.name}
                      width={400}
                      height={192}
                      className="w-full h-48 object-cover rounded-t-lg"/>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{experience.name}</h3>
                      <Badge variant="outline">{experience.category}</Badge>
                    </div>
                    <div className="flex items-center space-x-1 mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400"/>
                      <span className="text-sm">{experience.rating}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-bold">${experience.price}</div>
                        <div className="text-sm text-muted-foreground">per person</div>
                      </div>
                      <Button size="sm">Book Now</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            {destination.upcomingEvents.length > 0 ? (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-display font-bold">Upcoming Events</h2>
                    <p className="text-muted-foreground">Major events and festivals in {destination.name}</p>
                  </div>
                  <Button>
                    <Link href={`/d/${handle}/events`}>View Event Calendar</Link>
                  </Button>
                </div>

                <div className="space-y-4">
                  {destination.upcomingEvents.map((event) => (
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
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1"/>
                                {event.attendees?.toLocaleString()} expected
                              </div>
                            </div>
                            <Badge variant="secondary">{event.type}</Badge>
                          </div>
                          <div className="text-right">
                            <Button size="sm" className="mb-2">Get Tickets</Button>
                            <p className="text-xs text-muted-foreground">Official Event</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4"/>
                  <h3 className="text-xl font-semibold mb-2">Events Coming Soon</h3>
                  <p className="text-muted-foreground mb-4">
                    We're planning exciting events for {destination.name}. Check back soon for updates!
                  </p>
                  <Button>Subscribe for Updates</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="seasons" className="space-y-6">
            <div>
              <h2 className="text-2xl font-display font-bold mb-4">When to Visit</h2>
              <p className="text-muted-foreground">The best time for every type of traveler</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {destination.seasons.map((season, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{season.name}</CardTitle>
                    <CardDescription>{season.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Best For:</h4>
                      <p className="text-sm text-muted-foreground">{season.bestFor}</p>
                    </div>
                    <Badge variant="secondary">{season.name.split(' ')[0]}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Travel Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Travel Tips</CardTitle>
                <CardDescription>Make the most of your visit</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Getting Around</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Public transportation is excellent</li>
                      <li>• Rideshares available 24/7</li>
                      <li>• Walking is feasible downtown</li>
                      <li>• Bike rentals for eco-friendly travel</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Local Tips</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Try authentic local cuisine</li>
                      <li>• Respect local customs and culture</li>
                      <li>• Book experiences in advance</li>
                      <li>• Check weather before outdoor plans</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
