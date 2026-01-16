
'use client'


import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { Accessibility as AccessibilityIcon, Ear, Eye, Phone, Mail, MapPin, Clock, Users, CheckCircle, AlertTriangle, Info, HelpCircle, Shield, Volume2, VolumeX, ArrowLeft } from "lucide-react"
import { logger } from '@/lib/logger'

interface EventData {
  id: string
  name: string
  venue: string
  date: string
  description?: string
  accessibility?: {
    features?: AccessibilityFeature[]
    services?: SupportService[]
    venues?: VenueAccessibility[]
  }
  contactInfo?: {
    phone?: string
    email?: string
  }
}

interface AccessibilityFeature {
  category: string
  features: string[]
  icon: React.ComponentType<{ className?: string }>
}

interface SupportService {
  name: string
  description: string
  contact: string
  available: string
}

interface VenueAccessibility {
  area: string
  features: string[]
  rating: 'full' | 'partial' | 'limited'
}

export default function AccessibilityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [eventData, setEventData] = useState<EventData | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadEventData = async () => {
      try {
        const res = await fetch(`/api/v1/events/${slug}`)
        if (res.ok) {
          const data = await res.json()
          const event = data.event || data
          if (!cancelled && event) {
            setEventData({
              name: String(event.name || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())),
              venue: String(event.venue || event.venue_name || ''),
              date: event.date || event.start_date || '',
              time: event.time || event.start_time || '',
              adaCompliant: Boolean(event.ada_compliant !== false),
              accessibilityRating: Number(event.accessibility_rating) || 4.5
            })
          }
        } else {
          if (!cancelled) {
            setEventData({
              name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              venue: '',
              date: '',
              time: '',
              adaCompliant: true,
              accessibilityRating: 4.5
            })
          }
        }
      } catch (error) {
        logger.error('Error loading event accessibility data', error, { slug })
      } finally {
        if (!cancelled) {
          setEventData({
            name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            venue: '',
            date: '',
            time: '',
            adaCompliant: true,
            accessibilityRating: 4.5
          })
        }
      }
    }

    loadEventData()
    return () => {
      cancelled = true
    }
  }, [slug])

  const accessibilityFeatures: AccessibilityFeature[] = [
    {
      category: "Mobility",
      icon: Users,
      features: [
        "Wheelchair accessible seating",
        "Ramp access to all areas",
        "Accessible parking spaces"
      ]
    },
    {
      category: "Sensory",
      icon: Ear,
      features: [
        "Hearing assistance devices (HAD)",
        "Captioned performances",
        "Sign language interpreters",
        "Audio description services",
        "Visual alerts for emergencies",
        "Low-noise areas available",
        "Tactile signage and wayfinding"
      ]
    },
    {
      category: "Visual",
      icon: Eye,
      features: [
        "Braille signage and programs",
        "Large print materials",
        "Audio description services",
        "Guide dog accessible areas",
        "High contrast signage",
        "Accessible lighting",
        "Magnification devices available"
      ]
    }
  ]

  const supportServices: SupportService[] = [
    {
      name: "Accessibility Support Line",
      description: "Dedicated support for accessibility accommodations and questions",
      contact: "1-800-ACCESS (1-800-222-3777)",
      available: "24/7 during event"
    },
    {
      name: "Sign Language Interpreters",
      description: "Certified ASL interpreters available for all performances",
      contact: "accessibility@atlvs.com",
      available: "By appointment"
    },
    {
      name: "Hearing Assistance Devices",
      description: "Headsets and receivers for enhanced audio experience",
      contact: "Will-call window",
      available: "Available at venue"
    },
    {
      name: "Mobility Assistance",
      description: "Accessibility and mobility support services",
      contact: "Guest Services Desk",
      available: "On-site support"
    }
  ]

  const venueAccessibility: VenueAccessibility[] = [
    {
      area: "Main Entrance",
      rating: "full",
      features: [
        "ADA compliant automatic doors",
        "Level entry with no steps",
        "Clear pathways to seating areas",
        "Braille and tactile signage",
        "Accessible ticket windows"
      ]
    },
    {
      area: "Seating Areas",
      rating: "full",
      features: [
        "Designated accessible seating",
        "Companion seating available",
        "Clear sightlines to stage",
        "Accessible concessions access",
        "Hearing assistance loops"
      ]
    },
    {
      area: "Restrooms",
      rating: "full",
      features: [
        "ADA compliant facilities",
        "Grab bars and accessible sinks",
        "Accessible changing tables",
        "Tactile signage",
        "Emergency call buttons"
      ]
    },
    {
      area: "Concessions",
      rating: "full",
      features: [
        "Lowered counters for wheelchair access",
        "Accessible food ordering",
        "Braille menus available",
        "Hearing assistance at counters"
      ]
    },
    {
      area: "Emergency Exits",
      rating: "full",
      features: [
        "ADA compliant exit routes",
        "Accessible evacuation procedures",
        "Visual and audible alarms",
        "Tactile exit signage",
        "Accessible refuge areas"
      ]
    }
  ]

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'full': return 'bg-semantic-success/10 text-green-800'
      case 'partial': return 'bg-semantic-warning/10 text-yellow-800'
      case 'limited': return 'bg-semantic-error/10 text-red-800'
      default: return 'bg-neutral-100 text-neutral-800'
    }
  }

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'full': return <CheckCircle className="h-4 w-4 text-semantic-success"/>
      case 'partial': return <AlertTriangle className="h-4 w-4 text-semantic-warning"/>
      case 'limited': return <AlertTriangle className="h-4 w-4 text-semantic-error"/>
      default: return <Info className="h-4 w-4 text-neutral-600"/>
    }
  }

  if (!eventData) {
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
            <Link href="/events" className="hover:text-foreground">Events</Link>
            <span>/</span>
            <Link href={`/events/${slug}`} className="hover:text-foreground">{eventData.name}</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Accessibility</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-accent-secondary/10 via-accent-primary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-3 bg-accent-primary/20 rounded-full">
              <AccessibilityIcon className="h-8 w-8 text-accent-primary"/>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
                {eventData.name} Accessibility
              </h1>
              <p className="text-xl text-muted-foreground">
                We&apos;re committed to making this event accessible to everyone
              </p>
            </div>
          </div>

          {/* Accessibility Status */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-semantic-success/10 rounded-full mb-4">
                  <CheckCircle className="h-6 w-6 text-semantic-success"/>
                </div>
                <h3 className="font-semibold mb-2">ADA Compliant</h3>
                <p className="text-sm text-muted-foreground">
                  This venue meets ADA accessibility standards
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-primary/10 rounded-full mb-4">
                  <div className="text-2xl">⭐</div>
                </div>
                <h3 className="font-semibold mb-2">Accessibility Rating</h3>
                <div className="flex items-center justify-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.floor(eventData.accessibilityRating) ? "text-yellow-400" : "text-neutral-300"}>
                      
                    </span>
                  ))}
                  <span className="ml-2 text-sm font-medium">{eventData.accessibilityRating}/5.0</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-primary/10 rounded-full mb-4">
                  <Phone className="h-6 w-6 text-accent-primary"/>
                </div>
                <h3 className="font-semibold mb-2">Support Available</h3>
                <p className="text-sm text-muted-foreground">
                  24/7 accessibility support during the event
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="venue">Venue Access</TabsTrigger>
            <TabsTrigger value="services">Support Services</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Commitment Statement */}
            <Card>
              <CardContent className="p-8">
                <div className="text-center max-w-4xl mx-auto">
                  <h2 className="text-2xl font-display font-bold mb-4">Our Accessibility Commitment</h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    We are dedicated to ensuring that everyone can enjoy {eventData.name} regardless of physical ability,
                    sensory needs, or other accessibility requirements. Our venue and event planning incorporate
                    comprehensive accessibility features to create an inclusive experience for all guests.
                  </p>
                  <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent-primary mb-2">100%</div>
                      <div className="text-sm text-muted-foreground">ADA Compliant Areas</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent-primary mb-2">24/7</div>
                      <div className="text-sm text-muted-foreground">Support Availability</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent-primary mb-2">15+</div>
                      <div className="text-sm text-muted-foreground">Accessibility Services</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Accessibility Features */}
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">Accessibility Features</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {accessibilityFeatures.map((category, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <category.icon className="h-5 w-5 mr-2 text-accent-primary"/>
                        {category.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {category.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-semantic-success mt-0.5 mr-2 flex-shrink-0"/>
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Important Notice */}
            <Alert>
              <Info className="h-4 w-4"/>
              <AlertTitle>Planning Your Visit</AlertTitle>
              <AlertDescription>
                We recommend contacting our accessibility team at least 48 hours in advance to ensure
                all accommodations are properly arranged. Early planning helps us provide the best possible experience.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="venue" className="space-y-8">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">Venue Accessibility Map</h2>
              <Card>
                <CardContent className="p-8">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground"/>
                    <h3 className="text-lg font-semibold mb-2">Interactive Venue Map</h3>
                    <p className="text-muted-foreground mb-4">
                      View detailed accessibility information for {eventData.venue}
                    </p>
                    <Button>View Interactive Map</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Venue Accessibility Details */}
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">Accessibility by Area</h2>
              <div className="space-y-6">
                {venueAccessibility.map((area, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center">
                          {getRatingIcon(area.rating)}
                          <span className="ml-2">{area.area}</span>
                        </span>
                        <Badge className={getRatingColor(area.rating)}>
                          {area.rating === 'full' ? 'Fully Accessible' :
                           area.rating === 'partial' ? 'Partially Accessible' :
                           'Limited Access'}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {area.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-semantic-success mt-0.5 mr-2 flex-shrink-0"/>
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-8">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">Support Services</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {supportServices.map((service, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-accent-primary"/>
                        {service.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground"/>
                          <span>{service.contact}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground"/>
                          <span>{service.available}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Emergency Procedures */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-semantic-warning"/>
                  Emergency Procedures
                </CardTitle>
                <CardDescription>
                  What to do in case of emergency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Emergency Evacuation</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      In case of emergency, follow the accessible evacuation routes marked with green signage.
                      Designated staff will assist guests requiring mobility support.
                    </p>
                    <ul className="text-sm space-y-1">
                      <li>• Follow tactile pathways to nearest exit</li>
                      <li>• Use elevator if available and safe to do so</li>
                      <li>• Wait for assistance in designated refuge areas</li>
                      <li>• Call accessibility support line if separated from group</li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Medical Assistance</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Medical emergencies will be handled by trained venue staff and local emergency services.
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <span>Emergency: 911</span>
                      <span>Venue Medical: Extension 500</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="faq" className="space-y-8">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="wheelchair">
                  <AccordionTrigger className="text-left">
                    Do you provide wheelchair accessible seating?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-3">
                      Yes, we offer wheelchair accessible seating throughout the venue. These seats are
                      strategically located to provide optimal viewing of the stage and performance area.
                    </p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• Designated wheelchair spaces in all seating sections</li>
                      <li>• Companion seating available next to wheelchair spaces</li>
                      <li>• Clear sightlines to all performance areas</li>
                      <li>• Accessible pathways to and from seating</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="service-animals">
                  <AccordionTrigger className="text-left">
                    Are service animals allowed?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-3">
                      Yes, service animals are welcome at {eventData.name}. Our venue is fully accessible
                      to service animals and their handlers.
                    </p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• All areas are accessible to service animals</li>
                      <li>• Designated relief areas available</li>
                      <li>• Water stations for service animals</li>
                      <li>• No additional fees for service animals</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="hearing">
                  <AccordionTrigger className="text-left">
                    What hearing assistance is available?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-3">
                      We provide comprehensive hearing assistance to ensure all guests can enjoy the performance.
                    </p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• Hearing assistance devices (HAD) available at will-call</li>
                      <li>• Sign language interpreters for all performances</li>
                      <li>• Captioned performances for select shows</li>
                      <li>• Audio description services available</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="parking">
                  <AccordionTrigger className="text-left">
                    Is accessible parking available?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-3">
                      Yes, we provide accessible parking with direct access to the venue entrance.
                    </p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• Designated accessible parking spaces</li>
                      <li>• Direct pathways to venue entrance</li>
                      <li>• No additional parking fees</li>
                      <li>• Valet service available for accessible vehicles</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="advance-notice">
                  <AccordionTrigger className="text-left">
                    How far in advance should I request accommodations?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-3">
                      We recommend requesting accommodations as early as possible, ideally when purchasing tickets.
                      However, we can accommodate requests up to 48 hours before the event in most cases.
                    </p>
                    <ul className="text-sm space-y-1 ml-4">
                      <li>• Best results: Request with ticket purchase</li>
                      <li>• Minimum notice: 48 hours before event</li>
                      <li>• Emergency requests: Contact accessibility line directly</li>
                      <li>• All requests handled on a case-by-case basis</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="contact">
                  <AccordionTrigger className="text-left">
                    How do I contact accessibility services?
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3">
                      <p>
                        Our accessibility team is available to assist with any questions or special requests.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center mb-2">
                            <Phone className="h-4 w-4 mr-2 text-accent-primary"/>
                            <span className="font-medium">Phone Support</span>
                          </div>
                          <p className="text-sm">1-800-ACCESS (1-800-222-3777)</p>
                          <p className="text-xs text-muted-foreground">24/7 during event</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center mb-2">
                            <Mail className="h-4 w-4 mr-2 text-accent-primary"/>
                            <span className="font-medium">Email Support</span>
                          </div>
                          <p className="text-sm">accessibility@atlvs.com</p>
                          <p className="text-xs text-muted-foreground">Response within 24 hours</p>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              We&apos;re committed to accessibility and inclusion for all guests.
            </p>
            <div className="flex justify-center space-x-6">
              <Button variant="outline" asChild>
                <Link href={`/events/${slug}`}>
                  <ArrowLeft className="h-4 w-4 mr-2"/>
                  Back to Event
                </Link>
              </Button>
              <Button asChild>
                <Link href="/support/accessibility">
                  <HelpCircle className="h-4 w-4 mr-2"/>
                  General Accessibility Info
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
