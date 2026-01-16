
'use client'


import { logger } from "@/lib/logger"
import { Shield, AlertTriangle, CheckCircle, Info, Phone, Mail, Clock, MapPin, ArrowLeft, ExternalLink, Gavel, Users, Camera, Ban } from "lucide-react"

interface EventData {
  id: string
  name: string
  venue: string
  date: string
  description?: string
  rules?: RuleCategory[]
  policies?: Policy[]
  contactInfo?: {
    phone?: string
    email?: string
  }
}

interface RuleCategory {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  rules: Rule[]
}

interface Rule {
  id: string
  title: string
  description: string
  enforcement: 'strict' | 'warning' | 'flexible'
  exceptions?: string[]
  consequences?: string
}

interface Policy {
  id: string
  title: string
  content: string
  category: string
  lastUpdated: Date
  effectiveDate: Date
}

interface EventRulesProps {
  params: Promise<{ slug: string }>
}

export default function Rules({ params }: EventRulesProps) {
  const { slug } = use(params)
  const [eventData, setEventData] = useState<EventData | null>(null)
  const [selectedTab, setSelectedTab] = useState("general")

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
              type: String(event.type || event.category || 'Event'),
              capacity: Number(event.capacity) || 0
            })
          }
        } else {
          if (!cancelled) {
            setEventData({
              name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              venue: '',
              date: '',
              time: '',
              type: 'Event',
              capacity: 0
            })
          }
        }
      } catch (error) {
        logger.error('Error loading event data:', error)
        if (!cancelled) {
          setEventData({
            name: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            venue: '',
            date: '',
            time: '',
            type: 'Event',
            capacity: 0
          })
        }
      }
    }

    loadEventData()

    return () => { cancelled = true }
  }, [slug])

  const ruleCategories: RuleCategory[] = [
    {
      id: "safety",
      title: "Safety & Security",
      description: "Rules designed to ensure the safety of all attendees",
      icon: Shield,
      color: "text-semantic-error",
      rules: [
        {
          id: "weapons",
          title: "No Weapons or Dangerous Items",
          description: "Firearms, knives, explosives, or any weapons are strictly prohibited. This includes concealed weapons.",
          enforcement: "strict",
          consequences: "Immediate removal from venue and potential arrest"
        },
        {
          id: "substances",
          title: "No Illegal Substances",
          description: "Possession or use of illegal drugs or controlled substances is prohibited.",
          enforcement: "strict",
          consequences: "Immediate removal and police involvement"
        },
        {
          id: "crowd-control",
          title: "Follow Crowd Control Instructions",
          description: "Obey all instructions from security personnel and venue staff regarding crowd movement and safety.",
          enforcement: "strict",
          consequences: "Removal from venue for non-compliance"
        },
        {
          id: "medical",
          title: "Medical Assistance",
          description: "Seek medical attention from venue medical staff rather than administering your own medical treatments.",
          enforcement: "warning",
          exceptions: ["Personal medication as prescribed by physician"]
        }
      ]
    },
    {
      id: "conduct",
      title: "Conduct & Behavior",
      description: "Standards of behavior expected from all attendees",
      icon: Users,
      color: "text-accent-secondary",
      rules: [
        {
          id: "respect",
          title: "Respect Other Attendees",
          description: "Treat all attendees, performers, and staff with respect. Harassment or discrimination will not be tolerated.",
          enforcement: "strict",
          consequences: "Immediate removal from venue"
        },
        {
          id: "disorderly",
          title: "No Disorderly Conduct",
          description: "Excessive intoxication, fighting, or disruptive behavior is prohibited.",
          enforcement: "strict",
          consequences: "Immediate removal and potential ban from future events"
        },
        {
          id: "children",
          title: "Children Under 5",
          description: "Children under 5 years old may not be admitted to this event due to volume levels and content.",
          enforcement: "strict",
          exceptions: ["Children under 5 are not permitted"]
        }
      ]
    },
    {
      id: "recording",
      title: "Recording & Photography",
      description: "Policies regarding recording devices and photography",
      icon: Camera,
      color: "text-accent-primary",
      rules: [
        {
          id: "professional-recording",
          title: "No Professional Recording Equipment",
          description: "Professional audio/video recording equipment is prohibited without written permission.",
          enforcement: "strict",
          consequences: "Equipment confiscation and removal"
        },
        {
          id: "personal-photos",
          title: "Personal Photography",
          description: "Personal cell phone photography is permitted but flash photography is prohibited during performances.",
          enforcement: "warning",
          exceptions: ["Personal cell phone photos without flash"]
        },
        {
          id: "drones",
          title: "No Drones or Aerial Devices",
          description: "Unmanned aerial vehicles (drones) are strictly prohibited in and around the venue.",
          enforcement: "strict",
          consequences: "Drone confiscation and legal action"
        }
      ]
    },
    {
      id: "items",
      title: "Prohibited Items",
      description: "Items that cannot be brought into the venue",
      icon: Ban,
      color: "text-semantic-warning",
      rules: [
        {
          id: "outside-food",
          title: "No Outside Food or Beverages",
          description: "Outside food, beverages, and coolers are not permitted. Venue concessions are available.",
          enforcement: "strict",
          consequences: "Items will be confiscated"
        },
        {
          id: "large-bags",
          title: "Bag Size Restrictions",
          description: "Bags larger than 12\" x 12\" x 6\" are not permitted. Small purses and clear bags are allowed.",
          enforcement: "strict",
          consequences: "Large bags must be returned to vehicle"
        },
        {
          id: "glass-containers",
          title: "No Glass Containers",
          description: "Glass bottles or containers are prohibited for safety reasons.",
          enforcement: "strict",
          consequences: "Glass items will not be permitted entry"
        },
        {
          id: "laser-pointers",
          title: "No Laser Pointers",
          description: "Laser pointers or similar devices are prohibited.",
          enforcement: "strict",
          consequences: "Items will be confiscated"
        }
      ]
    }
  ]

  const additionalPolicies: Policy[] = [
    {
      id: "refund",
      title: "Refund Policy",
      content: "Tickets are non-refundable except in cases of event cancellation. Refunds for cancelled events will be processed within 30 days. No refunds for no-shows or late arrivals.",
      category: "Ticketing",
      lastUpdated: new Date("2026-01-10"),
      effectiveDate: new Date("2026-01-01")
    },
    {
      id: "resale",
      title: "Ticket Resale Policy",
      content: "Tickets may not be resold for profit. Any tickets found to be sold above face value may result in cancellation. Official resale through authorized platforms only.",
      category: "Ticketing",
      lastUpdated: new Date("2026-01-08"),
      effectiveDate: new Date("2026-01-01")
    },
    {
      id: "weather",
      title: "Weather Policy",
      content: "Events will proceed rain or shine unless severe weather conditions pose a safety risk. In case of cancellation due to weather, ticket holders will be notified via email and app notifications.",
      category: "Operations",
      lastUpdated: new Date("2026-01-05"),
      effectiveDate: new Date("2026-01-01")
    },
    {
      id: "accessibility",
      title: "Accessibility Accommodations",
      content: "We are committed to accessibility. Guests requiring accommodations should contact our accessibility team at least 48 hours in advance. Sign language interpreters, audio description, and mobility assistance are available.",
      category: "Accessibility",
      lastUpdated: new Date("2026-01-03"),
      effectiveDate: new Date("2026-01-01")
    }
  ]

  const getEnforcementColor = (enforcement: string) => {
    switch (enforcement) {
      case 'strict': return 'bg-semantic-error/10 text-red-800'
      case 'warning': return 'bg-semantic-warning/10 text-yellow-800'
      case 'flexible': return 'bg-semantic-success/10 text-green-800'
      default: return 'bg-neutral-100 text-neutral-800'
    }
  }

  const getEnforcementIcon = (enforcement: string) => {
    switch (enforcement) {
      case 'strict': return <AlertTriangle className="h-4 w-4 text-semantic-error"/>
      case 'warning': return <Info className="h-4 w-4 text-semantic-warning"/>
      case 'flexible': return <CheckCircle className="h-4 w-4 text-semantic-success"/>
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
            <span className="text-foreground font-medium">Rules</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-accent-secondary/10 via-accent-primary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center space-x-4 mb-8">
            <div className="p-3 bg-accent-primary/20 rounded-full">
              <Gavel className="h-8 w-8 text-accent-primary"/>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">
                {eventData.name} Rules & Policies
              </h1>
              <p className="text-xl text-muted-foreground">
                Please review these important rules and policies before attending
              </p>
            </div>
          </div>

          {/* Important Notice */}
          <Alert className="mb-8">
            <AlertTriangle className="h-4 w-4"/>
            <AlertTitle>Important: Read Before Attending</AlertTitle>
            <AlertDescription>
              Violation of these rules may result in removal from the venue, forfeiture of ticket value,
              and potential banning from future events. Please respect these policies to ensure a safe
              and enjoyable experience for everyone.
            </AlertDescription>
          </Alert>

          {/* Key Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-8 w-8 mx-auto mb-2 text-semantic-error"/>
                <h3 className="font-semibold mb-1">Safety First</h3>
                <p className="text-sm text-muted-foreground">
                  Your safety is our top priority
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-accent-primary"/>
                <h3 className="font-semibold mb-1">{eventData.capacity.toLocaleString()}</h3>
                <p className="text-sm text-muted-foreground">
                  Maximum capacity
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-semantic-success"/>
                <h3 className="font-semibold mb-1">24/7</h3>
                <p className="text-sm text-muted-foreground">
                  Security monitoring
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 mx-auto mb-2 text-accent-primary"/>
                <h3 className="font-semibold mb-1">Support</h3>
                <p className="text-sm text-muted-foreground">
                  Available throughout event
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General Rules</TabsTrigger>
            <TabsTrigger value="categories">Rule Categories</TabsTrigger>
            <TabsTrigger value="policies">Additional Policies</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-8">
            {/* Overview */}
            <Card>
              <CardContent className="p-8">
                <div className="text-center max-w-4xl mx-auto">
                  <h2 className="text-2xl font-display font-bold mb-4">Event Rules Overview</h2>
                  <p className="text-lg text-muted-foreground mb-6">
                    These rules are designed to ensure a safe, enjoyable, and respectful experience for all attendees.
                    By purchasing a ticket, you agree to abide by these policies.
                  </p>
                  <div className="grid md:grid-cols-3 gap-6 mt-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent-primary mb-2">4</div>
                      <div className="text-sm text-muted-foreground">Rule Categories</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent-primary mb-2">15+</div>
                      <div className="text-sm text-muted-foreground">Specific Rules</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent-primary mb-2">100%</div>
                      <div className="text-sm text-muted-foreground">Enforcement Rate</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Rules Summary */}
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">Quick Rules Summary</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-semantic-error">
                      <Ban className="h-5 w-5 mr-2"/>
                      Absolutely Prohibited
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Weapons or dangerous items</li>
                      <li>• Illegal substances</li>
                      <li>• Professional recording equipment</li>
                      <li>• Drones or aerial devices</li>
                      <li>• Glass containers</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-semantic-success">
                      <CheckCircle className="h-5 w-5 mr-2"/>
                      Permitted
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li>• Personal cell phones</li>
                      <li>• Small purses and bags</li>
                      <li>• Personal medication</li>
                      <li>• Service animals</li>
                      <li>• Personal photography (no flash)</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-8">
            {ruleCategories.map((category, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <category.icon className={`h-6 w-6 mr-3 ${category.color}`}/>
                    {category.title}
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.rules.map((rule, ruleIndex) => (
                      <AccordionItem key={ruleIndex} value={`${category.id}-${rule.id}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-start justify-between w-full text-left">
                            <div className="flex-1">
                              <h4 className="font-semibold">{rule.title}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge className={getEnforcementColor(rule.enforcement)}>
                                  {getEnforcementIcon(rule.enforcement)}
                                  <span className="ml-1 capitalize">{rule.enforcement}</span>
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pt-4 space-y-4">
                            <p className="text-muted-foreground">{rule.description}</p>

                            {rule.exceptions && rule.exceptions.length > 0 && (
                              <div>
                                <h5 className="font-medium mb-2 text-semantic-success">Exceptions:</h5>
                                <ul className="text-sm text-muted-foreground ml-4 space-y-1">
                                  {rule.exceptions.map((exception, excIndex) => (
                                    <li key={excIndex}>• {exception}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {rule.consequences && (
                              <div>
                                <h5 className="font-medium mb-2 text-semantic-error">Consequences for Violation:</h5>
                                <p className="text-sm text-muted-foreground">{rule.consequences}</p>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="policies" className="space-y-8">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6">Additional Policies</h2>
              <div className="space-y-6">
                {additionalPolicies.map((policy, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-start justify-between">
                        <span>{policy.title}</span>
                        <Badge variant="outline" className="ml-2">
                          {policy.category}
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        Effective {policy.effectiveDate.toLocaleDateString()} •
                        Last updated {policy.lastUpdated.toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{policy.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="h-5 w-5 mr-2"/>
                  Questions About These Policies?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-accent-primary"/>
                      <div>
                        <p className="font-medium">Event Support Line</p>
                        <p className="text-sm text-muted-foreground">1-800-EVENTS (1-800-368-3687)</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-accent-primary"/>
                      <div>
                        <p className="font-medium">Email Support</p>
                        <p className="text-sm text-muted-foreground">rules@atlvs.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-accent-primary"/>
                      <div>
                        <p className="font-medium">Support Hours</p>
                        <p className="text-sm text-muted-foreground">24/7 during event</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-5 w-5 text-accent-primary"/>
                      <div>
                        <p className="font-medium">On-site Support</p>
                        <p className="text-sm text-muted-foreground">Guest Services Desk</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              These rules help ensure a safe and enjoyable experience for everyone.
            </p>
            <div className="flex justify-center space-x-6">
              <Button variant="outline" asChild>
                <Link href={`/events/${slug}`}>
                  <ArrowLeft className="h-4 w-4 mr-2"/>
                  Back to Event
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={`/events/${slug}/accessibility`}>
                  <ExternalLink className="h-4 w-4 mr-2"/>
                  Accessibility Info
                </Link>
              </Button>
              <Button asChild>
                <Link href={`/events/${slug}/tickets`}>
                  <ExternalLink className="h-4 w-4 mr-2"/>
                  Get Tickets
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
