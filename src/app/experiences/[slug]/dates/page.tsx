
'use client'


import { logger } from "@/lib/logger"
import { Calendar as CalendarIcon, Clock, Users, CheckCircle, XCircle, AlertTriangle, Info, Star, MapPin, DollarSign, ArrowRight } from "lucide-react"
import { format, isBefore, startOfDay, addDays, isSameDay } from "date-fns"

interface AvailabilitySlotApiResponse {
  date?: string
  time?: string
  available?: boolean
  capacity?: number
  booked?: number
  price?: number
}

interface Experience {
  id: string
  name: string
  description: string
  duration: string
  basePrice: number
  currency: string
  rating: number
  reviewCount: number
  location: string
  groupSize: string
  ageRange: string
}

interface Experience {
  id: string
  name: string
  description: string
  duration: string
  basePrice: number
  currency: string
  rating: number
  reviewCount: number
  location: string
  groupSize: string
  ageRange: string
}

interface AvailabilitySlot {
  date: string
  time: string
  available: boolean
  capacity: number
  booked: number
  price: number
}

interface TimeSlot {
  time: string
  available: boolean
  capacity: number
  booked: number
  price: number
}

export default function Dates({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const experienceSlug = slug
  const experienceName = experienceSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  const [experience, setExperience] = useState<Experience | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [availableSlots, setAvailableSlots] = useState<AvailabilitySlot[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [participants, setParticipants] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadData = async () => {
      try {
        // Fetch experience data
        const expRes = await fetch(`/api/v1/experiences/${experienceSlug}`)
        if (expRes.ok) {
          const expData = await expRes.json()
          const exp = expData.experience || expData
          if (!cancelled && exp) {
            setExperience({
              id: String(exp.id || experienceSlug),
              name: String(exp.name || experienceName),
              description: String(exp.description || ''),
              duration: String(exp.duration || '4 hours'),
              basePrice: Number(exp.price || exp.base_price || 0),
              currency: String(exp.currency || 'USD'),
              rating: Number(exp.rating || 4.5),
              reviewCount: Number(exp.review_count || 0),
              location: String(exp.location || ''),
              groupSize: String(exp.group_size || '1-10'),
              ageRange: String(exp.age_range || 'All ages')
            })
          }
        }

        // Fetch availability slots
        const slotsRes = await fetch(`/api/v1/experiences/${experienceSlug}/availability`)
        if (slotsRes.ok) {
          const slotsData = await slotsRes.json()
          const slots = Array.isArray(slotsData.slots) ? slotsData.slots : []
          if (!cancelled) {
            setAvailableSlots(slots.map((s: AvailabilitySlotApiResponse) => ({
              date: String(s.date || ''),
              time: String(s.time || ''),
              available: Boolean(s.available),
              capacity: Number(s.capacity || 10),
              booked: Number(s.booked || 0),
              price: Number(s.price || 0)
            })))
          }
        }
      } catch (error) {
        logger.error('Error loading experience data:', error)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => { cancelled = true }
  }, [experienceSlug, experienceName])

  // Update time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd")
      const daySlots = availableSlots.filter(slot => slot.date === dateStr)
      setTimeSlots(daySlots)
      setSelectedTime("") // Reset time selection
    }
  }, [selectedDate, availableSlots])

  const getAvailableDates = () => {
    const dates = availableSlots
      .filter(slot => slot.available)
      .map(slot => new Date(slot.date))
    return [...new Set(dates.map(date => date.getTime()))].map(time => new Date(time))
  }

  const isDateAvailable = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    return availableSlots.some(slot => slot.date === dateStr && slot.available)
  }

  const getAvailabilityStatus = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    const daySlots = availableSlots.filter(slot => slot.date === dateStr)
    const availableCount = daySlots.filter(slot => slot.available).length

    if (availableCount === 0) return "unavailable"
    if (availableCount < daySlots.length * 0.5) return "limited"
    return "available"
  }

  const getSlotAvailability = (slot: TimeSlot) => {
    const remaining = slot.capacity - slot.booked
    if (!slot.available) return { status: "unavailable", text: "Unavailable" }
    if (remaining === 0) return { status: "full", text: "Fully Booked" }
    if (remaining <= 2) return { status: "limited", text: `${remaining} spots left` }
    return { status: "available", text: `${remaining} spots available` }
  }

  const handleBookNow = () => {
    if (!selectedDate || !selectedTime) {
      alert("Please select both a date and time.")
      return
    }

    alert(`Booking initiated for ${experienceName} on ${format(selectedDate, "MMMM dd, yyyy")} at ${format(new Date(`2023-01-01T${selectedTime}`), "h:mm a")} for ${participants} participant${participants !== 1 ? 's' : ''}`)

    window.location.href = `/experiences/${slug}/book?date=${format(selectedDate, "yyyy-MM-dd")}&time=${selectedTime}&participants=${participants}`
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

  const availableDates = getAvailableDates()
  const hasSelectedValidSlot = selectedDate && selectedTime && timeSlots.find(slot => slot.time === selectedTime)?.available

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
            <span className="text-foreground font-medium">Dates</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-accent-secondary/10 via-accent-primary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Available Dates for {experienceName}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Choose your preferred date and time. We offer flexible scheduling with expert guides
              ready to make your experience unforgettable.
            </p>

            {/* Experience Quick Info */}
            <div className="grid md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-accent-primary"/>
                <div className="text-sm font-medium">{experience.duration}</div>
                <div className="text-xs text-muted-foreground">Duration</div>
              </div>
              <div className="text-center">
                <DollarSign className="h-6 w-6 mx-auto mb-2 text-accent-primary"/>
                <div className="text-sm font-medium">From ${experience.basePrice}</div>
                <div className="text-xs text-muted-foreground">per person</div>
              </div>
              <div className="text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-accent-primary"/>
                <div className="text-sm font-medium">{experience.groupSize}</div>
                <div className="text-xs text-muted-foreground">Group size</div>
              </div>
              <div className="text-center">
                <Star className="h-6 w-6 mx-auto mb-2 text-accent-primary"/>
                <div className="text-sm font-medium">{experience.rating}</div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Calendar & Time Selection */}
            <div className="lg:col-span-2 space-y-8">
              {/* Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2"/>
                    Select Date
                  </CardTitle>
                  <CardDescription>
                    Choose an available date for your experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => isBefore(date, startOfDay(new Date()))}
                    modifiers={{
                      available: availableDates,
                      limited: (date) => getAvailabilityStatus(date) === "limited",
                      unavailable: (date) => !isDateAvailable(date)
                    }}
                    modifiersClassNames={{
                      available: "bg-success/20 text-success font-medium",
                      limited: "bg-warning/20 text-warning font-medium",
                      unavailable: "text-muted-foreground opacity-50"
                    }}
                    className="rounded-md border w-full"/>

                  {/* Legend */}
                  <div className="flex flex-wrap gap-4 mt-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-success/20 mr-2"></div>
                      <span>Available</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-warning/20 mr-2"></div>
                      <span>Limited spots</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-muted mr-2"></div>
                      <span>Unavailable</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Time Slots */}
              {selectedDate && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="h-5 w-5 mr-2"/>
                      Available Times for {format(selectedDate, "MMMM dd, yyyy")}
                    </CardTitle>
                    <CardDescription>
                      Select your preferred time slot
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {timeSlots.length === 0 ? (
                      <div className="text-center py-8">
                        <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-warning"/>
                        <h3 className="text-lg font-semibold mb-2">No Available Times</h3>
                        <p className="text-muted-foreground">
                          There are no available time slots for this date. Please select another date.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {timeSlots.map((slot) => {
                          const availability = getSlotAvailability(slot)
                          const isSelected = selectedTime === slot.time

                          return (
                            <Button
                              key={slot.time}
                              onClick={() => slot.available && setSelectedTime(slot.time)}
                              disabled={!slot.available}
                              className={`p-4 border rounded-lg text-center transition-all ${
                                isSelected
                                  ? 'border-accent-primary bg-accent-primary/10 text-accent-primary'
                                  : slot.available
                                    ? 'border-border hover:border-accent-primary hover:bg-accent-primary/5'
                                    : 'border-muted bg-muted/50 text-muted-foreground cursor-not-allowed'
                              }`}
                            >
                              <div className="font-semibold">
                                {format(new Date(`2023-01-01T${slot.time}`), "h:mm a")}
                              </div>
                              <div className={`text-xs mt-1 ${
                                availability.status === 'available' ? 'text-success' :
                                availability.status === 'limited' ? 'text-warning' :
                                availability.status === 'full' ? 'text-destructive' : 'text-muted-foreground'
                              }`}>
                                {availability.text}
                              </div>
                              {slot.available && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  ${slot.price}
                                </div>
                              )}
                            </Button>
                          )
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Participants */}
              {selectedDate && selectedTime && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2"/>
                      Number of Participants
                    </CardTitle>
                    <CardDescription>
                      How many people will be joining this experience?
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Select value={participants.toString()} onValueChange={(value) => setParticipants(parseInt(value))}>
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

                    <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Total Price:</span>
                        <span className="text-lg font-bold text-accent-primary">
                          ${(experience.basePrice * participants).toFixed(2)}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        ${experience.basePrice} per person × {participants} participant{participants !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Book Now Button */}
              {hasSelectedValidSlot && (
                <div className="flex justify-center">
                  <Button size="lg" onClick={handleBookNow} className="px-12">
                    Book Now
                    <ArrowRight className="h-4 w-4 ml-2"/>
                  </Button>
                </div>
              )}
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
                </CardContent>
              </Card>

              {/* Selection Summary */}
              {(selectedDate || selectedTime) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Your Selection</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedDate && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Date:</span>
                        <span className="text-sm font-medium">
                          {format(selectedDate, "MMMM dd, yyyy")}
                        </span>
                      </div>
                    )}
                    {selectedTime && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Time:</span>
                        <span className="text-sm font-medium">
                          {format(new Date(`2023-01-01T${selectedTime}`), "h:mm a")}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Participants:</span>
                      <span className="text-sm font-medium">{participants}</span>
                    </div>
                    <Separator/>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Total:</span>
                      <span className="font-bold text-accent-primary">
                        ${(experience.basePrice * participants).toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Availability Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Info className="h-4 w-4 mr-2"/>
                    Availability Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0"/>
                    <div className="text-sm">
                      <div className="font-medium text-success">Available</div>
                      <div className="text-muted-foreground">Multiple spots remaining</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0"/>
                    <div className="text-sm">
                      <div className="font-medium text-warning">Limited</div>
                      <div className="text-muted-foreground">Only a few spots left</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0"/>
                    <div className="text-sm">
                      <div className="font-medium text-destructive">Fully Booked</div>
                      <div className="text-muted-foreground">No spots available</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href={`/experiences/${slug}`}>
                      View Experience Details
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href={`/experiences/${slug}/reviews`}>
                      Read Reviews
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href={`/experiences/${slug}/faq`}>
                      FAQ
                    </Link>
                  </Button>
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
