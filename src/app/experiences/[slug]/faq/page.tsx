
'use client'

import { useState, useEffect, use } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { logger } from "@/lib/logger"
import { Search, HelpCircle, MessageSquare, Phone, Mail, MapPin, Calendar, DollarSign, Users, Star, ThumbsUp, ExternalLink, Clock, Shield, AlertTriangle } from "lucide-react"

interface FAQ {
  id: string
  category: 'general' | 'booking' | 'preparation' | 'during' | 'safety' | 'practical'
  question: string
  answer: string
  tags: string[]
  helpful: number
  featured: boolean
}

interface ContactInfo {
  type: 'phone' | 'email' | 'website'
  label: string
  value: string
  available: string
}

export default function FAQ({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const experienceSlug = slug
  const experienceName = experienceSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [helpfulVotes, setHelpfulVotes] = useState<Set<string>>(new Set())

  const categories = [
    { value: "all", label: "All Questions", icon: HelpCircle },
    { value: "general", label: "General Info", icon: MessageSquare },
    { value: "booking", label: "Booking & Payment", icon: DollarSign },
    { value: "preparation", label: "Preparation", icon: Calendar },
    { value: "during", label: "During Experience", icon: Clock },
    { value: "safety", label: "Safety & Health", icon: Shield },
    { value: "practical", label: "Practical Tips", icon: AlertTriangle }
  ]

  const contactInfo: ContactInfo[] = [
    {
      type: "phone",
      label: "Experience Support Line",
      value: "1-800-EXP-" + experienceSlug.substring(0, 4).toUpperCase(),
      available: "Mon-Fri, 9AM-6PM"
    },
    {
      type: "email",
      label: "Experience Coordinator",
      value: "support@" + experienceSlug.toLowerCase() + "experience.com",
      available: "24/7 email support"
    },
    {
      type: "website",
      label: "Experience Details",
      value: "https://www." + experienceSlug.toLowerCase() + "experience.com/faq",
      available: "Always available"
    }
  ]

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const res = await fetch(`/api/v1/experiences/${experienceSlug}/faqs`)
        if (res.ok) {
          const data = await res.json()
          setFaqs(data.faqs || [])
          setFilteredFaqs(data.faqs || [])
        }
      } catch (error) {
        logger.error('Error loading FAQs:', error)
        setFaqs([])
        setFilteredFaqs([])
      }
    }

    loadFaqs()
  }, [experienceSlug])

  // Apply filters and search
  useEffect(() => {
    let filtered = faqs

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(faq => faq.category === selectedCategory)
    }

    // Sort by featured first, then by helpful votes
    filtered.sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return b.helpful - a.helpful
    })

    setFilteredFaqs(filtered)
  }, [faqs, searchQuery, selectedCategory])

  const markHelpful = (faqId: string) => {
    setHelpfulVotes(prev => {
      const newVotes = new Set(prev)
      if (newVotes.has(faqId)) {
        newVotes.delete(faqId)
        // Decrease helpful count
        setFaqs(prevFaqs =>
          prevFaqs.map(faq =>
            faq.id === faqId ? { ...faq, helpful: faq.helpful - 1 } : faq
          )
        )
      } else {
        newVotes.add(faqId)
        // Increase helpful count
        setFaqs(prevFaqs =>
          prevFaqs.map(faq =>
            faq.id === faqId ? { ...faq, helpful: faq.helpful + 1 } : faq
          )
        )
      }
      return newVotes
    })
  }

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.value === category)
    return cat ? cat.icon : HelpCircle
  }

  const featuredFaqs = faqs.filter(faq => faq.featured).slice(0, 3)

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
            <Link href="/experiences" className="hover:text-foreground">Experiences</Link>
            <span>/</span>
            <Link href={`/experiences/${slug}`} className="hover:text-foreground">{experienceName}</Link>
            <span>/</span>
            <span className="text-foreground font-medium">FAQ</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-accent-secondary/10 via-accent-primary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              {experienceName} FAQ
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Find answers to commonly asked questions about {experienceName}.
              Get all the information you need for a successful experience.
            </p>

            {/* Search */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"/>
                <Input
                  placeholder="Search frequently asked questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"/>
              </div>
            </div>
          </div>

          {/* Featured Questions */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {featuredFaqs.map((faq) => (
              <Card key={faq.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 mb-3">
                    <getCategoryIcon category={faq.category} className="h-5 w-5 text-accent-primary mt-0.5 flex-shrink-0"/>
                    <Badge variant="secondary" className="text-xs">
                      {categories.find(c => c.value === faq.category)?.label}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 mb-3">{faq.answer}</p>
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markHelpful(faq.id)}
                      className="text-xs"
                    >
                      <ThumbsUp className={`h-3 w-3 mr-1 ${helpfulVotes.has(faq.id) ? 'fill-accent-primary text-accent-primary' : ''}`}/>
                      {faq.helpful}
                    </Button>
                    <div className="flex flex-wrap gap-1">
                      {faq.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main FAQ Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between mb-8">
              <TabsList className="grid grid-cols-4 lg:grid-cols-7 w-full max-w-4xl">
                {categories.map(category => (
                  <TabsTrigger
                    key={category.value}
                    value={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className="text-xs"
                  >
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value={selectedCategory} className="mt-8">
              {filteredFaqs.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <HelpCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground"/>
                    <h3 className="text-lg font-semibold mb-2">No questions found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your search or selecting a different category.
                    </p>
                    <Button onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory("all")
                    }}>
                      Clear Search
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Accordion type="single" collapsible className="w-full space-y-4">
                  {filteredFaqs.map((faq) => (
                    <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-6">
                      <AccordionTrigger className="hover:no-underline py-6">
                        <div className="flex items-start space-x-3 text-left">
                          <getCategoryIcon category={faq.category} className="h-5 w-5 text-accent-primary mt-0.5 flex-shrink-0"/>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{faq.question}</h3>
                            <div className="flex items-center space-x-3 mt-2">
                              <Badge variant="secondary" className="text-xs">
                                {categories.find(c => c.value === faq.category)?.label}
                              </Badge>
                              {faq.featured && (
                                <Badge variant="outline" className="text-xs">
                                  Featured
                                </Badge>
                              )}
                              <div className="flex items-center text-xs text-muted-foreground">
                                <ThumbsUp className="h-3 w-3 mr-1"/>
                                {faq.helpful} helpful
                              </div>
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-6">
                        <div className="pl-8">
                          <p className="text-muted-foreground leading-relaxed mb-4">{faq.answer}</p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {faq.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markHelpful(faq.id)}
                              className={`text-sm ${helpfulVotes.has(faq.id) ? 'text-accent-primary' : ''}`}
                            >
                              <ThumbsUp className={`h-4 w-4 mr-2 ${helpfulVotes.has(faq.id) ? 'fill-current' : ''}`}/>
                              {helpfulVotes.has(faq.id) ? 'Helpful' : 'Mark as helpful'}
                            </Button>
                            <span className="text-xs text-muted-foreground">
                              Was this answer helpful?
                            </span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-display font-bold mb-4">Still Need Help?</h2>
            <p className="text-muted-foreground">
              Can&apos;t find the answer you&apos;re looking for? Our experience team is here to help.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {contactInfo.map((contact, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center">
                  {contact.type === 'phone' && <Phone className="h-8 w-8 mx-auto mb-3 text-accent-primary"/>}
                  {contact.type === 'email' && <Mail className="h-8 w-8 mx-auto mb-3 text-accent-primary"/>}
                  {contact.type === 'website' && <ExternalLink className="h-8 w-8 mx-auto mb-3 text-accent-primary"/>}

                  <h3 className="font-semibold mb-2">{contact.label}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{contact.available}</p>

                  {contact.type === 'website' ? (
                    <Button variant="outline" size="sm" asChild>
                      <a href={contact.value} target="_blank" rel="noopener noreferrer">
                        Visit Website
                      </a>
                    </Button>
                  ) : (
                    <div className="font-mono text-sm">{contact.value}</div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button size="lg">
              <MessageSquare className="h-5 w-5 mr-2"/>
              Contact Experience Team
            </Button>
          </div>
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
