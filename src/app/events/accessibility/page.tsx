
'use client'

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/lib/design-system"
import { Accessibility, Volume2, VolumeX, Eye, EyeOff, Users, Clock, MapPin, Phone, Mail, AlertCircle, CheckCircle, Info, HelpCircle } from "lucide-react"

interface AccessibilityFeature {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  available: boolean
  details?: string
}

interface SeatingSection {
  id: string
  name: string
  description: string
  accessibilityFeatures: string[]
  capacity: number
  available: number
  priceRange: {
    min: number
    max: number
    currency: string
  }
}

interface AssistiveService {
  id: string
  title: string
  description: string
  contact: string
  availability: string
  bookingRequired: boolean
}

export default function EventAccessibilityPage() {
  const [selectedTab, setSelectedTab] = useState("overview")

  // Mock data for accessibility features
  const accessibilityFeatures: AccessibilityFeature[] = [
    {
      id: "wheelchair-access",
      title: "Accessibility Accessible Entrances",
      description: "Multiple ADA-compliant entrances with ramps and automatic doors",
      icon: Accessibility,
      available: true,
      details: "All main entrances and VIP areas are fully accessible"
    },
    {
      id: "accessible-seating",
      title: "Accessible Seating Areas",
      description: "Designated seating sections with proper sightlines and space",
      icon: Users,
      available: true,
      details: "Sections A101-A110 with companion seating available"
    },
    {
      id: "audio-description",
      title: "Audio Description Services",
      description: "Live audio narration of visual elements for visually impaired guests",
      icon: Volume2,
      available: true,
      details: "Available in English and Spanish, headphones provided"
    },
    {
      id: "captioning",
      title: "Closed Captioning",
      description: "Real-time captioning displayed on venue screens",
      icon: Eye,
      available: true,
      details: "Available on all main stage screens and mobile app"
    },
    {
      id: "sign-language",
      title: "Sign Language Interpreters",
      description: "Certified ASL interpreters for deaf and hard-of-hearing guests",
      icon: HelpCircle,
      available: true,
      details: "2 interpreters available, located at stage left"
    },
    {
      id: "quiet-areas",
      title: "Quiet/Sensory-Friendly Areas",
      description: "Designated low-stimulation areas for guests with sensory sensitivities",
      icon: VolumeX,
      available: true,
      details: "Located in the East Wing, available throughout the event"
    },
    {
      id: "service-animals",
      title: "Service Animal Access",
      description: "Service animals are welcome with proper documentation",
      icon: Eye,
      available: true,
      details: "Please inform staff upon arrival for assistance"
    },
    {
      id: "accessible-restrooms",
      title: "Accessible Restrooms",
      description: "ADA-compliant restrooms with grab bars and accessible sinks",
      icon: Accessibility,
      available: true,
      details: "Located on all floors, clearly marked"
    }
  ]

  const seatingSections: SeatingSection[] = [
    {
      id: "accessible-general",
      name: "Accessible General Admission",
      description: "Accessible seating in the general admission area with excellent sightlines",
      accessibilityFeatures: ["wheelchair-access", "accessible-seating", "audio-description"],
      capacity: 50,
      available: 23,
      priceRange: { min: 89, max: 125, currency: "USD" }
    },
    {
      id: "vip-accessible",
      name: "VIP Accessible Lounge",
      description: "Premium accessible seating with VIP amenities and dedicated staff",
      accessibilityFeatures: ["wheelchair-access", "accessible-seating", "audio-description", "sign-language"],
      capacity: 20,
      available: 8,
      priceRange: { min: 250, max: 350, currency: "USD" }
    },
    {
      id: "companion-seating",
      name: "Companion Seating",
      description: "Accessible seating for guests accompanying wheelchair users",
      accessibilityFeatures: ["accessible-seating", "wheelchair-access"],
      capacity: 30,
      available: 15,
      priceRange: { min: 75, max: 100, currency: "USD" }
    }
  ]

  const assistiveServices: AssistiveService[] = [
    {
      id: "captioning-service",
      title: "Live Captioning",
      description: "Real-time captioning of all announcements and performances",
      contact: "accessibility@atlvs.com",
      availability: "Throughout event",
      bookingRequired: false
    },
    {
      id: "interpreter-service",
      title: "Sign Language Interpretation",
      description: "Certified ASL interpreters for the full event duration",
      contact: "+1 (555) 123-4567",
      availability: "Event duration",
      bookingRequired: true
    },
    {
      id: "audio-assistance",
      title: "Hearing Assistance Devices",
      description: "Personal FM systems and captioning glasses available",
      contact: "accessibility@atlvs.com",
      availability: "Upon request",
      bookingRequired: true
    },
    {
      id: "mobility-assistance",
      title: "Mobility Assistance",
      description: "Accessibility loans and staff assistance throughout the venue",
      contact: "+1 (555) 123-4567",
      availability: "Event duration",
      bookingRequired: false
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-accent-primary/10 via-accent-secondary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-primary/20 rounded-full mb-6">
              <Accessibility className="h-10 w-10 text-accent-primary"/>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Event Accessibility
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              We&apos;re committed to making our events accessible and enjoyable for everyone.
              Explore our comprehensive accessibility features and support services.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                <Phone className="h-5 w-5 mr-2"/>
                Request Assistance
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Mail className="h-5 w-5 mr-2"/>
                Contact Accessibility Team
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Accessibility className="h-8 w-8 mx-auto mb-2 text-accent-primary"/>
              <div className="text-2xl font-bold">100%</div>
              <div className="text-sm text-muted-foreground">Accessibility Accessible</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Volume2 className="h-8 w-8 mx-auto mb-2 text-accent-secondary"/>
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm text-muted-foreground">Audio Description</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <HelpCircle className="h-8 w-8 mx-auto mb-2 text-accent-tertiary"/>
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm text-muted-foreground">Accessible Seats</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-semantic-success"/>
              <div className="text-2xl font-bold">Free</div>
              <div className="text-sm text-muted-foreground">Assistive Services</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="seating">Accessible Seating</TabsTrigger>
            <TabsTrigger value="services">Assistive Services</TabsTrigger>
            <TabsTrigger value="planning">Planning Your Visit</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Accessibility className="h-5 w-5 mr-2"/>
                  Accessibility Features
                </CardTitle>
                <CardDescription>
                  Comprehensive accessibility features available at all our events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {accessibilityFeatures.map((feature) => (
                    <div key={feature.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className={`p-2 rounded-lg ${feature.available ? 'bg-semantic-success/10' : 'bg-neutral-100'}`}>
                        <feature.icon className={`h-5 w-5 ${feature.available ? 'text-semantic-success' : 'text-neutral-400'}`}/>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{feature.title}</h3>
                          <Badge className={feature.available ? 'bg-semantic-success/10 text-green-800' : 'bg-neutral-100 text-neutral-800'}>
                            {feature.available ? 'Available' : 'Not Available'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {feature.description}
                        </p>
                        {feature.details && (
                          <p className="text-xs text-muted-foreground">
                            {feature.details}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Get in touch with our accessibility team
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-accent-primary"/>
                      <div>
                        <p className="font-medium">Accessibility Hotline</p>
                        <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                        <p className="text-xs text-muted-foreground">Available 24/7 for event support</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-accent-secondary"/>
                      <div>
                        <p className="font-medium">Email Support</p>
                        <p className="text-sm text-muted-foreground">accessibility@atlvs.com</p>
                        <p className="text-xs text-muted-foreground">Response within 2 hours</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-accent-tertiary"/>
                      <div>
                        <p className="font-medium">On-site Support</p>
                        <p className="text-sm text-muted-foreground">Available at all entrances</p>
                        <p className="text-xs text-muted-foreground">2 hours before event start</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-semantic-success"/>
                      <div>
                        <p className="font-medium">Accessibility Center</p>
                        <p className="text-sm text-muted-foreground">Located in Main Lobby</p>
                        <p className="text-xs text-muted-foreground">Staff available throughout event</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Seating Tab */}
          <TabsContent value="seating" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold mb-4">Accessible Seating Options</h2>
              <p className="text-muted-foreground">
                Choose from our selection of accessible seating areas designed for comfort and optimal viewing
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {seatingSections.map((section) => (
                <Card key={section.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {section.name}
                      <Badge variant="outline">
                        {section.available}/{section.capacity} available
                      </Badge>
                    </CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Accessibility Features</h4>
                        <div className="flex flex-wrap gap-1">
                          {section.accessibilityFeatures.map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {accessibilityFeatures.find(f => f.id === feature)?.title.split(' ')[0] || feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Price Range:</span>
                        <span className="font-medium">
                          ${section.priceRange.min} - ${section.priceRange.max}
                        </span>
                      </div>

                      <Button className="w-full" disabled={section.available === 0}>
                        {section.available > 0 ? 'Select Seats' : 'Sold Out'}
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
                    <h3 className="font-semibold text-blue-900 mb-2">Seating Policies</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Accessible seating is available on a first-come, first-served basis</li>
                      <li>• Companion seating is available for wheelchair users</li>
                      <li>• All accessible seats have unobstructed views of the stage</li>
                      <li>• Early arrival is recommended for best seat selection</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold mb-4">Assistive Services</h2>
              <p className="text-muted-foreground">
                Professional support services to ensure everyone can enjoy the event
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {assistiveServices.map((service) => (
                <Card key={service.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5 text-accent-primary"/>
                      {service.title}
                    </CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground"/>
                        <span>Available: {service.availability}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground"/>
                        <span>Contact: {service.contact}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {service.bookingRequired ? (
                          <>
                            <AlertCircle className="h-4 w-4 text-semantic-warning"/>
                            <span className="text-sm text-orange-700">Advance booking required</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 text-semantic-success"/>
                            <span className="text-sm text-semantic-success">Available on-site</span>
                          </>
                        )}
                      </div>

                      <Button variant="outline" className="w-full">
                        {service.bookingRequired ? 'Request Service' : 'Contact for Support'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Planning Tab */}
          <TabsContent value="planning" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold mb-4">Planning Your Accessible Visit</h2>
              <p className="text-muted-foreground">
                Tips and information to help you plan the perfect accessible event experience
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Pre-Event Preparation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-semantic-success mt-0.5 flex-shrink-0"/>
                    <div>
                      <p className="font-medium">Book Accessible Seating Early</p>
                      <p className="text-sm text-muted-foreground">
                        Reserve your accessible seats at least 48 hours in advance
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-semantic-success mt-0.5 flex-shrink-0"/>
                    <div>
                      <p className="font-medium">Request Assistive Services</p>
                      <p className="text-sm text-muted-foreground">
                        Contact us 1 week before the event for special accommodations
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-semantic-success mt-0.5 flex-shrink-0"/>
                    <div>
                      <p className="font-medium">Download Accessibility App</p>
                      <p className="text-sm text-muted-foreground">
                        Use our mobile app for venue navigation and real-time updates
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-semantic-success mt-0.5 flex-shrink-0"/>
                    <div>
                      <p className="font-medium">Plan Your Transportation</p>
                      <p className="text-sm text-muted-foreground">
                        Check transportation accessibility and parking availability
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>On-Site Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-accent-primary mt-0.5 flex-shrink-0"/>
                    <div>
                      <p className="font-medium">Accessibility Ambassadors</p>
                      <p className="text-sm text-muted-foreground">
                        Trained staff available throughout the venue to assist guests
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Accessibility className="h-5 w-5 text-accent-primary mt-0.5 flex-shrink-0"/>
                    <div>
                      <p className="font-medium">Mobility Support</p>
                      <p className="text-sm text-muted-foreground">
                        Accessibility loans and assistance available at main entrances
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-semantic-success mt-0.5 flex-shrink-0"/>
                    <div>
                      <p className="font-medium">Accessible Routes</p>
                      <p className="text-sm text-muted-foreground">
                        Clearly marked accessible paths throughout the venue
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Volume2 className="h-5 w-5 text-semantic-warning mt-0.5 flex-shrink-0"/>
                    <div>
                      <p className="font-medium">Quiet Areas</p>
                      <p className="text-sm text-muted-foreground">
                        Designated sensory-friendly areas available as needed
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-accent-primary/5 to-accent-secondary/5 border-accent-primary/20">
              <CardContent className="p-8">
                <div className="text-center">
                  <Accessibility className="h-12 w-12 mx-auto mb-4 text-accent-primary"/>
                  <h3 className="text-2xl font-display font-bold mb-4">Need Additional Support?</h3>
                  <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Our accessibility team is here to help you have the best possible event experience.
                    Contact us anytime for personalized assistance and accommodations.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg">
                      <Phone className="h-4 w-4 mr-2"/>
                      Call Accessibility Team
                    </Button>
                    <Button size="lg" variant="outline">
                      <Mail className="h-4 w-4 mr-2"/>
                      Send Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t py-12 px-4 mt-16">
        <div className="container mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 G H X S T S H I P Industries LLC. ATLVS + GVTEWAY Events.</p>
            <p className="text-sm mt-2">
              Committed to accessible and inclusive entertainment for everyone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
