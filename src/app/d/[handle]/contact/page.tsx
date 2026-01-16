
'use client'

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { logger } from "@/lib/logger"
import { ArrowLeft, MapPin, Phone, Mail, Clock, MessageSquare, Send } from "lucide-react"

interface DestinationContactPageProps {
  params: Promise<{ handle: string }>
}

interface DestinationData {
  handle: string
  name: string
  contact: {
    general: { email: string; phone: string; address: string }
    [key: string]: { email: string; phone: string; address?: string }
  }
  hours: Record<string, string>
  responseTime: string
  emergencyContact: string
}

export default function DestinationContactPage({ params }: DestinationContactPageProps) {
  const { handle } = use(params)
  const [destination, setDestination] = useState<DestinationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    inquiryType: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

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
              contact: dest.contact || {
                general: { email: '', phone: '', address: '' }
              },
              hours: dest.hours || {},
              responseTime: dest.response_time || 'Contact for details',
              emergencyContact: dest.emergency_contact || ''
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
        <div className="animate-pulse text-muted-foreground">Loading contact info...</div>
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

  if (!destination) {
    notFound()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: contactForm.name,
          email: contactForm.email,
          topic: `Venue Inquiry: ${destination.name}`,
          subject: contactForm.subject,
          message: `Inquiry Type: ${contactForm.inquiryType}\nPhone: ${contactForm.phone}\n\n${contactForm.message}`,
          urgency: 'normal'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      const result = await response.json()

      // Success
      alert(`Thank you for your message! We\'ll get back to you within ${destination.responseTime}. Reference: ${result.referenceId || 'N/A'}`)

      // Reset form
      setContactForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        inquiryType: ''
      })
    } catch (error) {
      logger.error('Error submitting form:', error)
      alert('Sorry, there was an error submitting your message. Please try again or contact us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const departments = [
    { key: 'general', label: 'General Inquiry', contact: destination.contact.general },
    { key: 'events', label: 'Event Planning', contact: destination.contact.events },
    { key: 'weddings', label: 'Weddings', contact: destination.contact.weddings },
    { key: 'corporate', label: 'Corporate Events', contact: destination.contact.corporate },
    { key: 'bookings', label: 'Bookings', contact: destination.contact.bookings },
    { key: 'technical', label: 'Technical Support', contact: destination.contact.technical }
  ].filter(dept => dept.contact)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Contact Header */}
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
              <MessageSquare className="h-8 w-8 text-accent-primary"/>
              <div>
                <h1 className="text-2xl font-display font-bold">Contact {destination.name}</h1>
                <p className="text-muted-foreground">Get in touch with our team</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Information */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Get In Touch</CardTitle>
                  <CardDescription>
                    We&apos;re here to help with all your event planning needs. Response time: {destination.responseTime}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-accent-primary mt-1 flex-shrink-0"/>
                    <div>
                      <div className="font-medium">Address</div>
                      <div className="text-muted-foreground">{destination.contact.general.address}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-accent-primary mt-1 flex-shrink-0"/>
                    <div>
                      <div className="font-medium">Phone</div>
                      <div className="text-muted-foreground">{destination.contact.general.phone}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-accent-primary mt-1 flex-shrink-0"/>
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-muted-foreground">{destination.contact.general.email}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Department Contacts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Department Contacts</CardTitle>
                  <CardDescription>Contact the right team for your specific needs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departments.map((dept) => (
                      <div key={dept.key} className="flex items-start justify-between p-4 border rounded-lg">
                        <div>
                          <div className="font-medium">{dept.label}</div>
                          <div className="text-sm text-muted-foreground">{dept.contact.email}</div>
                          {dept.contact.phone && (
                            <div className="text-sm text-muted-foreground">{dept.contact.phone}</div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={`mailto:${dept.contact.email}`}>
                              <Mail className="h-3 w-3"/>
                            </a>
                          </Button>
                          {dept.contact.phone && (
                            <Button variant="outline" size="sm" asChild>
                              <a href={`tel:${dept.contact.phone}`}>
                                <Phone className="h-3 w-3"/>
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Business Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {Object.entries(destination.hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="capitalize">{day}</span>
                        <span className={hours === 'Closed' ? 'text-semantic-error' : 'text-muted-foreground'}>
                          {hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Contact */}
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-4 w-4 text-amber-600"/>
                    </div>
                    <div>
                      <div className="font-medium text-amber-900">Emergency Contact</div>
                      <div className="text-sm text-amber-700">{destination.emergencyContact}</div>
                      <div className="text-xs text-amber-600 mt-1">
                        For urgent matters during events
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we&apos;ll get back to you as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                          required/>
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                          required/>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm(prev => ({ ...prev, phone: e.target.value }))}/>
                      </div>

                      <div>
                        <Label htmlFor="inquiryType">Inquiry Type</Label>
                        <Select
                          id="inquiryType"
                          value={contactForm.inquiryType}
                          onChange={(e) => setContactForm(prev => ({ ...prev, inquiryType: e.target.value }))}
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        >
                          <SelectItem value="">Select inquiry type</SelectItem>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="availability">Check Availability</SelectItem>
                          <SelectItem value="pricing">Pricing Information</SelectItem>
                          <SelectItem value="planning">Event Planning</SelectItem>
                          <SelectItem value="wedding">Wedding</SelectItem>
                          <SelectItem value="corporate">Corporate Event</SelectItem>
                          <SelectItem value="tour">Facility Tour</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Brief description of your inquiry"
                        required/>
                    </div>

                    <div>
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        rows={6}
                        value={contactForm.message}
                        onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                        placeholder="Please provide details about your event, date preferences, guest count, and any specific requirements..."
                        required/>
                    </div>

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"/>
                          Sending Message...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2"/>
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Alternative Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Quick Contact Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-auto p-4" asChild>
                      <a href={`tel:${destination.contact.general.phone}`}>
                        <div className="text-center">
                          <Phone className="h-6 w-6 mx-auto mb-2"/>
                          <div className="font-medium">Call Us</div>
                          <div className="text-sm text-muted-foreground">{destination.contact.general.phone}</div>
                        </div>
                      </a>
                    </Button>

                    <Button variant="outline" className="h-auto p-4" asChild>
                      <a href={`mailto:${destination.contact.general.email}`}>
                        <div className="text-center">
                          <Mail className="h-6 w-6 mx-auto mb-2"/>
                          <div className="font-medium">Email Us</div>
                          <div className="text-sm text-muted-foreground">{destination.contact.general.email}</div>
                        </div>
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
