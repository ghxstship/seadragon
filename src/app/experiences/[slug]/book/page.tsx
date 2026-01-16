
'use client'

import { useState, useEffect, use } from "react"
import { logger } from '@/lib/logger'
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { Calendar as CalendarIcon, Clock, Users, DollarSign, MapPin, Star, CheckCircle, AlertCircle, Info, CreditCard, Shield, Heart } from "lucide-react"
import { format, addDays, isBefore, startOfDay } from "date-fns"

interface Experience {
  id: string
  name: string
  description: string
  category: string
  duration: string
  basePrice: number
  currency: string
  rating: number
  reviewCount: number
  location: string
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Extreme'
  groupSize: string
  ageRange: string
  highlights: string[]
  included: string[]
  requirements: string[]
  cancellationPolicy: string
  images: string[]
  availability: {
    dates: string[]
    times: string[]
  }
}

interface BookingForm {
  date: Date | undefined
  time: string
  participants: number
  participantDetails: Array<{
    name: string
    email: string
    phone: string
    age: string
    dietaryRestrictions: string
  }>
  specialRequests: string
  agreeToTerms: boolean
  agreeToCancellation: boolean
}

export default function Book({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const experienceSlug = slug
  const experienceName = experienceSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  const [experience, setExperience] = useState<Experience | null>(null)
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    date: undefined,
    time: "",
    participants: 1,
    participantDetails: [{
      name: "",
      email: "",
      phone: "",
      age: "",
      dietaryRestrictions: ""
    }],
    specialRequests: "",
    agreeToTerms: false,
    agreeToCancellation: false
  })
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [totalPrice, setTotalPrice] = useState(0)

  // Fetch experience data from API
  const fetchExperienceData = async (slug: string): Promise<Experience | null> => {
    try {
      const response = await fetch(`/api/experiences/${slug}`)
      if (!response.ok) {
        return null
      }
      return await response.json()
    } catch (error) {
      logger.error('Error fetching experience data', error)
      return null
    }
  }

  useEffect(() => {
    let cancelled = false

    const loadExperience = async () => {
      try {
        const res = await fetch(`/api/v1/experiences/${experienceSlug}`)
        if (res.ok) {
          const data = await res.json()
          const exp = data.experience || data
          if (!cancelled && exp) {
            setExperience({
              id: String(exp.id || experienceSlug),
              name: String(exp.name || experienceName),
              description: String(exp.description || ''),
              category: String(exp.category || 'Adventure'),
              duration: String(exp.duration || '4 hours'),
              basePrice: Number(exp.price || exp.base_price || 0),
              currency: String(exp.currency || 'USD'),
              rating: Number(exp.rating || 4.5),
              reviewCount: Number(exp.review_count || 0),
              location: String(exp.location || ''),
              difficulty: exp.difficulty || 'Moderate',
              groupSize: String(exp.group_size || '1-10'),
              ageRange: String(exp.age_range || 'All ages'),
              highlights: Array.isArray(exp.highlights) ? exp.highlights : [],
              included: Array.isArray(exp.included) ? exp.included : [],
              requirements: Array.isArray(exp.requirements) ? exp.requirements : [],
              cancellationPolicy: String(exp.cancellation_policy || 'Standard cancellation policy applies.'),
              images: Array.isArray(exp.images) ? exp.images : [],
              availability: {
                dates: Array.isArray(exp.availability?.dates) ? exp.availability.dates : 
                  Array.from({ length: 30 }, (_, i) => format(addDays(new Date(), i), "yyyy-MM-dd")),
                times: Array.isArray(exp.availability?.times) ? exp.availability.times : 
                  ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"]
              }
            })
          }
        }
      } catch (error) {
        logger.error('Error loading experience:', error)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadExperience()

    return () => { cancelled = true }
  }, [experienceSlug, experienceName])

  // Update participant details when participant count changes
  useEffect(() => {
    setBookingForm(prev => ({
      ...prev,
      participantDetails: Array.from({ length: prev.participants }, (_, i) => ({
        name: prev.participantDetails[i]?.name || "",
        email: prev.participantDetails[i]?.email || "",
        phone: prev.participantDetails[i]?.phone || "",
        age: prev.participantDetails[i]?.age || "",
        dietaryRestrictions: prev.participantDetails[i]?.dietaryRestrictions || ""
      }))
    }))
  }, [bookingForm.participants])

  // Calculate total price
  useEffect(() => {
    if (experience) {
      const baseTotal = experience.basePrice * bookingForm.participants
      // Add any additional fees (service fee, taxes, etc.)
      const serviceFee = baseTotal * 0.08 // 8% service fee
      const tax = baseTotal * 0.07 // 7% tax
      setTotalPrice(baseTotal + serviceFee + tax)
    }
  }, [experience, bookingForm.participants])

  const updateParticipantDetail = (index: number, field: string, value: string) => {
    setBookingForm(prev => ({
      ...prev,
      participantDetails: prev.participantDetails.map((participant, i) =>
        i === index ? { ...participant, [field]: value } : participant
      )
    }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(bookingForm.date && bookingForm.time && bookingForm.participants > 0)
      case 2:
        return bookingForm.participantDetails.every(p =>
          p.name.trim() && p.email.trim() && p.phone.trim() && p.age.trim()
        )
      case 3:
        return bookingForm.agreeToTerms && bookingForm.agreeToCancellation
      default:
        return false
    }
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3))
    } else {
      alert("Please complete all required fields before proceeding.")
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmitBooking = () => {
    if (!validateStep(3)) {
      alert("Please agree to the terms and cancellation policy.")
      return
    }

    // In a real app, this would submit to API
    alert(`Booking confirmed for ${experienceName} on ${format(bookingForm.date!, "MMMM dd, yyyy")} at ${bookingForm.time} for ${bookingForm.participants} participant${bookingForm.participants !== 1 ? 's' : ''}. Total: $${totalPrice.toFixed(2)}`)

    // Reset form or redirect to confirmation
    setBookingForm({
      date: undefined,
      time: "",
      participants: 1,
      participantDetails: [{
        name: "",
        email: "",
        phone: "",
        age: "",
        dietaryRestrictions: ""
      }],
      specialRequests: "",
      agreeToTerms: false,
      agreeToCancellation: false
    })
    setCurrentStep(1)
  }

  if (loading || !experience) {
    return (
      <div className="min-h-screen bg-background">
        <Header/>
        <div className="container mx-auto px-4 py-20">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-muted rounded w-1/2 mx-auto"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
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
            <Link href="/experiences" className="hover:text-foreground">Experiences</Link>
            <span>/</span>
            <Link href={`/experiences/${slug}`} className="hover:text-foreground">{experienceName}</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Book</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-accent-secondary/10 via-accent-primary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Book {experienceName}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Reserve your spot for this unforgettable experience. Complete the booking process below.
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step ? 'bg-accent-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {step}
                  </div>
                  <span className={`ml-2 text-sm ${currentStep >= step ? 'text-accent-primary font-medium' : 'text-muted-foreground'}`}>
                    {step === 1 ? 'Select Date & Time' : step === 2 ? 'Participant Details' : 'Review & Confirm'}
                  </span>
                  {step < 3 && <div className="w-8 h-0.5 bg-muted mx-4"></div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Step 1: Date & Time Selection */}
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2"/>
                      Select Date & Time
                    </CardTitle>
                    <CardDescription>
                      Choose your preferred date and time for the experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-base font-semibold mb-3 block">Select Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start">
                              <CalendarIcon className="mr-2 h-4 w-4"/>
                              {bookingForm.date ? format(bookingForm.date, "MMM dd, yyyy") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={bookingForm.date}
                              onSelect={(date) => setBookingForm(prev => ({ ...prev, date }))}
                              disabled={(date) => isBefore(date, startOfDay(new Date()))}
                              initialFocus/>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label className="text-base font-semibold mb-3 block">Select Time</Label>
                        <Select value={bookingForm.time} onValueChange={(value) => setBookingForm(prev => ({ ...prev, time: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose time"/>
                          </SelectTrigger>
                          <SelectContent>
                            {experience.availability.times.map(time => (
                              <SelectItem key={time} value={time}>
                                {format(new Date(`2023-01-01T${time}`), "h:mm a")}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-semibold mb-3 block">Number of Participants</Label>
                      <Select value={bookingForm.participants.toString()} onValueChange={(value) => setBookingForm(prev => ({ ...prev, participants: parseInt(value) }))}>
                        <SelectTrigger className="w-full">
                          <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} Participant{num !== 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Participant Details */}
              {currentStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2"/>
                      Participant Details
                    </CardTitle>
                    <CardDescription>
                      Provide information for each participant
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {bookingForm.participantDetails.map((participant, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h4 className="font-semibold mb-4">Participant {index + 1}</h4>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`name-${index}`}>Full Name *</Label>
                            <Input
                              id={`name-${index}`}
                              value={participant.name}
                              onChange={(e) => updateParticipantDetail(index, 'name', e.target.value)}
                              required/>
                          </div>
                          <div>
                            <Label htmlFor={`email-${index}`}>Email Address *</Label>
                            <Input
                              id={`email-${index}`}
                              type="email"
                              value={participant.email}
                              onChange={(e) => updateParticipantDetail(index, 'email', e.target.value)}
                              required/>
                          </div>
                          <div>
                            <Label htmlFor={`phone-${index}`}>Phone Number *</Label>
                            <Input
                              id={`phone-${index}`}
                              type="tel"
                              value={participant.phone}
                              onChange={(e) => updateParticipantDetail(index, 'phone', e.target.value)}
                              required/>
                          </div>
                          <div>
                            <Label htmlFor={`age-${index}`}>Age *</Label>
                            <Input
                              id={`age-${index}`}
                              type="number"
                              value={participant.age}
                              onChange={(e) => updateParticipantDetail(index, 'age', e.target.value)}
                              required/>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Label htmlFor={`dietary-${index}`}>Dietary Restrictions (Optional)</Label>
                          <Input
                            id={`dietary-${index}`}
                            value={participant.dietaryRestrictions}
                            onChange={(e) => updateParticipantDetail(index, 'dietaryRestrictions', e.target.value)}
                            placeholder="e.g., vegetarian, allergies"/>
                        </div>
                      </div>
                    ))}

                    <div>
                      <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
                      <Textarea
                        id="specialRequests"
                        value={bookingForm.specialRequests}
                        onChange={(e) => setBookingForm(prev => ({ ...prev, specialRequests: e.target.value }))}
                        placeholder="Any special accommodations or requests..."
                        rows={3}/>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Review & Confirm */}
              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2"/>
                      Review & Confirm
                    </CardTitle>
                    <CardDescription>
                      Please review your booking details and agree to the terms
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Booking Summary */}
                    <div className="border rounded-lg p-4 bg-muted/50">
                      <h4 className="font-semibold mb-3">Booking Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Experience:</span>
                          <span className="font-medium">{experience.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Date & Time:</span>
                          <span>{bookingForm.date ? format(bookingForm.date, "MMM dd, yyyy") : ''} at {bookingForm.time ? format(new Date(`2023-01-01T${bookingForm.time}`), "h:mm a") : ''}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Participants:</span>
                          <span>{bookingForm.participants}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span>{experience.duration}</span>
                        </div>
                        <Separator className="my-2"/>
                        <div className="flex justify-between font-semibold">
                          <span>Total Price:</span>
                          <span>${totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="terms"
                          checked={bookingForm.agreeToTerms}
                          onCheckedChange={(checked) => setBookingForm(prev => ({ ...prev, agreeToTerms: checked as boolean }))}/>
                        <div className="text-sm">
                          <Label htmlFor="terms" className="font-medium cursor-pointer">
                            I agree to the Terms of Service and Privacy Policy *
                          </Label>
                          <p className="text-muted-foreground mt-1">
                            By booking, you agree to our terms and conditions governing the use of our services.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="cancellation"
                          checked={bookingForm.agreeToCancellation}
                          onCheckedChange={(checked) => setBookingForm(prev => ({ ...prev, agreeToCancellation: checked as boolean }))}/>
                        <div className="text-sm">
                          <Label htmlFor="cancellation" className="font-medium cursor-pointer">
                            I understand the cancellation policy *
                          </Label>
                          <p className="text-muted-foreground mt-1">
                            {experience.cancellationPolicy}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-3 flex items-center">
                        <CreditCard className="h-4 w-4 mr-2"/>
                        Payment Information
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        You&apos;ll be redirected to a secure payment page after confirming your booking.
                        We accept all major credit cards and PayPal.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between">
                {currentStep > 1 && (
                  <Button variant="outline" onClick={handlePrevStep}>
                    Previous
                  </Button>
                )}
                <div className="ml-auto space-x-4">
                  {currentStep < 3 ? (
                    <Button onClick={handleNextStep}>
                      Next Step
                    </Button>
                  ) : (
                    <Button onClick={handleSubmitBooking} size="lg">
                      <CreditCard className="h-4 w-4 mr-2"/>
                      Complete Booking
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Experience Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Experience Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="aspect-video bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 rounded-lg"></div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">{experience.name}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(experience.rating) ? 'fill-accent-primary text-accent-primary' : 'text-muted-foreground'}`}/>
                        ))}
                      </div>
                      <span className="text-sm font-medium">{experience.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({experience.reviewCount} reviews)
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-2"/>
                        {experience.duration}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-2"/>
                        {experience.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-3 w-3 mr-2"/>
                        {experience.groupSize}
                      </div>
                    </div>
                  </div>

                  <Separator/>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Base Price:</span>
                      <span>${experience.basePrice} × {bookingForm.participants}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Service Fee:</span>
                      <span>${(experience.basePrice * bookingForm.participants * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax:</span>
                      <span>${(experience.basePrice * bookingForm.participants * 0.07).toFixed(2)}</span>
                    </div>
                    <Separator/>
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* What's Included */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">What&apos;s Included</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {experience.included.map((item, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <CheckCircle className="h-4 w-4 mr-2 text-success mt-0.5 flex-shrink-0"/>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Info className="h-4 w-4 mr-2"/>
                    Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {experience.requirements.map((requirement, index) => (
                      <li key={index} className="flex items-start text-sm text-muted-foreground">
                        <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0"/>
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Cancellation Policy */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Shield className="h-4 w-4 mr-2"/>
                    Cancellation Policy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{experience.cancellationPolicy}</p>
                </CardContent>
              </Card>
            </div>
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
