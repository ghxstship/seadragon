
'use client'


import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/lib/design-system"
import { Crown, Star, Users, Gift, CheckCircle, X, ArrowRight, Award, TrendingUp, Shield, Globe, Clock } from "lucide-react"

interface MembershipTier {
  id: string
  name: string
  price: string
  period: string
  description: string
  popular: boolean
  recommended: boolean
  features: Record<string, boolean | string>
}

interface ComparisonFeature {
  category: string
  name: string
  description: string
  tiers: Record<string, boolean | string>
}

export default function MembershipsComparePage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')

  const membershipTiers: MembershipTier[] = [
    {
      id: "explorer",
      name: "Explorer",
      price: billingCycle === 'yearly' ? "$99" : "$12",
      period: billingCycle === 'yearly' ? "/year" : "/month",
      description: "Perfect for occasional travelers seeking great value",
      popular: false,
      recommended: false,
      features: {
        bookingDiscount: "5%",
        conciergeSupport: false,
        travelCredits: "$50",
        freeCancellations: "24 hours",
        priorityBooking: false,
        vipEvents: false,
        privateJetAccess: false,
        dedicatedConsultant: false,
        executiveLounge: false,
        premiumInsurance: false
      }
    },
    {
      id: "adventurer",
      name: "Adventurer",
      price: billingCycle === 'yearly' ? "$199" : "$20",
      period: billingCycle === 'yearly' ? "/year" : "/month",
      description: "Ideal for frequent travelers who want premium benefits",
      popular: true,
      recommended: true,
      features: {
        bookingDiscount: "10%",
        conciergeSupport: true,
        travelCredits: "$150",
        freeCancellations: "48 hours",
        priorityBooking: true,
        vipEvents: true,
        privateJetAccess: false,
        dedicatedConsultant: false,
        executiveLounge: false,
        premiumInsurance: true
      }
    },
    {
      id: "elite",
      name: "Elite",
      price: billingCycle === 'yearly' ? "$399" : "$40",
      period: billingCycle === 'yearly' ? "/year" : "/month",
      description: "Ultimate luxury experience for discerning travelers",
      popular: false,
      recommended: false,
      features: {
        bookingDiscount: "15%",
        conciergeSupport: true,
        travelCredits: "$300",
        freeCancellations: "72 hours",
        priorityBooking: true,
        vipEvents: true,
        privateJetAccess: true,
        dedicatedConsultant: true,
        executiveLounge: true,
        premiumInsurance: true
      }
    }
  ]

  const comparisonFeatures: ComparisonFeature[] = [
    {
      category: "Savings & Credits",
      name: "Booking Discount",
      description: "Discount on all hotel, flight, and experience bookings",
      tiers: {
        explorer: "5%",
        adventurer: "10%",
        elite: "15%"
      }
    },
    {
      category: "Savings & Credits",
      name: "Annual Travel Credits",
      description: "Credits to use toward any booking",
      tiers: {
        explorer: "$50",
        adventurer: "$150",
        elite: "$300"
      }
    },
    {
      category: "Support",
      name: "Concierge Support",
      description: "24/7 dedicated support team",
      tiers: {
        explorer: false,
        adventurer: true,
        elite: true
      }
    },
    {
      category: "Support",
      name: "Dedicated Consultant",
      description: "Personal travel consultant for planning",
      tiers: {
        explorer: false,
        adventurer: false,
        elite: true
      }
    },
    {
      category: "Booking Flexibility",
      name: "Free Cancellations",
      description: "Extended cancellation windows",
      tiers: {
        explorer: "24 hours",
        adventurer: "48 hours",
        elite: "72 hours"
      }
    },
    {
      category: "Exclusive Access",
      name: "Priority Booking",
      description: "Early access to new experiences and sold-out events",
      tiers: {
        explorer: false,
        adventurer: true,
        elite: true
      }
    },
    {
      category: "Exclusive Access",
      name: "VIP Events",
      description: "Invitation to exclusive member-only events",
      tiers: {
        explorer: false,
        adventurer: true,
        elite: true
      }
    },
    {
      category: "Exclusive Access",
      name: "Private Jet Access",
      description: "Charter flight options and private aviation network",
      tiers: {
        explorer: false,
        adventurer: false,
        elite: true
      }
    },
    {
      category: "Exclusive Access",
      name: "Executive Lounge Access",
      description: "Access to premium airport lounges worldwide",
      tiers: {
        explorer: false,
        adventurer: false,
        elite: true
      }
    },
    {
      category: "Insurance & Safety",
      name: "Premium Travel Insurance",
      description: "Enhanced coverage including trip interruption and medical",
      tiers: {
        explorer: false,
        adventurer: true,
        elite: true
      }
    }
  ]

  const renderFeatureValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <CheckCircle className="h-5 w-5 text-semantic-success mx-auto"/>
      ) : (
        <X className="h-5 w-5 text-neutral-300 mx-auto"/>
      )
    }
    return <span className="font-medium text-center">{value}</span>
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
              <Award className="h-10 w-10 text-accent-primary"/>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Compare Membership Plans
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Choose the perfect membership tier for your travel style. Compare features, benefits,
              and pricing to find the best fit for your adventures.
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
          </div>
        </div>
      </section>

      {/* Pricing Cards Overview */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {membershipTiers.map((tier) => (
              <Card
                key={tier.id}
                className={`relative hover:shadow-xl transition-shadow ${
                  tier.popular ? 'ring-2 ring-accent-primary' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-accent-primary text-primary-foreground px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-primary/20 flex items-center justify-center">
                    {tier.id === 'explorer' && <Star className="h-8 w-8 text-accent-primary"/>}
                    {tier.id === 'adventurer' && <Award className="h-8 w-8 text-accent-primary"/>}
                    {tier.id === 'elite' && <Crown className="h-8 w-8 text-accent-primary"/>}
                  </div>
                  <CardTitle className="text-2xl">{tier.name}</CardTitle>
                  <CardDescription className="mb-4">{tier.description}</CardDescription>
                  <div className="text-center">
                    <span className="text-4xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground">{tier.period}</span>
                    {billingCycle === 'yearly' && tier.id === 'adventurer' && (
                      <div className="text-sm text-semantic-success font-medium mt-1">
                        Save $61/year
                      </div>
                    )}
                    {billingCycle === 'yearly' && tier.id === 'elite' && (
                      <div className="text-sm text-semantic-success font-medium mt-1">
                        Save $121/year
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  <Button
                    className="w-full"
                    variant={tier.recommended ? "default" : "outline"}
                  >
                    {tier.recommended ? "Get Started" : "Choose Plan"}
                    <ArrowRight className="h-4 w-4 ml-2"/>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Comparison Table */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Feature Comparison</h2>
            <p className="text-xl text-muted-foreground">
              Detailed breakdown of what's included in each membership tier
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-6 font-semibold">Features</th>
                  {membershipTiers.map((tier) => (
                    <th key={tier.id} className="text-center py-4 px-6 min-w-[200px]">
                      <div className="space-y-2">
                        <div className="font-semibold text-lg">{tier.name}</div>
                        <div className="text-2xl font-bold text-accent-primary">
                          {tier.price}
                          <span className="text-sm text-muted-foreground">{tier.period}</span>
                        </div>
                        <Button
                          size="sm"
                          variant={tier.recommended ? "default" : "outline"}
                          className="w-full"
                        >
                          {tier.recommended ? "Choose Elite" : "Select"}
                        </Button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr key={index} className="border-b hover:bg-muted/30">
                    <td className="py-6 px-6">
                      <div>
                        <div className="font-semibold mb-1">{feature.name}</div>
                        <div className="text-sm text-muted-foreground">{feature.description}</div>
                      </div>
                    </td>
                    {Object.entries(feature.tiers).map(([tierId, value]) => (
                      <td key={tierId} className="py-6 px-6 text-center">
                        {renderFeatureValue(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Benefits by Category */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Benefits Breakdown</h2>
            <p className="text-xl text-muted-foreground">
              Understand how each membership tier delivers value across different categories
            </p>
          </div>

          <div className="space-y-12">
            {["Savings & Credits", "Support", "Booking Flexibility", "Exclusive Access", "Insurance & Safety"].map((category) => {
              const categoryFeatures = comparisonFeatures.filter(f => f.category === category)
              if (categoryFeatures.length === 0) return null

              return (
                <div key={category}>
                  <h3 className="text-2xl font-semibold mb-8 flex items-center">
                    {category === "Savings & Credits" && <TrendingUp className="h-6 w-6 mr-3 text-semantic-success"/>}
                    {category === "Support" && <Users className="h-6 w-6 mr-3 text-accent-secondary"/>}
                    {category === "Booking Flexibility" && <Clock className="h-6 w-6 mr-3 text-accent-primary"/>}
                    {category === "Exclusive Access" && <Award className="h-6 w-6 mr-3 text-semantic-warning"/>}
                    {category === "Insurance & Safety" && <Shield className="h-6 w-6 mr-3 text-semantic-error"/>}
                    {category}
                  </h3>

                  <div className="grid md:grid-cols-3 gap-6">
                    {categoryFeatures.map((feature, index) => (
                      <Card key={index} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <h4 className="font-semibold mb-3">{feature.name}</h4>
                          <p className="text-muted-foreground text-sm mb-4">
                            {feature.description}
                          </p>

                          <div className="space-y-3">
                            {membershipTiers.map((tier) => {
                              const tierValue = feature.tiers[tier.id]
                              return (
                                <div key={tier.id} className="flex items-center justify-between py-2 border-b border-muted last:border-0">
                                  <span className="text-sm font-medium">{tier.name}</span>
                                  <div className="flex items-center">
                                    {renderFeatureValue(tierValue)}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Common questions about our membership plans
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Can I change my membership tier?</h3>
                <p className="text-muted-foreground">
                  Yes, you can upgrade or downgrade your membership at any time. Upgrades take effect immediately,
                  while downgrades apply at the next billing cycle. Contact our support team to make changes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Are there any setup fees or contracts?</h3>
                <p className="text-muted-foreground">
                  No setup fees or long-term contracts. You can cancel your membership at any time with no penalties.
                  Monthly memberships can be cancelled before the next billing cycle, while annual memberships
                  are billed upfront.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Do benefits apply to existing bookings?</h3>
                <p className="text-muted-foreground">
                  Membership benefits apply to all new bookings made after joining. Some benefits like discounts
                  may be applied retroactively to bookings made within 30 days of joining. Contact support for assistance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-3">Can I share my membership benefits?</h3>
                <p className="text-muted-foreground">
                  Elite memberships include benefits that can be shared with up to 3 additional travelers.
                  All other membership tiers are individual-only. Family and group discounts may be available
                  for certain experiences regardless of membership tier.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-accent-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <Crown className="h-16 w-16 mx-auto mb-6 text-accent-primary"/>
          <h2 className="text-4xl font-display font-bold mb-4">Ready to Choose Your Membership?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of travelers who have elevated their journeys with our exclusive membership benefits.
            Start with a free trial and experience the difference immediately.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/memberships/join">
                <Star className="h-5 w-5 mr-2"/>
                Start Free Trial
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">
                <Users className="h-5 w-5 mr-2"/>
                Need Help Deciding?
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 G H X S T S H I P Industries LLC. ATLVS + GVTEWAY Membership Comparison.</p>
            <p className="text-sm mt-2">
              All membership benefits are subject to terms and conditions. Features and pricing may vary by region.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
