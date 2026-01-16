
'use client'


import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Header } from "@/lib/design-system"
import { Scale, AlertTriangle, Users, Ban, CheckCircle, XCircle, Info, Shield, MapPin, Phone, Mail } from "lucide-react"

interface RuleCategory {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  rules: RuleItem[]
}

interface RuleItem {
  id: string
  title: string
  description: string
  severity: "high" | "medium" | "low"
  category: string
  examples?: string[]
}

interface VenuePolicy {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  details: string[]
}

export default function EventRulesPage() {
  const [selectedTab, setSelectedTab] = useState("general")

  const ruleCategories: RuleCategory[] = [
    {
      id: "conduct",
      title: "Code of Conduct",
      description: "Standards of behavior expected from all attendees",
      icon: Users,
      rules: [
        {
          id: "respect",
          title: "Respect All Attendees",
          description: "Treat everyone with respect regardless of background, appearance, or beliefs. Harassment, discrimination, or bullying will not be tolerated.",
          severity: "high",
          category: "conduct",
          examples: ["Verbal harassment", "Physical intimidation", "Discriminatory language", "Unwanted advances"]
        },
        {
          id: "inclusion",
          title: "Promote Inclusion",
          description: "Create a welcoming environment for all attendees, including those with disabilities, different cultural backgrounds, and diverse identities.",
          severity: "medium",
          category: "conduct",
          examples: ["Accommodating different needs", "Being mindful of personal space", "Using inclusive language"]
        },
        {
          id: "safety",
          title: "Prioritize Safety",
          description: "Report any safety concerns immediately to event staff. Do not engage in dangerous behavior that could harm yourself or others.",
          severity: "high",
          category: "conduct",
          examples: ["Rough play or shoving", "Climbing on structures", "Running in crowds", "Blocking emergency exits"]
        }
      ]
    },
    {
      id: "prohibited",
      title: "Prohibited Items & Activities",
      description: "Items and behaviors that are not allowed at the event",
      icon: Ban,
      rules: [
        {
          id: "weapons",
          title: "No Weapons or Dangerous Items",
          description: "Firearms, knives, explosives, or any items that could be used as weapons are strictly prohibited.",
          severity: "high",
          category: "prohibited",
          examples: ["Firearms", "Knives over 4 inches", "Explosives", "Brass knuckles"]
        },
        {
          id: "substances",
          title: "No Illegal Substances",
          description: "Possession, use, or distribution of illegal drugs or controlled substances is prohibited and will result in immediate removal.",
          severity: "high",
          category: "prohibited",
          examples: ["Marijuana", "Cocaine", "Heroin", "Synthetic drugs"]
        },
        {
          id: "recording",
          title: "Recording Restrictions",
          description: "Professional recording equipment and commercial photography require special permission. Personal photos for non-commercial use are allowed.",
          severity: "medium",
          category: "prohibited",
          examples: ["Professional cameras with detachable lenses", "Audio recording equipment", "Drone photography"]
        },
        {
          id: "resale",
          title: "No Ticket Resale",
          description: "Tickets cannot be resold above face value. Unauthorized resale violates our terms and may result in account suspension.",
          severity: "high",
          category: "prohibited",
          examples: ["Selling on secondary markets", "Price gouging", "Unauthorized ticket transfers"]
        }
      ]
    },
    {
      id: "venue",
      title: "Venue Rules",
      description: "Specific rules for the event venue and facilities",
      icon: MapPin,
      rules: [
        {
          id: "capacity",
          title: "Venue Capacity Limits",
          description: "Venue capacity limits are strictly enforced for safety. Areas may close when they reach capacity.",
          severity: "high",
          category: "venue",
          examples: ["Crowded performance areas", "Over-capacity bars", "Blocked walkways"]
        },
        {
          id: "smoking",
          title: "Smoking Policy",
          description: "Smoking is only permitted in designated outdoor areas. No smoking inside any venue buildings or within 25 feet of entrances.",
          severity: "medium",
          category: "venue",
          examples: ["Indoor smoking", "Smoking near entrances", "E-cigarettes in non-designated areas"]
        },
        {
          id: "outside-food",
          title: "Outside Food & Drink",
          description: "Outside food and beverages are not permitted. All food and drink must be purchased from authorized vendors.",
          severity: "low",
          category: "venue",
          examples: ["Homemade food", "Outside alcohol", "Large coolers", "Glass containers"]
        },
        {
          id: "re-entry",
          title: "Re-Entry Policy",
          description: "Re-entry may be permitted during certain times but requires wristband verification. Some events may not allow re-entry.",
          severity: "medium",
          category: "venue",
          examples: ["Leaving without wristband", "Attempting to sneak back in", "Sharing wristbands"]
        }
      ]
    },
    {
      id: "age",
      title: "Age Restrictions",
      description: "Age requirements and restrictions for different areas",
      icon: Users,
      rules: [
        {
          id: "general-admission",
          title: "General Admission",
          description: "Most events are all-ages, but some content may not be suitable for young children. Parents should use discretion.",
          severity: "low",
          category: "age",
          examples: ["Inappropriate content for children", "Late-night performances", "Crowded environments"]
        },
        {
          id: "alcohol-areas",
          title: "Alcohol Service Areas",
          description: "Valid government-issued photo ID required for alcohol service. No exceptions.",
          severity: "high",
          category: "age",
          examples: ["No ID presented", "Fake ID usage", "Borrowing ID from others"]
        },
        {
          id: "vip-areas",
          title: "VIP & Premium Areas",
          description: "VIP areas may have minimum age requirements (typically 18+). Additional restrictions may apply.",
          severity: "medium",
          category: "age",
          examples: ["Underage in VIP areas", "Bypassing age checks", "False age declarations"]
        }
      ]
    }
  ]

  const venuePolicies: VenuePolicy[] = [
    {
      id: "emergency",
      title: "Emergency Procedures",
      description: "What to do in case of emergency",
      icon: AlertTriangle,
      details: [
        "Follow instructions from event staff and emergency personnel",
        "Know the location of emergency exits and assembly points",
        "Do not use elevators during evacuations",
        "Help others if safe to do so",
        "Call emergency services if needed (911 or local equivalent)",
        "Stay calm and move in an orderly fashion"
      ]
    },
    {
      id: "medical",
      title: "Medical Assistance",
      description: "Medical services available on-site",
      icon: Shield,
      details: [
        "Medical tents/stations located throughout the venue",
        "Trained medical professionals available 24/7 during event",
        "Emergency medical services can be reached via event staff",
        "Report medical emergencies immediately to nearest staff member",
        "Carry personal medications and medical information",
        "Notify staff of any medical conditions upon arrival"
      ]
    },
    {
      id: "lost-found",
      title: "Lost & Found",
      description: "Procedures for lost items and reuniting with group members",
      icon: MapPin,
      details: [
        "Lost items should be reported to any information booth",
        "Lost & found is located at the main entrance",
        "Identification may be required to claim items",
        "Valuable items will be secured separately",
        "Use the buddy system to avoid separation",
        "Designate meeting points in case of separation"
      ]
    },
    {
      id: "accessibility",
      title: "Accessibility Services",
      description: "Support for attendees with disabilities",
      icon: Users,
      details: [
        "Accessibility accessible routes and areas",
        "Sign language interpreters available (advance request)",
        "Audio description services for visually impaired",
        "Accessible restrooms and changing facilities",
        "Service animal relief areas available",
        "Companion seating for wheelchair users"
      ]
    }
  ]

  const consequences = [
    {
      violation: "Minor violations (first offense)",
      consequences: ["Verbal warning", "Request to correct behavior", "Possible relocation within venue"],
      color: "yellow"
    },
    {
      violation: "Serious violations",
      consequences: ["Immediate removal from area", "Confiscation of prohibited items", "Loss of wristband access", "No refunds"],
      color: "orange"
    },
    {
      violation: "Severe violations",
      consequences: ["Permanent ban from venue", "Account suspension", "Report to authorities", "Legal action if applicable"],
      color: "red"
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
              <Scale className="h-10 w-10 text-accent-primary"/>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Event Rules & Policies
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Help us create a safe, enjoyable experience for everyone by following our
              comprehensive rules and guidelines.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                <CheckCircle className="h-5 w-5 mr-2"/>
                Accept Rules & Continue
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Mail className="h-5 w-5 mr-2"/>
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </section>

    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Important Notice */}
      <Alert className="mb-8 border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4"/>
        <AlertTitle className="text-orange-900">Important Notice</AlertTitle>
        <p className="text-sm text-blue-800">
          These rules are designed to ensure safety and enjoyment for all attendees.
          Violation of these rules may result in removal from the event without refund.
          Please read carefully and contact us with any questions.
        </p>
      </Alert>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General Rules</TabsTrigger>
          <TabsTrigger value="venue">Venue Policies</TabsTrigger>
          <TabsTrigger value="consequences">Consequences</TabsTrigger>
          <TabsTrigger value="faq">Frequently Asked</TabsTrigger>
        </TabsList>

          {/* General Rules Tab */}
          <TabsContent value="general" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold mb-4">Event Rules & Guidelines</h2>
              <p className="text-muted-foreground">
                Our comprehensive rules ensure a safe and enjoyable experience for everyone
              </p>
            </div>

            <div className="space-y-8">
              {ruleCategories.map((category) => (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <category.icon className="h-6 w-6 mr-3 text-accent-primary"/>
                      {category.title}
                    </CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {category.rules.map((rule) => (
                        <div key={rule.id} className={`p-4 border-l-4 rounded-r-lg ${
                          rule.severity === 'high' ? 'border-l-red-500 bg-red-50' :
                          rule.severity === 'medium' ? 'border-l-yellow-500 bg-yellow-50' :
                          'border-l-green-500 bg-green-50'
                        }`}>
                          <div className="flex items-start gap-3">
                            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                              rule.severity === 'high' ? 'bg-semantic-error/10' :
                              rule.severity === 'medium' ? 'bg-semantic-warning/10' :
                              'bg-semantic-success/10'
                            }`}>
                              {rule.severity === 'high' && <XCircle className="h-4 w-4 text-semantic-error"/>}
                              {rule.severity === 'medium' && <AlertTriangle className="h-4 w-4 text-semantic-warning"/>}
                              {rule.severity === 'low' && <Info className="h-4 w-4 text-semantic-success"/>}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">{rule.title}</h3>
                                <Badge className={`text-xs ${
                                  rule.severity === 'high' ? 'bg-semantic-error/10 text-red-800' :
                                  rule.severity === 'medium' ? 'bg-semantic-warning/10 text-yellow-800' :
                                  'bg-semantic-success/10 text-green-800'
                                }`}>
                                  {rule.severity} priority
                                </Badge>
                              </div>

                              <p className="text-muted-foreground mb-3">{rule.description}</p>

                              {rule.examples && (
                                <div>
                                  <h4 className="font-medium text-sm mb-2">Examples:</h4>
                                  <ul className="text-sm text-muted-foreground space-y-1">
                                    {rule.examples.map((example, index) => (
                                      <li key={index} className="flex items-center gap-2">
                                        <span className="w-1 h-1 bg-current rounded-full flex-shrink-0"></span>
                                        {example}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Venue Policies Tab */}
          <TabsContent value="venue" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold mb-4">Venue Policies & Procedures</h2>
              <p className="text-muted-foreground">
                Important information about venue operations and emergency procedures
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {venuePolicies.map((policy) => (
                <Card key={policy.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <policy.icon className="h-5 w-5 mr-2 text-accent-primary"/>
                      {policy.title}
                    </CardTitle>
                    <CardDescription>{policy.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {policy.details.map((detail, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-semantic-success mt-0.5 flex-shrink-0"/>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Info className="h-6 w-6 text-accent-secondary mt-1 flex-shrink-0"/>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">Weather Policy</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Events continue rain or shine unless severe weather threatens safety</li>
                      <li>• Designated covered areas available during inclement weather</li>
                      <li>• Weather updates provided via app and announcements</li>
                      <li>• Refunds not available due to weather (except extreme conditions)</li>
                      <li>• Bring appropriate rain gear for outdoor events</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Consequences Tab */}
          <TabsContent value="consequences" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold mb-4">Rule Violation Consequences</h2>
              <p className="text-muted-foreground">
                Understanding the consequences helps maintain a positive environment for everyone
              </p>
            </div>

            <div className="space-y-6">
              {consequences.map((level, index) => (
                <Card key={index} className={`border-l-4 ${
                  level.color === 'red' ? 'border-l-red-500' :
                  level.color === 'orange' ? 'border-l-orange-500' :
                  'border-l-yellow-500'
                }`}>
                  <CardHeader>
                    <CardTitle className={`text-lg ${
                      level.color === 'red' ? 'text-red-900' :
                      level.color === 'orange' ? 'text-orange-900' :
                      'text-yellow-900'
                    }`}>
                      {level.violation}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-medium">Possible Consequences:</h4>
                      <ul className="space-y-2">
                        {level.consequences.map((consequence, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <XCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                              level.color === 'red' ? 'text-semantic-error' :
                              level.color === 'orange' ? 'text-semantic-warning' :
                              'text-semantic-warning'
                            }`}/>
                            <span className="text-sm">{consequence}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4"/>
              <AlertTitle className="text-red-900">Zero Tolerance Policy</AlertTitle>
              <AlertDescription className="text-red-800">
                Serious violations including violence, illegal substances, or severe harassment
                will result in immediate permanent bans and potential legal action.
                We work closely with local law enforcement for such incidents.
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-display font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Common questions about our rules and policies
              </p>
            </div>

            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="re-entry">
                <AccordionTrigger>Can I leave and come back to the event?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-3">
                    Re-entry policies vary by event and venue. Most events allow re-entry during daytime hours
                    with proper wristband verification. Some evening or multi-day events may not permit re-entry.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Check your ticket confirmation for specific re-entry policies</li>
                    <li>• Keep your wristband secure and visible</li>
                    <li>• Some venues require additional security checks for re-entry</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="medical">
                <AccordionTrigger>What if I need medical assistance?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-3">
                    Medical assistance is available throughout the event. Look for medical tents marked with
                    red crosses, or ask any staff member for help.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Medical stations are staffed 24/7 during events</li>
                    <li>• Emergency services can be reached by contacting any staff member</li>
                    <li>• Bring personal medications and medical information</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="prohibited-items">
                <AccordionTrigger>What items are prohibited?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-3">
                    Weapons, illegal substances, professional recording equipment, outside food/beverage,
                    and large bags/backpacks are generally prohibited.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Prohibited items will be confiscated and not returned</li>
                    <li>• Some items may be stored at the gate for pickup at event end</li>
                    <li>• Clear bags under 12&quot;x12&quot; may be permitted for some events</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="children">
                <AccordionTrigger>Are children allowed at events?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-3">
                    Most events are all-ages, but some content may not be suitable for young children.
                    Parents should use discretion.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Children under 5 may enter free with a ticketed adult</li>
                    <li>• Age-restricted areas are clearly marked</li>
                    <li>• ID may be required for alcohol service areas</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="photography">
                <AccordionTrigger>Can I take photos and videos?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-3">
                    Personal photography for non-commercial use is generally allowed. Professional
                    equipment and commercial photography require special permission.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• No flash photography during performances</li>
                    <li>• Respect other attendees&apos; privacy</li>
                    <li>• Drone photography is not permitted</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="refunds">
                <AccordionTrigger>What is the refund policy?</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-3">
                    Refunds are available up to 48 hours before the event for most tickets.
                    Event cancellations due to weather or other factors follow venue-specific policies.
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Rule violations do not qualify for refunds</li>
                    <li>• Medical emergencies may qualify for partial refunds</li>
                    <li>• Contact customer service for specific refund requests</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </TabsContent>
        </Tabs>

        {/* Contact Support */}
        <section className="mt-12">
          <Card className="bg-gradient-to-r from-accent-primary/5 to-accent-secondary/5 border-accent-primary/20">
            <CardContent className="p-8">
              <div className="text-center">
                <Scale className="h-12 w-12 mx-auto mb-4 text-accent-primary"/>
                <h3 className="text-2xl font-display font-bold mb-4">Questions About Our Rules?</h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Our team is here to help clarify any questions about event rules and policies.
                  We want to ensure you have a clear understanding of our expectations.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link href="/contact">
                      <Mail className="h-4 w-4 mr-2"/>
                      Contact Support
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/support">
                      <Phone className="h-4 w-4 mr-2"/>
                      Live Chat
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t py-12 px-4 mt-16">
        <div className="container mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 G H X S T S H I P Industries LLC. ATLVS + GVTEWAY Events.</p>
            <p className="text-sm mt-2">
              Creating safe, inclusive, and memorable experiences for everyone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
