
'use client'

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/lib/design-system"
import { logger } from "@/lib/logger"
import { Plane, Car, Train, Bus, MapPin, Clock, DollarSign, Calendar, Users, CheckCircle, AlertCircle, Info, Star, Navigation, Route, Camera, Utensils, Shield, Phone, Mail } from "lucide-react"

interface TransportationOption {
  id: string
  type: "flight" | "train" | "bus" | "car" | "private"
  name: string
  description: string
  duration: string
  cost: {
    amount: number
    currency: string
    perPerson: boolean
  }
  availability: string
  bookingRequired: boolean
  icon: React.ComponentType<{ className?: string }>
}

interface AccommodationOption {
  id: string
  name: string
  type: "hotel" | "ryokan" | "guesthouse" | "airbnb"
  description: string
  location: string
  distance: string
  priceRange: {
    min: number
    max: number
    currency: string
  }
  rating: number
  amenities: string[]
  accessibility: boolean
  recommended: boolean
}

interface LocalAttraction {
  id: string
  name: string
  description: string
  category: "cultural" | "natural" | "food" | "shopping" | "entertainment"
  distance: string
  duration: string
  cost: string
  bestTime: string
  rating: number
}

interface SafetyTip {
  id: string
  category: "general" | "health" | "transportation" | "cultural"
  title: string
  description: string
  priority: "high" | "medium" | "low"
}

export default function ExperienceTravelPage() {
  const [selectedTab, setSelectedTab] = useState("transportation")
  const [transportationOptions, setTransportationOptions] = useState<TransportationOption[]>([])
  const [accommodationOptions, setAccommodationOptions] = useState<AccommodationOption[]>([])
  const [localAttractions, setLocalAttractions] = useState<LocalAttraction[]>([])
  const [safetyTips, setSafetyTips] = useState<SafetyTip[]>([])
  const [emergencyContacts, setEmergencyContacts] = useState<{ service: string; number: string; description: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Helper to get transportation icon based on type
  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'flight': return <Plane className="h-6 w-6 text-accent-primary" />
      case 'train': return <Train className="h-6 w-6 text-accent-primary" />
      case 'bus': return <Bus className="h-6 w-6 text-accent-primary" />
      case 'car':
      case 'private': return <Car className="h-6 w-6 text-accent-primary" />
      default: return <MapPin className="h-6 w-6 text-accent-primary" />
    }
  }

  useEffect(() => {
    const fetchTravelData = async () => {
      setIsLoading(true)
      try {
        // const [transRes, accomRes, attrRes, safetyRes, emergRes] = await Promise.all([
        //   fetch('/api/v1/travel/transportation'),
        //   fetch('/api/v1/travel/accommodations'),
        //   fetch('/api/v1/travel/attractions'),
        //   fetch('/api/v1/travel/safety-tips'),
        //   fetch('/api/v1/travel/emergency-contacts'),
        // ])
        
        // For now, set empty arrays - data will come from Supabase
        setTransportationOptions([])
        setAccommodationOptions([])
        setLocalAttractions([])
        setSafetyTips([])
        setEmergencyContacts([])
      } catch (error) {
        logger.error('Error fetching travel data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTravelData()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-accent-primary/10 via-accent-secondary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-primary/20 rounded-full mb-6">
              <Navigation className="h-10 w-10 text-accent-primary"/>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Travel Details
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Everything you need to know about getting to your experience,
              where to stay, what to see, and how to stay safe during your trip.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                <Route className="h-5 w-5 mr-2"/>
                Plan Your Journey
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Phone className="h-5 w-5 mr-2"/>
                Emergency Contacts
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="transportation">Getting There</TabsTrigger>
            <TabsTrigger value="accommodation">Where to Stay</TabsTrigger>
            <TabsTrigger value="attractions">Local Attractions</TabsTrigger>
            <TabsTrigger value="safety">Safety & Tips</TabsTrigger>
            <TabsTrigger value="emergency">Emergency Info</TabsTrigger>
          </TabsList>

          {/* Transportation Tab */}
          <TabsContent value="transportation" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold mb-4">Transportation Options</h2>
              <p className="text-muted-foreground">
                Choose the best way to reach your experience in Tokyo
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transportationOptions.map((option) => (
                <Card key={option.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      {getTransportIcon(option.type)}
                      <Badge variant="outline" className="capitalize">
                        {option.type}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{option.name}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4"/>
                          Duration:
                        </span>
                        <span className="font-medium">{option.duration}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4"/>
                          Cost:
                        </span>
                        <span className="font-medium">
                          {option.cost.currency}{option.cost.amount}
                          {option.cost.perPerson ? '/person' : ' total'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span>Availability:</span>
                        <span className="font-medium">{option.availability}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {option.bookingRequired ? (
                          <>
                            <AlertCircle className="h-4 w-4 text-semantic-warning"/>
                            <span className="text-sm text-orange-700">Booking required</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 text-semantic-success"/>
                            <span className="text-sm text-semantic-success">Available on-demand</span>
                          </>
                        )}
                      </div>

                      <Button className="w-full" variant="outline">
                        {option.bookingRequired ? 'Book Now' : 'Learn More'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Info className="h-6 w-6 text-accent-secondary mt-1 flex-shrink-0"/>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Transportation Tips</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Purchase IC cards (Suica/Pasmo) for easy public transport access</li>
                      <li>• Download navigation apps like Google Maps or Hyperdia for train routes</li>
                      <li>• Allow extra time for potential delays and jet lag</li>
                      <li>• Airport transfers can be booked through your hotel or our concierge</li>
                      <li>• Taxis and rideshares are readily available but more expensive</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Accommodation Tab */}
          <TabsContent value="accommodation" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold mb-4">Recommended Accommodations</h2>
              <p className="text-muted-foreground">
                Handpicked stays that complement your cultural experience
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {accommodationOptions.map((accommodation) => (
                <Card key={accommodation.id} className={`hover:shadow-lg transition-shadow ${accommodation.recommended ? 'ring-2 ring-accent-primary' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{accommodation.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="capitalize">
                            {accommodation.type}
                          </Badge>
                          {accommodation.recommended && (
                            <Badge className="bg-accent-primary text-primary-foreground">
                              Recommended
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1"/>
                        <span className="text-sm font-medium">{accommodation.rating}</span>
                      </div>
                    </div>
                    <CardDescription>{accommodation.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4"/>
                          Location:
                        </span>
                        <span className="font-medium">{accommodation.location}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span>Distance:</span>
                        <span className="font-medium">{accommodation.distance}</span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span>Price Range:</span>
                        <span className="font-medium">
                          {accommodation.priceRange.currency}{accommodation.priceRange.min} - {accommodation.priceRange.max}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {accommodation.accessibility ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-semantic-success"/>
                            <span className="text-sm text-semantic-success">Accessible</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="h-4 w-4 text-semantic-warning"/>
                            <span className="text-sm text-orange-700">Limited accessibility</span>
                          </>
                        )}
                      </div>

                      <div>
                        <h4 className="font-medium mb-2 text-sm">Key Amenities:</h4>
                        <div className="flex flex-wrap gap-1">
                          {accommodation.amenities.slice(0, 3).map((amenity, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button className="w-full">
                        View Details & Book
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Attractions Tab */}
          <TabsContent value="attractions" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold mb-4">Nearby Attractions</h2>
              <p className="text-muted-foreground">
                Explore Tokyo&apos;s rich culture and vibrant attractions during your stay
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {localAttractions.map((attraction) => (
                <Card key={attraction.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-accent-primary/20 rounded-lg flex items-center justify-center">
                          {attraction.category === 'cultural' && <Star className="h-6 w-6 text-accent-primary"/>}
                          {attraction.category === 'natural' && <Camera className="h-6 w-6 text-accent-primary"/>}
                          {attraction.category === 'food' && <Utensils className="h-6 w-6 text-accent-primary"/>}
                          {attraction.category === 'shopping' && <DollarSign className="h-6 w-6 text-accent-primary"/>}
                          {attraction.category === 'entertainment' && <Star className="h-6 w-6 text-accent-primary"/>}
                        </div>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{attraction.name}</h3>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1"/>
                            <span className="text-sm font-medium">{attraction.rating}</span>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-3">{attraction.description}</p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-muted-foreground"/>
                            <span>{attraction.distance}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground"/>
                            <span>{attraction.duration}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4 text-muted-foreground"/>
                            <span>{attraction.cost}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground"/>
                            <span>{attraction.bestTime}</span>
                          </div>
                        </div>

                        <Button variant="outline" className="w-full mt-4">
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Safety Tab */}
          <TabsContent value="safety" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold mb-4">Safety & Travel Tips</h2>
              <p className="text-muted-foreground">
                Important information to ensure a safe and enjoyable trip
              </p>
            </div>

            <div className="space-y-6">
              {safetyTips.map((tip) => (
                <Card key={tip.id} className={`border-l-4 ${
                  tip.priority === 'high' ? 'border-l-red-500 bg-red-50' :
                  tip.priority === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
                  'border-l-green-500 bg-green-50'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        tip.priority === 'high' ? 'bg-semantic-error/10' :
                        tip.priority === 'medium' ? 'bg-semantic-warning/10' :
                        'bg-semantic-success/10'
                      }`}>
                        {tip.category === 'general' && <Info className="h-4 w-4 text-neutral-600"/>}
                        {tip.category === 'health' && <Shield className="h-4 w-4 text-neutral-600"/>}
                        {tip.category === 'transportation' && <Navigation className="h-4 w-4 text-neutral-600"/>}
                        {tip.category === 'cultural' && <Users className="h-4 w-4 text-neutral-600"/>}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{tip.title}</h3>
                          <Badge className={`text-xs ${
                            tip.priority === 'high' ? 'bg-semantic-error/10 text-red-800' :
                            tip.priority === 'medium' ? 'bg-semantic-warning/10 text-yellow-800' :
                            'bg-semantic-success/10 text-green-800'
                          }`}>
                            {tip.priority} priority
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">{tip.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Emergency Tab */}
          <TabsContent value="emergency" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold mb-4">Emergency Information</h2>
              <p className="text-muted-foreground">
                Important contacts and procedures for emergencies during your trip
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Phone className="h-5 w-5 mr-2 text-semantic-error"/>
                    Emergency Contacts
                  </CardTitle>
                  <CardDescription>
                    Save these numbers in your phone before traveling
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {emergencyContacts.map((contact, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{contact.service}</p>
                          <p className="text-sm text-muted-foreground">{contact.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-lg">{contact.number}</p>
                          <Button variant="outline" size="sm" className="mt-1">
                            Call
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-accent-primary"/>
                    Health & Medical
                  </CardTitle>
                  <CardDescription>
                    Healthcare facilities and medical information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Tokyo Medical Centers</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Tokyo Medical University Hospital</li>
                        <li>• St. Luke&apos;s International Hospital</li>
                        <li>• Tokyo Metropolitan Hospital</li>
                        <li>• Emergency: Call 119 (English-speaking operators available)</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-2">Travel Health Tips</h4>
                      <ul className="text-sm text-green-800 space-y-1">
                        <li>&bull; Universal healthcare available</li>
                        <li>&bull; Carry personal medications and medical information</li>
                        <li>&bull; Most hospitals accept international insurance</li>
                        <li>&bull; Pharmacies marked with green crosses</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-medium text-yellow-900 mb-2">Embassy Information</h4>
                      <ul className="text-sm text-yellow-800 space-y-1">
                        <li>• US Embassy: +81-3-3224-5000</li>
                        <li>• UK Embassy: +81-3-5211-1100</li>
                        <li>• Canadian Embassy: +81-3-5412-6200</li>
                        <li>• Emergency consular assistance available 24/7</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
              <CardContent className="p-8">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-semantic-error"/>
                  <h3 className="text-2xl font-display font-bold mb-4 text-red-900">Emergency Procedures</h3>
                  <div className="grid md:grid-cols-3 gap-6 text-left">
                    <div>
                      <h4 className="font-semibold text-red-900 mb-2">Earthquake</h4>
                      <ul className="text-sm text-red-800 space-y-1">
                        <li>• Drop to knees</li>
                        <li>• Cover head</li>
                        <li>• Hold until shaking stops</li>
                        <li>• Evacuate calmly</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-900 mb-2">Fire Emergency</h4>
                      <ul className="text-sm text-red-800 space-y-1">
                        <li>• Call 119 immediately</li>
                        <li>• Use fire extinguishers if safe</li>
                        <li>• Evacuate via marked exits</li>
                        <li>• Help others if possible</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-900 mb-2">Medical Emergency</h4>
                      <ul className="text-sm text-red-800 space-y-1">
                        <li>• Call 119 for ambulance</li>
                        <li>• Provide location in English</li>
                        <li>• Stay calm and give clear symptoms</li>
                        <li>• Have insurance info ready</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <section className="mt-12">
          <Card className="bg-gradient-to-r from-accent-primary/5 to-accent-secondary/5 border-accent-primary/20">
            <CardContent className="p-8">
              <div className="text-center">
                <Navigation className="h-12 w-12 mx-auto mb-4 text-accent-primary"/>
                <h3 className="text-2xl font-display font-bold mb-4">Need Help Planning?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Our travel experts are here to help you customize your journey,
                  answer questions, and ensure you have everything you need for an amazing experience.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link href="/contact">
                      <Mail className="h-4 w-4 mr-2"/>
                      Contact Travel Team
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/support">
                      <Phone className="h-4 w-4 mr-2"/>
                      24/7 Support
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t py-12 px-4 mt-16">
        <div className="container mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 G H X S T S H I P Industries LLC. ATLVS + GVTEWAY Travel Services.</p>
            <p className="text-sm mt-2">
              Making every journey safe, memorable, and extraordinary.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
