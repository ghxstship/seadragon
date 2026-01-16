
'use client'

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { logger } from "@/lib/logger"
import { ArrowLeft, MapPin, Car, Plane, Train, Bus, Navigation, Clock, Phone, Share2 } from "lucide-react"

interface DestinationDirectionsPageProps {
  params: Promise<{ handle: string }>
}

interface ParkingInfo {
  available: boolean
  cost?: string
  type?: string
  restrictions?: string
  capacity?: number
}

interface TransportationInfo {
  publicTransit?: {
    available: boolean
    lines?: string[]
    frequency?: string
  }
  rideshare?: {
    available: boolean
    services?: string[]
  }
  taxi?: {
    available: boolean
    companies?: string[]
  }
}

interface DirectionsInfo {
  driving?: {
    distance: string
    time: string
    tolls?: boolean
    route?: string
  }
  walking?: {
    distance: string
    time: string
  }
  publicTransit?: {
    routes?: Array<{
      type: string
      line: string
      stops: number
      time: string
    }>
  }
}

interface NearbyAmenity {
  id: string
  name: string
  type: string
  distance: string
  rating?: number
  address?: string
}

interface EmergencyContacts {
  police?: string
  fire?: string
  medical?: string
  tourism?: string
  embassy?: string
}

interface DestinationData {
  handle: string
  name: string
  address: string
  coordinates: { lat: number; lng: number }
  nearestAirport: string
  airportDistance: string
  airportDriveTime: string
  parking: ParkingInfo
  transportation: TransportationInfo
  directions: DirectionsInfo
  nearbyAmenities: NearbyAmenity[]
  emergencyContacts: EmergencyContacts
}

export default function DestinationDirectionsPage({ params }: DestinationDirectionsPageProps) {
  const { handle } = use(params)
  const [destination, setDestination] = useState<DestinationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch destination data from API
  useEffect(() => {
    if (!handle) return
    const fetchDestination = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/v1/destinations/${handle}`)
        if (res.ok) {
          const data = await res.json()
          const dest = data.destination || data.data?.destination
          if (dest) {
            setDestination({
              handle: dest.handle || handle,
              name: dest.name || 'Destination',
              address: dest.address || '',
              coordinates: dest.coordinates || { lat: 0, lng: 0 },
              nearestAirport: dest.nearest_airport || '',
              airportDistance: dest.airport_distance || '',
              airportDriveTime: dest.airport_drive_time || '',
              parking: dest.parking || {},
              transportation: dest.transportation || {},
              directions: dest.directions || {},
              nearbyAmenities: dest.nearby_amenities || [],
              emergencyContacts: dest.emergency_contacts || {}
            })
          }
        }
      } catch (error) {
        logger.error('Error fetching destination:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDestination()
  }, [handle])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading directions...</div>
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

      {/* Directions Header */}
      <section className="py-8 px-4 bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/d/${handle}`}>
                <ArrowLeft className="h-4 w-4 mr-2"/>
                Back to Destination
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <Navigation className="h-8 w-8 text-accent-primary"/>
              <div>
                <h1 className="text-2xl font-display font-bold">Directions to {destination.name}</h1>
                <p className="text-muted-foreground">Get here safely and easily</p>
              </div>
            </div>
            <Button>
              <Share2 className="h-4 w-4 mr-2"/>
              Share Location
            </Button>
          </div>

          {/* Address Card */}
          <Card className="max-w-2xl">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-accent-primary mt-1 flex-shrink-0"/>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Venue Address</h3>
                  <p className="text-muted-foreground mb-3">{destination.address}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">
                      Lat: {destination.coordinates.lat}
                    </Badge>
                    <Badge variant="outline">
                      Lng: {destination.coordinates.lng}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Directions Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <Tabs defaultValue="driving" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="driving">Driving</TabsTrigger>
              <TabsTrigger value="airport">From Airport</TabsTrigger>
              <TabsTrigger value="parking">Parking</TabsTrigger>
              <TabsTrigger value="nearby">Nearby</TabsTrigger>
            </TabsList>

            {/* Driving Directions */}
            <TabsContent value="driving" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">From Los Angeles (LAX)</CardTitle>
                    <CardDescription>
                      {destination.airportDistance} • {destination.airportDriveTime}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-3">
                      {destination.directions.fromLAX.map((step, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-accent-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                            {index + 1}
                          </div>
                          <span className="text-sm leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Tip:</strong> Use Pacific Coast Highway (PCH) for scenic views, or I-405 for faster travel.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">From Santa Monica</CardTitle>
                    <CardDescription>15 miles • 20-25 minutes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-3">
                      {destination.directions.fromSantaMonica.map((step, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-accent-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                            {index + 1}
                          </div>
                          <span className="text-sm leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Landmarks to watch for:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {destination.directions.landmarks.map((landmark, index) => (
                          <li key={index}>• {landmark}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Google Maps Integration Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Interactive Map</CardTitle>
                  <CardDescription>View the venue location and plan your route</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
                      <p className="text-muted-foreground mb-4">Interactive Google Maps integration</p>
                      <Button asChild>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${destination.coordinates.lat},${destination.coordinates.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open in Google Maps
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Airport Directions */}
            <TabsContent value="airport" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">From {destination.nearestAirport}</CardTitle>
                  <CardDescription>
                    {destination.airportDistance} • {destination.airportDriveTime}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <Car className="h-8 w-8 text-accent-primary mx-auto mb-2"/>
                      <div className="font-medium mb-1">Rideshare</div>
                      <div className="text-sm text-muted-foreground">
                        Uber/Lyft recommended
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Bus className="h-8 w-8 text-accent-primary mx-auto mb-2"/>
                      <div className="font-medium mb-1">Shuttle</div>
                      <div className="text-sm text-muted-foreground">
                        ${destination.transportation.shuttle.cost}
                      </div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <Plane className="h-8 w-8 text-accent-primary mx-auto mb-2"/>
                      <div className="font-medium mb-1">Limo Service</div>
                      <div className="text-sm text-muted-foreground">
                        {destination.transportation.limo.cost}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">Transportation Options:</h4>

                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <Car className="h-5 w-5 text-accent-primary mt-1"/>
                      <div>
                        <div className="font-medium">Rideshare (Uber/Lyft)</div>
                        <div className="text-sm text-muted-foreground">
                          Most convenient option. Available 24/7. Estimated cost: $50-80 from airport.
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <Bus className="h-5 w-5 text-accent-primary mt-1"/>
                      <div>
                        <div className="font-medium">Private Shuttle Service</div>
                        <div className="text-sm text-muted-foreground">
                          ${destination.transportation.shuttle.cost} per person. Scheduled pickup from airport.
                          {destination.transportation.shuttle.description}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <Plane className="h-5 w-5 text-accent-primary mt-1"/>
                      <div>
                        <div className="font-medium">Limousine Service</div>
                        <div className="text-sm text-muted-foreground">
                          {destination.transportation.limo.cost}. Luxury transportation for special occasions.
                          {destination.transportation.limo.description}
                        </div>
                      </div>
                    </div>
                  </div>

                  {destination.transportation.publicTransit && (
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <Train className="h-5 w-5 text-accent-primary mt-1"/>
                      <div>
                        <div className="font-medium">Public Transit</div>
                        <div className="text-sm text-muted-foreground">
                          {destination.transportation.publicTransit.description}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Parking */}
            <TabsContent value="parking" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Parking Options</CardTitle>
                    <CardDescription>Convenient parking for all guests</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-accent-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-accent-primary font-medium">V</span>
                      </div>
                      <div>
                        <div className="font-medium">Valet Parking</div>
                        <div className="text-sm text-muted-foreground">
                          ${destination.parking.valet.cost} per vehicle • {destination.parking.valet.hours}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-accent-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-accent-primary font-medium">P</span>
                      </div>
                      <div>
                        <div className="font-medium">Self Parking</div>
                        <div className="text-sm text-muted-foreground">
                          Free • {destination.parking.self.spaces} spaces available
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="w-8 h-8 bg-accent-primary/10 rounded-lg flex items-center justify-center">
                        <span className="text-accent-primary font-medium"></span>
                      </div>
                      <div>
                        <div className="font-medium">Accessible Parking</div>
                        <div className="text-sm text-muted-foreground">
                          {destination.parking.accessible.spaces} designated spaces available
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">Parking Policies</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-accent-primary mt-0.5"/>
                      <span>Valet service available during event hours</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Car className="h-4 w-4 text-accent-primary mt-0.5"/>
                      <span>Overnight parking available for multi-day events</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 text-accent-primary mt-0.5"/>
                      <span>Call ahead for large group parking arrangements</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-accent-primary mt-0.5"/>
                      <span>Follow venue staff directions for parking locations</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Nearby Amenities */}
            <TabsContent value="nearby" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Nearby Amenities</CardTitle>
                  <CardDescription>Restaurants, shopping, and attractions near the venue</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {destination.nearbyAmenities.map((amenity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="w-8 h-8 bg-accent-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-accent-primary font-medium text-xs">
                            {amenity.type === 'Restaurant' ? '️' :
                             amenity.type === 'Shopping' ? '️' :
                             amenity.type === 'Attraction' ? '' :
                             amenity.type === 'Landmark' ? '️' :
                             amenity.type === 'Education' ? '' :
                             amenity.type === 'Museum' ? '️' : ''}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{amenity.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {amenity.type} • {amenity.distance}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Information */}
              <Card className="border-amber-200 bg-amber-50">
                <CardHeader>
                  <CardTitle className="text-lg text-amber-900">Emergency Contacts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-amber-900">Venue Security</div>
                      <div className="text-amber-700">{destination.emergencyContacts.venue}</div>
                    </div>
                    <div>
                      <div className="font-medium text-amber-900">Police</div>
                      <div className="text-amber-700">{destination.emergencyContacts.police}</div>
                    </div>
                    <div>
                      <div className="font-medium text-amber-900">Nearest Hospital</div>
                      <div className="text-amber-700">{destination.emergencyContacts.hospital}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
