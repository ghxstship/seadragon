
'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation, NavigationItem } from "@/components/ui/navigation"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const conservationInitiatives = [
  {
    title: "Carbon Neutral Operations",
    description: "Achieved 100% carbon neutrality across all platform operations and data centers.",
    impact: "Eliminated 50,000+ tons of CO2 emissions annually",
    status: "Completed"
  },
  {
    title: "Sustainable Event Certification",
    description: "Developed certification program for events meeting environmental standards.",
    impact: "200+ certified sustainable events",
    status: "Active"
  },
  {
    title: "Waste Reduction Technology",
    description: "AI-powered waste management systems for events and venues.",
    impact: "Reduced event waste by 40% on average",
    status: "Active"
  },
  {
    title: "Renewable Energy Partnerships",
    description: "Partnerships with renewable energy providers for venue operations.",
    impact: "Powered 500+ venues with renewable energy",
    status: "Active"
  },
  {
    title: "Water Conservation Program",
    description: "Smart water management systems for outdoor events and venues.",
    impact: "Saved 2M+ gallons of water annually",
    status: "Active"
  },
  {
    title: "Biodiversity Protection",
    description: "Environmental impact assessments and habitat protection programs.",
    impact: "Protected 100+ acres of natural habitats",
    status: "Active"
  }
]

const environmentalMetrics = [
  { label: "Carbon Offset", value: "50K tons", description: "CO2 emissions offset annually" },
  { label: "Energy Saved", value: "200M kWh", description: "Equivalent to powering 18K homes" },
  { label: "Waste Diverted", value: "500K lbs", description: "Kept out of landfills monthly" },
  { label: "Water Conserved", value: "2M gallons", description: "Saved annually through efficiency" }
]

const conservationPartners = [
  {
    name: "Greenpeace",
    type: "Environmental NGO",
    partnership: "Joint climate action initiatives and environmental education programs"
  },
  {
    name: "World Wildlife Fund",
    type: "Conservation Organization",
    partnership: "Biodiversity protection and habitat conservation projects"
  },
  {
    name: "CarbonFund.org",
    type: "Carbon Offset Provider",
    partnership: "High-quality carbon offset programs and verification"
  },
  {
    name: "RE100",
    type: "Renewable Energy Coalition",
    partnership: "100% renewable energy commitment for operations"
  }
]

export default function Conservation() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-display font-bold">ATLVS + GVTEWAY</h1>
          </div>
          <Navigation>
            <NavigationItem href="/">Home</NavigationItem>
            <NavigationItem href="/about" active>About</NavigationItem>
            <NavigationItem href="/destinations">Destinations</NavigationItem>
            <NavigationItem href="/experiences">Experiences</NavigationItem>
            <NavigationItem href="/events">Events</NavigationItem>
          </Navigation>
          <div className="flex items-center space-x-2">
            <Button variant="ghost">Sign In</Button>
            <Button>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <nav className="bg-muted/50 px-4 py-3">
        <div className="container mx-auto">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/about" className="hover:text-foreground">About</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Conservation</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Environmental Conservation
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            We&apos;re committed to protecting our planet while creating unforgettable live entertainment experiences.
            Sustainability is at the core of everything we do.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Badge variant="secondary" className="px-4 py-2 text-sm">Carbon Neutral</Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">Sustainable Events</Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">Conservation Partner</Badge>
            <Badge variant="secondary" className="px-4 py-2 text-sm">Green Technology</Badge>
          </div>
        </div>
      </section>

      {/* Environmental Impact Metrics */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Our Environmental Impact</h2>
            <p className="text-xl text-muted-foreground">
              Measurable results from our conservation initiatives and sustainable practices
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {environmentalMetrics.map((metric, index) => (
              <Card key={index} className="text-center">
                <CardHeader className="pb-3">
                  <CardTitle className="text-2xl font-display text-accent-primary">
                    {metric.value}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-2">{metric.label}</h3>
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Conservation Initiatives */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Conservation Initiatives</h2>
            <p className="text-xl text-muted-foreground">
              Active programs and technologies working to reduce environmental impact
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {conservationInitiatives.map((initiative, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{initiative.title}</CardTitle>
                    <Badge variant={initiative.status === 'Completed' ? 'default' : 'secondary'}>
                      {initiative.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-base">
                    {initiative.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-accent-primary/10 rounded-lg p-4">
                    <p className="text-sm font-medium text-accent-primary">
                      Impact: {initiative.impact}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology for Sustainability */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold mb-6">Technology for Sustainability</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our AI-powered platform enables data-driven environmental decisions and automated
                sustainability management across the entire entertainment ecosystem.
              </p>
              <div className="space-y-4">
                <div className="border-l-4 border-accent-primary pl-4">
                  <h3 className="font-semibold mb-2">Smart Energy Management</h3>
                  <p className="text-muted-foreground">
                    AI algorithms optimize energy usage for lighting, sound, and venue operations,
                    reducing consumption by up to 30%.
                  </p>
                </div>
                <div className="border-l-4 border-accent-secondary pl-4">
                  <h3 className="font-semibold mb-2">Predictive Waste Analytics</h3>
                  <p className="text-muted-foreground">
                    Machine learning predicts waste generation and optimizes collection routes
                    and recycling programs.
                  </p>
                </div>
                <div className="border-l-4 border-accent-tertiary pl-4">
                  <h3 className="font-semibold mb-2">Carbon Tracking & Offsets</h3>
                  <p className="text-muted-foreground">
                    Real-time carbon footprint monitoring with automated offset purchasing
                    and verification systems.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Environmental Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Comprehensive environmental monitoring and reporting tools for events
                    and venues to track and improve their sustainability metrics.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li>• Real-time carbon tracking</li>
                    <li>• Waste diversion analytics</li>
                    <li>• Energy consumption monitoring</li>
                    <li>• Water usage optimization</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Sustainable Event Planning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    AI-assisted event planning that automatically incorporates sustainable
                    practices and minimizes environmental impact.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li>• Eco-friendly vendor matching</li>
                    <li>• Sustainable transportation options</li>
                    <li>• Waste reduction planning</li>
                    <li>• Carbon offset integration</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Partnerships */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Conservation Partnerships</h2>
            <p className="text-xl text-muted-foreground">
              Collaborating with leading environmental organizations to maximize our impact
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {conservationPartners.map((partner, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{partner.name}</CardTitle>
                  <CardDescription className="text-base font-medium">
                    {partner.type}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{partner.partnership}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Future Commitments */}
      <section className="py-20 px-4 bg-accent-primary/5">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl font-display font-bold mb-4">
            Future Commitments
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Our environmental responsibility extends beyond today. We&apos;re committed to continuous
            improvement and setting new standards for sustainability in entertainment.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <h3 className="font-semibold mb-2">2030 Goal</h3>
              <p className="text-sm text-muted-foreground">
                Achieve negative carbon emissions across all operations and partner events.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">2035 Goal</h3>
              <p className="text-sm text-muted-foreground">
                Enable 100% of events on our platform to achieve carbon neutrality.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">2040 Goal</h3>
              <p className="text-sm text-muted-foreground">
                Lead the industry in regenerative environmental practices.
              </p>
            </div>
          </div>
          <Button size="lg" className="text-lg px-8 py-6">
            Learn More About Our Impact
          </Button>
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
