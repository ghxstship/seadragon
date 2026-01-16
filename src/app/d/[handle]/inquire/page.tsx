
'use client'

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { logger } from "@/lib/logger"
import { ArrowLeft, Calendar, Users, MapPin, Phone, Mail, MessageSquare, Clock, CheckCircle } from "lucide-react"

interface DestinationInquirePageProps {
  params: Promise<{ handle: string }>
}

interface DestinationData {
  handle: string
  name: string
  contact: { phone: string; email: string; responseTime: string }
  spaces: Array<{ id: string; name: string; capacity: string }>
}

export default function DestinationInquirePage({ params }: DestinationInquirePageProps) {
  const { handle } = use(params)
  const [destination, setDestination] = useState<DestinationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [inquiryType, setInquiryType] = useState('')
  const [eventDetails, setEventDetails] = useState({
    eventType: '',
    guestCount: '',
    preferredDate: '',
    preferredTime: '',
    duration: '',
    selectedSpace: '',
    budget: '',
    specialRequests: ''
  })
  const [contactInfo, setContactInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    title: ''
  })
  const [preferences, setPreferences] = useState({
    newsletter: false,
    followUp: true,
    virtualTour: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Extract handle from params
  useEffect(() => {
  }, [params])

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
              contact: dest.contact || { phone: '', email: '', responseTime: 'Contact for details' },
              spaces: dest.spaces || []
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
        <div className="animate-pulse text-muted-foreground">Loading...</div>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      // In real app, redirect to confirmation page
      alert('Inquiry submitted successfully! We\'ll get back to you within ' + destination.contact.responseTime + '.')
    }, 2000)
  }

  const canSubmit = contactInfo.firstName && contactInfo.lastName && contactInfo.email && inquiryType

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Inquiry Header */}
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
                <h1 className="text-2xl font-display font-bold">Inquire About {destination.name}</h1>
                <p className="text-muted-foreground">Get personalized assistance for your event planning</p>
              </div>
            </div>
          </div>

          {/* Response Time */}
          <Card className="max-w-md">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-accent-primary"/>
                <div>
                  <div className="font-medium">Response Time</div>
                  <div className="text-sm text-muted-foreground">{destination.contact.responseTime}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Inquiry Type */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">What type of inquiry is this?</CardTitle>
                <CardDescription>Help us understand how we can best assist you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="inquiryType">Inquiry Type *</Label>
                    <Select value={inquiryType} onValueChange={setInquiryType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select inquiry type"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="availability">Check Availability</SelectItem>
                        <SelectItem value="pricing">Get Pricing Quote</SelectItem>
                        <SelectItem value="planning">Event Planning Consultation</SelectItem>
                        <SelectItem value="tour">Schedule Facility Tour</SelectItem>
                        <SelectItem value="wedding">Wedding Planning</SelectItem>
                        <SelectItem value="corporate">Corporate Event</SelectItem>
                        <SelectItem value="private">Private Event</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Event Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Event Details</CardTitle>
                <CardDescription>Tell us about your event (optional, but helpful)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="eventType">Event Type</Label>
                    <Select value={eventDetails.eventType} onValueChange={(value) => setEventDetails(prev => ({ ...prev, eventType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Wedding, corporate, etc."/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wedding">Wedding</SelectItem>
                        <SelectItem value="corporate">Corporate Event</SelectItem>
                        <SelectItem value="birthday">Birthday Party</SelectItem>
                        <SelectItem value="anniversary">Anniversary</SelectItem>
                        <SelectItem value="conference">Conference</SelectItem>
                        <SelectItem value="concert">Concert/Performance</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="guestCount">Expected Guest Count</Label>
                    <Select value={eventDetails.guestCount} onValueChange={(value) => setEventDetails(prev => ({ ...prev, guestCount: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Number of guests"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10-25">10-25 guests</SelectItem>
                        <SelectItem value="25-50">25-50 guests</SelectItem>
                        <SelectItem value="50-100">50-100 guests</SelectItem>
                        <SelectItem value="100-250">100-250 guests</SelectItem>
                        <SelectItem value="250-500">250-500 guests</SelectItem>
                        <SelectItem value="500+">500+ guests</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="preferredDate">Preferred Date</Label>
                    <Input
                      id="preferredDate"
                      type="date"
                      value={eventDetails.preferredDate}
                      onChange={(e) => setEventDetails(prev => ({ ...prev, preferredDate: e.target.value }))}/>
                  </div>

                  <div>
                    <Label htmlFor="preferredTime">Preferred Time</Label>
                    <Select value={eventDetails.preferredTime} onValueChange={(value) => setEventDetails(prev => ({ ...prev, preferredTime: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (9 AM - 12 PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12 PM - 5 PM)</SelectItem>
                        <SelectItem value="evening">Evening (5 PM - 10 PM)</SelectItem>
                        <SelectItem value="overnite">Overnight Event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="duration">Event Duration</Label>
                    <Select value={eventDetails.duration} onValueChange={(value) => setEventDetails(prev => ({ ...prev, duration: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="How long is your event?"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2-4">2-4 hours</SelectItem>
                        <SelectItem value="4-8">4-8 hours</SelectItem>
                        <SelectItem value="full-day">Full day (8+ hours)</SelectItem>
                        <SelectItem value="multi-day">Multi-day event</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="selectedSpace">Preferred Space</Label>
                    <Select value={eventDetails.selectedSpace} onValueChange={(value) => setEventDetails(prev => ({ ...prev, selectedSpace: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Any specific space?"/>
                      </SelectTrigger>
                      <SelectContent>
                        {destination.spaces.map((space) => (
                          <SelectItem key={space.id} value={space.id}>
                            {space.name} ({space.capacity})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="budget">Budget Range (Optional)</Label>
                  <Select value={eventDetails.budget} onValueChange={(value) => setEventDetails(prev => ({ ...prev, budget: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5000-10000">$5,000 - $10,000</SelectItem>
                      <SelectItem value="10000-25000">$10,000 - $25,000</SelectItem>
                      <SelectItem value="25000-50000">$25,000 - $50,000</SelectItem>
                      <SelectItem value="50000-100000">$50,000 - $100,000</SelectItem>
                      <SelectItem value="100000+">$100,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mt-4">
                  <Label htmlFor="specialRequests">Special Requests or Requirements</Label>
                  <Textarea
                    id="specialRequests"
                    rows={4}
                    value={eventDetails.specialRequests}
                    onChange={(e) => setEventDetails(prev => ({ ...prev, specialRequests: e.target.value }))}
                    placeholder="Any special requirements, accessibility needs, dietary restrictions, or other details..."/>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Contact Information</CardTitle>
                <CardDescription>We need this information to respond to your inquiry</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={contactInfo.firstName}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, firstName: e.target.value }))}
                      required/>
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={contactInfo.lastName}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, lastName: e.target.value }))}
                      required/>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactInfo.email}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, email: e.target.value }))}
                      required/>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={contactInfo.phone}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}/>
                  </div>

                  <div>
                    <Label htmlFor="organization">Organization</Label>
                    <Input
                      id="organization"
                      value={contactInfo.organization}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, organization: e.target.value }))}
                      placeholder="Company or organization name"/>
                  </div>

                  <div>
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      value={contactInfo.title}
                      onChange={(e) => setContactInfo(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Your job title"/>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Communication Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="followUp"
                    checked={preferences.followUp}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, followUp: checked as boolean }))}/>
                  <Label htmlFor="followUp">I would like a follow-up call to discuss my inquiry</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="newsletter"
                    checked={preferences.newsletter}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, newsletter: checked as boolean }))}/>
                  <Label htmlFor="newsletter">Subscribe to our newsletter for event planning tips and venue updates</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="virtualTour"
                    checked={preferences.virtualTour}
                    onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, virtualTour: checked as boolean }))}/>
                  <Label htmlFor="virtualTour">I&apos;m interested in a virtual tour of the facility</Label>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-center">
              <Button
                type="submit"
                size="lg"
                disabled={!canSubmit || isSubmitting}
                className="px-8"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"/>
                    Submitting Inquiry...
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4 mr-2"/>
                    Submit Inquiry
                  </>
                )}
              </Button>
            </div>

            {!canSubmit && (
              <p className="text-center text-sm text-muted-foreground">
                Please fill in all required fields (*) to submit your inquiry.
              </p>
            )}
          </form>

          {/* Contact Information */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-xl">Alternative Contact Methods</CardTitle>
              <CardDescription>If you prefer to speak with us directly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent-primary/10 rounded-lg flex items-center justify-center">
                    <Phone className="h-5 w-5 text-accent-primary"/>
                  </div>
                  <div>
                    <div className="font-medium">Call Us</div>
                    <div className="text-sm text-muted-foreground">{destination.contact.phone}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent-primary/10 rounded-lg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-accent-primary"/>
                  </div>
                  <div>
                    <div className="font-medium">Email Us</div>
                    <div className="text-sm text-muted-foreground">{destination.contact.email}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
