
'use client'

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { logger } from "@/lib/logger"
import { ArrowLeft, Search, MessageSquare, Phone, Mail, HelpCircle, Calendar, Users, DollarSign, MapPin } from "lucide-react"

interface DestinationFaqPageProps {
  params: Promise<{ handle: string }>
}

interface FaqItem {
  id: string
  category: string
  question: string
  answer: string
}

interface DestinationData {
  handle: string
  name: string
  faqs: FaqItem[]
  categories: string[]
  contact: { email: string; phone: string; hours: string }
}

export default function DestinationFaqPage({ params }: DestinationFaqPageProps) {
  const { handle } = use(params)
  const [destination, setDestination] = useState<DestinationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Fetch destination data from API
  useEffect(() => {
    if (!handle) return
    const fetchDestination = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/v1/destinations/${handle}`)
        if (res.ok) {
          const data = await res.json()
          const dest = data.destination || data.data?.destination
          if (dest) {
            setDestination({
              handle: dest.handle || handle,
              name: dest.name || 'Destination',
              faqs: dest.faqs || [],
              categories: dest.faq_categories || [],
              contact: dest.contact || { email: '', phone: '', hours: '' }
            })
          }
        }
      } catch (error) {
        logger.error('Error fetching destination:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDestination()
  }, [handle])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading FAQs...</div>
      </div>
    )
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Destination Not Found</h1>
          <p className="text-muted-foreground">The destination @{handle} does not exist.</p>
          <Link href="/" className="text-accent-primary mt-4 inline-block">Go Home</Link>
        </div>
      </div>
    )
  }

  const filteredFaqs = destination.faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* FAQ Header */}
      <section className="py-8 px-4 bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/d/${handle}`}>
                <ArrowLeft className="h-4 w-4 mr-2"/>
                Back to Destination
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <HelpCircle className="h-8 w-8 text-accent-primary"/>
              <div>
                <h1 className="text-2xl font-display font-bold">{destination.name} FAQ</h1>
                <p className="text-muted-foreground">Answers to common questions about our venue</p>
              </div>
            </div>
            <Button asChild>
              <Link href={`/d/${handle}/inquire`}>
                Ask a Question
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Search and Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    <Input
                      placeholder="Search FAQs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"/>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory('all')}
                  >
                    All ({destination.faqs.length})
                  </Button>
                  {destination.categories.slice(0, 4).map((category) => {
                    const categoryFaqs = destination.faqs.filter(faq => faq.category === category)
                    return (
                      <Button
                        key={handle}
                        variant={selectedCategory === category ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {handle} ({categoryFaqs.length})
                      </Button>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ Accordion */}
          {filteredFaqs.length > 0 ? (
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFaqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-accent-primary">{faq.category}</span>
                      </div>
                      <div className="font-medium">{faq.question}</div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pt-2">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-12">
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
              <h3 className="text-lg font-semibold mb-2">No FAQs found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or category filter.
              </p>
            </div>
          )}

          {/* Popular Topics */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle className="text-xl">Popular Topics</CardTitle>
              <CardDescription>Most frequently asked questions about {destination.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {destination.faqs.slice(0, 6).map((faq) => (
                  <Link
                    key={faq.id}
                    href={`/d/${handle}/faq#${faq.id}`}
                    className="block p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-2 mb-1">
                      <HelpCircle className="h-4 w-4 text-accent-primary mt-0.5 flex-shrink-0"/>
                      <span className="text-sm font-medium line-clamp-2">{faq.question}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{faq.category}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Answers */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card>
              <CardHeader className="text-center pb-3">
                <Calendar className="h-8 w-8 text-accent-primary mx-auto mb-2"/>
                <CardTitle className="text-lg">Booking Timeline</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-sm text-muted-foreground">
                <p>Book 12-18 months in advance for peak dates</p>
                <p>6-12 months for standard dates</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center pb-3">
                <Users className="h-8 w-8 text-accent-primary mx-auto mb-2"/>
                <CardTitle className="text-lg">Group Policies</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-sm text-muted-foreground">
                <p>Minimum 10 guests for group rates</p>
                <p>Custom packages available</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center pb-3">
                <DollarSign className="h-8 w-8 text-accent-primary mx-auto mb-2"/>
                <CardTitle className="text-lg">Payment Terms</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-sm text-muted-foreground">
                <p>50% deposit to book</p>
                <p>Balance 30 days prior</p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Support */}
          <Card className="mt-12">
            <CardHeader>
              <CardTitle className="text-xl">Still Need Help?</CardTitle>
              <CardDescription>Can&apos;t find the answer you&apos;re looking for? We&apos;re here to help.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <MessageSquare className="h-8 w-8 text-accent-primary mx-auto mb-3"/>
                  <h4 className="font-semibold mb-2">Live Chat</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Get instant answers during business hours
                  </p>
                  <Button variant="outline" size="sm">
                    Start Chat
                  </Button>
                </div>
                <div className="text-center">
                  <Mail className="h-8 w-8 text-accent-primary mx-auto mb-3"/>
                  <h4 className="font-semibold mb-2">Email Support</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {destination.contact.email}
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`mailto:${destination.contact.email}`}>
                      Send Email
                    </a>
                  </Button>
                </div>
                <div className="text-center">
                  <Phone className="h-8 w-8 text-accent-primary mx-auto mb-3"/>
                  <h4 className="font-semibold mb-2">Call Us</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {destination.contact.phone}
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`tel:${destination.contact.phone}`}>
                      Call Now
                    </a>
                  </Button>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t text-center">
                <p className="text-sm text-muted-foreground">
                  <strong>Business Hours:</strong> {destination.contact.hours}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  We respond to all inquiries within 2 business hours
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
