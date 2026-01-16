
'use client'

import type { ComponentType } from 'react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Header } from '@/lib/design-system'
import { Plane, Car, Hotel, MapPin, Calendar, Users, Plus, Edit, Download, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface Flight {
  id: number
  airline: string
  flightNumber: string
  departure: { city: string; code: string; time: string }
  arrival: { city: string; code: string; time: string }
  date: string
  status: string
  seat: string
  bookingRef: string
}

interface Destination {
  id: string
  name: string
  country: string
  description: string
  image: string | null
  rating: number | null
  priceRange: string | null
  bestTime: string | null
  highlights: string[] | null
  travelTime: string | null
}

interface TravelService {
  id: string
  name: string
  description: string
  icon: ComponentType<{ className?: string }>
  href: string
  features: string[]
  popular: boolean
}

interface PopularItinerary {
  id: string
  title: string
  destination: string
  duration: string
  price: string | null
  rating: number | null
  highlights: string[] | null
  image: string | null
}

interface HotelBooking {
  id: number
  name: string
  location: string
  checkIn: string
  checkOut: string
  roomType: string
  guests: number
  amenities?: string[]
  bookingRef?: string
  status: string
}

interface CarRental {
  id: number
  type: string
  provider: string
  pickup: { location: string; date: string; time: string }
  dropoff: { location: string; date: string; time: string }
  features: string[]
  bookingRef: string
  status: string
}

interface TravelDocument {
  id: number
  type: string
  number: string
  expiryDate: string
  country?: string
  state?: string
  status: string
}

export default function TravelPage() {
  const [activeTab, setActiveTab] = useState('flights')
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [itineraries, setItineraries] = useState<PopularItinerary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient()
        const { data: destinationData, error: destError } = await supabase
          .from('destinations')
          .select('id,name,country,description,image,rating,priceRange,bestTime,highlights,travelTime')
        if (destError) throw destError
        setDestinations(destinationData || [])

        const { data: itineraryData, error: itinError } = await supabase
          .from('itineraries')
          .select('id,title,destination,duration,price,rating,highlights,image')
        if (itinError) throw itinError
        setItineraries(itineraryData || [])
      } catch (error) {
        // Swallow errors for now; could add logger if desired
        setDestinations([])
        setItineraries([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Placeholder empty collections until Supabase endpoints are added for these entities
  const flights: Flight[] = []
  const hotels: HotelBooking[] = []
  const rentals: CarRental[] = []
  const travelDocuments: TravelDocument[] = []

  const renderFlightCard = (flight: Flight) => (
    <Card key={flight.id}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{flight.airline} {flight.flightNumber}</CardTitle>
            <CardDescription>{new Date(flight.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</CardDescription>
          </div>
          <Badge variant="secondary">{flight.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold">{flight.departure.time}</div>
            <div className="text-sm text-muted-foreground">{flight.departure.city}</div>
            <div className="text-xs text-muted-foreground">{flight.departure.code}</div>
          </div>
          <div className="flex-1 mx-4">
            <div className="h-px bg-border relative">
              <Plane className="h-4 w-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background p-1 rounded-full"/>
            </div>
            <div className="text-xs text-muted-foreground text-center mt-1">
              5h 30m
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{flight.arrival.time}</div>
            <div className="text-sm text-muted-foreground">{flight.arrival.city}</div>
            <div className="text-xs text-muted-foreground">{flight.arrival.code}</div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            Seat {flight.seat} • {flight.bookingRef}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1"/>
              Boarding Pass
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1"/>
              Modify
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderHotelCard = (hotel: HotelBooking) => (
    <Card key={hotel.id}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{hotel.name}</CardTitle>
            <CardDescription className="flex items-center">
              <MapPin className="h-4 w-4 mr-1"/>
              {hotel.location}
            </CardDescription>
          </div>
          <Badge variant="secondary">{hotel.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-muted-foreground">Check-in</div>
            <div className="font-medium">{new Date(hotel.checkIn).toLocaleDateString()}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Check-out</div>
            <div className="font-medium">{new Date(hotel.checkOut).toLocaleDateString()}</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm text-muted-foreground mb-2">Room Type</div>
          <div className="font-medium">{hotel.roomType}</div>
          <div className="text-sm text-muted-foreground">{hotel.guests} guests</div>
        </div>

        <div className="mb-4">
          <div className="text-sm text-muted-foreground mb-2">Amenities</div>
          <div className="flex flex-wrap gap-1">
            {(hotel.amenities ?? []).map((amenity: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {amenity}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {hotel.bookingRef}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1"/>
              Confirmation
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1"/>
              Modify
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderRentalCard = (rental: CarRental) => (
    <Card key={rental.id}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{rental.type}</CardTitle>
            <CardDescription>{rental.provider}</CardDescription>
          </div>
          <Badge variant="secondary">{rental.status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-sm text-muted-foreground">Pickup</div>
            <div className="font-medium">{rental.pickup.location}</div>
            <div className="text-sm">{new Date(rental.pickup.date).toLocaleDateString()} at {rental.pickup.time}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Drop-off</div>
            <div className="font-medium">{rental.dropoff.location}</div>
            <div className="text-sm">{new Date(rental.dropoff.date).toLocaleDateString()} at {rental.dropoff.time}</div>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm text-muted-foreground mb-2">Features</div>
          <div className="flex flex-wrap gap-1">
            {rental.features.map((feature: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {rental.bookingRef}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-1"/>
              Agreement
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-1"/>
              Modify
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderDocumentCard = (document: TravelDocument) => (
    <Card key={document.id}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{document.type}</CardTitle>
            <CardDescription>
              {document.number}
              {document.country && ` • ${document.country}`}
              {document.state && ` • ${document.state}`}
            </CardDescription>
          </div>
          <Badge variant={document.status === 'valid' ? 'default' : 'destructive'}>
            {document.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-sm text-muted-foreground">Expires</div>
          <div className="font-medium">
            {new Date(document.expiryDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {document.status === 'valid' ? 'Ready for travel' : 'Requires renewal'}
          </div>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-1"/>
            Update
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-display font-bold">Travel Management</h1>
              <p className="text-muted-foreground">
                Manage all your travel bookings and documents in one place
              </p>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2"/>
              Book Travel
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="flights">
              <Plane className="h-4 w-4 mr-2"/>
              Flights
            </TabsTrigger>
            <TabsTrigger value="hotels">
              <Hotel className="h-4 w-4 mr-2"/>
              Hotels
            </TabsTrigger>
            <TabsTrigger value="rentals">
              <Car className="h-4 w-4 mr-2"/>
              Rentals
            </TabsTrigger>
            <TabsTrigger value="documents">
              <Users className="h-4 w-4 mr-2"/>
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="flights" className="space-y-6">
            <div className="grid gap-6">
              {flights.map(renderFlightCard)}
            </div>
            <Card>
              <CardContent className="pt-6 text-center">
                <Plane className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
                <h3 className="text-lg font-semibold mb-2">Book Your Next Flight</h3>
                <p className="text-muted-foreground mb-4">
                  Find and book flights for your entertainment travels
                </p>
                <Button>
                  Search Flights
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hotels" className="space-y-6">
            <div className="grid gap-6">
              {hotels.map(renderHotelCard)}
            </div>
            <Card>
              <CardContent className="pt-6 text-center">
                <Hotel className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
                <h3 className="text-lg font-semibold mb-2">Find Your Perfect Stay</h3>
                <p className="text-muted-foreground mb-4">
                  Book hotels near your favorite venues and experiences
                </p>
                <Button>
                  Search Hotels
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rentals" className="space-y-6">
            <div className="grid gap-6">
              {rentals.map(renderRentalCard)}
            </div>
            <Card>
              <CardContent className="pt-6 text-center">
                <Car className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
                <h3 className="text-lg font-semibold mb-2">Rent a Vehicle</h3>
                <p className="text-muted-foreground mb-4">
                  Get around easily with car rentals at major airports
                </p>
                <Button>
                  Find Rentals
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <div className="grid gap-6">
              {travelDocuments.map(renderDocumentCard)}
            </div>
            <Card>
              <CardContent className="pt-6 text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
                <h3 className="text-lg font-semibold mb-2">Add Travel Documents</h3>
                <p className="text-muted-foreground mb-4">
                  Keep all your travel documents organized and up to date
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2"/>
                  Add Document
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
