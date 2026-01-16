
'use client'


import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Header } from "@/lib/design-system"
import { Crown, Star, Users, Gift, CreditCard, CheckCircle, ArrowRight, Heart, Zap, Shield, Globe, Award, Calendar, DollarSign, Sparkles, TrendingUp, MapPin } from "lucide-react"

interface MembershipTier {
  id: string
  name: string
  price: string
  period: string
  description: string
  features: string[]
  popular: boolean
  recommended: boolean
  savings?: string
  color: string
  icon: React.ComponentType<{ className?: string }>
}

interface MembershipBenefit {
  category: string
  icon: React.ComponentType<{ className?: string }>
  benefits: {
    name: string
    description: string
    tiers: string[]
  }[]
}

interface Testimonial {
  id: string
  name: string
  location: string
  membership: string
  quote: string
  avatar: string
  rating: number
  saved: string
}

export default function MembershipsPage() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')

  const membershipTiers: MembershipTier[] = [
    {
      id: "explorer",
      name: "Explorer",
      price: billingCycle === 'yearly' ? "$99" : "$12",
      period: billingCycle === 'yearly' ? "/year" : "/month",
      description: "Perfect for occasional travelers seeking great value",
      features: [
        "5% discount on all bookings",
        "Priority customer support",
        "Free cancellation up to 24 hours",
        "Travel credits ($50/year)",
        "Access to member-only deals",
        "Basic travel insurance"
      ],
      popular: false,
      recommended: false,
      color: "bg-accent-primary",
      icon: MapPin
    },
    {
      id: "adventurer",
      name: "Adventurer",
      price: billingCycle === 'yearly' ? "$199" : "$20",
      period: billingCycle === 'yearly' ? "/year" : "/month",
      description: "Ideal for frequent travelers who want premium benefits",
      features: [
        "10% discount on all bookings",
        "24/7 concierge support",
        "Free cancellation up to 48 hours",
        "Travel credits ($150/year)",
        "Priority booking access",
        "VIP event invitations",
        "Complimentary upgrades",
        "Enhanced travel insurance"
      ],
      popular: true,
      recommended: true,
      savings: billingCycle === 'yearly' ? "Save $61/year" : "",
      color: "bg-accent-primary",
      icon: Star
    },
    {
      id: "elite",
      name: "Elite",
      price: billingCycle === 'yearly' ? "$399" : "$40",
      period: billingCycle === 'yearly' ? "/year" : "/month",
      description: "Ultimate luxury experience for discerning travelers",
      features: [
        "15% discount on all bookings",
        "Dedicated concierge service",
        "Free cancellation up to 72 hours",
        "Travel credits ($300/year)",
        "Exclusive VIP experiences",
        "Private jet access",
        "Luxury hotel upgrades",
        "Premium travel insurance",
        "Executive lounge access",
        "Personal travel consultant"
      ],
      popular: false,
      recommended: false,
      savings: billingCycle === 'yearly' ? "Save $121/year" : "",
      color: "bg-gold-500",
      icon: Crown
    }
  ]

  const membershipBenefits: MembershipBenefit[] = [
    {
      category: "Travel Savings",
      icon: DollarSign,
      benefits: [
        {
          name: "Booking Discounts",
          description: "Exclusive discounts on hotels, flights, and experiences",
          tiers: ["explorer", "adventurer", "elite"]
        },
        {
          name: "Travel Credits",
          description: "Annual credits to use toward any booking",
          tiers: ["explorer", "adventurer", "elite"]
        },
        {
          name: "Free Cancellations",
          description: "Extended cancellation windows with full refunds",
          tiers: ["explorer", "adventurer", "elite"]
        }
      ]
    },
    {
      category: "Exclusive Access",
      icon: Star,
      benefits: [
        {
          name: "Priority Booking",
          description: "Early access to new experiences and sold-out events",
          tiers: ["adventurer", "elite"]
        },
        {
          name: "VIP Experiences",
          description: "Invitation-only events and exclusive activities",
          tiers: ["adventurer", "elite"]
        },
        {
          name: "Private Jet Access",
          description: "Charter flight options and private aviation network",
          tiers: ["elite"]
        }
      ]
    },
    {
      category: "Personalized Service",
      icon: Users,
      benefits: [
        {
          name: "Concierge Support",
          description: "24/7 dedicated support for all your travel needs",
          tiers: ["adventurer", "elite"]
        },
        {
          name: "Personal Consultant",
          description: "Dedicated travel consultant for itinerary planning",
          tiers: ["elite"]
        },
        {
          name: "Custom Itineraries",
          description: "Bespoke travel planning tailored to your preferences",
          tiers: ["elite"]
        }
      ]
    }
  ]

  const testimonials: Testimonial[] = [
    {
      id: "sarah-j",
      name: "Sarah Johnson",
      location: "San Francisco, CA",
      membership: "Adventurer",
      quote: "The membership has completely transformed how I travel. The concierge service alone has saved me countless hours, and the discounts make every trip more affordable.",
      avatar: "/api/placeholder/60/60",
      rating: 5,
      saved: "$2,400"
    },
    {
      id: "michael-c",
      name: "Michael Chen",
      location: "New York, NY",
      membership: "Elite",
      quote: "As a frequent business traveler, the Elite membership provides unparalleled service. The private jet access and personal consultant are game-changers.",
      avatar: "/api/placeholder/60/60",
      rating: 5,
      saved: "$8,500"
    },
    {
      id: "emma-d",
      name: "Emma Davis",
      location: "London, UK",
      membership: "Explorer",
      quote: "Even the Explorer tier offers amazing value. The travel credits and priority support make it worthwhile for occasional travelers like me.",
      avatar: "/api/placeholder/60/60",
      rating: 5,
      saved: "$850"
    }
  ]

  const faqs = [
    {
      question: "Can I cancel my membership anytime?",
      answer: "Yes, you can cancel your membership at any time. Annual memberships are billed upfront, but monthly memberships can be cancelled with no penalty."
    },
    {
      question: "Do membership benefits expire?",
      answer: "Travel credits expire at the end of each membership year, but all other benefits remain active as long as your membership is current."
    },
    {
      question: "Can I upgrade or downgrade my membership?",
      answer: "Absolutely! You can change your membership tier at any time. Upgrades take effect immediately, while downgrades apply at the next billing cycle."
    },
    {
      question: "Are there any setup fees?",
      answer: "No setup fees for any membership tier. You only pay the monthly or annual membership fee."
    },
    {
      question: "Do benefits apply to existing bookings?",
      answer: "Membership benefits apply to all new bookings made after joining. Existing bookings may qualify for retroactive discounts in some cases."
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
              <Crown className="h-10 w-10 text-accent-primary"/>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Exclusive Membership
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Unlock premium travel experiences, exclusive benefits, and unparalleled service.
              Join over 250,000 members who travel smarter, save more, and enjoy extraordinary adventures.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-background rounded-lg p-1 shadow-sm mb-8">
              <Button
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-accent-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Monthly
              </Button>
              <Button
                onClick={() => setBillingCycle('yearly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'yearly'
                    ? 'bg-accent-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Yearly
                <Badge variant="secondary" className="ml-2 bg-semantic-success/10 text-green-800 text-xs">
                  Save 17%
                </Badge>
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                <Star className="h-5 w-5 mr-2"/>
                Start Free Trial
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Award className="h-5 w-5 mr-2"/>
                Compare Plans
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Choose Your Membership</h2>
            <p className="text-xl text-muted-foreground">
              Select the perfect plan for your travel style and unlock exclusive benefits
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {membershipTiers.map((tier) => (
              <Card
                key={tier.id}
                className={`relative hover:shadow-xl transition-shadow cursor-pointer ${
                  tier.popular ? 'ring-2 ring-accent-primary' : ''
                } ${selectedTier === tier.id ? 'ring-2 ring-accent-primary' : ''}`}
                onClick={() => setSelectedTier(tier.id)}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-accent-primary text-primary-foreground px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${tier.color.replace('bg-', 'bg-')}/20`}>
                    <tier.icon className="h-8 w-8 text-accent-primary"/>
                  </div>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription className="mb-4">{tier.description}</CardDescription>
                  <div className="text-center">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground">{tier.period}</span>
                    {tier.savings && billingCycle === 'yearly' && (
                      <div className="text-sm text-semantic-success font-medium mt-1">
                        {tier.savings}
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <CheckCircle className="h-4 w-4 mr-3 text-semantic-success mt-0.5 flex-shrink-0"/>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant={tier.recommended ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation()
                      // Handle membership signup
                    }}
                  >
                    {tier.recommended ? "Get Started" : "Choose Plan"}
                    <ArrowRight className="h-4 w-4 ml-2"/>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/memberships/compare">
                <Award className="h-5 w-5 mr-2"/>
                Compare All Features
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Overview */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Membership Benefits</h2>
            <p className="text-xl text-muted-foreground">
              Discover all the ways membership enhances your travel experience
            </p>
          </div>

          <div className="space-y-12">
            {membershipBenefits.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="flex items-center mb-8">
                  <div className="p-3 bg-accent-primary/20 rounded-lg mr-4">
                    <category.icon className="h-6 w-6 text-accent-primary"/>
                  </div>
                  <h3 className="text-2xl font-semibold">{category.category}</h3>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {category.benefits.map((benefit, benefitIndex) => (
                    <Card key={benefitIndex} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <h4 className="font-semibold mb-2">{benefit.name}</h4>
                        <p className="text-muted-foreground text-sm mb-4">
                          {benefit.description}
                        </p>
                        <div className="flex gap-2">
                          {membershipTiers.map((tier) => (
                            <Badge
                              key={tier.id}
                              variant={benefit.tiers.includes(tier.id) ? "default" : "secondary"}
                              className={`text-xs ${
                                benefit.tiers.includes(tier.id)
                                  ? 'bg-accent-primary'
                                  : 'bg-muted text-muted-foreground'
                              }`}
                            >
                              {tier.name}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">What Members Say</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of satisfied travelers who have transformed their journeys
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 rounded-full mr-4"></div>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {testimonial.membership} Member
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-neutral-300'
                        }`}/>
                    ))}
                  </div>

                  <blockquote className="text-muted-foreground mb-4 italic">
                    "{testimonial.quote}"
                  </blockquote>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-semantic-success font-medium">
                      Saved {testimonial.saved}
                    </span>
                    <span className="text-muted-foreground">Verified Member</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about membership
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-accent-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <Sparkles className="h-16 w-16 mx-auto mb-6 text-accent-primary"/>
          <h2 className="text-4xl font-display font-bold mb-4">Ready to Elevate Your Travel?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join our community of discerning travelers and unlock a world of exclusive experiences,
            unparalleled savings, and personalized service that makes every journey extraordinary.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/memberships/join">
                <Crown className="h-5 w-5 mr-2"/>
                Start Your Membership
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">
                <Users className="h-5 w-5 mr-2"/>
                Have Questions?
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 G H X S T S H I P Industries LLC. ATLVS + GVTEWAY Membership Program.</p>
            <p className="text-sm mt-2">
              All membership benefits are subject to terms and conditions. Prices may vary by region.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}