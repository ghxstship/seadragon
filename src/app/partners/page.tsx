
'use client'


import { logger } from "@/lib/logger"
import { Handshake, Trophy, Building2, Users, Award, TrendingUp, Globe, Star, CheckCircle, ArrowRight, ExternalLink, MapPin, Calendar, DollarSign } from "lucide-react"

interface PartnerApiResponse {
  id: string | number
  name?: string
  type?: string
  description?: string
  logo?: string
  website?: string
  partnership_level?: string
  since?: number
  benefits?: string[]
  location?: string
  featured?: boolean
}

interface Partner {
  id: string
  name: string
  type: 'sponsor' | 'vendor' | 'affiliate' | 'destination' | 'airline' | 'hospitality'
  description: string
  logo: string
  website?: string
  partnershipLevel: 'platinum' | 'gold' | 'silver' | 'bronze'
  since: number
  benefits: string[]
  location?: string
  featured: boolean
}

interface Partner {
  id: string
  name: string
  type: 'sponsor' | 'vendor' | 'affiliate' | 'destination' | 'airline' | 'hospitality'
  description: string
  logo: string
  website?: string
  partnershipLevel: 'platinum' | 'gold' | 'silver' | 'bronze'
  since: number
  benefits: string[]
  location?: string
  featured: boolean
}

interface SponsorshipTier {
  id: string
  name: string
  level: 'platinum' | 'gold' | 'silver' | 'bronze'
  price: string
  benefits: string[]
  popular?: boolean
}

interface SuccessStory {
  id: string
  partner: string
  type: string
  quote: string
  author: string
  title: string
  results: string[]
  logo: string
}

export default function PartnersPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadPartners = async () => {
      try {
        // Fetch partners from API
        const res = await fetch('/api/v1/partners')
        if (res.ok) {
          const data = await res.json()
          const partnerData = Array.isArray(data.partners) ? data.partners : []
          const mapped: Partner[] = partnerData.map((p: PartnerApiResponse) => ({
            id: String(p.id),
            name: String(p.name || 'Partner'),
            type: (p.type as 'sponsor' | 'vendor' | 'affiliate' | 'destination' | 'airline' | 'hospitality') || 'vendor',
            description: String(p.description || ''),
            logo: p.logo || '',
            website: p.website,
            partnershipLevel: (p.partnership_level as 'platinum' | 'gold' | 'silver' | 'bronze') || 'bronze',
            since: p.since || new Date().getFullYear(),
            benefits: Array.isArray(p.benefits) ? p.benefits : [],
            location: p.location,
            featured: Boolean(p.featured)
          }))
          if (!cancelled) {
            setPartners(mapped)
            setLoading(false)
          }
        } else {
          if (!cancelled) {
            setPartners([])
            setLoading(false)
          }
        }
      } catch (error) {
        logger.error('Error loading partners:', error)
        if (!cancelled) {
          setPartners([])
          setLoading(false)
        }
      }
    }

    loadPartners()

    return () => { cancelled = true }
  }, [])

  const sponsorshipTiers: SponsorshipTier[] = [
    {
      id: "platinum",
      name: "Platinum Sponsor",
      level: "platinum",
      price: "Custom",
      benefits: [
        "Premium logo placement",
        "Speaking opportunities",
        "VIP event access",
        "Custom content integration",
        "Dedicated account manager",
        "Analytics & reporting"
      ],
      popular: false
    },
    {
      id: "gold",
      name: "Gold Sponsor",
      level: "gold",
      price: "$50,000+",
      benefits: [
        "Prominent logo placement",
        "Social media mentions",
        "Booth space at events",
        "Newsletter features",
        "Website recognition",
        "Monthly performance reports"
      ],
      popular: true
    },
    {
      id: "silver",
      name: "Silver Sponsor",
      level: "silver",
      price: "$25,000+",
      benefits: [
        "Logo placement",
        "Event mentions",
        "Digital content features",
        "Email newsletter",
        "Basic analytics",
        "Community recognition"
      ],
      popular: false
    },
    {
      id: "bronze",
      name: "Bronze Sponsor",
      level: "bronze",
      price: "$10,000+",
      benefits: [
        "Logo recognition",
        "Event listing",
        "Social media shoutouts",
        "Basic website presence",
        "Community access"
      ],
      popular: false
    }
  ]

  const successStories: SuccessStory[] = [
    {
      id: "luxury-resorts",
      partner: "Paradise Resorts",
      type: "Hospitality Partner",
      quote: "Partnering with ATLVS + GVTEWAY increased our direct bookings by 40% and helped us reach a premium audience we couldn't access through traditional channels.",
      author: "Sarah Chen",
      title: "Marketing Director",
      results: ["40% increase in direct bookings", "25% higher average booking value", "Enhanced brand recognition"],
      logo: ""
    },
    {
      id: "adventure-gear",
      partner: "Summit Gear",
      type: "Equipment Partner",
      quote: "The partnership program provided us with valuable market insights and helped us connect with passionate outdoor enthusiasts worldwide.",
      author: "Marcus Rodriguez",
      title: "CEO",
      results: ["300% increase in online sales", "Expanded to 15 new markets", "Improved brand awareness"],
      logo: ""
    },
    {
      id: "destination-marketing",
      partner: "Alpine Tourism Board",
      type: "Destination Partner",
      quote: "Through our collaboration, we've seen a 60% increase in international visitors and significantly improved our destination's global reputation.",
      author: "Elena Kowalski",
      title: "Director of Tourism",
      results: ["60% increase in international visitors", "45% boost in tourism revenue", "Enhanced global reputation"],
      logo: "️"
    }
  ]

  const getPartnerTypeIcon = (type: string) => {
    switch (type) {
      case 'airline': return "️"
      case 'hospitality': return ""
      case 'vendor': return ""
      case 'destination': return "️"
      case 'sponsor': return ""
      default: return ""
    }
  }

  const getPartnershipLevelColor = (level: string) => {
    switch (level) {
      case 'platinum': return 'bg-gradient-to-r from-gray-300 to-gray-400 text-neutral-900'
      case 'gold': return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-primary-foreground'
      case 'silver': return 'bg-gradient-to-r from-gray-200 to-gray-300 text-neutral-700'
      case 'bronze': return 'bg-gradient-to-r from-amber-600 to-amber-700 text-primary-foreground'
      default: return 'bg-muted'
    }
  }

  const filteredPartners = partners.filter(partner => {
    if (activeTab === "all") return true
    return partner.type === activeTab
  })

  const partnerTypes = [
    { id: "all", label: "All Partners", count: partners.length },
    { id: "airline", label: "Airlines", count: partners.filter(p => p.type === "airline").length },
    { id: "hospitality", label: "Hospitality", count: partners.filter(p => p.type === "hospitality").length },
    { id: "vendor", label: "Vendors", count: partners.filter(p => p.type === "vendor").length },
    { id: "destination", label: "Destinations", count: partners.filter(p => p.type === "destination").length },
    { id: "sponsor", label: "Sponsors", count: partners.filter(p => p.type === "sponsor").length }
  ]

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
              <Handshake className="h-10 w-10 text-accent-primary"/>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Partnership Network
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Building extraordinary travel experiences through strategic partnerships.
              Discover our valued sponsors, trusted vendors, and collaborative opportunities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                <Building2 className="h-5 w-5 mr-2"/>
                Become a Partner
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Trophy className="h-5 w-5 mr-2"/>
                Explore Sponsorship
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Types Navigation */}
      <section className="py-8 px-4 bg-muted/30 border-b">
        <div className="container mx-auto max-w-6xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
              {partnerTypes.map((type) => (
                <TabsTrigger key={type.id} value={type.id} className="text-xs lg:text-sm">
                  {type.label}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {type.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              {/* Partner Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPartners.map((partner) => (
                  <Card key={partner.id} className={`overflow-hidden hover:shadow-xl transition-shadow ${partner.featured ? 'ring-2 ring-accent-primary/20' : ''}`}>
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl">{partner.logo}</div>
                          <div>
                            <CardTitle className="text-lg">{partner.name}</CardTitle>
                            <CardDescription className="capitalize">{partner.type}</CardDescription>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          {partner.featured && (
                            <Badge variant="secondary" className="bg-semantic-warning/10 text-yellow-800">
                              <Star className="h-3 w-3 mr-1"/>
                              Featured
                            </Badge>
                          )}
                          <Badge className={getPartnershipLevelColor(partner.partnershipLevel)}>
                            {partner.partnershipLevel}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm">{partner.description}</p>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Partner since {partner.since}</span>
                          {partner.location && (
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1"/>
                              {partner.location}
                            </div>
                          )}
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">Partner Benefits:</h4>
                          <ul className="text-xs text-muted-foreground space-y-1">
                            {partner.benefits.slice(0, 3).map((benefit, index) => (
                              <li key={index} className="flex items-center">
                                <CheckCircle className="h-3 w-3 mr-2 text-semantic-success flex-shrink-0"/>
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex gap-2 pt-2">
                          {partner.website && (
                            <Button variant="outline" size="sm" asChild className="flex-1">
                              <a href={partner.website} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-3 w-3 mr-1"/>
                                Visit Site
                              </a>
                            </Button>
                          )}
                          <Button size="sm" className="flex-1">
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Sponsorship Opportunities */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Sponsorship Opportunities</h2>
            <p className="text-xl text-muted-foreground">
              Become a valued sponsor and gain visibility across our platform and premium audience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {sponsorshipTiers.map((tier) => (
              <Card key={tier.id} className={`relative hover:shadow-xl transition-shadow ${tier.popular ? 'ring-2 ring-accent-primary' : ''}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-accent-primary text-primary-foreground px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    tier.level === 'platinum' ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
                    tier.level === 'gold' ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                    tier.level === 'silver' ? 'bg-gradient-to-r from-gray-200 to-gray-300' :
                    'bg-gradient-to-r from-amber-600 to-amber-700'
                  }`}>
                    <Award className={`h-8 w-8 ${
                      tier.level === 'platinum' ? 'text-neutral-700' : 'text-primary-foreground'
                    }`}/>
                  </div>
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <div className="text-2xl font-bold text-accent-primary">{tier.price}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {tier.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <CheckCircle className="h-4 w-4 mr-2 text-semantic-success mt-0.5 flex-shrink-0"/>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant={tier.popular ? "default" : "outline"}>
                    Learn More
                    <ArrowRight className="h-4 w-4 ml-2"/>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" asChild>
              <Link href="/sponsors/inquire">
                <Trophy className="h-5 w-5 mr-2"/>
                Start Sponsorship Inquiry
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Partnership Success Stories</h2>
            <p className="text-xl text-muted-foreground">
              Real results from our valued partners
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story) => (
              <Card key={story.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-3xl">{story.logo}</div>
                    <div>
                      <CardTitle className="text-lg">{story.partner}</CardTitle>
                      <CardDescription>{story.type}</CardDescription>
                    </div>
                  </div>
                  <blockquote className="text-muted-foreground italic">
                    "{story.quote}"
                  </blockquote>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <p className="font-medium">{story.author}</p>
                    <p className="text-sm text-muted-foreground">{story.title}</p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Key Results:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {story.results.map((result, index) => (
                        <li key={index} className="flex items-center">
                          <TrendingUp className="h-3 w-3 mr-2 text-semantic-success"/>
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Why Partner With Us?</h2>
            <p className="text-xl text-muted-foreground">
              Join our network of industry leaders and unlock new opportunities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="text-4xl mb-4"></div>
                <h3 className="text-xl font-semibold mb-3">Global Reach</h3>
                <p className="text-muted-foreground">
                  Access to millions of discerning travelers across 150+ countries through our premium platform
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="text-4xl mb-4"></div>
                <h3 className="text-xl font-semibold mb-3">Premium Audience</h3>
                <p className="text-muted-foreground">
                  Connect with high-value travelers who prioritize quality experiences and luxury service
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="text-4xl mb-4"></div>
                <h3 className="text-xl font-semibold mb-3">Targeted Marketing</h3>
                <p className="text-muted-foreground">
                  Precise audience targeting with detailed demographics, preferences, and travel patterns
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="text-4xl mb-4"></div>
                <h3 className="text-xl font-semibold mb-3">Performance Analytics</h3>
                <p className="text-muted-foreground">
                  Comprehensive reporting and analytics to measure ROI and optimize your partnership
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="text-4xl mb-4"></div>
                <h3 className="text-xl font-semibold mb-3">Dedicated Support</h3>
                <p className="text-muted-foreground">
                  Dedicated partnership managers and 24/7 support to ensure your success
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="text-4xl mb-4"></div>
                <h3 className="text-xl font-semibold mb-3">Innovation Access</h3>
                <p className="text-muted-foreground">
                  Early access to new features, beta programs, and exclusive partnership opportunities
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-accent-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <Handshake className="h-16 w-16 mx-auto mb-6 text-accent-primary"/>
          <h2 className="text-4xl font-display font-bold mb-4">Ready to Become a Partner?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join our growing network of industry leaders and unlock new opportunities for growth.
            Whether you're looking to sponsor events, provide services, or collaborate on experiences,
            we have the right partnership for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/partners/become-partner">
                <Building2 className="h-5 w-5 mr-2"/>
                Start Partnership Application
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact/partnerships">
                <Users className="h-5 w-5 mr-2"/>
                Schedule a Call
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 G H X S T S H I P Industries LLC. ATLVS + GVTEWAY Partnership Network.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
