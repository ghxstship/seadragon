'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Header } from '@/lib/design-system'
import { logger } from '@/lib/logger'
import { MapPin, Phone, Mail, Globe, Clock, Star, Users, MessageSquare, Share2, Award, Building2, Calendar, DollarSign, CheckCircle } from 'lucide-react'

interface ProfessionalProfile {
  handle: string
  name: string
  type: string
  tagline: string
  description: string
  logo: string
  coverImage: string
  location: string
  phone: string
  email: string
  website: string
  founded: string
  verified: boolean
  badges: string[]
  stats: { rating: number; reviews: number; capacity: number; eventsHosted: number }
  hours: Record<string, string>
  services: string[]
  specialties: string[]
  pricing: { range: string; average: string }
}

interface ProfessionalProfilePageProps {
  params: Promise<{ handle: string }>
}

export default function ProfessionalProfilePage({ params }: ProfessionalProfilePageProps) {
  const { handle } = use(params)
  const [activeTab, setActiveTab] = useState('overview')
  const [professional, setProfessional] = useState<ProfessionalProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!handle) return
    let cancelled = false

    const loadProfessional = async () => {
      try {
        const res = await fetch(`/api/v1/professionals/${handle}`)
        if (res.ok) {
          const data = await res.json()
          const p = data.professional || data
          if (!cancelled && p) {
            setProfessional({
              handle: handle,
              name: String(p.name || handle),
              type: String(p.type || ''),
              tagline: String(p.tagline || ''),
              description: String(p.description || ''),
              logo: p.logo || '/placeholder-logo.jpg',
              coverImage: p.cover_image || p.coverImage || '/placeholder-cover.jpg',
              location: String(p.location || ''),
              phone: String(p.phone || ''),
              email: String(p.email || ''),
              website: String(p.website || ''),
              founded: String(p.founded || ''),
              verified: Boolean(p.verified),
              badges: Array.isArray(p.badges) ? p.badges : [],
              stats: {
                rating: Number(p.stats?.rating || 0),
                reviews: Number(p.stats?.reviews || 0),
                capacity: Number(p.stats?.capacity || 0),
                eventsHosted: Number(p.stats?.events_hosted || p.stats?.eventsHosted || 0)
              },
              hours: p.hours || {},
              services: Array.isArray(p.services) ? p.services : [],
              specialties: Array.isArray(p.specialties) ? p.specialties : [],
              pricing: p.pricing || { range: '', average: '' }
            })
          }
        }
      } catch (error) {
        logger.error('Error loading professional:', error)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadProfessional()

    return () => { cancelled = true }
  }, [handle])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading professional...</div>
      </div>
    )
  }

  if (!professional) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Professional Not Found</h1>
          <p className="text-muted-foreground">The professional @{handle} does not exist.</p>
          <Link href="/" className="text-accent-primary mt-4 inline-block">Go Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-accent-primary to-accent-secondary relative">
        <Image
          src={professional.coverImage}
          alt={`${professional.name} cover`}
          fill
          className="object-cover"/>
        <div className="absolute inset-0 bg-neutral-900/20"/>
      </div>

      {/* Profile Header */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-background rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="w-32 h-32 border-4 border-background">
              <AvatarImage src={professional.logo} alt={professional.name}/>
              <AvatarFallback className="text-2xl">
                <Building2 className="h-16 w-16"/>
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-3xl font-display font-bold">{professional.name}</h1>
                {professional.verified && (
                  <Badge variant="secondary" className="bg-accent-primary text-primary-foreground">
                    <CheckCircle className="h-3 w-3 mr-1"/>
                    Verified {professional.type}
                  </Badge>
                )}
              </div>

              <p className="text-lg text-accent-primary font-medium mb-2">{professional.tagline}</p>

              <div className="flex items-center space-x-4 text-muted-foreground mb-3">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1"/>
                  {professional.location}
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-1"/>
                  Est. {professional.founded}
                </div>
              </div>

              <p className="text-muted-foreground mb-4 max-w-2xl">{professional.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {professional.badges.map((badge, index) => (
                  <Badge key={index} variant="outline">
                    <Award className="h-3 w-3 mr-1"/>
                    {badge}
                  </Badge>
                ))}
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 mb-4 text-sm">
                {professional.phone && (
                  <div className="flex items-center text-muted-foreground">
                    <Phone className="h-4 w-4 mr-1"/>
                    {professional.phone}
                  </div>
                )}
                {professional.email && (
                  <div className="flex items-center text-muted-foreground">
                    <Mail className="h-4 w-4 mr-1"/>
                    {professional.email}
                  </div>
                )}
                {professional.website && (
                  <a
                    href={professional.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-accent-primary hover:underline"
                  >
                    <Globe className="h-4 w-4 mr-1"/>
                    Website
                  </a>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button>
                  <Calendar className="h-4 w-4 mr-2"/>
                  Book Now
                </Button>
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2"/>
                  Contact
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
                <div className="text-2xl font-bold text-accent-primary">{professional.stats.rating}</div>
                <div className="flex justify-center mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(professional.stats.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}`}/>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">{professional.stats.reviews.toLocaleString()} reviews</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-primary">{professional.stats.capacity.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Capacity</div>
              </div>
              {professional.stats.eventsHosted > 0 && (
                <>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent-primary">{professional.stats.eventsHosted.toLocaleString()}+</div>
                    <div className="text-sm text-muted-foreground">Events Hosted</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-accent-primary">{professional.pricing.range}</div>
                    <div className="text-sm text-muted-foreground">{professional.pricing.average}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="info">Info</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Services */}
              <Card>
                <CardHeader>
                  <CardTitle>Services & Amenities</CardTitle>
                  <CardDescription>What we offer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    {professional.services.map((service, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-accent-primary"/>
                        <span className="text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Specialties */}
              <Card>
                <CardHeader>
                  <CardTitle>Specialties</CardTitle>
                  <CardDescription>Our signature offerings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {professional.specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary">{specialty}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2"/>
                  Hours of Operation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Monday</span>
                      <span>{professional.hours.monday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Tuesday</span>
                      <span>{professional.hours.tuesday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Wednesday</span>
                      <span>{professional.hours.wednesday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Thursday</span>
                      <span>{professional.hours.thursday}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Friday</span>
                      <span>{professional.hours.friday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Saturday</span>
                      <span>{professional.hours.saturday}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Sunday</span>
                      <span>{professional.hours.sunday}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            {upcomingEvents.length > 0 ? (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-display font-bold">Upcoming Events</h2>
                    <p className="text-muted-foreground">What&apos;s happening at {professional.name}</p>
                  </div>
                  <Button>
                    <Link href={`/pro/${handle}/events`}>View All Events</Link>
                  </Button>
                </div>

                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <Card key={event.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
                            <p className="text-accent-primary font-medium mb-2">{event.artist}</p>
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
                            </div>
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
              </>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4"/>
                  <h3 className="text-xl font-semibold mb-2">No Upcoming Events</h3>
                  <p className="text-muted-foreground mb-4">
                    {professional.name} doesn&apos;t have any public events scheduled at this time.
                  </p>
                  <Button>Contact for Private Events</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-display font-bold">Customer Reviews</h2>
                <p className="text-muted-foreground">
                  What guests are saying about {professional.name}
                </p>
              </div>
              <Button>
                <Link href={`/pro/${handle}/reviews`}>Write a Review</Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardContent className="pt-6 text-center">
                  <div className="text-4xl font-bold text-accent-primary mb-2">{professional.stats.rating}</div>
                  <div className="flex justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < Math.floor(professional.stats.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}`}/>
                    ))}
                  </div>
                  <div className="text-muted-foreground">
                    Based on {professional.stats.reviews.toLocaleString()} reviews
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-4">Rating Breakdown</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Overall Experience', rating: 4.8 },
                      { label: 'Quality', rating: 4.9 },
                      { label: 'Service', rating: 4.7 },
                      { label: 'Value', rating: 4.6 },
                      { label: 'Ambiance', rating: 4.8 }
                    ].map((item, index) => (
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
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-semibold">{review.author}</span>
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-neutral-300'}`}/>
                            ))}
                          </div>
                        </div>
                        <h4 className="font-medium mb-2">{review.title}</h4>
                        <p className="text-muted-foreground mb-3">{review.content}</p>
                        <div className="text-sm text-muted-foreground">
                          {new Date(review.date).toLocaleDateString()} • {review.helpful} people found this helpful
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
              ))}
            </div>
          </TabsContent>

          <TabsContent value="info" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Get in touch</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-accent-primary mt-0.5"/>
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">{professional.location}</p>
                    </div>
                  </div>
                  {professional.phone && (
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-accent-primary"/>
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">{professional.phone}</p>
                      </div>
                    </div>
                  )}
                  {professional.email && (
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-accent-primary"/>
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{professional.email}</p>
                      </div>
                    </div>
                  )}
                  {professional.website && (
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-accent-primary"/>
                      <div>
                        <p className="font-medium">Website</p>
                        <a
                          href={professional.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-accent-primary hover:underline"
                        >
                          {professional.website}
                        </a>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Business Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Business Details</CardTitle>
                  <CardDescription>About our operation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Building2 className="h-5 w-5 text-accent-primary"/>
                    <div>
                      <p className="font-medium">Type</p>
                      <p className="text-sm text-muted-foreground">{professional.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="h-5 w-5 text-accent-primary"/>
                    <div>
                      <p className="font-medium">Founded</p>
                      <p className="text-sm text-muted-foreground">{professional.founded}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-accent-primary"/>
                    <div>
                      <p className="font-medium">Price Range</p>
                      <p className="text-sm text-muted-foreground">{professional.pricing.average}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-accent-primary"/>
                    <div>
                      <p className="font-medium">Capacity</p>
                      <p className="text-sm text-muted-foreground">{professional.stats.capacity.toLocaleString()} people</p>
                    </div>
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
