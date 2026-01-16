
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface ProfessionalAvailabilityPageProps {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: ProfessionalAvailabilityPageProps): Promise<Metadata> {
  const { handle } = await params
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, professional_profiles(*), users(*)')
    .eq('slug', handle)
    .single()

  if (!profile || !profile.professional_profiles) {
    return {
      title: 'Professional Not Found | ATLVS + GVTEWAY'
    }
  }

  const displayName = profile.display_name || `${profile.users?.first_name} ${profile.users?.last_name}` || profile.slug

  return {
    title: `${displayName} - Availability | ATLVS + GVTEWAY`,
    description: `Booking availability and schedule for ${displayName}.`,
  }
}

export default async function ProfessionalAvailabilityPage({ params }: ProfessionalAvailabilityPageProps) {
  const { handle } = await params
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, professional_profiles(*), users(*)')
    .eq('slug', handle)
    .single()

  if (!profile || !profile.professional_profiles) {
    notFound()
  }

  const professional = profile.professional_profiles
  const displayName = profile.display_name || `${profile.users?.first_name} ${profile.users?.last_name}` || profile.slug

  // Mock availability data - in real app, this would come from database
  const availability = {
    acceptingBookings: professional.acceptingBookings || false,
    availability: professional.availability || {},
    travelRadius: professional.travelRadius || 0,
    willingToTravel: professional.willingToTravel || false
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-background rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-6">{displayName} - Availability & Booking</h1>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Booking Status</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Accepting Bookings</span>
                      <Badge variant={availability.acceptingBookings ? "default" : "secondary"}>
                        {availability.acceptingBookings ? "Yes" : "No"}
                      </Badge>
                    </div>

                    {professional.bookingRateMin && (
                      <div>
                        <span className="font-medium">Daily Rate:</span>
                        <span className="ml-2">${professional.bookingRateMin} - ${professional.bookingRateMax || 'TBD'}</span>
                      </div>
                    )}

                    {availability.travelRadius > 0 && (
                      <div>
                        <span className="font-medium">Travel Radius:</span>
                        <span className="ml-2">{availability.travelRadius} miles</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="font-medium">Willing to Travel</span>
                      <Badge variant={availability.willingToTravel ? "default" : "secondary"}>
                        {availability.willingToTravel ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Quick Book</h2>
              {availability.acceptingBookings ? (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-neutral-700 mb-4">
                      Ready to book {displayName} for your next project?
                    </p>
                    <Button className="w-full">
                      Request Booking
                    </Button>
                    <p className="text-xs text-neutral-500 mt-2">
                      Response within 24 hours
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-neutral-500">
                      Currently not accepting new bookings
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Availability Calendar</h2>
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-neutral-500">
                  <p>Interactive calendar would be displayed here</p>
                  <p className="text-sm mt-2">Showing available dates for booking</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {professional.availability && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">General Availability</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="text-neutral-700">
                    <p>Availability details would be parsed from the availability JSON field</p>
                    <p className="text-sm mt-2 text-neutral-500">
                      This could include preferred days, blackout dates, seasonal availability, etc.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Booking Process</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-0.5">1</Badge>
                      <div>
                        <p className="font-medium">Inquiry</p>
                        <p className="text-sm text-neutral-600">Submit project details</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-0.5">2</Badge>
                      <div>
                        <p className="font-medium">Quote</p>
                        <p className="text-sm text-neutral-600">Receive detailed proposal</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-0.5">3</Badge>
                      <div>
                        <p className="font-medium">Contract</p>
                        <p className="text-sm text-neutral-600">Sign agreement</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline" className="mt-0.5">4</Badge>
                      <div>
                        <p className="font-medium">Production</p>
                        <p className="text-sm text-neutral-600">Execute the project</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Cancellation Policy</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="text-neutral-700">
                    {professional.cancellationPolicy ? (
                      <p>{professional.cancellationPolicy}</p>
                    ) : (
                      <div className="space-y-2">
                        <p>• 30 days: Full refund</p>
                        <p>• 14-29 days: 50% refund</p>
                        <p>• 7-13 days: 25% refund</p>
                        <p>• &lt; 7 days: No refund</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
