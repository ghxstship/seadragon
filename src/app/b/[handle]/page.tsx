
'use client'

import { useState, useEffect, use } from 'react'
import Image from "next/image"
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/lib/design-system'
import { logger } from '@/lib/logger'
import { MapPin, Calendar, Star, Users, Building2, Award, Globe, Phone, Mail, Heart, Share2, ShoppingBag, Music, Camera, ChefHat } from 'lucide-react'

interface BrandProfile {
  handle: string
  name: string
  category: string
  tagline: string
  description: string
  logo: string
  coverImage: string
  location: string
  founded: string
  verified: boolean
  badges: string[]
  website: string
  socialLinks: { twitter?: string; instagram?: string; facebook?: string }
  stats: { followers: number; events: number; partnerships: number; reach: string }
  products: { name: string; description: string; price: string }[]
  upcomingEvents: { id: number; name: string; date: string; type: string; attendees?: number; location?: string }[]
  partnerships: { name: string; logo?: string; description?: string }[]
}

interface BrandProfilePageProps {
  params: Promise<{ handle: string }>
}

export default function BrandProfilePage({ params }: BrandProfilePageProps) {
  const { handle } = use(params)
  const [activeTab, setActiveTab] = useState('overview')
  const [brand, setBrand] = useState<BrandProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadBrand = async () => {
      try {
        const res = await fetch(`/api/v1/brands/${handle}`)
        if (res.ok) {
          const data = await res.json()
          const b = data.brand || data
          if (!cancelled && b) {
            setBrand({
              handle: handle,
              name: String(b.name || handle),
              category: String(b.category || ''),
              tagline: String(b.tagline || ''),
              description: String(b.description || ''),
              logo: b.logo || '/placeholder-logo.jpg',
              coverImage: b.cover_image || b.coverImage || '/placeholder-cover.jpg',
              location: String(b.location || ''),
              founded: String(b.founded || ''),
              verified: Boolean(b.verified),
              badges: Array.isArray(b.badges) ? b.badges : [],
              website: String(b.website || ''),
              socialLinks: b.social_links || b.socialLinks || {},
              stats: {
                followers: Number(b.stats?.followers || 0),
                events: Number(b.stats?.events || 0),
                partnerships: Number(b.stats?.partnerships || 0),
                reach: String(b.stats?.reach || 'Global')
              },
              products: Array.isArray(b.products) ? b.products : [],
              upcomingEvents: Array.isArray(b.upcoming_events || b.upcomingEvents) ? (b.upcoming_events || b.upcomingEvents) : [],
              partnerships: Array.isArray(b.partnerships) ? b.partnerships : []
            })
          }
        }
      } catch (error) {
        logger.error('Error loading brand:', error)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadBrand()

    return () => { cancelled = true }
  }, [handle])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading brand...</div>
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Brand Not Found</h1>
          <p className="text-muted-foreground">The brand @{handle} does not exist.</p>
          <Link href="/" className="text-accent-primary mt-4 inline-block">Go Home</Link>
        </div>
      </div>
    )
  }

  const brandData = {
    handle: handle,
    name: handle === 'sxsw' ? 'SXSW' : handle === 'spotify' ? 'Music2' : 'Red Bull',
    category: handle === 'sxsw' ? 'Festival & Conference' : handle === 'spotify' ? 'Music Streaming' : 'Energy Drinks',
    tagline: handle === 'sxsw'
      ? 'Where creativity and commerce collide'
      : handle === 'spotify'
      ? 'Music for everyone'
      : 'Gives you wings',
    description: handle === 'sxsw'
      ? 'SXSW is the premier destination for music, film, and interactive professionals. Since 1987, SXSW has celebrated the convergence of the interactive, music, and film industries and continues to be the place where the most innovative and forward-thinking creators gather.'
      : handle === 'spotify'
      ? 'Music2 is a digital music, podcast, and video streaming service that gives you access to millions of songs and other content from artists all over the world. Discover, manage and share playlists, listen to the radio, and enjoy music with friends.'
      : 'Red Bull is an energy drink sold by Red Bull GmbH, an Austrian company. Red Bull has the highest market share of energy drinks in the world, with 7.5 billion cans sold in a year. Red Bull is also known for sponsoring extreme sports events.',
    logo: '/api/placeholder/150/150',
    coverImage: '/api/placeholder/1200/400',
    location: handle === 'sxsw' ? 'Austin, TX' : handle === 'spotify' ? 'Stockholm, Sweden' : 'Fuschl am See, Austria',
    founded: handle === 'sxsw' ? '1987' : handle === 'spotify' ? '2006' : '1987',
    verified: true,
    badges: handle === 'sxsw'
      ? ['Music Festival', 'Tech Conference', 'Film Festival', 'Innovation Hub']
      : handle === 'spotify'
      ? ['Music Streaming', 'Podcast Platform', 'Global Reach', 'Artist Support']
      : ['Energy Drinks', 'Extreme Sports', 'Event Sponsorship', 'Global Brand'],
    website: handle === 'sxsw' ? 'https://sxsw.com' : handle === 'spotify' ? 'https://spotify.com' : 'https://redbull.com',
    socialLinks: {
      twitter: handle === 'sxsw' ? '@sxsw' : handle === 'spotify' ? '@Music2' : '@redbull',
      instagram: handle === 'sxsw' ? '@sxsw' : handle === 'spotify' ? '@Music2' : '@redbull',
      facebook: handle === 'sxsw' ? 'sxsw' : handle === 'spotify' ? 'Music2' : 'redbull'
    },
    stats: {
      followers: handle === 'sxsw' ? 125000 : handle === 'spotify' ? 8500000 : 12000000,
      events: handle === 'sxsw' ? 1200 : handle === 'spotify' ? 0 : 5000,
      partnerships: handle === 'sxsw' ? 200 : handle === 'spotify' ? 1000 : 300,
      reach: handle === 'sxsw' ? 'Global' : handle === 'spotify' ? '200+ countries' : 'Global'
    },
    products: handle === 'sxsw'
      ? []
      : handle === 'spotify'
      ? [
          { name: 'Music2 Premium', description: 'Ad-free music listening, offline playback, and unlimited skips', price: '$9.99/month' },
          { name: 'Music2 for Artists', description: 'Tools and insights for musicians and creators', price: 'Free' },
          { name: 'Music2 Wrapped', description: 'Your personalized music year in review', price: 'Free' }
        ]
      : [
          { name: 'Red Bull Energy Drink', description: 'The original energy drink with caffeine and taurine', price: '$2.99/can' },
          { name: 'Red Bull Sugarfree', description: 'Zero sugar energy drink with the same great taste', price: '$2.99/can' },
          { name: 'Red Bull Editions', description: 'Limited edition flavors and seasonal varieties', price: '$3.49/can' }
        ],
    upcomingEvents: handle === 'sxsw'
      ? [
          { id: 1, name: 'SXSW 2026 Music Festival', date: '2026-03-14', type: 'Music Festival', attendees: 25000 },
          { id: 2, name: 'SXSW 2026 Film Festival', date: '2026-03-07', type: 'Film Festival', attendees: 15000 },
          { id: 3, name: 'SXSW 2026 Interactive', date: '2026-03-08', type: 'Tech Conference', attendees: 30000 }
        ]
      : handle === 'spotify'
      ? []
      : [
          { id: 1, name: 'Red Bull Air Race', date: '2026-04-12', type: 'Air Racing', location: 'Various Cities' },
          { id: 2, name: 'Red Bull Rampage', date: '2026-10-15', type: 'Mountain Biking', location: 'Utah, USA' },
          { id: 3, name: 'Red Bull BC One', date: '2026-11-20', type: 'Breakdancing', location: 'Various Cities' }
        ],
    partnerships: handle === 'sxsw'
      ? ['Austin Convention Center', 'Various Music Venues', 'Tech Companies', 'Film Studios']
      : handle === 'spotify'
      ? ['Major Record Labels', 'Independent Artists', 'Podcasters', 'Music Publishers']
      : ['Extreme Sports Athletes', 'Event Organizers', 'Music Festivals', 'Gaming Companies']
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Cover Image */}
      <div className="h-48 bg-gradient-to-r from-accent-primary to-accent-secondary relative">
        <Image
          src={brand.coverImage}
          alt={`${brand.name} cover`}
          fill
          className="object-cover"/>
        <div className="absolute inset-0 bg-neutral-900/20"/>
      </div>

      {/* Profile Header */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-background rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="w-32 h-32 bg-background rounded-lg border-4 border-background flex items-center justify-center">
              <Image
                src={brand.logo}
                alt={brand.name}
                width={96}
                height={96}
                className="w-24 h-24 object-contain"/>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h1 className="text-3xl font-display font-bold">{brand.name}</h1>
                {brand.verified && (
                  <Badge variant="secondary" className="bg-accent-primary text-primary-foreground">
                    <Award className="h-3 w-3 mr-1"/>
                    Verified Brand
                  </Badge>
                )}
              </div>

              <p className="text-lg text-accent-primary font-medium mb-2">{brand.tagline}</p>

              <div className="flex items-center space-x-4 text-muted-foreground mb-3">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1"/>
                  {brand.location}
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-1"/>
                  Founded {brand.founded}
                </div>
              </div>

              <p className="text-muted-foreground mb-4 max-w-2xl">{brand.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {brand.badges.map((badge, index) => (
                  <Badge key={index} variant="outline">
                    {badge === 'Music Festival' && <Music className="h-3 w-3 mr-1"/>}
                    {badge === 'Energy Drinks' && <Award className="h-3 w-3 mr-1"/>}
                    {badge === 'Music Streaming' && <Music className="h-3 w-3 mr-1"/>}
                    {badge}
                  </Badge>
                ))}
              </div>

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 mb-4">
                {brand.website && (
                  <a
                    href={brand.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-accent-primary hover:underline"
                  >
                    <Globe className="h-4 w-4 mr-1"/>
                    Website
                  </a>
                )}
                <Link href={`/b/${handle}/contact`} className="flex items-center text-muted-foreground hover:text-accent-primary">
                  <Mail className="h-4 w-4 mr-1"/>
                  Contact
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button>
                  <Heart className="h-4 w-4 mr-2"/>
                  Follow Brand
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2"/>
                  Share
                </Button>
                {brand.products.length > 0 && (
                  <Button variant="outline">
                    <ShoppingBag className="h-4 w-4 mr-2"/>
                    Shop Products
                  </Button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-primary">{brand.stats.followers.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-primary">{brand.stats.reach}</div>
                <div className="text-sm text-muted-foreground">Market Reach</div>
              </div>
              {brand.stats.events > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-primary">{brand.stats.events.toLocaleString()}+</div>
                  <div className="text-sm text-muted-foreground">Events</div>
                </div>
              )}
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-primary">{brand.stats.partnerships.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Partnerships</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Brand Info */}
              <Card>
                <CardHeader>
                  <CardTitle>About {brand.name}</CardTitle>
                  <CardDescription>Brand background and mission</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Category</h3>
                    <Badge variant="secondary">{brand.category}</Badge>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Founded</h3>
                    <p className="text-muted-foreground">{brand.founded}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Headquarters</h3>
                    <p className="text-muted-foreground">{brand.location}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Market Reach</h3>
                    <p className="text-muted-foreground">{brand.stats.reach}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Social Presence */}
              <Card>
                <CardHeader>
                  <CardTitle>Social Presence</CardTitle>
                  <CardDescription>Connect with {brand.name} online</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {brand.socialLinks.twitter && (
                    <a
                      href={`https://twitter.com/${brand.socialLinks.twitter.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="w-8 h-8 bg-accent-primary rounded flex items-center justify-center">
                        <span className="text-primary-foreground text-sm font-bold">T</span>
                      </div>
                      <span>{brand.socialLinks.twitter}</span>
                    </a>
                  )}
                  {brand.socialLinks.instagram && (
                    <a
                      href={`https://instagram.com/${brand.socialLinks.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="w-8 h-8 bg-pink-500 rounded flex items-center justify-center">
                        <Camera className="h-4 w-4 text-primary-foreground"/>
                      </div>
                      <span>{brand.socialLinks.instagram}</span>
                    </a>
                  )}
                  {brand.socialLinks.facebook && (
                    <a
                      href={`https://facebook.com/${brand.socialLinks.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="w-8 h-8 bg-accent-secondary rounded flex items-center justify-center">
                        <span className="text-primary-foreground text-sm font-bold">f</span>
                      </div>
                      <span>{brand.socialLinks.facebook}</span>
                    </a>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Brand Values/Mission */}
            <Card>
              <CardHeader>
                <CardTitle>Brand Mission</CardTitle>
                <CardDescription>What drives {brand.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {brand.name} is committed to bringing people together through shared experiences and innovative solutions.
                    {brand.category === 'Festival & Conference'
                      ? ' We create platforms where creativity thrives and industry leaders connect.'
                      : brand.category === 'Music Streaming'
                      ? ' We believe music has the power to bring people together and fuel creativity worldwide.'
                      : ' We energize people to pursue their passions and live life to the fullest.'
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            {brand.products.length > 0 ? (
              <>
                <div>
                  <h2 className="text-2xl font-display font-bold mb-4">Products & Services</h2>
                  <p className="text-muted-foreground">What {brand.name} offers</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {brand.products.map((product, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-lg font-semibold">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">{product.price}</p>
                          </div>
                          <Badge variant="secondary">
                            {product.price === 'Free' ? 'Free' : 'Premium'}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">{product.description}</p>
                        <Button className="w-full" size="sm">
                          {product.price === 'Free' ? 'Get Started' : 'Learn More'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4"/>
                  <h3 className="text-xl font-semibold mb-2">No Products Listed</h3>
                  <p className="text-muted-foreground mb-4">
                    {brand.name} focuses on experiences and events rather than physical products.
                  </p>
                  <Button>
                    <Link href={`/b/${handle}/events`}>View Events</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            {brand.upcomingEvents.length > 0 ? (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-display font-bold">Upcoming Events</h2>
                    <p className="text-muted-foreground">Events featuring or sponsored by {brand.name}</p>
                  </div>
                  <Button>
                    <Link href={`/b/${handle}/events`}>View All Events</Link>
                  </Button>
                </div>

                <div className="space-y-4">
                  {brand.upcomingEvents.map((event) => (
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
                              {event.location && (
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1"/>
                                  {event.location}
                                </div>
                              )}
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1"/>
                                {event.attendees?.toLocaleString()} expected
                              </div>
                            </div>
                            <Badge variant="secondary">{event.type}</Badge>
                          </div>
                          <div className="text-right">
                            <Button size="sm" className="mb-2">Get Tickets</Button>
                            <p className="text-xs text-muted-foreground">Presented by {brand.name}</p>
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
                    {brand.name} doesn&apos;t have any upcoming events scheduled at this time.
                  </p>
                  <Button>
                    <Link href={`/b/${handle}/partnerships`}>View Partnerships</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="partnerships" className="space-y-6">
            <div>
              <h2 className="text-2xl font-display font-bold mb-4">Brand Partnerships</h2>
              <p className="text-muted-foreground">Collaborations and partnerships with {brand.name}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Strategic Partners</CardTitle>
                  <CardDescription>Key partnerships and collaborations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {brand.partnerships.map((partner, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-accent-primary/10 rounded flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-accent-primary"/>
                          </div>
                          <span className="font-medium">{partner.name}</span>
                        </div>
                        <Badge variant="outline">Partner</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Partnership Opportunities</CardTitle>
                  <CardDescription>Interested in partnering with {brand.name}?</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      {brand.name} is always looking for meaningful partnerships that align with our mission and values.
                      We work with venues, events, creators, and brands that share our commitment to quality and innovation.
                    </p>
                    <div className="space-y-2">
                      <h4 className="font-medium">Partnership Types:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Event Sponsorships</li>
                        <li>• Content Collaborations</li>
                        <li>• Venue Partnerships</li>
                        <li>• Artist Endorsements</li>
                      </ul>
                    </div>
                    <Button className="w-full">
                      <Mail className="h-4 w-4 mr-2"/>
                      Contact for Partnership
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Partnership Impact */}
            <Card>
              <CardHeader>
                <CardTitle>Partnership Impact</CardTitle>
                <CardDescription>The reach and influence of our partnerships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent-primary mb-2">{brand.stats.partnerships}</div>
                    <div className="text-sm text-muted-foreground">Active Partnerships</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent-primary mb-2">500K+</div>
                    <div className="text-sm text-muted-foreground">Combined Reach</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent-primary mb-2">95%</div>
                    <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
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
