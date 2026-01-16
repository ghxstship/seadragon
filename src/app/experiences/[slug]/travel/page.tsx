
'use client'


import { useState, useEffect, use } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { logger } from "@/lib/logger"
import { MapPin, Navigation, Car, Train, Plane, Bus, Clock, DollarSign, Star, CheckCircle, Info, Phone, Mail, ExternalLink, Calendar, Users, HelpCircle } from "lucide-react"

interface TravelOption {
  id: string
  type: 'driving' | 'public_transport' | 'shuttle' | 'taxi' | 'rideshare'
  name: string
  description: string
  duration: string
  cost: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  bookingRequired: boolean
  bookingInfo?: string
  availability: string
}

interface Accommodation {
  id: string
  name: string
  type: string
  distance: string
  rating: number
  priceRange: string
  amenities: string[]
  bookingUrl?: string
}

interface LocalAttraction {
  id: string
  name: string
  description: string
  distance: string
  category: string
  rating: number
  estimatedTime: string
}

interface ExperienceTravelProps {
  params: Promise<{ slug: string }>
}

export default function Travel({ params }: ExperienceTravelProps) {
  const { slug } = use(params)
  const [experienceData, setExperienceData] = useState<any>(null)
  const [selectedTransport, setSelectedTransport] = useState("driving")

  useEffect(() => {
    let cancelled = false

    const loadExperienceData = async () => {
      try {
        const res = await fetch(`/api/v1/experiences/${slug}`)
        if (res.ok) {
          const data = await res.json()
          const exp = data.experience || data
          if (!cancelled && exp) {
            setExperienceData({
              name: String(exp.name || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())),
              location: String(exp.location || exp.venue || ''),
              address: String(exp.address || ''),
              coordinates: exp.coordinates || { lat: 0, lng: 0 },
              date: exp.date || exp.start_date || '',
              time: exp.time || exp.start_time || '',
              duration: String(exp.duration || '')
            })
          }
        } else {
          if (!cancelled) {
            setExperienceData({
              name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              location: '',
              address: '',
              coordinates: { lat: 0, lng: 0 },
              date: '',
              time: '',
              duration: ''
            })
          }
        }
      } catch (error) {
        logger.error('Error loading experience data:', error)
        if (!cancelled) {
          setExperienceData({
            name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            location: '',
            address: '',
            coordinates: { lat: 0, lng: 0 },
            date: '',
            time: '',
            duration: ''
          })
        }
      }
    }

    loadExperienceData()

    return () => { cancelled = true }
  }, [slug])

  const travelOptions: TravelOption[] = [
    {
      id: "driving",
      type: "driving",
      name: "Driving",
      description: "Drive your own vehicle with on-site parking available",
      duration: "15-30 minutes",
      cost: "$15-25 parking",
      icon: Car,
      color: "text-accent-secondary",
      bookingRequired: false,
      availability: "24/7"
    },
    {
      id: "rideshare",
      type: "rideshare",
      name: "Rideshare (Uber/Lyft)",
      description: "Convenient door-to-door transportation",
      duration: "20-40 minutes",
      cost: "$25-45",
      icon: Car,
      color: "text-foreground",
      bookingRequired: true,
      bookingInfo: "Book via Uber or Lyft app",
      availability: "24/7"
    },
    {
      id: "taxi",
      type: "taxi",
      name: "Taxi Service",
      description: "Traditional taxi service with local drivers",
      duration: "20-40 minutes",
      cost: "$30-50",
      icon: Car,
      color: "text-semantic-warning",
      bookingRequired: true,
      bookingInfo: "Call local taxi companies",
      availability: "24/7"
    },
    {
      id: "public-transport",
      type: "public_transport",
      name: "Public Transportation",
      description: "Miami-Dade Transit buses and Metrorail",
      duration: "45-60 minutes",
      cost: "$2.65",
      icon: Bus,
      color: "text-semantic-success",
      bookingRequired: false,
      availability: "5:00 AM - 12:00 AM"
    },
    {
      id: "shuttle",
      type: "shuttle",
      name: "Event Shuttle",
      description: "Official event shuttle service from major hotels",
      duration: "25-35 minutes",
      cost: "$10 round-trip",
      icon: Bus,
      color: "text-accent-primary",
      bookingRequired: true,
      bookingInfo: "Purchase tickets online or at venue",
      availability: "Event days only"
    }
  ]

  const accommodations: Accommodation[] = [
    {
      id: "1",
      name: "Miami Beach Marriott",
      type: "Hotel",
      distance: "0.3 miles",
      rating: 4.5,
      priceRange: "$299-499/night",
      amenities: ["Pool", "Spa", "Restaurant", "Fitness Center", "Room Service"],
      bookingUrl: "https://marriott.com"
    },
    {
      id: "2",
      name: "The Ritz-Carlton South Beach",
      type: "Luxury Hotel",
      distance: "0.5 miles",
      rating: 4.8,
      priceRange: "$599-999/night",
      amenities: ["Private Beach", "Spa", "Fine Dining", "Butler Service", "Ocean Views"],
      bookingUrl: "https://ritzcarlton.com"
    },
    {
      id: "3",
      name: "Hilton Miami Downtown",
      type: "Business Hotel",
      distance: "2.1 miles",
      rating: 4.2,
      priceRange: "$199-349/night",
      amenities: ["Business Center", "Fitness Center", "Restaurant", "Valet Parking"],
      bookingUrl: "https://hilton.com"
    },
    {
      id: "4",
      name: "Airbnb Oceanfront Condo",
      type: "Vacation Rental",
      distance: "0.8 miles",
      rating: 4.7,
      priceRange: "$150-350/night",
      amenities: ["Kitchen", "Balcony", "WiFi", "Pool Access", "Parking"],
      bookingUrl: "https://airbnb.com"
    }
  ]

  const localAttractions: LocalAttraction[] = [
    {
      id: "1",
      name: "South Beach",
      description: "Iconic Art Deco district with beautiful beaches and vibrant nightlife",
      distance: "0.5 miles",
      category: "Beach & Leisure",
      rating: 4.6,
      estimatedTime: "1-2 hours"
    },
    {
      id: "2",
      name: "Lincoln Road Mall",
      description: "Pedestrian mall with shopping, dining, and street performers",
      distance: "1.2 miles",
      category: "Shopping & Dining",
      rating: 4.4,
      estimatedTime: "2-3 hours"
    },
    {
      id: "3",
      name: "Vizcaya Museum and Gardens",
      description: "Stunning Italian Renaissance-style estate with beautiful gardens",
      distance: "3.5 miles",
      category: "Culture & History",
      rating: 4.5,
      estimatedTime: "2-3 hours"
    },
    {
      id: "4",
      name: "Wynwood Walls",
      description: "World-famous outdoor street art museum",
      distance: "4.2 miles",
      category: "Arts & Culture",
      rating: 4.7,
      estimatedTime: "1-2 hours"
    },
    {
      id: "5",
      name: "Everglades Airboat Tour",
      description: "Thrilling airboat adventure through the Florida Everglades",
      distance: "35 miles",
      category: "Adventure",
      rating: 4.3,
      estimatedTime: "2-3 hours"
    }
  ]

  const emergencyContacts = [
    { name: "Venue Security", number: "(305) 555-0101", description: "Security and safety concerns" },
    { name: "Medical Emergency", number: "911", description: "Medical emergencies" },
    { name: "Event Support", number: "1-800-EVENTS", description: "General event assistance" },
    { name: "Lost & Found", number: "(305) 555-0102", description: "Lost items" }
  ]

  const getTransportIcon = (type: string) => {
    const option = travelOptions.find(opt => opt.id === type)
    return option ? <SelectItem.icon className={`h-5 w-5 ${option.color}`}/> : null
  }

  if (!experienceData) {
    return (
      <div className="min-h-screen bg-background">
        <Header/>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

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
            <Link href="/experiences" className="hover:text-foreground">Experiences</Link>
            <span>/</span>
            <Link href={`/experiences/${slug}`} className="hover:text-foreground">{experienceData.name}</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Travel</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-accent-secondary/10 via-accent-primary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-3 bg-accent-primary/20 rounded-full">
              <Navigation className="h-8 w-8 text-accent-primary"/>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
                {experienceData.name} Travel Guide
              </h1>
              <p className="text-xl text-muted-foreground">
                Everything you need to know for getting to and around the experience
              </p>
            </div>
          </div>

          {/* Quick Info Cards */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-semantic-error"/>
                <h3 className="font-semibold mb-1">Location</h3>
                <p className="text-sm text-muted-foreground">
                  Miami Beach Amphitheater
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-accent-primary"/>
                <h3 className="font-semibold mb-1">Date & Time</h3>
                <p className="text-sm text-muted-foreground">
                  {experienceData.date} at {experienceData.time}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-semantic-success"/>
                <h3 className="font-semibold mb-1">Duration</h3>
                <p className="text-sm text-muted-foreground">
                  {experienceData.duration}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-accent-primary"/>
                <h3 className="font-semibold mb-1">Group Size</h3>
                <p className="text-sm text-muted-foreground">
                  Up to 15,000 attendees
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="transportation" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transportation">Transportation</TabsTrigger>
            <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
            <TabsTrigger value="attractions">Local Attractions</TabsTrigger>
            <TabsTrigger value="emergency">Emergency Info</TabsTrigger>
          </TabsList>

          <TabsContent value="transportation" className="space-y-8">
            {/* Transportation Options */}
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">Getting to the Experience</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {travelOptions.map((option) => (
                  <Card key={option.id} className={`cursor-pointer transition-all ${
                    selectedTransport === option.id ? 'ring-2 ring-accent-primary' : 'hover:shadow-lg'
                  }`} onClick={() => setSelectedTransport(option.id)}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <SelectItem.icon className={`h-6 w-6 mr-3 ${option.color}`}/>
                        {option.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{option.description}</p>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span className="font-semibold">{option.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cost:</span>
                          <span className="font-semibold">{option.cost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Availability:</span>
                          <span className="font-semibold">{option.availability}</span>
                        </div>
                      </div>

                      {option.bookingRequired && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs text-blue-800">
                            <Info className="h-3 w-3 inline mr-1"/>
                            {option.bookingInfo}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Parking Information */}
            <Card>
              <CardHeader>
                <CardTitle>Parking Information</CardTitle>
                <CardDescription>Parking options and policies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Parking Options</h4>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-semantic-success mt-0.5"/>
                        <div>
                          <p className="font-medium">On-site Parking Garage</p>
                          <p className="text-sm text-muted-foreground">$25 for event day</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-semantic-success mt-0.5"/>
                        <div>
                          <p className="font-medium">Valet Parking</p>
                          <p className="text-sm text-muted-foreground">$35 with tip</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-semantic-success mt-0.5"/>
                        <div>
                          <p className="font-medium">Street Parking</p>
                          <p className="text-sm text-muted-foreground">$2/hour (limited availability)</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Parking Tips</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Arrive early to secure preferred parking spots</li>
                      <li>• Purchase parking passes online for discounted rates</li>
                      <li>• Accessible parking available with proper permits</li>
                      <li>• No overnight parking allowed</li>
                      <li>• Parking attendants available for assistance</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="accommodations" className="space-y-8">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">Recommended Accommodations</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {accommodations.map((accommodation) => (
                  <Card key={accommodation.id}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{accommodation.name}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{accommodation.type}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span>{accommodation.distance} away</span>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 mr-1"/>
                              <span>{accommodation.rating}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">{accommodation.priceRange}</Badge>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Amenities</h4>
                        <div className="flex flex-wrap gap-1">
                          {accommodation.amenities.slice(0, 4).map((amenity, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {accommodation.amenities.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{accommodation.amenities.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {accommodation.bookingUrl && (
                        <Button className="w-full" asChild>
                          <a href={accommodation.bookingUrl} target="_blank" rel="noopener noreferrer">
                            Book Now
                            <ExternalLink className="h-4 w-4 ml-2"/>
                          </a>
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4"/>
              <AlertTitle>Booking Tips</AlertTitle>
              <AlertDescription>
                Book accommodations early as popular hotels near the venue fill up quickly.
                Many hotels offer event packages with transportation and special rates.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="attractions" className="space-y-8">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">Explore Miami Beach</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {localAttractions.map((attraction) => (
                  <Card key={attraction.id}>
                    <CardContent className="p-6">
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline">{attraction.category}</Badge>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 mr-1"/>
                            <span className="text-sm">{attraction.rating}</span>
                          </div>
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{attraction.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{attraction.description}</p>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Distance:</span>
                          <span className="font-semibold">{attraction.distance}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time to Visit:</span>
                          <span className="font-semibold">{attraction.estimatedTime}</span>
                        </div>
                      </div>

                      <Button variant="outline" className="w-full mt-4">
                        Learn More
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="emergency" className="space-y-8">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">Emergency Information</h2>

              {/* Emergency Contacts */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-semantic-error"/>
                    Emergency Contacts
                  </CardTitle>
                  <CardDescription>
                    Important numbers to know during your visit
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {emergencyContacts.map((contact, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-1">{contact.name}</h4>
                        <p className="text-2xl font-bold text-accent-primary mb-1">{contact.number}</p>
                        <p className="text-sm text-muted-foreground">{contact.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Safety Information */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Safety Guidelines</CardTitle>
                  <CardDescription>
                    Important safety information for attendees
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">General Safety</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Stay hydrated, especially in warm weather</li>
                        <li>• Wear comfortable shoes for walking</li>
                        <li>• Keep valuables secure and visible</li>
                        <li>• Follow all venue staff instructions</li>
                        <li>• Use designated walkways and pathways</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Weather Preparedness</h4>
                      <ul className="space-y-2 text-sm">
                        <li>• Check weather forecasts before attending</li>
                        <li>• Bring rain gear for outdoor events</li>
                        <li>• Sunscreen and hats for sun protection</li>
                        <li>• Indoor alternatives available if needed</li>
                        <li>• Follow venue weather policies</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Medical Facilities */}
              <Card>
                <CardHeader>
                  <CardTitle>Medical Facilities</CardTitle>
                  <CardDescription>
                    Nearby medical facilities and services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">Mount Sinai Medical Center</h4>
                        <Badge>Emergency Room</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        4300 Alton Rd, Miami Beach, FL 33140
                      </p>
                      <p className="text-sm">Distance: 2.3 miles • Phone: (305) 674-2121</p>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">On-site Medical Station</h4>
                        <Badge>Event Medical</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Located near main entrance
                      </p>
                      <p className="text-sm">Open during event hours • Staffed medical professionals</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Plan your perfect experience with our comprehensive travel guide.
            </p>
            <div className="flex justify-center space-x-6">
              <Button variant="outline" asChild>
                <Link href={`/experiences/${slug}`}>
                  <Navigation className="h-4 w-4 mr-2"/>
                  Back to Experience
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/experiences/${slug}/book`}>
                  <Calendar className="h-4 w-4 mr-2"/>
                  Book Experience
                </Link>
              </Button>
              <Button asChild>
                <Link href="/support/travel">
                  <HelpCircle className="h-4 w-4 mr-2"/>
                  Travel Support
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
