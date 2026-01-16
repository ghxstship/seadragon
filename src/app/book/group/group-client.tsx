'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { Users, Calendar, Phone, Mail, CheckCircle, Award, Gift, Star } from "lucide-react"

interface GroupPackage {
  id: string
  name: string
  sizeRange: string
  pricePerPerson: number
  currency: string
  inclusions: string[]
  popular: boolean
  description: string
}

interface GroupBenefit {
  icon: string
  title: string
  description: string
}

export function GroupClient() {
  const [groupInquiry, setGroupInquiry] = useState({
    organizationName: '',
    contactName: '',
    email: '',
    phone: '',
    groupSize: '',
    eventType: '',
    preferredDate: '',
    budget: '',
    specialRequests: '',
    venue: 'any'
  })

  const groupPackages: GroupPackage[] = [
    {
      id: "small-group",
      name: "Intimate Gathering (10-25 people)",
      sizeRange: "10-25",
      pricePerPerson: 125,
      currency: "USD",
      popular: false,
      description: "Perfect for small corporate meetings, team building sessions, or intimate celebrations",
      inclusions: [
        "Dedicated event coordinator",
        "Customizable agenda",
        "Audio-visual setup",
        "Refreshments and catering",
        "Group photo session",
        "Follow-up summary report"
      ]
    },
    {
      id: "medium-group",
      name: "Mid-Size Event (25-75 people)",
      sizeRange: "25-75",
      pricePerPerson: 95,
      currency: "USD",
      popular: true,
      description: "Ideal for corporate retreats, conferences, or larger celebrations",
      inclusions: [
        "Senior event coordinator",
        "Custom branding and theming",
        "Professional AV equipment",
        "Catering with dietary accommodations",
        "Team building activities",
        "Transportation coordination",
        "On-site support staff"
      ]
    },
    {
      id: "large-group",
      name: "Major Event (75-200 people)",
      sizeRange: "75-200",
      pricePerPerson: 75,
      currency: "USD",
      popular: false,
      description: "For large-scale corporate events, product launches, or major celebrations",
      inclusions: [
        "Executive event director",
        "Full production services",
        "State-of-the-art AV and lighting",
        "Premium catering",
        "Entertainment and speakers",
        "VIP guest services",
        "Complete event management"
      ]
    },
    {
      id: "enterprise-group",
      name: "Enterprise Solution (200+ people)",
      sizeRange: "200+",
      pricePerPerson: 65,
      currency: "USD",
      popular: false,
      description: "Comprehensive solutions for enterprise-level events and conferences",
      inclusions: [
        "Executive event management team",
        "Full-scale production",
        "Multi-venue coordination",
        "Premium hospitality services",
        "Security and logistics",
        "Custom applications",
        "Post-event analytics"
      ]
    }
  ]

  const groupBenefits: GroupBenefit[] = [
    {
      icon: "",
      title: "Dedicated Coordination",
      description: "Personal event coordinator assigned to your group for seamless planning"
    },
    {
      icon: "",
      title: "Volume Discounts",
      description: "Competitive pricing with group rates and volume discounts"
    },
    {
      icon: "",
      title: "Custom Experiences",
      description: "Tailored activities and experiences based on your group's interests"
    },
    {
      icon: "",
      title: "Premium Amenities",
      description: "Access to exclusive venues, premium catering, and VIP services"
    },
    {
      icon: "",
      title: "Event Analytics",
      description: "Post-event reports and analytics to measure success"
    },
    {
      icon: "",
      title: "Team Building Focus",
      description: "Activities designed to strengthen team dynamics and collaboration"
    }
  ]

  const faqs = [
    {
      question: "What's the minimum group size for booking?",
      answer: "We can accommodate groups as small as 10 people. For groups under 10, we recommend our VIP individual experiences."
    },
    {
      question: "How far in advance should we book?",
      answer: "We recommend booking 4-6 weeks in advance for optimal availability. However, we can often accommodate last-minute requests depending on the event type and group size."
    },
    {
      question: "Do you offer transportation for groups?",
      answer: "Yes, we provide transportation coordination for groups, including shuttle services, private buses, and luxury vehicles depending on your needs and location."
    },
    {
      question: "Can we customize the activities?",
      answer: "Absolutely! We work with you to customize every aspect of your event, from activities and catering to theming and entertainment."
    },
    {
      question: "What's included in the group pricing?",
      answer: "Group pricing includes event coordination, venue access, basic AV equipment, refreshments, and our standard event services. Premium add-ons are available."
    },
    {
      question: "Do you handle corporate team-building events?",
      answer: "Yes, we're specialists in corporate team-building events. We offer activities designed to improve collaboration, communication, and team morale."
    }
  ]

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Thank you for your group inquiry! Our team will contact you within 24 hours with a customized proposal.')
    setGroupInquiry({
      organizationName: '',
      contactName: '',
      email: '',
      phone: '',
      groupSize: '',
      eventType: '',
      preferredDate: '',
      budget: '',
      specialRequests: '',
      venue: 'any'
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header/>

      <nav className="bg-muted/50 px-4 py-3">
        <div className="container mx-auto">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/book" className="hover:text-foreground">Book</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Group</span>
          </div>
        </div>
      </nav>

      <section className="py-20 px-4 bg-gradient-to-br from-accent-secondary/10 via-accent-primary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Users className="h-16 w-16 text-accent-secondary mr-4"/>
              <div>
                <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
                  Group Booking
                </h1>
                <Badge variant="secondary" className="text-lg px-4 py-2 bg-accent-secondary/20 text-accent-secondary border-accent-secondary/30">
                  <Award className="h-4 w-4 mr-2"/>
                  Corporate & Team Events
                </Badge>
              </div>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Create unforgettable experiences for your group, team, or organization. From corporate retreats
              to team-building adventures, we specialize in crafting exceptional group events tailored to your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                <Users className="h-5 w-5 mr-2"/>
                Request Group Quote
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Phone className="h-5 w-5 mr-2"/>
                Call Group Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Why Choose Group Booking?</h2>
            <p className="text-xl text-muted-foreground">
              Specialized services designed for groups and organizations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {groupBenefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Group Packages</h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive packages designed for every group size and occasion
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {groupPackages.map((pkg) => (
              <Card key={pkg.id} className={`relative hover:shadow-xl transition-shadow ${pkg.popular ? 'border-accent-secondary' : ''}`}>
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-accent-secondary text-primary-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                  <CardDescription className="text-lg">
                    {pkg.sizeRange} people • ${pkg.pricePerPerson} per person
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">{pkg.description}</p>

                  <div>
                    <h4 className="font-semibold mb-3">What&apos;s Included:</h4>
                    <ul className="space-y-2">
                      {pkg.inclusions.map((inclusion, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 mr-2 text-success flex-shrink-0"/>
                          {inclusion}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Starting from</div>
                        {(() => {
                          const firstSegment = pkg.sizeRange.split('-')[0] || pkg.sizeRange.replace(/\D/g, '')
                          const parsed = parseInt(firstSegment || '0', 10)
                          const minimumCount = Number.isFinite(parsed) && parsed > 0 ? parsed : 0
                          const startingTotal = minimumCount ? pkg.pricePerPerson * minimumCount : pkg.pricePerPerson
                          return (
                            <>
                              <div className="text-3xl font-bold text-accent-secondary">
                                ${startingTotal}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {minimumCount ? `for ${minimumCount} people` : 'Per person pricing'}
                              </div>
                            </>
                          )
                        })()}
                      </div>
                      <Button size="lg">
                        Get Quote
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Request a Group Quote</h2>
            <p className="text-xl text-muted-foreground">
              Tell us about your group and event vision. We&apos;ll create a customized proposal.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Group Event Inquiry</CardTitle>
              <CardDescription>
                Fill out this form and our group sales team will contact you within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInquirySubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">Organization Name *</Label>
                    <Input
                      id="organizationName"
                      value={groupInquiry.organizationName}
                      onChange={(e) => setGroupInquiry(prev => ({ ...prev, organizationName: e.target.value }))}
                      placeholder="Your company or organization"
                      required/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name *</Label>
                    <Input
                      id="contactName"
                      value={groupInquiry.contactName}
                      onChange={(e) => setGroupInquiry(prev => ({ ...prev, contactName: e.target.value }))}
                      placeholder="Primary contact person"
                      required/>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={groupInquiry.email}
                      onChange={(e) => setGroupInquiry(prev => ({ ...prev, email: e.target.value }))}
                      required/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={groupInquiry.phone}
                      onChange={(e) => setGroupInquiry(prev => ({ ...prev, phone: e.target.value }))}
                      required/>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="groupSize">Group Size *</Label>
                    <Select value={groupInquiry.groupSize} onValueChange={(value) => setGroupInquiry(prev => ({ ...prev, groupSize: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select group size"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10-25">10-25 people</SelectItem>
                        <SelectItem value="25-50">25-50 people</SelectItem>
                        <SelectItem value="50-100">50-100 people</SelectItem>
                        <SelectItem value="100-200">100-200 people</SelectItem>
                        <SelectItem value="200+">200+ people</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventType">Event Type *</Label>
                    <Select value={groupInquiry.eventType} onValueChange={(value) => setGroupInquiry(prev => ({ ...prev, eventType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="corporate">Corporate Event</SelectItem>
                        <SelectItem value="team-building">Team Building</SelectItem>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="retreat">Company Retreat</SelectItem>
                        <SelectItem value="celebration">Celebration</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="preferredDate">Preferred Date</Label>
                    <Input
                      id="preferredDate"
                      type="date"
                      value={groupInquiry.preferredDate}
                      onChange={(e) => setGroupInquiry(prev => ({ ...prev, preferredDate: e.target.value }))}/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Range</Label>
                    <Select value={groupInquiry.budget} onValueChange={(value) => setGroupInquiry(prev => ({ ...prev, budget: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5000-15000">$5K - $15K</SelectItem>
                        <SelectItem value="15000-50000">$15K - $50K</SelectItem>
                        <SelectItem value="50000-100000">$50K - $100K</SelectItem>
                        <SelectItem value="100000+">$100K+</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue">Preferred Venue</Label>
                  <Select value={groupInquiry.venue} onValueChange={(value) => setGroupInquiry(prev => ({ ...prev, venue: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select venue preference"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any venue</SelectItem>
                      <SelectItem value="urban">Urban/City venue</SelectItem>
                      <SelectItem value="outdoor">Outdoor venue</SelectItem>
                      <SelectItem value="resort">Resort/Hotel</SelectItem>
                      <SelectItem value="corporate">Corporate facility</SelectItem>
                      <SelectItem value="custom">Custom location</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequests">Special Requests or Requirements</Label>
                  <Textarea
                    id="specialRequests"
                    value={groupInquiry.specialRequests}
                    onChange={(e) => setGroupInquiry(prev => ({ ...prev, specialRequests: e.target.value }))}
                    placeholder="Tell us about any special requirements, themes, activities, or other details..."
                    rows={4}/>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Submit Group Inquiry
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">What Groups Say</h2>
            <p className="text-xl text-muted-foreground">
              Success stories from organizations that chose us for their group events
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent-primary text-accent-primary"/>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  Our corporate retreat was flawless. The team handled every detail from transportation
                  to activities. Our employees still talk about how amazing the experience was. Highly
                  recommend for any company looking to boost team morale.
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-accent-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-accent-primary">TC</span>
                  </div>
                  <div>
                    <div className="font-semibold">TechCorp Inc.</div>
                    <div className="text-sm text-muted-foreground">150-person retreat</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent-primary text-accent-primary"/>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  We booked a team-building event for our 75-person sales team. The activities were
                  engaging, the food was excellent, and the coordination was professional throughout.
                  Our team&apos;s productivity and collaboration improved significantly after the event.
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-accent-secondary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-accent-secondary">GS</span>
                  </div>
                  <div>
                    <div className="font-semibold">Global Solutions</div>
                    <div className="text-sm text-muted-foreground">75-person team building</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent-primary text-accent-primary"/>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  Our product launch event for 200+ people was spectacular. From the venue selection
                  to the entertainment and catering, everything exceeded our expectations. The event
                  was a huge success and generated tremendous buzz for our product.
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-accent-tertiary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-accent-tertiary">IL</span>
                  </div>
                  <div>
                    <div className="font-semibold">Innovate Labs</div>
                    <div className="text-sm text-muted-foreground">200-person product launch</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Group Booking FAQ</h2>
            <p className="text-xl text-muted-foreground">
              Answers to common questions about group bookings
            </p>
          </div>

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
      </section>

      <section className="py-20 px-4 bg-accent-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <Users className="h-16 w-16 mx-auto mb-6 text-accent-primary"/>
          <h2 className="text-4xl font-display font-bold mb-4">Ready to Plan Your Group Event?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Our dedicated group sales team is here to make your event unforgettable.
            Contact us today to discuss your vision and get started.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center">
              <Phone className="h-8 w-8 mb-3 text-accent-primary"/>
              <h3 className="font-semibold mb-1">Group Sales Line</h3>
              <p className="text-sm text-muted-foreground">1-800-GROUP-EVENT</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 mb-3 text-accent-primary"/>
              <h3 className="font-semibold mb-1">Email Us</h3>
              <p className="text-sm text-muted-foreground">groups@atlvs.com</p>
            </div>
            <div className="flex flex-col items-center">
              <Calendar className="h-8 w-8 mb-3 text-accent-primary"/>
              <h3 className="font-semibold mb-1">Response Time</h3>
              <p className="text-sm text-muted-foreground">Within 24 hours</p>
            </div>
          </div>
          <Button size="lg" className="text-lg px-8 py-6">
            <Gift className="h-5 w-5 mr-2"/>
            Start Planning Today
          </Button>
        </div>
      </section>

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
