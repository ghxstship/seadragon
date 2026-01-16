
'use client'

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/lib/design-system"
import { logger } from "@/lib/logger"
import { MapPin, Plane, Hotel, Car, Compass, Star, Clock, ArrowRight, Search, Shield, Sparkles, Globe, Sun, Zap, CheckCircle } from "lucide-react"

interface DestinationApiResponse {
  id: string | number
  slug?: string
  name?: string
  country?: string
  location?: string
  description?: string
  image_url?: string
  image?: string
  rating?: number
  price_range?: string
  best_time?: string
  highlights?: string[]
  travel_time?: string
}

interface Destination {
  id: string
  name: string
  country: string
  description: string
  image: string
  rating: number
  priceRange: string
  bestTime: string
  highlights: string[]
  travelTime: string
}

interface Destination {
  id: string
  name: string
  country: string
  description: string
  image: string
  rating: number
  priceRange: string
  bestTime: string
  highlights: string[]
  travelTime: string
}

interface TravelService {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  features: string[]
  popular: boolean
}

interface PopularItinerary {
  id: string
  title: string
  destination: string
  duration: string
  price: string
  rating: number
  highlights: string[]
  image: string
}


export default function TravelPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContinent, setSelectedContinent] = useState("all")
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadDestinations = async () => {
      try {
        const res = await fetch('/api/v1/destinations')
        if (res.ok) {
          const data = await res.json()
          const dests = Array.isArray(data.destinations) ? data.destinations : []
          const mapped: Destination[] = dests.map((d: DestinationApiResponse) => ({
            id: String(d.slug || d.id),
            name: String(d.name || ''),
            country: String(d.country || d.location || ''),
            description: String(d.description || ''),
            image: d.image_url || d.image || '/placeholder-destination.jpg',
            rating: Number(d.rating) || 4.5,
            priceRange: String(d.price_range || '$$'),
            bestTime: String(d.best_time || 'Year-round'),
            highlights: Array.isArray(d.highlights) ? d.highlights : [],
            travelTime: String(d.travel_time || '')
          }))
          if (!cancelled) {
            setDestinations(mapped)
            setLoading(false)
          }
        } else {
          if (!cancelled) {
            setDestinations([])
            setLoading(false)
          }
        }
      } catch (error) {
        logger.error('Error loading destinations:', error)
        if (!cancelled) {
          setDestinations([])
          setLoading(false)
        }
      }
    }

    loadDestinations()

    return () => { cancelled = true }
  }, [])

  const travelServices: TravelService[] = [
    {
      id: "planning",
      name: "Trip Planning",
      description: "AI-powered itinerary creation and personalized recommendations",
      icon: Compass,
      href: "/travel/planning",
      features: ["AI Trip Planner", "Personalized Itineraries", "Local Expert Tips", "Budget Optimization"],
      popular: true
    },
    {
      id: "flights",
      name: "Flights",
      description: "Book flights with competitive prices and flexible options",
      icon: Plane,
      href: "/travel/flights",
      features: ["Price Comparison", "Flexible Booking", "24/7 Support", "Carbon Offset"],
      popular: false
    },
    {
      id: "accommodations",
      name: "Accommodations",
      description: "Hotels, resorts, vacation rentals, and unique stays",
      icon: Hotel,
      href: "/travel/accommodations",
      features: ["Verified Properties", "Best Price Guarantee", "Free Cancellation", "Local Support"],
      popular: true
    },
    {
      id: "transportation",
      name: "Transportation",
      description: "Ground transportation and local transit solutions",
      icon: Car,
      href: "/travel/transportation",
      features: ["Airport Transfers", "Local Guides", "Private Drivers", "Group Transport"],
      popular: false
    },
    {
      id: "rentals",
      name: "Rentals",
      description: "Car rentals, equipment, and adventure gear",
      icon: Car,
      href: "/travel/rentals",
      features: ["Vehicle Selection", "Equipment Rental", "Insurance Included", "24/7 Support"],
      popular: false
    },
    {
      id: "insurance",
      name: "Travel Insurance",
      description: "Comprehensive coverage for peace of mind",
      icon: Shield,
      href: "/travel/insurance",
      features: ["Trip Cancellation", "Medical Coverage", "Baggage Protection", "Emergency Support"],
      popular: false
    }
  ]

  const popularItineraries: PopularItinerary[] = [
    {
      id: "europe-grand-tour",
      title: "Europe Grand Tour",
      destination: "Multiple Countries",
      duration: "14 Days",
      price: "From $3,200",
      rating: 4.9,
      highlights: ["Paris Highlights", "Rome Ancient Sites", "Swiss Alps", "Venice Canals"],
      image: "/api/placeholder/300/200"
    },
    {
      id: "japan-cultural-journey",
      title: "Japan Cultural Journey",
      destination: "Japan",
      duration: "10 Days",
      price: "From $2,800",
      rating: 4.8,
      highlights: ["Tokyo Modern Life", "Kyoto Temples", "Mount Fuji", "Traditional Onsen"],
      image: "/api/placeholder/300/200"
    },
    {
      id: "bali-spiritual-retreat",
      title: "Bali Spiritual Retreat",
      destination: "Bali, Indonesia",
      duration: "7 Days",
      price: "From $1,600",
      rating: 4.7,
      highlights: ["Ubud Healing", "Beach Yoga", "Temple Visits", "Meditation Retreat"],
      image: "/api/placeholder/300/200"
    }
  ]

  const continents = [
    { value: "all", label: "All Continents" },
    { value: "europe", label: "Europe" },
    { value: "asia", label: "Asia" },
    { value: "americas", label: "Americas" },
    { value: "africa", label: "Africa" },
    { value: "oceania", label: "Oceania" }
  ]

  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.country.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesContinent = selectedContinent === "all" ||
                            dest.country.toLowerCase().includes(selectedContinent.toLowerCase())
    return matchesSearch && matchesContinent
  })

  const handleDestinationClick = (destinationId: string) => {
    router.push(`/destinations/${destinationId}`)
  }

  const handleItineraryClick = (itineraryId: string) => {
    router.push(`/travel/itineraries/${itineraryId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header/>
        <div className="container mx-auto px-4 py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded w-1/3 mx-auto"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-accent-primary/10 via-accent-secondary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-primary/20 rounded-full mb-6">
              <Globe className="h-10 w-10 text-accent-primary"/>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Plan Your Perfect Journey
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover destinations, create custom itineraries, and book everything you need
              for unforgettable travel experiences around the world.
            </p>

            {/* Quick Search */}
            <div className="max-w-md mx-auto mb-8">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                  <Input
                    placeholder="Where do you want to go?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"/>
                </div>
                <Select value={selectedContinent} onValueChange={setSelectedContinent}>
                  <SelectTrigger className="w-40">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    {continents.map(continent => (
                      <SelectItem key={continent.value} value={continent.value}>
                        {continent.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                <Compass className="h-5 w-5 mr-2"/>
                Start Planning
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Sparkles className="h-5 w-5 mr-2"/>
                AI Trip Planner
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Travel Services */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Travel Services</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need for seamless travel planning and booking
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {travelServices.map((service) => (
              <Card key={service.id} className={`hover:shadow-lg transition-all ${service.popular ? 'ring-2 ring-accent-primary/20' : ''}`}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${service.popular ? 'bg-accent-primary/20' : 'bg-muted'}`}>
                      <service.icon className="h-6 w-6 text-accent-primary"/>
                    </div>
                    {service.popular && (
                      <Badge variant="secondary" className="bg-accent-primary/10 text-accent-primary">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{service.name}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-success mr-2 flex-shrink-0"/>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" asChild>
                    <Link href={service.href}>
                      Get Started
                      <ArrowRight className="h-4 w-4 ml-2"/>
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Popular Destinations</h2>
            <p className="text-xl text-muted-foreground">
              Discover amazing places loved by our community
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => handleDestinationClick(destination.id)}>
                <div className="aspect-video bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 relative">
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary" className="bg-background/90 text-foreground">
                      {destination.priceRange}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4 flex items-center bg-background/90 rounded px-2 py-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1"/>
                    <span className="text-xs font-medium">{destination.rating}</span>
                  </div>
                  <div className="absolute inset-0 bg-neutral-900/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button variant="secondary">Explore {destination.name}</Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">{destination.name}</h3>
                    <span className="text-sm text-muted-foreground">{destination.country}</span>
                  </div>
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {destination.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1"/>
                      {destination.travelTime}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Sun className="h-3 w-3 mr-1"/>
                      Best time: {destination.bestTime}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {destination.highlights.slice(0, 3).map((highlight, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>

                  <Button variant="outline" className="w-full">
                    View Details
                    <ArrowRight className="h-4 w-4 ml-2"/>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/destinations">
                View All Destinations
                <ArrowRight className="h-5 w-5 ml-2"/>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Itineraries */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Curated Itineraries</h2>
            <p className="text-xl text-muted-foreground">
              Ready-made travel plans crafted by experts
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {popularItineraries.map((itinerary) => (
              <Card key={itinerary.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleItineraryClick(itinerary.id)}>
                <div className="aspect-video bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 relative">
                  <div className="absolute top-4 right-4 flex items-center bg-background/90 rounded px-2 py-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1"/>
                    <span className="text-xs font-medium">{itinerary.rating}</span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{itinerary.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 mr-1"/>
                    {itinerary.destination} • {itinerary.duration}
                  </div>

                  <ul className="space-y-1 mb-4">
                    {itinerary.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle className="h-3 w-3 text-success mr-2 flex-shrink-0"/>
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-semibold text-accent-primary">
                      {itinerary.price}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      per person
                    </div>
                  </div>

                  <Button className="w-full">
                    View Itinerary
                    <ArrowRight className="h-4 w-4 ml-2"/>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/travel/itineraries">
                Browse All Itineraries
                <ArrowRight className="h-5 w-5 ml-2"/>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Travel Tips & Resources */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Travel Resources</h2>
            <p className="text-xl text-muted-foreground">
              Expert tips and essential information for your journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="text-4xl mb-4"></div>
                <h3 className="text-lg font-semibold mb-2">Visa Information</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Check visa requirements and application processes
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/travel/visa">Learn More</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="text-4xl mb-4"></div>
                <h3 className="text-lg font-semibold mb-2">Travel Guides</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Destination guides and local insights
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/travel/guides">Explore</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="text-4xl mb-4"></div>
                <h3 className="text-lg font-semibold mb-2">Travel Tips</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Essential tips for stress-free travel
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/travel/tips">Get Tips</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="text-4xl mb-4">️</div>
                <h3 className="text-lg font-semibold mb-2">Travel Insurance</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Comprehensive coverage and emergency support
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/travel/insurance">Get Covered</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-accent-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <Zap className="h-16 w-16 mx-auto mb-6 text-accent-primary"/>
          <h2 className="text-4xl font-display font-bold mb-4">Ready to Start Your Adventure?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Let our AI-powered trip planner create a personalized itinerary just for you,
            or explore destinations and book everything manually.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              <Sparkles className="h-5 w-5 mr-2"/>
              Try AI Trip Planner
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
              <Link href="/experiences">
                Browse Experiences
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Additional Services Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Travel Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <a href="/travel/tips" className="block p-6 bg-background rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Travel Tips</h3>
              <p className="text-neutral-600">Helpful tips for a smooth journey.</p>
            </a>

            <a href="/travel/visa" className="block p-6 bg-background rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Visa Information</h3>
              <p className="text-neutral-600">Visa requirements and application guidance.</p>
            </a>

            <a href="/travel/insurance" className="block p-6 bg-background rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Travel Insurance</h3>
              <p className="text-neutral-600">Protect your trip with comprehensive coverage.</p>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 G H X S T S H I P Industries LLC. ATLVS + GVTEWAY Travel Platform.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
