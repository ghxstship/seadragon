'use client'


import { useState, useEffect, useMemo, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { logger } from "@/lib/logger"
import { Search, HelpCircle, MessageSquare, Phone, Mail, ArrowLeft, ThumbsUp, ThumbsDown, ExternalLink, Filter } from "lucide-react"

interface FAQApiResponse {
  id: string | number
  question?: string
  answer?: string
  category?: string
  tags?: string[]
  helpful?: number
  not_helpful?: number
  updated_at?: string
  created_at?: string
  related_questions?: string[]
}

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
  helpful: number
  notHelpful: number
  lastUpdated: Date
  relatedQuestions?: string[]
}

interface EventFAQProps {
  params: Promise<{ slug: string }>
}

export default function FAQ({ params }: EventFAQProps) {
  const { slug } = use(params)
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("relevance")
  const [showContactForm, setShowContactForm] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })

  const eventName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "tickets", label: "Tickets & Booking" },
    { value: "venue", label: "Venue & Location" },
    { value: "accessibility", label: "Accessibility" },
    { value: "policies", label: "Policies & Rules" },
    { value: "experience", label: "Event Experience" },
    { value: "technical", label: "Technical Support" }
  ]

  const sortOptions = [
    { value: "relevance", label: "Most Relevant" },
    { value: "helpful", label: "Most Helpful" },
    { value: "recent", label: "Recently Updated" },
    { value: "alphabetical", label: "A-Z" }
  ]

  useEffect(() => {
    let cancelled = false

    const loadFaqs = async () => {
      try {
        const res = await fetch(`/api/v1/events/${slug}/faq`)
        if (res.ok) {
          const data = await res.json()
          const faqsData = Array.isArray(data.faqs) ? data.faqs : []
          const mapped: FAQ[] = faqsData.map((f: FAQApiResponse) => ({
            id: String(f.id),
            question: String(f.question || ''),
            answer: String(f.answer || ''),
            category: String(f.category || 'experience'),
            tags: Array.isArray(f.tags) ? f.tags : [],
            helpful: Number(f.helpful) || 0,
            notHelpful: Number(f.not_helpful) || 0,
            lastUpdated: new Date(f.updated_at || f.created_at || new Date()),
            relatedQuestions: Array.isArray(f.related_questions) ? f.related_questions : undefined
          }))
          if (!cancelled) {
            setFaqs(mapped)
          }
        } else {
          if (!cancelled) {
            setFaqs([])
          }
        }
      } catch (error) {
        logger.error('Error loading FAQs:', error)
        if (!cancelled) {
          setFaqs([])
        }
      }
    }

    loadFaqs()

    return () => { cancelled = true }
  }, [slug])

  // Filter and sort FAQs
  const filteredAndSortedFAQs = useMemo(() => {
    let filtered = faqs

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(faq => faq.category === selectedCategory)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "helpful":
          return (b.helpful - b.notHelpful) - (a.helpful - a.notHelpful)
        case "recent":
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        case "alphabetical":
          return a.question.localeCompare(b.question)
        case "relevance":
        default:
          // For relevance, prioritize by helpfulness and recency
          const aScore = (a.helpful - a.notHelpful) + (new Date(a.lastUpdated).getTime() / 1000000000)
          const bScore = (b.helpful - b.notHelpful) + (new Date(b.lastUpdated).getTime() / 1000000000)
          return bScore - aScore
      }
    })

    return filtered
  }, [faqs, searchQuery, selectedCategory, sortBy])

  const handleFeedback = (faqId: string, isHelpful: boolean) => {
    setFaqs(prev => prev.map(faq =>
      faq.id === faqId
        ? {
            ...faq,
            helpful: isHelpful ? faq.helpful + 1 : faq.helpful,
            notHelpful: !isHelpful ? faq.notHelpful + 1 : faq.notHelpful
          }
        : faq
    ))
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In real app, this would submit to API
    alert("Thank you for your question. We'll get back to you within 24 hours.")
    setShowContactForm(false)
    setContactForm({ name: "", email: "", subject: "", message: "" })
  }

  const getCategoryStats = () => {
    const stats: { [key: string]: number } = {}
    categories.forEach(cat => {
      if (cat.value === "all") return
      stats[cat.value] = faqs.filter(faq => faq.category === cat.value).length
    })
    return stats
  }

  const categoryStats = getCategoryStats()
  const totalFAQs = faqs.length
  const averageHelpfulRating = faqs.length > 0
    ? faqs.reduce((sum, faq) => sum + (faq.helpful / (faq.helpful + faq.notHelpful || 1)), 0) / faqs.length
    : 0

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
            <Link href="/events" className="hover:text-foreground">Events</Link>
            <span>/</span>
            <Link href={`/events/${slug}`} className="hover:text-foreground">{eventName}</Link>
            <span>/</span>
            <span className="text-foreground font-medium">FAQ</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-accent-secondary/10 via-accent-primary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-primary/20 rounded-full mb-6">
              <HelpCircle className="h-8 w-8 text-accent-primary"/>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              {eventName} FAQ
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Find answers to the most frequently asked questions about {eventName}.
              Can't find what you're looking for? Contact our support team.
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5"/>
                <Input
                  placeholder="Search FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 text-lg"/>
              </div>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-primary mb-1">{totalFAQs}</div>
                <div className="text-sm text-muted-foreground">Total FAQs</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-primary mb-1">
                  {categories.length - 1}
                </div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-primary mb-1">
                  {(averageHelpfulRating * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-muted-foreground">Helpful Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-primary mb-1">
                  {faqs.reduce((sum, faq) => sum + faq.helpful, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Helpful Votes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2"/>
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label} {cat.value !== "all" && `(${categoryStats[cat.value] || 0})`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue/>
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Category Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(categoryStats).map(([category, count]) => {
                    const categoryInfo = categories.find(c => c.value === category)
                    return (
                      <div key={slug} className="flex justify-between items-center">
                        <span className="text-sm">{categoryInfo?.label}</span>
                        <Badge variant="secondary">{count}</Badge>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2"/>
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Can't find the answer you're looking for?
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowContactForm(!showContactForm)}
                >
                  <Mail className="h-4 w-4 mr-2"/>
                  Contact Support
                </Button>

                <div className="pt-3 border-t space-y-2">
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-muted-foreground"/>
                    <span>1-800-EVENTS</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground"/>
                    <span>support@atlvs.com</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Links */}
            <Card>
              <CardHeader>
                <CardTitle>Related Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href={`/events/${slug}/accessibility`}>
                    <ExternalLink className="h-4 w-4 mr-2"/>
                    Accessibility Information
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href={`/events/${slug}/tickets`}>
                    <ExternalLink className="h-4 w-4 mr-2"/>
                    Ticket Information
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link href={`/events/${slug}/travel`}>
                    <ExternalLink className="h-4 w-4 mr-2"/>
                    Travel & Directions
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Contact Form */}
            {showContactForm && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>
                    Send us your question and we'll get back to you within 24 hours.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Name</label>
                        <Input
                          value={contactForm.name}
                          onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                          required/>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Email</label>
                        <Input
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                          required/>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Subject</label>
                      <Input
                        value={contactForm.subject}
                        onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                        required/>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Message</label>
                      <Textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                        rows={4}
                        required/>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setShowContactForm(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Send Message</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredAndSortedFAQs.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <HelpCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground"/>
                    <h3 className="text-lg font-semibold mb-2">
                      {searchQuery ? 'No FAQs found' : 'No FAQs available'}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery
                        ? 'Try adjusting your search terms or filters.'
                        : 'Check back later for frequently asked questions.'
                      }
                    </p>
                    {!searchQuery && (
                      <Button onClick={() => setShowContactForm(true)}>
                        Ask a Question
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Accordion type="single" collapsible className="space-y-4">
                  {filteredAndSortedFAQs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg">
                      <AccordionTrigger className="px-6 py-4 hover:no-underline">
                        <div className="flex items-start justify-between w-full text-left">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{faq.question}</h3>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Badge variant="outline" className="text-xs">
                                {categories.find(c => c.value === faq.category)?.label}
                              </Badge>
                              <span>Updated {new Date(faq.lastUpdated).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <div className="text-sm text-muted-foreground">
                              {faq.helpful} helpful
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <div className="pt-4 border-t">
                          <p className="text-muted-foreground mb-4 leading-relaxed">
                            {faq.answer}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mb-4">
                            {faq.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          {/* Feedback */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <span className="text-sm text-muted-foreground">Was this helpful?</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleFeedback(faq.id, true)}
                              >
                                <ThumbsUp className="h-4 w-4 mr-1"/>
                                Yes ({faq.helpful})
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleFeedback(faq.id, false)}
                              >
                                <ThumbsDown className="h-4 w-4 mr-1"/>
                                No ({faq.notHelpful})
                              </Button>
                            </div>

                            <Button variant="ghost" size="sm">
                              Report Issue
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              Still have questions? Our support team is here to help.
            </p>
            <div className="flex justify-center space-x-6">
              <Button variant="outline" asChild>
                <Link href={`/events/${slug}`}>
                  <ArrowLeft className="h-4 w-4 mr-2"/>
                  Back to Event
                </Link>
              </Button>
              <Button onClick={() => setShowContactForm(true)}>
                <MessageSquare className="h-4 w-4 mr-2"/>
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
