
'use client'


import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { CheckCircle, Star, Crown, Phone, Mail, Calendar, Gift, Heart, Sparkles } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface PrivateEventType {
  id: string
  name: string
  description: string
  icon: string
  features: string[]
  startingPrice: number
}

interface PrivateEventFeature {
  icon: string
  title: string
  description: string
}

export default function Private() {
  const [privateInquiry, setPrivateInquiry] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    guestCount: '',
    eventDate: '',
    budget: '',
    venue: '',
    specialRequests: '',
    timeline: ''
  })

  const privateEventTypes: PrivateEventType[] = [
    {
      id: "wedding",
      name: "Wedding & Reception",
      description: "Your dream wedding day, perfectly orchestrated from ceremony to reception",
      icon: "",
      features: [
        "Full ceremony coordination",
        "Reception planning and execution",
        "Vendor management",
        "Custom floral and decor",
        "Photography and videography",
        "Wedding cake and catering"
      ],
      startingPrice: 25000
    },
    {
      id: "corporate-gala",
      name: "Corporate Gala",
      description: "Elegant corporate events, galas, and award ceremonies",
      icon: "",
      features: [
        "Event theme development",
        "Guest list management",
        "AV production and staging",
        "Catering and beverage service",
        "Entertainment and speakers",
        "VIP guest services"
      ],
      startingPrice: 15000
    },
    {
      id: "birthday-party",
      name: "Birthday Celebration",
      description: "Memorable birthday parties for all ages and styles",
      icon: "",
      features: [
        "Theme development",
        "Entertainment and activities",
        "Custom cake and desserts",
        "Invitations and decor",
        "Photo booth and memories",
        "Party favors and gifts"
      ],
      startingPrice: 3000
    },
    {
      id: "anniversary",
      name: "Anniversary Celebration",
      description: "Romantic anniversary celebrations and milestone events",
      icon: "️",
      features: [
        "Romantic venue selection",
        "Custom menu planning",
        "Entertainment and surprises",
        "Photography services",
        "Personalized touches",
        "Memory book creation"
      ],
      startingPrice: 5000
    },
    {
      id: "private-dinner",
      name: "Private Dinner Party",
      description: "Intimate dinner parties and exclusive dining experiences",
      icon: "️",
      features: [
        "Chef-curated menu",
        "Wine pairing selection",
        "Private dining room",
        "Personalized service",
        "Entertainment options",
        "Take-home recipes"
      ],
      startingPrice: 2000
    },
    {
      id: "custom-event",
      name: "Custom Event",
      description: "Bespoke events tailored to your unique vision and requirements",
      icon: "",
      features: [
        "Unlimited customization",
        "Creative concept development",
        "Full production services",
        "Vendor coordination",
        "Technical production",
        "Post-event support"
      ],
      startingPrice: 10000
    }
  ]

  const privateEventFeatures: PrivateEventFeature[] = [
    {
      icon: "",
      title: "Complete Customization",
      description: "Every detail tailored to your vision, from theme to execution"
    },
    {
      icon: "",
      title: "Dedicated Event Director",
      description: "Personal event director assigned to ensure flawless execution"
    },
    {
      icon: "️",
      title: "Venue Sourcing",
      description: "Access to exclusive venues and locations worldwide"
    },
    {
      icon: "",
      title: "Entertainment & Production",
      description: "Professional entertainment, lighting, sound, and production services"
    },
    {
      icon: "️",
      title: "Catering Excellence",
      description: "Award-winning chefs and bespoke menu creation"
    },
    {
      icon: "",
      title: "Photography & Videography",
      description: "Professional photo and video documentation of your event"
    }
  ]

  const testimonials = [
    {
      name: "Sarah & Michael Chen",
      event: "Wedding Reception",
      quote: "Our wedding was absolutely magical. Every detail was perfect, from the floral arrangements to the lighting. Our guests are still talking about how amazing everything was. The team made our dream day a reality.",
      rating: 5
    },
    {
      name: "David Rodriguez",
      event: "50th Birthday Celebration",
      quote: "I wanted something special for my milestone birthday, and they delivered beyond my expectations. The surprise elements, the entertainment, and the attention to detail made it unforgettable.",
      rating: 5
    },
    {
      name: "Emma Thompson",
      event: "Corporate Product Launch",
      quote: "Our product launch event was a huge success. The team's creativity and execution helped us create buzz and excitement around our new product. Highly recommend for any corporate event.",
      rating: 5
    }
  ]

  const faqs = [
    {
      question: "How far in advance should I book a private event?",
      answer: "We recommend booking at least 6-12 months in advance for weddings and major events, and 3-6 months for smaller celebrations. However, we can often accommodate shorter timelines depending on availability and event complexity."
    },
    {
      question: "Do you handle destination weddings?",
      answer: "Yes, we specialize in destination weddings and events worldwide. Our team can handle all logistics including travel coordination, vendor sourcing, and on-site management."
    },
    {
      question: "What's included in your event planning services?",
      answer: "Our comprehensive planning includes venue selection, vendor coordination, timeline creation, day-of coordination, and post-event follow-up. We can customize packages based on your specific needs."
    },
    {
      question: "Can you work with my existing vendors?",
      answer: "Absolutely! We're happy to work with your preferred vendors or recommend trusted professionals. We'll coordinate everything to ensure seamless execution."
    },
    {
      question: "Do you offer payment plans?",
      answer: "Yes, we offer flexible payment plans for larger events. We'll discuss payment terms during our initial consultation and can work with you to create a plan that fits your budget."
    },
    {
      question: "What's your cancellation policy?",
      answer: "Our cancellation policy varies by event type and timing. We'll provide full details in your contract. Generally, we offer more flexibility the further out you book, with deposits being non-refundable closer to the event date."
    }
  ]

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit to API
    alert('Thank you for your private event inquiry! Our event director will contact you within 24 hours to discuss your vision and create a customized proposal.')
    setPrivateInquiry({
      name: '',
      email: '',
      phone: '',
      eventType: '',
      guestCount: '',
      eventDate: '',
      budget: '',
      venue: '',
      specialRequests: '',
      timeline: ''
    })
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
            <Link href="/book" className="hover:text-foreground">Book</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Private</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-accent-tertiary/10 via-accent-secondary/5 to-accent-primary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Heart className="h-16 w-16 text-accent-tertiary mr-4"/>
              <div>
                <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
                  Private Events
                </h1>
                <Badge variant="secondary" className="text-lg px-4 py-2 bg-accent-tertiary/20 text-accent-tertiary border-accent-tertiary/30">
                  <Sparkles className="h-4 w-4 mr-2"/>
                  Bespoke Experiences
                </Badge>
              </div>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Create unforgettable private events tailored to your unique vision. From intimate celebrations
              to grand galas, our expert team brings your dreams to life with flawless execution and
              unparalleled attention to detail.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                <Heart className="h-5 w-5 mr-2"/>
                Start Your Private Event
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Phone className="h-5 w-5 mr-2"/>
                Speak with Event Director
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Event Types */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Private Event Types</h2>
            <p className="text-xl text-muted-foreground">
              We specialize in creating extraordinary experiences for every occasion
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {privateEventTypes.map((eventType) => (
              <Card key={eventType.id} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="text-center mb-4">
                    <div className="text-6xl mb-4">{eventType.icon}</div>
                    <CardTitle className="text-xl">{eventType.name}</CardTitle>
                  </div>
                  <CardDescription className="text-center">
                    {eventType.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">What&apos;s Included:</h4>
                    <ul className="text-sm space-y-1">
                      {eventType.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-3 w-3 mr-2 text-success flex-shrink-0"/>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground">Starting from</div>
                        <div className="text-2xl font-bold text-accent-tertiary">
                          ${eventType.startingPrice.toLocaleString()}
                        </div>
                      </div>
                      <Button size="sm">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Why Choose Our Private Event Services?</h2>
            <p className="text-xl text-muted-foreground">
              Experience the difference of working with event planning experts
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {privateEventFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Private Event Inquiry */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Plan Your Private Event</h2>
            <p className="text-xl text-muted-foreground">
              Share your vision with us and we&apos;ll create a bespoke event proposal tailored to your needs.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Private Event Inquiry</CardTitle>
              <CardDescription>
                Fill out this form and our event director will contact you within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleInquirySubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={privateInquiry.name}
                      onChange={(e) => setPrivateInquiry(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your full name"
                      required/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={privateInquiry.email}
                      onChange={(e) => setPrivateInquiry(prev => ({ ...prev, email: e.target.value }))}
                      required/>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={privateInquiry.phone}
                      onChange={(e) => setPrivateInquiry(prev => ({ ...prev, phone: e.target.value }))}
                      required/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventType">Event Type *</Label>
                    <Select value={privateInquiry.eventType} onValueChange={(value) => setPrivateInquiry(prev => ({ ...prev, eventType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select event type"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wedding">Wedding</SelectItem>
                        <SelectItem value="corporate">Corporate Event</SelectItem>
                        <SelectItem value="birthday">Birthday</SelectItem>
                        <SelectItem value="anniversary">Anniversary</SelectItem>
                        <SelectItem value="dinner">Private Dinner</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="guestCount">Number of Guests *</Label>
                    <Input
                      id="guestCount"
                      type="number"
                      value={privateInquiry.guestCount}
                      onChange={(e) => setPrivateInquiry(prev => ({ ...prev, guestCount: e.target.value }))}
                      placeholder="e.g., 50"
                      required/>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventDate">Preferred Event Date</Label>
                    <Input
                      id="eventDate"
                      type="date"
                      value={privateInquiry.eventDate}
                      onChange={(e) => setPrivateInquiry(prev => ({ ...prev, eventDate: e.target.value }))}/>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Range</Label>
                    <Select value={privateInquiry.budget} onValueChange={(value) => setPrivateInquiry(prev => ({ ...prev, budget: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5000-15000">$5K - $15K</SelectItem>
                        <SelectItem value="15000-50000">$15K - $50K</SelectItem>
                        <SelectItem value="50000-100000">$50K - $100K</SelectItem>
                        <SelectItem value="100000-250000">$100K - $250K</SelectItem>
                        <SelectItem value="250000+">$250K+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeline">Planning Timeline</Label>
                    <Select value={privateInquiry.timeline} onValueChange={(value) => setPrivateInquiry(prev => ({ ...prev, timeline: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="How far out are you planning?"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-3">1-3 months</SelectItem>
                        <SelectItem value="3-6">3-6 months</SelectItem>
                        <SelectItem value="6-12">6-12 months</SelectItem>
                        <SelectItem value="12+">More than a year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue">Venue Preference</Label>
                  <Select value={privateInquiry.venue} onValueChange={(value) => setPrivateInquiry(prev => ({ ...prev, venue: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Do you have a preferred venue?"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home/Backyard</SelectItem>
                      <SelectItem value="venue">Specific Venue</SelectItem>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="hotel">Hotel/Ballroom</SelectItem>
                      <SelectItem value="outdoor">Outdoor Location</SelectItem>
                      <SelectItem value="flexible">Flexible/Open to Suggestions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialRequests">Tell Us About Your Vision *</Label>
                  <Textarea
                    id="specialRequests"
                    value={privateInquiry.specialRequests}
                    onChange={(e) => setPrivateInquiry(prev => ({ ...prev, specialRequests: e.target.value }))}
                    placeholder="Describe your dream event, theme, colors, entertainment preferences, dietary requirements, or any special requests..."
                    rows={6}
                    required/>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Submit Private Event Inquiry
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Client Experiences</h2>
            <p className="text-xl text-muted-foreground">
              Hear from clients who trusted us with their most important celebrations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-accent-primary text-accent-primary"/>
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="border-t pt-4">
                    <div className="font-semibold">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.event}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Private Event FAQ</h2>
            <p className="text-xl text-muted-foreground">
              Answers to common questions about private event planning
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger value={`item-${index}`} className="text-left">
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

      {/* Contact Section */}
      <section className="py-20 px-4 bg-accent-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <Crown className="h-16 w-16 mx-auto mb-6 text-accent-primary"/>
          <h2 className="text-4xl font-display font-bold mb-4">Ready to Create Your Dream Event?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Our dedicated private event team is here to bring your vision to life.
            Let&apos;s discuss how we can make your special occasion unforgettable.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center">
              <Phone className="h-8 w-8 mb-3 text-accent-primary"/>
              <h3 className="font-semibold mb-1">Private Events Line</h3>
              <p className="text-sm text-muted-foreground">1-800-PRIVATE-EVENT</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 mb-3 text-accent-primary"/>
              <h3 className="font-semibold mb-1">Email Us</h3>
              <p className="text-sm text-muted-foreground">private@atlvs.com</p>
            </div>
            <div className="flex flex-col items-center">
              <Calendar className="h-8 w-8 mb-3 text-accent-primary"/>
              <h3 className="font-semibold mb-1">Consultation</h3>
              <p className="text-sm text-muted-foreground">Free Initial Consultation</p>
            </div>
          </div>
          <Button size="lg" className="text-lg px-8 py-6">
            <Gift className="h-5 w-5 mr-2"/>
            Start Planning Your Event
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
