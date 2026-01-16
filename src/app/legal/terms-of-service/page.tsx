
'use client'


import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Header } from "@/lib/design-system"
import { FileText, Download, Printer, Eye, Clock, Shield, AlertTriangle, Info, CheckCircle, ExternalLink } from "lucide-react"

interface DocumentVersion {
  version: string
  date: string
  changes: string
  isCurrent: boolean
}

interface LegalSection {
  id: string
  title: string
  content: string
  subsections?: {
    title: string
    content: string
  }[]
}

export default function TermsOfServicePage() {
  const [selectedVersion, setSelectedVersion] = useState("current")
  const [showFullDocument, setShowFullDocument] = useState(false)

  const documentVersions: DocumentVersion[] = [
    {
      version: "2.1.0",
      date: "January 15, 2026",
      changes: "Updated privacy policy references and added AI service terms",
      isCurrent: true
    },
    {
      version: "2.0.1",
      date: "October 10, 2025",
      changes: "Minor clarifications to payment terms and refund policies",
      isCurrent: false
    },
    {
      version: "2.0.0",
      date: "July 1, 2025",
      changes: "Major update including new membership tiers and service expansions",
      isCurrent: false
    },
    {
      version: "1.5.0",
      date: "March 15, 2025",
      changes: "Added international travel terms and currency handling",
      isCurrent: false
    }
  ]

  const legalSections: LegalSection[] = [
    {
      id: "acceptance",
      title: "1. Acceptance of Terms",
      content: `By accessing and using the ATLVS + GVTEWAY platform ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`,
      subsections: [
        {
          title: "Binding Agreement",
          content: "This agreement constitutes a legally binding contract between you and G H X S T S H I P Industries LLC."
        },
        {
          title: "Age Requirements",
          content: "You must be at least 18 years old or have parental consent to use our services."
        }
      ]
    },
    {
      id: "services",
      title: "2. Description of Services",
      content: `ATLVS + GVTEWAY provides cultural experience booking, travel planning, membership services, and related digital content. Our platform connects users with authentic cultural experiences worldwide.`,
      subsections: [
        {
          title: "Experience Booking",
          content: "Users can discover, book, and participate in curated cultural experiences and events."
        },
        {
          title: "Membership Benefits",
          content: "Members receive exclusive access to premium experiences, early booking, and special pricing."
        },
        {
          title: "Travel Services",
          content: "AI-powered travel planning and itinerary generation for cultural journeys."
        }
      ]
    },
    {
      id: "user-obligations",
      title: "3. User Obligations and Conduct",
      content: `Users agree to use the Service responsibly and in compliance with applicable laws. Prohibited activities include but are not limited to harassment, fraud, and violation of intellectual property rights.`,
      subsections: [
        {
          title: "Account Security",
          content: "Users are responsible for maintaining the confidentiality of their account credentials."
        },
        {
          title: "Content Standards",
          content: "All user-generated content must be respectful, accurate, and not harmful."
        },
        {
          title: "Prohibited Uses",
          content: "The Service may not be used for illegal activities, spam, or system abuse."
        }
      ]
    },
    {
      id: "payments",
      title: "4. Payment Terms",
      content: `Payment processing is handled securely through approved payment providers. All fees are clearly disclosed before purchase. Refunds are provided according to our refund policy.`,
      subsections: [
        {
          title: "Pricing",
          content: "Experience prices include all applicable taxes and fees unless otherwise noted."
        },
        {
          title: "Payment Methods",
          content: "We accept major credit cards, PayPal, and other secure payment methods."
        },
        {
          title: "Refunds",
          content: "Cancellations made 48+ hours before experience date receive full refunds."
        }
      ]
    },
    {
      id: "liability",
      title: "5. Limitation of Liability",
      content: `G H X S T S H I P Industries LLC's liability is limited to the amount paid for services. We are not liable for indirect damages or circumstances beyond our reasonable control.`,
      subsections: [
        {
          title: "Service Interruptions",
          content: "We are not liable for temporary service interruptions due to maintenance or technical issues."
        },
        {
          title: "Third-Party Services",
          content: "We are not responsible for the actions or services provided by third-party experience providers."
        }
      ]
    },
    {
      id: "termination",
      title: "6. Termination",
      content: `Either party may terminate this agreement. We reserve the right to suspend or terminate accounts that violate these terms.`,
      subsections: [
        {
          title: "Account Suspension",
          content: "Accounts may be suspended for policy violations pending investigation."
        },
        {
          title: "Data Retention",
          content: "User data is retained according to our privacy policy after account termination."
        }
      ]
    },
    {
      id: "disclaimers",
      title: "7. Disclaimers",
      content: `The Service is provided "as is" without warranties. We do not guarantee the availability or quality of third-party experiences.`,
      subsections: [
        {
          title: "Experience Quality",
          content: "While we vet all experiences, individual experiences may vary in quality."
        },
        {
          title: "Travel Risks",
          content: "Users assume all risks associated with travel and cultural experiences."
        }
      ]
    },
    {
      id: "governing-law",
      title: "8. Governing Law",
      content: `This agreement is governed by the laws of the State of Colorado, United States. Any disputes will be resolved through binding arbitration.`,
      subsections: [
        {
          title: "Jurisdiction",
          content: "Legal proceedings must be initiated in Boulder County, Colorado."
        },
        {
          title: "Arbitration",
          content: "Disputes will be resolved through the American Arbitration Association."
        }
      ]
    }
  ]

  const currentVersion = documentVersions.find(v => v.isCurrent)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <section className="relative py-16 px-4 bg-gradient-to-br from-accent-primary/10 via-accent-secondary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-primary/20 rounded-full mb-4">
              <FileText className="h-8 w-8 text-accent-primary"/>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
              Please read these terms carefully before using our services
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                <CheckCircle className="h-5 w-5 mr-2"/>
                I Accept These Terms
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Download className="h-5 w-5 mr-2"/>
                Download PDF
              </Button>
            </div>
          </div>

          {/* Document Info */}
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-accent-primary mb-1">
                    {currentVersion?.version}
                  </div>
                  <div className="text-sm text-muted-foreground">Current Version</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent-secondary mb-1">
                    {new Date(currentVersion?.date || '').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="text-sm text-muted-foreground">Last Updated</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent-tertiary mb-1">
                    English
                  </div>
                  <div className="text-sm text-muted-foreground">Primary Language</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Important Notice */}
        <Alert className="mb-8 border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4"/>
          <AlertTitle className="text-orange-900">Important Notice</AlertTitle>
          <AlertDescription className="text-orange-800">
            These terms constitute a legally binding agreement. By using our services, you agree to be bound by these terms.
            If you do not agree, please discontinue use of our platform.
          </AlertDescription>
        </Alert>

        {/* Version Selector */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Select value={selectedVersion} onValueChange={setSelectedVersion}>
              <SelectTrigger className="w-32">
                <SelectValue/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Version</SelectItem>
                {documentVersions.filter(v => !v.isCurrent).map((version) => (
                  <SelectItem key={version.version} value={version.version}>
                    v{version.version}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4"/>
              <span>Last updated: {currentVersion?.date}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2"/>
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2"/>
              Export
            </Button>
          </div>
        </div>

        {/* Document Content */}
        <Tabs value={showFullDocument ? "full" : "summary"} onValueChange={(value) => setShowFullDocument(value === "full")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="summary">Quick Summary</TabsTrigger>
            <TabsTrigger value="full">Full Document</TabsTrigger>
          </TabsList>

          {/* Summary View */}
          <TabsContent value="summary" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Terms Summary</CardTitle>
                <CardDescription>
                  Important highlights from our terms of service
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-semantic-success mt-0.5 flex-shrink-0"/>
                    <div>
                      <h4 className="font-semibold">Service Usage</h4>
                      <p className="text-sm text-muted-foreground">
                        You must be 18+ and agree to use our platform responsibly for booking cultural experiences.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-accent-primary mt-0.5 flex-shrink-0"/>
                    <div>
                      <h4 className="font-semibold">Account Security</h4>
                      <p className="text-sm text-muted-foreground">
                        You are responsible for maintaining your account credentials and all activities under your account.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-semantic-warning mt-0.5 flex-shrink-0"/>
                    <div>
                      <h4 className="font-semibold">Payment Terms</h4>
                      <p className="text-sm text-muted-foreground">
                        All bookings are final 48 hours before the experience. Refunds available for cancellations made earlier.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-semantic-error mt-0.5 flex-shrink-0"/>
                    <div>
                      <h4 className="font-semibold">Liability Limitations</h4>
                      <p className="text-sm text-muted-foreground">
                        Our liability is limited to the amount paid for services. We are not responsible for third-party actions.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Changes</CardTitle>
                <CardDescription>
                  Updates to our terms in the current version
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documentVersions.slice(0, 3).map((version) => (
                    <div key={version.version} className="flex items-start gap-3">
                      <Badge variant={version.isCurrent ? "default" : "secondary"} className="mt-1">
                        v{version.version}
                      </Badge>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{version.date}</span>
                          {version.isCurrent && (
                            <Badge className="bg-semantic-success/10 text-green-800 text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{version.changes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button onClick={() => setShowFullDocument(true)} size="lg">
                <Eye className="h-4 w-4 mr-2"/>
                Read Full Terms
              </Button>
            </div>
          </TabsContent>

          {/* Full Document View */}
          <TabsContent value="full" className="space-y-6">
            <Alert>
              <Info className="h-4 w-4"/>
              <AlertDescription>
                This is the complete terms of service document. For easier reading, use the summary view above.
              </AlertDescription>
            </Alert>

            <Accordion type="single" collapsible className="space-y-4">
              {legalSections.map((section) => (
                <AccordionItem key={section.id} value={section.id}>
                  <AccordionTrigger className="text-left">
                    <div>
                      <div className="font-semibold">{section.title}</div>
                      <div className="text-sm text-muted-foreground font-normal">
                        {section.content.substring(0, 100)}...
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="prose prose-sm max-w-none">
                        <p>{section.content}</p>
                      </div>

                      {section.subsections && (
                        <div className="space-y-3">
                          {section.subsections.map((subsection, index) => (
                            <div key={index} className="border-l-2 border-accent-primary/20 pl-4">
                              <h4 className="font-semibold text-accent-primary mb-2">
                                {subsection.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {subsection.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            {/* Document Footer */}
            <Card className="bg-muted/20">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                    <span>Version: {currentVersion?.version}</span>
                    <span>•</span>
                    <span>Effective: {currentVersion?.date}</span>
                    <span>•</span>
                    <span>Last reviewed: January 15, 2026</span>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p>
                      For questions about these terms, please contact our legal team at{' '}
                      <Link href="mailto:legal@atlvs.com" className="text-accent-primary hover:underline">
                        legal@atlvs.com
                      </Link>
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2"/>
                      Privacy Policy
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-2"/>
                      Acceptable Use Policy
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="border-t py-12 px-4 mt-16">
        <div className="container mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 G H X S T S H I P Industries LLC. ATLVS + GVTEWAY Legal.</p>
            <p className="text-sm mt-2">
              These terms are governed by the laws of Colorado, United States.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
