
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { logger } from '@/lib/logger'
import { useRouter } from 'next/navigation'
import { ErrorBoundary } from '@/lib/error-handling'
import {
  validateEmail,
  validatePhone,
  validateName,
  validateCardNumber,
  validateExpiryDate,
  validateCVV,
  ValidationResult
} from '@/lib/validation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Header } from '@/lib/design-system'
import {
  Calendar as CalendarIcon,
  CreditCard,
  Users,
  Mail,
  Phone,
  User,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Clock,
  MapPin,
  AlertCircle,
  Shield,
  Lock
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

interface BookingData {
  experienceId: string
  experienceName: string
  selectedDate: Date
  selectedTime: string
  guestCount: number
  totalPrice: number
  customerInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  paymentInfo: {
    cardNumber: string
    expiryMonth: string
    expiryYear: string
    cvv: string
    billingAddress: {
      street: string
      city: string
      state: string
      zipCode: string
      country: string
    }
  }
  specialRequests?: string
  termsAccepted: boolean
  marketingOptIn: boolean
}

interface BookingFlowProps {
  experienceId: string
  experienceName: string
  experienceImage: string
  basePrice: number
  maxGuests: number
  minGuests: number
  duration?: string
  location?: string
  availability?: string[]
  requirements?: string[]
  onBookingComplete?: (bookingData: any) => void
}

export function BookingFlow({
  experienceId,
  experienceName,
  experienceImage,
  basePrice,
  maxGuests,
  minGuests,
  duration = '2 hours',
  location = 'Location TBA',
  availability = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
  requirements = [],
  onBookingComplete
}: BookingFlowProps) {
  return (
    <ErrorBoundary>
      <BookingFlowInner
        experienceId={experienceId}
        experienceName={experienceName}
        experienceImage={experienceImage}
        basePrice={basePrice}
        maxGuests={maxGuests}
        minGuests={minGuests}
        duration={duration}
        location={location}
        availability={availability}
        requirements={requirements}
        onBookingComplete={onBookingComplete}
      />
    </ErrorBoundary>
  )
}

function BookingFlowInner({
  experienceId,
  experienceName,
  experienceImage,
  basePrice,
  maxGuests,
  minGuests,
  duration,
  location,
  availability,
  requirements,
  onBookingComplete
}: BookingFlowProps) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [guests, setGuests] = useState(minGuests)
  const [specialRequests, setSpecialRequests] = useState('')

  // Guest information
  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    emergencyContact: '',
    dietaryRestrictions: '',
    accessibilityNeeds: ''
  })

  // Payment information (mock)
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    billingAddress: '',
    saveCard: false
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingReference, setBookingReference] = useState('')

  // Validation state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [fieldTouched, setFieldTouched] = useState<Record<string, boolean>>({})

  const totalPrice = basePrice * guests
  const serviceFee = Math.round(totalPrice * 0.08)
  const taxes = Math.round(totalPrice * 0.1)
  const finalTotal = totalPrice + serviceFee + taxes

  const steps = [
    { id: 1, title: 'Select Date & Time', description: 'Choose when you want to experience this' },
    { id: 2, title: 'Guest Information', description: 'Tell us about yourself and your group' },
    { id: 3, title: 'Review & Payment', description: 'Confirm details and complete booking' },
    { id: 4, title: 'Confirmation', description: 'Your booking is confirmed!' }
  ]

  // Validation helpers
  const validateField = (fieldName: string, value: string, validator: (val: string) => ValidationResult) => {
    const result = validator(value)
    setValidationErrors(prev => ({
      ...prev,
      [fieldName]: result.errors.length > 0 ? result.errors[0] : ''
    }))
    return result.isValid
  }

  const markFieldTouched = (fieldName: string) => {
    setFieldTouched(prev => ({ ...prev, [fieldName]: true }))
  }

  const getFieldError = (fieldName: string) => {
    return fieldTouched[fieldName] ? validationErrors[fieldName] : ''
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmitBooking = async () => {
    setIsProcessing(true)

    try {
      // Mock API call to create booking
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          experienceId,
          date: selectedDate,
          time: selectedTime,
          guests,
          guestInfo,
          paymentInfo: {
            ...paymentInfo,
            amount: finalTotal
          },
          specialRequests,
          totalPrice: finalTotal
        })
      })

      if (response.ok) {
        const bookingData = await response.json()
        setBookingReference(bookingData.reference)
        setBookingComplete(true)
        setCurrentStep(4)

        // Call completion callback if provided
        if (onBookingComplete) {
          onBookingComplete(bookingData)
        }

        // Create notification for the booking
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'booking',
            title: 'Booking Confirmed',
            message: `Your booking for "${experienceName}" has been confirmed for ${format(selectedDate!, 'PPP')} at ${selectedTime}`,
            actionUrl: `/bookings/${bookingData.id}`
          })
        })
      } else {
        throw new Error('Booking failed')
      }
    } catch (error) {
      logger.error('Booking error', error)
      // In a real app, show error toast
      alert('Booking failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return selectedDate && selectedTime
      case 2:
        return guestInfo.firstName && guestInfo.lastName && guestInfo.email && guestInfo.phone
      case 3:
        return paymentInfo.cardNumber && paymentInfo.expiryDate && paymentInfo.cvv && paymentInfo.nameOnCard
      default:
        return true
    }
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Header/>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card>
            <CardContent className="pt-8 pb-8 text-center">
              <div className="text-6xl mb-6 text-semantic-success">
                <CheckCircle className="mx-auto"/>
              </div>
              <h1 className="text-3xl font-bold mb-4">Booking Confirmed!</h1>
              <p className="text-muted-foreground mb-6">
                Your experience has been booked successfully. We&apos;ve sent a confirmation email with all the details.
              </p>

              <div className="bg-muted/50 rounded-lg p-6 mb-6 text-left">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Booking Reference:</span>
                    <p className="font-mono text-lg">{bookingReference}</p>
                  </div>
                  <div>
                    <span className="font-medium">Experience:</span>
                    <p>{experienceName}</p>
                  </div>
                  <div>
                    <span className="font-medium">Date & Time:</span>
                    <p>{selectedDate && format(selectedDate, 'PPP')} at {selectedTime}</p>
                  </div>
                  <div>
                    <span className="font-medium">Guests:</span>
                    <p>{guests} people</p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4 justify-center">
                <Button onClick={() => router.push('/dashboard')}>
                  View My Bookings
                </Button>
                <Button variant="outline" onClick={() => router.push('/')}>
                  Browse More Experiences
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header/>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    currentStep >= step.id ? "bg-accent-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    {step.id}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className={cn(
                      "text-sm font-medium",
                      currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {step.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "w-12 h-0.5 mx-4",
                      currentStep > step.id ? "bg-accent-primary" : "bg-muted"
                    )}/>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Step 1: Date & Time Selection */}
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CalendarIcon className="h-5 w-5 mr-2"/>
                      Select Date & Time
                    </CardTitle>
                    <CardDescription>
                      Choose when you&apos;d like to experience {experienceName}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Date Selection */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">Select Date</Label>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date() || date > new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)}
                        className="rounded-md border"/>
                    </div>

                    {/* Time Selection */}
                    {selectedDate && (
                      <div>
                        <Label className="text-base font-medium mb-3 block">Select Time</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {(availability || []).map((time) => (
                            <Button
                              key={time}
                              variant={selectedTime === time ? "default" : "outline"}
                              onClick={() => setSelectedTime(time)}
                              className="h-12"
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Guest Count */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">
                        Number of Guests ({minGuests}-{maxGuests})
                      </Label>
                      <Select
                        value={guests.toString()}
                        onValueChange={(value) => setGuests(Number(value))}
                      >
                        <SelectTrigger>
                          <SelectValue/>
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: maxGuests - minGuests + 1 }, (_, i) => (
                            <SelectItem key={i + minGuests} value={(i + minGuests).toString()}>
                              {i + minGuests} {i + minGuests === 1 ? 'Guest' : 'Guests'}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Special Requests */}
                    <div>
                      <Label className="text-base font-medium mb-3 block">Special Requests (Optional)</Label>
                      <Textarea
                        placeholder="Any dietary requirements, accessibility needs, or special occasions..."
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        rows={3}/>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Guest Information */}
              {currentStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2"/>
                      Guest Information
                    </CardTitle>
                    <CardDescription>
                      Please provide information for the lead guest
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={guestInfo.firstName}
                          onChange={(e) => {
                            setGuestInfo(prev => ({ ...prev, firstName: e.target.value }))
                            if (fieldTouched.firstName) {
                              validateField('firstName', e.target.value, validateName)
                            }
                          }}
                          onBlur={() => {
                            markFieldTouched('firstName')
                            validateField('firstName', guestInfo.firstName, validateName)
                          }}
                          className={getFieldError('firstName') ? 'border-red-500' : ''}
                          required/>
                        {getFieldError('firstName') && (
                          <p className="text-sm text-red-600 mt-1">{getFieldError('firstName')}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={guestInfo.lastName}
                          onChange={(e) => setGuestInfo(prev => ({ ...prev, lastName: e.target.value }))}
                          required/>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={guestInfo.email}
                        onChange={(e) => setGuestInfo(prev => ({ ...prev, email: e.target.value }))}
                        required/>
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={guestInfo.phone}
                        onChange={(e) => setGuestInfo(prev => ({ ...prev, phone: e.target.value }))}
                        required/>
                    </div>

                    <div>
                      <Label htmlFor="emergencyContact">Emergency Contact</Label>
                      <Input
                        id="emergencyContact"
                        value={guestInfo.emergencyContact}
                        onChange={(e) => setGuestInfo(prev => ({ ...prev, emergencyContact: e.target.value }))}
                        placeholder="Name and phone number"/>
                    </div>

                    <div>
                      <Label htmlFor="dietaryRestrictions">Dietary Restrictions</Label>
                      <Input
                        id="dietaryRestrictions"
                        value={guestInfo.dietaryRestrictions}
                        onChange={(e) => setGuestInfo(prev => ({ ...prev, dietaryRestrictions: e.target.value }))}
                        placeholder="e.g., vegetarian, allergies"/>
                    </div>

                    <div>
                      <Label htmlFor="accessibilityNeeds">Accessibility Needs</Label>
                      <Textarea
                        id="accessibilityNeeds"
                        value={guestInfo.accessibilityNeeds}
                        onChange={(e) => setGuestInfo(prev => ({ ...prev, accessibilityNeeds: e.target.value }))}
                        placeholder="Any mobility requirements or special accommodations needed"
                        rows={2}/>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Review & Payment */}
              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="h-5 w-5 mr-2"/>
                      Review & Payment
                    </CardTitle>
                    <CardDescription>
                      Review your booking details and complete payment
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Booking Summary */}
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h3 className="font-medium mb-3">Booking Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Experience:</span>
                          <span className="font-medium">{experienceName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Date & Time:</span>
                          <span>{selectedDate && format(selectedDate, 'PPP')} at {selectedTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duration:</span>
                          <span>{duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Location:</span>
                          <span>{location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Guests:</span>
                          <span>{guests}</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Form */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number *</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo(prev => ({ ...prev, cardNumber: e.target.value }))}
                          required/>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Expiry Date *</Label>
                          <Input
                            id="expiryDate"
                            placeholder="MM/YY"
                            value={paymentInfo.expiryDate}
                            onChange={(e) => setPaymentInfo(prev => ({ ...prev, expiryDate: e.target.value }))}
                            required/>
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV *</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo(prev => ({ ...prev, cvv: e.target.value }))}
                            required/>
                        </div>
                        <div className="flex items-end">
                          <div className="flex items-center space-x-2">
                            <Lock className="h-4 w-4 text-semantic-success"/>
                            <span className="text-xs text-semantic-success">Secure</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="nameOnCard">Name on Card *</Label>
                        <Input
                          id="nameOnCard"
                          value={paymentInfo.nameOnCard}
                          onChange={(e) => setPaymentInfo(prev => ({ ...prev, nameOnCard: e.target.value }))}
                          required/>
                      </div>

                      <div>
                        <Label htmlFor="billingAddress">Billing Address</Label>
                        <Input
                          id="billingAddress"
                          value={paymentInfo.billingAddress}
                          onChange={(e) => setPaymentInfo(prev => ({ ...prev, billingAddress: e.target.value }))}/>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="saveCard"
                          checked={paymentInfo.saveCard}
                          onCheckedChange={(checked) =>
                            setPaymentInfo(prev => ({ ...prev, saveCard: !!checked }))
                          }/>
                        <Label htmlFor="saveCard" className="text-sm">
                          Save card for future bookings
                        </Label>
                      </div>
                    </div>

                    {/* Price Breakdown */}
                    <div className="bg-muted/50 rounded-lg p-4">
                      <h3 className="font-medium mb-3">Price Breakdown</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>{experienceName} × {guests}</span>
                          <span>${totalPrice.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Service fee</span>
                          <span>${serviceFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Taxes</span>
                          <span>${taxes.toLocaleString()}</span>
                        </div>
                        <Separator/>
                        <div className="flex justify-between font-medium text-lg">
                          <span>Total</span>
                          <span>${finalTotal.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Terms and Cancellation */}
                    <div className="text-xs text-muted-foreground space-y-2">
                      <p>
                        By completing this booking, you agree to our{' '}
                        <a href="/terms" className="text-accent-primary underline">Terms of Service</a>
                        {' '}and{' '}
                        <a href="/privacy" className="text-accent-primary underline">Privacy Policy</a>.
                      </p>
                      <p>
                        Free cancellation up to 24 hours before your experience. Cancellations within 24 hours are non-refundable.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Experience Summary */}
              <Card>
                <CardHeader className="p-0">
                  <Image
                    src={experienceImage}
                    alt={experienceName}
                    width={400}
                    height={192}
                    className="w-full h-48 object-cover rounded-t-lg"/>
                </CardHeader>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{experienceName}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2"/>
                      {duration}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2"/>
                      {location}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2"/>
                      {guests} guests
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Price Summary */}
              {currentStep >= 3 && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Total Cost</h4>
                    <div className="text-2xl font-bold text-accent-primary mb-2">
                      ${finalTotal.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Includes service fees and taxes
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Requirements */}
              {(requirements || []).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {(requirements || []).map((req, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="h-4 w-4 text-semantic-success mr-2 mt-0.5 flex-shrink-0"/>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="h-4 w-4 mr-2"/>
              Previous
            </Button>

            <div className="flex space-x-2">
              {currentStep < 4 && (
                <Button
                  onClick={currentStep === 3 ? handleSubmitBooking : handleNext}
                  disabled={!validateStep(currentStep) || isProcessing}
                >
                  {isProcessing ? (
                    'Processing...'
                  ) : currentStep === 3 ? (
                    <>
                      <Shield className="h-4 w-4 mr-2"/>
                      Complete Booking
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRight className="h-4 w-4 ml-2"/>
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
