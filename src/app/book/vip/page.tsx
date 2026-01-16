
'use client'


import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { Crown, Star, Sparkles, Users, Calendar, MapPin, Phone, Mail, Clock, CheckCircle, Gift, Shield } from "lucide-react"

interface VIPPackage {
  id: string
  name: string
  description: string
  price: number
  currency: string
  category: 'experience' | 'event' | 'venue' | 'travel'
  duration: string
  capacity: string
  inclusions: string[]
  image: string
  featured: boolean
  availability: 'available' | 'limited' | 'sold-out'
}

interface VIPBenefit {
  icon: string
  title: string
  description: string
}

export default function VIP() {
  const [selectedPackage, setSelectedPackage] = useState<VIPPackage | null>(null)
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    eventType: '',
    guestCount: '',
    date: '',
    budget: '',
    specialRequests: ''
  })

  const vipPackages: VIPPackage[] = [
    {
      id: "vip-1",
      name: "Exclusive Backstage Experience",
      description: "Full backstage access, meet & greet with artists, VIP seating, and exclusive merchandise",
      price: 2500,
      currency: "USD",
      category: "experience",
      duration: "4 hours",
      capacity: "Up to 10 guests",
      inclusions: [
        "Backstage access",
        "Meet & greet with performers",
        "VIP seating in prime location",
        "Exclusive merchandise package",
        "Professional photography",
        "Champagne reception",
        "Personal concierge service"
      ],
      image: "/api/placeholder/400/300",
      featured: true,
      availability: "available"
    },
    {
      id: "vip-2",
      name: "Private Venue Experience",
      description: "Rent an entire venue for your exclusive private event with full customization",
      price: 15000,
      currency: "USD",
      category: "venue",
      duration: "Full evening",
      capacity: "50-500 guests",
      inclusions: [
        "Exclusive venue access",
        "Custom event planning",
        "Catering by celebrity chefs",
        "State-of-the-art AV equipment",
        "Security and staff",
        "VIP parking and transportation",
        "24/7 event coordination"
      ],
      image: "/api/placeholder/400/300",
      featured: true,
      availability: "limited"
    },
    {
      id: "vip-3",
      name: "Celebrity Artist Collaboration",
      description: "Work directly with world-class performers for your special occasion",
      price: 50000,
      currency: "USD",
      category: "event",
      duration: "Custom",
      capacity: "Flexible",
      inclusions: [
        "Direct artist collaboration",
        "Custom performance set",
        "Sound and lighting design",
        "Rehearsal coordination",
        "Artist accommodation",
        "Legal and contract management",
        "Full production support"
      ],
      image: "/api/placeholder/400/300",
      featured: false,
      availability: "available"
    },
    {
      id: "vip-4",
      name: "Luxury Travel Experience",
      description: "Premium travel arrangements with private jets, yachts, and exclusive destinations",
      price: 75000,
      currency: "USD",
      category: "travel",
      duration: "Multi-day",
      capacity: "2-20 guests",
      inclusions: [
        "Private jet charter",
        "Luxury accommodation",
        "Personal chef services",
        "Guided experiences",
        "Security detail",
        "24/7 concierge",
        "Custom itinerary design"
      ],
      image: "/api/placeholder/400/300",
      featured: false,
      availability: "available"
    }
  ]

  const vipBenefits: VIPBenefit[] = [
    {
      icon: "",
      title: "Exclusive Access",
      description: "Priority access to sold-out events, VIP areas, and exclusive experiences"
    },
    {
      icon: "",
      title: "Personal Concierge",
      description: "Dedicated VIP concierge team available 24/7 for all your needs"
    },
    {
      icon: "",
      title: "Fast Track Service",
      description: "Skip lines, priority booking, and expedited processing for all services"
    },
    {
      icon: "",
      title: "Premium Perks",
      description: "Complimentary upgrades, exclusive merchandise, and special offers"
    },
    {
      icon: "",
      title: "Privacy & Security",
      description: "Discreet handling, enhanced security, and privacy protection"
    },
    {
      icon: "",
      title: "Luxury Amenities",
      description: "Premium transportation, accommodations, and dining experiences"
    }
  ]

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit to API
    alert('Thank you for your VIP inquiry! Our concierge team will contact you within 24 hours.')
    setBookingForm({
      name: '',
      email: '',
      phone: '',
      company: '',
      eventType: '',
      guestCount: '',
      date: '',
      budget: '',
      specialRequests: ''
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
            <span className="text-foreground font-medium">VIP</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-accent-primary/10 via-accent-secondary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center mb-6">
              <Crown className="h-16 w-16 text-accent-primary mr-4"/>
              <div>
                <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
                  VIP Experiences
                </h1>
                <Badge variant="secondary" className="text-lg px-4 py-2 bg-accent-primary/20 text-accent-primary border-accent-primary/30">
                  <Sparkles className="h-4 w-4 mr-2"/>
                  Exclusive Access Only
                </Badge>
              </div>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Unlock unparalleled experiences with our premium VIP services. From backstage encounters with world-class artists
              to bespoke private events, our VIP concierge team ensures every moment exceeds expectations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg" className="text-lg px-8 py-6">
                    <Crown className="h-5 w-5 mr-2"/>
                    Inquire About VIP Services
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <Crown className="h-5 w-5 mr-2 text-accent-primary"/>
                      VIP Experience Inquiry
                    </DialogTitle>
                    <DialogDescription>
                      Tell us about your vision and our VIP concierge team will create a bespoke experience for you.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={bookingForm.name}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                          required/>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={bookingForm.email}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, email: e.target.value }))}
                          required/>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={bookingForm.phone}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, phone: e.target.value }))}
                          required/>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company/Organization</Label>
                        <Input
                          id="company"
                          value={bookingForm.company}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, company: e.target.value }))}/>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="eventType">Event Type</Label>
                        <Select value={bookingForm.eventType} onValueChange={(value) => setBookingForm(prev => ({ ...prev, eventType: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select event type"/>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="corporate">Corporate Event</SelectItem>
                            <SelectItem value="wedding">Wedding</SelectItem>
                            <SelectItem value="birthday">Birthday Celebration</SelectItem>
                            <SelectItem value="anniversary">Anniversary</SelectItem>
                            <SelectItem value="concert">Concert Experience</SelectItem>
                            <SelectItem value="travel">Luxury Travel</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="guestCount">Number of Guests</Label>
                        <Input
                          id="guestCount"
                          type="number"
                          value={bookingForm.guestCount}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, guestCount: e.target.value }))}
                          placeholder="e.g., 50"/>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Preferred Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={bookingForm.date}
                          onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))}/>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="budget">Budget Range</Label>
                        <Select value={bookingForm.budget} onValueChange={(value) => setBookingForm(prev => ({ ...prev, budget: value }))}>
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
                      <Label htmlFor="specialRequests">Special Requests or Vision</Label>
                      <Textarea
                        id="specialRequests"
                        value={bookingForm.specialRequests}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, specialRequests: e.target.value }))}
                        placeholder="Tell us about your dream experience..."
                        rows={4}/>
                    </div>
                    <Button type="submit" className="w-full">
                      Submit VIP Inquiry
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Phone className="h-5 w-5 mr-2"/>
                Call VIP Concierge
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* VIP Benefits */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">VIP Benefits</h2>
            <p className="text-xl text-muted-foreground">
              Experience the pinnacle of luxury and exclusivity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {vipBenefits.map((benefit, index) => (
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

      {/* VIP Packages */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Exclusive VIP Packages</h2>
            <p className="text-xl text-muted-foreground">
              Curated experiences designed for those who demand the extraordinary
            </p>
          </div>

          <Tabs defaultValue="featured" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="featured">Featured</TabsTrigger>
              <TabsTrigger value="experiences">Experiences</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="travel">Travel</TabsTrigger>
            </TabsList>

            <TabsContent value="featured">
              <div className="grid md:grid-cols-2 gap-8">
                {vipPackages.filter(pkg => pkg.featured).map((pkg) => (
                  <Card key={pkg.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 relative">
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-accent-primary">Featured VIP</Badge>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center justify-between text-primary-foreground">
                          <div>
                            <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
                            <p className="text-sm opacity-90">{pkg.category.charAt(0).toUpperCase() + pkg.category.slice(1)}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">${pkg.price.toLocaleString()}</div>
                            <div className="text-sm opacity-90">{pkg.currency}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <p className="text-muted-foreground mb-4">{pkg.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground"/>
                          {pkg.duration}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground"/>
                          {pkg.capacity}
                        </div>
                      </div>
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Includes:</h4>
                        <ul className="text-sm space-y-1">
                          {pkg.inclusions.slice(0, 3).map((inclusion, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="h-3 w-3 mr-2 text-success"/>
                              {inclusion}
                            </li>
                          ))}
                          {pkg.inclusions.length > 3 && (
                            <li className="text-muted-foreground">+{pkg.inclusions.length - 3} more</li>
                          )}
                        </ul>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant={pkg.availability === 'available' ? 'default' : pkg.availability === 'limited' ? 'secondary' : 'destructive'}>
                          {pkg.availability === 'available' ? 'Available' : pkg.availability === 'limited' ? 'Limited' : 'Sold Out'}
                        </Badge>
                        <Button size="sm" onClick={() => setSelectedPackage(pkg)}>
                          Learn More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="experiences">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vipPackages.filter(pkg => pkg.category === 'experience').map((pkg) => (
                  <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{pkg.name}</h3>
                          <Badge variant="secondary">{pkg.category}</Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">${pkg.price.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">{pkg.currency}</div>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4 text-sm">{pkg.description}</p>
                      <Button size="sm" className="w-full" onClick={() => setSelectedPackage(pkg)}>
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="events">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vipPackages.filter(pkg => pkg.category === 'event').map((pkg) => (
                  <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{pkg.name}</h3>
                          <Badge variant="secondary">{pkg.category}</Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">${pkg.price.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">{pkg.currency}</div>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4 text-sm">{pkg.description}</p>
                      <Button size="sm" className="w-full" onClick={() => setSelectedPackage(pkg)}>
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="travel">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vipPackages.filter(pkg => pkg.category === 'travel').map((pkg) => (
                  <Card key={pkg.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-lg">{pkg.name}</h3>
                          <Badge variant="secondary">{pkg.category}</Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">${pkg.price.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">{pkg.currency}</div>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4 text-sm">{pkg.description}</p>
                      <Button size="sm" className="w-full" onClick={() => setSelectedPackage(pkg)}>
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* VIP Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">VIP Client Experiences</h2>
            <p className="text-xl text-muted-foreground">
              Hear from our distinguished VIP clients
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
                  "The VIP experience exceeded all expectations. From the moment we arrived,
                  everything was perfectly orchestrated. The backstage access and meet & greet
                  with the artists was unforgettable."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-accent-primary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-accent-primary">JD</span>
                  </div>
                  <div>
                    <div className="font-semibold">Jennifer Davis</div>
                    <div className="text-sm text-muted-foreground">CEO, Tech Innovations</div>
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
                  "Booking a private venue through the VIP service was seamless. The attention
                  to detail, from the custom menu to the lighting design, made our corporate
                  event truly spectacular."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-accent-secondary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-accent-secondary">MR</span>
                  </div>
                  <div>
                    <div className="font-semibold">Michael Rodriguez</div>
                    <div className="text-sm text-muted-foreground">Event Director, Global Corp</div>
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
                  "The VIP concierge team made our luxury travel experience flawless. Every
                  detail was handled with the utmost care and professionalism. Worth every
                  penny for the peace of mind alone."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-accent-tertiary/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-sm font-semibold text-accent-tertiary">SC</span>
                  </div>
                  <div>
                    <div className="font-semibold">Sarah Chen</div>
                    <div className="text-sm text-muted-foreground">Luxury Travel Enthusiast</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* VIP Concierge Contact */}
      <section className="py-20 px-4 bg-accent-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <Crown className="h-16 w-16 mx-auto mb-6 text-accent-primary"/>
          <h2 className="text-4xl font-display font-bold mb-4">VIP Concierge Service</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Our dedicated VIP concierge team is available 24/7 to bring your vision to life.
            Experience the ultimate in personalized service and attention to detail.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="flex flex-col items-center">
              <Phone className="h-8 w-8 mb-3 text-accent-primary"/>
              <h3 className="font-semibold mb-1">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">1-800-VIP-ATLVS</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 mb-3 text-accent-primary"/>
              <h3 className="font-semibold mb-1">Direct Email</h3>
              <p className="text-sm text-muted-foreground">vip@atlvs.com</p>
            </div>
            <div className="flex flex-col items-center">
              <Shield className="h-8 w-8 mb-3 text-accent-primary"/>
              <h3 className="font-semibold mb-1">Confidential</h3>
              <p className="text-sm text-muted-foreground">100% Private & Secure</p>
            </div>
          </div>
          <Button size="lg" className="text-lg px-8 py-6">
            <Gift className="h-5 w-5 mr-2"/>
            Start Your VIP Journey
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

      {/* Package Detail Modal */}
      {selectedPackage && (
        <Dialog open={!!selectedPackage} onOpenChange={() => setSelectedPackage(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Crown className="h-5 w-5 mr-2 text-accent-primary"/>
                {selectedPackage.name}
              </DialogTitle>
              <DialogDescription>
                {selectedPackage.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="aspect-video bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 rounded-lg"></div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Package Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <Badge>{selectedPackage.category}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span>{selectedPackage.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span>{selectedPackage.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price:</span>
                      <span className="font-bold text-lg">${selectedPackage.price.toLocaleString()} {selectedPackage.currency}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">What&apos;s Included</h3>
                  <ul className="space-y-2">
                    {selectedPackage.inclusions.map((inclusion, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-success flex-shrink-0"/>
                        <span className="text-sm">{inclusion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="flex-1" size="lg">
                  Request This Package
                </Button>
                <Button variant="outline" size="lg" onClick={() => setSelectedPackage(null)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
