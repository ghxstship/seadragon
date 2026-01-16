
'use client'

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { logger } from "@/lib/logger"
import { ArrowLeft, Calendar as CalendarIcon, Clock, Users, CheckCircle, XCircle, AlertCircle, Filter, Info } from "lucide-react"

interface DestinationAvailabilityPageProps {
  params: Promise<{ handle: string }>
}

interface DestinationData {
  handle: string
  name: string
  spaces: Array<{ id: string; name: string; capacity: number }>
  bookedDates: Array<{ date: string; space: string; event: string }>
  blackoutDates: string[]
}

export default function DestinationAvailabilityPage({ params }: DestinationAvailabilityPageProps) {
  const { handle } = use(params)
  const [destination, setDestination] = useState<DestinationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedSpace, setSelectedSpace] = useState('')

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
              spaces: dest.spaces || [],
              bookedDates: dest.booked_dates || [],
              blackoutDates: dest.blackout_dates || []
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
        <div className="animate-pulse text-muted-foreground">Loading availability...</div>
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

  const getDateStatus = (date: Date, spaceId?: string) => {
    const dateString = date.toISOString().split('T')[0]

    // Check blackout dates
    if (destination.blackoutDates.includes(dateString)) {
      return { status: 'unavailable', reason: 'Blackout date' }
    }

    // Check if space is booked for this date
    const spaceBookings = destination.bookedDates.filter(booking =>
      booking.date === dateString && (!spaceId || booking.space === spaceId)
    )

    if (spaceBookings.length > 0) {
      if (spaceId) {
        return { status: 'booked', reason: spaceBookings[0].event }
      } else {
        return { status: 'partially-booked', spaces: spaceBookings.length }
      }
    }

    return { status: 'available' }
  }

  const getSpaceAvailability = (spaceId: string, date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    const booking = destination.bookedDates.find(b =>
      b.date === dateString && b.space === spaceId
    )
    return booking ? { status: 'booked', event: booking.event } : { status: 'available' }
  }

  const selectedSpaceData = selectedSpace ? destination.spaces.find(s => s.id === selectedSpace) : null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Availability Header */}
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
              <CalendarIcon className="h-8 w-8 text-accent-primary"/>
              <div>
                <h1 className="text-2xl font-display font-bold">{destination.name} Availability</h1>
                <p className="text-muted-foreground">Check real-time availability for your preferred dates</p>
              </div>
            </div>
            <Button asChild>
              <Link href={`/d/${handle}/inquire`}>
                Inquire About Dates
              </Link>
            </Button>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-semantic-success rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-semantic-warning rounded"></div>
              <span>Partially Booked</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-semantic-error rounded"></div>
              <span>Booked/Unavailable</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-neutral-500 rounded"></div>
              <span>Blackout Dates</span>
            </div>
          </div>
        </div>
      </section>

      {/* Availability Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Calendar & Filters */}
            <div className="lg:col-span-2 space-y-6">
              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Filter by Space</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedSpace} onValueChange={setSelectedSpace}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a space (optional)"/>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Spaces</SelectItem>
                      {destination.spaces.map((space) => (
                        <SelectItem key={space.id} value={space.id}>
                          {space.name} (Up to {space.capacity} guests)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Select Date</CardTitle>
                  <CardDescription>
                    Click on any date to view availability details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    disabled={(date) => date < new Date()}/>
                </CardContent>
              </Card>

              {/* Date Details */}
              {selectedDate && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </CardTitle>
                    <CardDescription>
                      {selectedSpace ? 'Space-specific availability' : 'Overall availability'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedSpace ? (
                      // Specific space availability
                      <div className="space-y-4">
                        {(() => {
                          const availability = getSpaceAvailability(selectedSpace, selectedDate)
                          const spaceData = destination.spaces.find(s => s.id === selectedSpace)

                          return (
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <h4 className="font-medium">{spaceData?.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Capacity: {spaceData?.capacity} guests
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                {availability.status === 'available' ? (
                                  <>
                                    <CheckCircle className="h-5 w-5 text-semantic-success"/>
                                    <Badge variant="default" className="bg-semantic-success">Available</Badge>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-5 w-5 text-semantic-error"/>
                                    <Badge variant="destructive">Booked</Badge>
                                  </>
                                )}
                              </div>
                            </div>
                          )
                        })()}
                      </div>
                    ) : (
                      // All spaces availability
                      <div className="space-y-4">
                        {destination.spaces.map((space) => {
                          const availability = getSpaceAvailability(space.id, selectedDate)
                          return (
                            <div key={space.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <h4 className="font-medium">{space.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  Capacity: {space.capacity} guests
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                {availability.status === 'available' ? (
                                  <>
                                    <CheckCircle className="h-5 w-5 text-semantic-success"/>
                                    <Badge variant="default" className="bg-semantic-success">Available</Badge>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-5 w-5 text-semantic-error"/>
                                    <Badge variant="destructive">Booked</Badge>
                                    <span className="text-xs text-muted-foreground ml-2">
                                      {availability.event}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {selectedDate && (
                      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-start gap-3">
                          <Info className="h-5 w-5 text-accent-secondary mt-0.5"/>
                          <div>
                            <h4 className="font-medium text-blue-900">Need this date?</h4>
                            <p className="text-sm text-accent-tertiary mb-3">
                              If your preferred date is booked, we may be able to accommodate you with alternative arrangements.
                            </p>
                            <Button size="sm" asChild>
                              <Link href={`/d/${handle}/inquire?date=${selectedDate.toISOString().split('T')[0]}${selectedSpace ? `&space=${selectedSpace}` : ''}`}>
                                Inquire About Alternatives
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Booking */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ready to Book?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedDate && (
                    <div className="text-sm">
                      <div className="font-medium mb-1">Selected Date:</div>
                      <div className="text-muted-foreground">
                        {selectedDate.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  )}

                  {selectedSpace && (
                    <div className="text-sm">
                      <div className="font-medium mb-1">Selected Space:</div>
                      <div className="text-muted-foreground">
                        {selectedSpaceData?.name}
                      </div>
                    </div>
                  )}

                  <Button
                    className="w-full"
                    disabled={!selectedDate}
                    asChild={selectedDate}
                  >
                    {selectedDate ? (
                      <Link href={`/d/${handle}/inquire?date=${selectedDate.toISOString().split('T')[0]}${selectedSpace ? `&space=${selectedSpace}` : ''}`}>
                        Request This Date
                      </Link>
                    ) : (
                      'Select a Date First'
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Booking Policies */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Booking Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-0.5 flex-shrink-0"/>
                    <span>Advance booking required (typically 3-6 months)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Users className="h-4 w-4 mt-0.5 flex-shrink-0"/>
                    <span>Group sizes from 10 to 1,000+ guests</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0"/>
                    <span>Flexible setup and breakdown times</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0"/>
                    <span>Weather-dependent for outdoor spaces</span>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Availability */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming Availability</CardTitle>
                  <CardDescription>Next available dates by space</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {destination.spaces.slice(0, 3).map((space) => {
                      // Find next available date for this space
                      const nextAvailable = Array.from({ length: 90 }, (_, i) => {
                        const date = new Date()
                        date.setDate(date.getDate() + i)
                        return date
                      }).find(date => getSpaceAvailability(space.id, date).status === 'available')

                      return (
                        <div key={space.id} className="flex items-center justify-between text-sm">
                          <span className="font-medium">{space.name}</span>
                          <span className="text-muted-foreground">
                            {nextAvailable ? nextAvailable.toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            }) : 'Check calendar'}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Need Help?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    Questions about availability or booking?
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`/d/${handle}/contact`}>
                        Contact Venue
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link href={`/d/${handle}/faq`}>
                        View FAQ
                      </Link>
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
