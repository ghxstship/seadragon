
'use client'

import { useState, useEffect, use } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { logger } from "@/lib/logger"
import { MapPin, Calendar, Users, Cloud, DollarSign, Phone, Clock, Star, Camera, Utensils, Car, Shield, Globe, Mountain, Waves, TreePine } from "lucide-react"

interface DestinationInfo {
  name: string
  description: string
  overview: string
  history: string
  culture: string
  geography: {
    location: string
    area: string
    climate: string
    terrain: string
  }
  demographics: {
    population: string
    language: string
    currency: string
    timezone: string
  }
  economy: {
    mainIndustries: string[]
    tourism: string
  }
  attractions: Array<{
    name: string
    description: string
    category: string
    highlights: string[]
  }>
  cuisine: {
    specialties: string[]
    diningTips: string[]
  }
  transportation: {
    options: string[]
    tips: string[]
  }
  bestTimeToVisit: {
    months: string
    reason: string
  }
  safety: {
    level: string
    tips: string[]
  }
  emergencyContacts: Array<{
    service: string
    number: string
  }>
}

export default function About({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const destinationName = slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())
  const [destinationInfo, setDestinationInfo] = useState<DestinationInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadAboutData = async () => {
      try {
        const res = await fetch(`/api/v1/destinations/${slug}/about`)
        if (res.ok) {
          const data = await res.json()
          if (!cancelled && data.about) {
            setDestinationInfo(data.about)
          }
        }
      } catch (error) {
        logger.error('Error loading about data:', error)
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadAboutData()

    return () => { cancelled = true }
  }, [slug])

  // Default data if API returns nothing
  const info: DestinationInfo = destinationInfo || {
    name: destinationName,
    description: `${destinationName} is a captivating destination known for its stunning natural beauty, rich cultural heritage, and warm hospitality.`,
    overview: `${destinationName} combines breathtaking landscapes with a vibrant cultural scene.`,
    history: `${destinationName} has a rich history dating back centuries.`,
    culture: `The culture of ${destinationName} is a beautiful blend of traditional customs and contemporary influences.`,
    geography: {
      location: `Located in a scenic region, ${destinationName} is easily accessible.`,
      area: "Information not available",
      climate: "Temperate climate",
      terrain: "Diverse landscape"
    },
    demographics: {
      population: "Information not available",
      language: "English",
      currency: "USD",
      timezone: "Local timezone"
    },
    economy: {
      mainIndustries: ["Tourism"],
      tourism: "Tourism is a major economic driver"
    },
    attractions: [],
    cuisine: {
      specialties: ["Local specialties"],
      diningTips: ["Try local restaurants"]
    },
    transportation: {
      options: ["Various transportation options available"],
      tips: ["Plan your travel in advance"]
    },
    bestTimeToVisit: {
      months: "Year-round",
      reason: "Each season offers unique experiences"
    },
    safety: {
      level: "Generally safe for tourists",
      tips: ["Exercise normal precautions"]
    },
    emergencyContacts: [
      { service: "Emergency Services", number: "911" }
    ]
  }

  const quickFacts = [
    { icon: Mountain, label: "Terrain", value: info.geography.terrain.split(' ')[0] || "Diverse" },
    { icon: Cloud, label: "Climate", value: info.geography.climate.split(' ')[0] || "Temperate" },
    { icon: Users, label: "Population", value: info.demographics.population.split(' ')[0] || "N/A" },
    { icon: Clock, label: "Timezone", value: info.demographics.timezone.split(' ')[0] || "Local" },
    { icon: DollarSign, label: "Currency", value: info.demographics.currency.split(' ')[0] || "USD" },
    { icon: Globe, label: "Language", value: info.demographics.language.split(' ')[0] || "English" }
  ]

  const faqs = [
    {
      question: "What's the best time to visit?",
      answer: info.bestTimeToVisit.reason
    },
    {
      question: "How do I get around the area?",
      answer: info.transportation.options.join(". ") + " " + info.transportation.tips.join(" ")
    },
    {
      question: "Is it safe for tourists?",
      answer: info.safety.level + ". " + info.safety.tips.slice(0, 2).join(" ")
    },
    {
      question: "What should I know about local customs?",
      answer: "Locals are known for their hospitality and friendliness. Respect for local traditions and sustainable tourism practices is highly valued."
    },
    {
      question: "Are there any special events or festivals?",
      answer: "The area hosts numerous festivals throughout the year. Check the local tourism website for current schedules."
    }
  ]

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
            <Link href="/destinations" className="hover:text-foreground">Destinations</Link>
            <span>/</span>
            <Link href={`/destinations/${slug}`} className="hover:text-foreground">{destinationName}</Link>
            <span>/</span>
            <span className="text-foreground font-medium">About</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-accent-secondary/10 via-accent-primary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              About {destinationName}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {info.description}
            </p>

            {/* Quick Facts */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
              {quickFacts.map((fact, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-4 pb-3">
                    <fact.icon className="h-6 w-6 mx-auto mb-2 text-accent-primary"/>
                    <div className="text-sm font-medium">{fact.label}</div>
                    <div className="text-xs text-muted-foreground">{fact.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="attractions">Attractions</TabsTrigger>
              <TabsTrigger value="practical">Practical Info</TabsTrigger>
              <TabsTrigger value="culture">Culture</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Destination Overview</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <p className="text-lg leading-relaxed">{info.overview}</p>
                </CardContent>
              </Card>

              {/* Geography */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <Mountain className="h-6 w-6 mr-2"/>
                    Geography & Climate
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Location & Area</h4>
                      <p className="text-muted-foreground">{info.geography.location}</p>
                      <p className="text-muted-foreground mt-2"><strong>Area:</strong> {info.geography.area}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Climate & Terrain</h4>
                      <p className="text-muted-foreground">{info.geography.climate}</p>
                      <p className="text-muted-foreground mt-2"><strong>Terrain:</strong> {info.geography.terrain}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Demographics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <Users className="h-6 w-6 mr-2"/>
                    Demographics & Economy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Population</h4>
                      <p className="text-muted-foreground">{info.demographics.population}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Language</h4>
                      <p className="text-muted-foreground">{info.demographics.language}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Currency</h4>
                      <p className="text-muted-foreground">{info.demographics.currency}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Timezone</h4>
                      <p className="text-muted-foreground">{info.demographics.timezone}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attractions" className="space-y-8">
              <div>
                <h2 className="text-3xl font-display font-bold mb-8">Top Attractions</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  {info.attractions.map((attraction, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="aspect-video bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 relative">
                        <div className="absolute top-3 left-3">
                          <Badge variant="secondary">{attraction.category}</Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-semibold mb-3">{attraction.name}</h3>
                        <p className="text-muted-foreground mb-4">{attraction.description}</p>
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm">Highlights:</h4>
                          <ul className="text-sm space-y-1">
                            {attraction.highlights.map((highlight, idx) => (
                              <li key={idx} className="flex items-center text-muted-foreground">
                                <Star className="h-3 w-3 mr-2 text-accent-primary"/>
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="practical" className="space-y-8">
              {/* Best Time to Visit */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <Calendar className="h-6 w-6 mr-2"/>
                    Best Time to Visit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Recommended Months</h4>
                      <p className="text-muted-foreground">{info.bestTimeToVisit.months}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Why Visit Then</h4>
                      <p className="text-muted-foreground">{info.bestTimeToVisit.reason}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transportation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <Car className="h-6 w-6 mr-2"/>
                    Transportation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Available Options</h4>
                      <ul className="space-y-2">
                        {info.transportation.options.map((option, index) => (
                          <li key={index} className="flex items-center text-muted-foreground">
                            <div className="w-2 h-2 bg-accent-primary rounded-full mr-3 flex-shrink-0"></div>
                            {option}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Travel Tips</h4>
                      <ul className="space-y-2">
                        {info.transportation.tips.map((tip, index) => (
                          <li key={index} className="flex items-center text-muted-foreground">
                            <div className="w-2 h-2 bg-accent-secondary rounded-full mr-3 flex-shrink-0"></div>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Cuisine */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <Utensils className="h-6 w-6 mr-2"/>
                    Local Cuisine
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Specialties to Try</h4>
                      <ul className="space-y-2">
                        {info.cuisine.specialties.map((specialty, index) => (
                          <li key={index} className="flex items-center text-muted-foreground">
                            <div className="w-2 h-2 bg-accent-tertiary rounded-full mr-3 flex-shrink-0"></div>
                            {specialty}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Dining Tips</h4>
                      <ul className="space-y-2">
                        {info.cuisine.diningTips.map((tip, index) => (
                          <li key={index} className="flex items-center text-muted-foreground">
                            <div className="w-2 h-2 bg-accent-primary rounded-full mr-3 flex-shrink-0"></div>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Safety & Emergency */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <Shield className="h-6 w-6 mr-2"/>
                    Safety & Emergency Contacts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Safety Level</h4>
                      <p className="text-muted-foreground mb-4">{info.safety.level}</p>
                      <h4 className="font-semibold mb-3">Safety Tips</h4>
                      <ul className="space-y-2">
                        {info.safety.tips.map((tip, index) => (
                          <li key={index} className="flex items-center text-muted-foreground">
                            <div className="w-2 h-2 bg-accent-secondary rounded-full mr-3 flex-shrink-0"></div>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Emergency Contacts</h4>
                      <div className="space-y-3">
                        {info.emergencyContacts.map((contact, index) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <span className="font-medium">{contact.service}</span>
                            <span className="font-mono text-sm">{contact.number}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="culture" className="space-y-8">
              {/* History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">History</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <p className="text-lg leading-relaxed">{info.history}</p>
                </CardContent>
              </Card>

              {/* Culture */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <Globe className="h-6 w-6 mr-2"/>
                    Culture & Heritage
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <p className="text-lg leading-relaxed">{info.culture}</p>
                </CardContent>
              </Card>

              {/* Economy */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <DollarSign className="h-6 w-6 mr-2"/>
                    Economy & Tourism
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Main Industries</h4>
                      <div className="flex flex-wrap gap-2">
                        {info.economy.mainIndustries.map((industry, index) => (
                          <Badge key={index} variant="secondary">{industry}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Tourism Impact</h4>
                      <p className="text-muted-foreground">{info.economy.tourism}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="faq" className="space-y-6">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-display font-bold mb-8 text-center">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 G H X S T S H I P Industries LLC. ATLVS + GVTEWAY Super App.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
