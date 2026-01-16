
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Mail, Phone, MapPin, Globe, Calendar } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface ProfessionalContactPageProps {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: ProfessionalContactPageProps): Promise<Metadata> {
  const { handle } = await params
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, professional_profiles(*), users(firstName, lastName)')
    .eq('slug', handle)
    .single()

  if (!profile || !profile.professional_profiles) {
    return {
      title: 'Professional Not Found | ATLVS + GVTEWAY'
    }
  }

  const displayName = profile.displayName || `${profile.users?.firstName} ${profile.users?.lastName}` || profile.slug

  return {
    title: `Contact ${displayName} | ATLVS + GVTEWAY`,
    description: `Get in touch with professional ${displayName} for booking inquiries.`,
  }
}

export default async function ProfessionalContactPage({ params }: ProfessionalContactPageProps) {
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
  const displayName = profile.displayName || `${profile.users?.firstName} ${profile.users?.lastName}` || profile.slug

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-background rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-6">Contact {displayName}</h1>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Get In Touch</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {professional.bookingContact && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-neutral-400"/>
                        <div>
                          <p className="font-medium">Booking Contact</p>
                          <p className="text-sm text-neutral-600">{professional.bookingContact}</p>
                        </div>
                      </div>
                    )}

                    {professional.pressContact && (
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-neutral-400"/>
                        <div>
                          <p className="font-medium">Press Contact</p>
                          <p className="text-sm text-neutral-600">{professional.pressContact}</p>
                        </div>
                      </div>
                    )}

                    {profile.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-neutral-400"/>
                        <div>
                          <p className="font-medium">Website</p>
                          <a href={profile.website} target="_blank" rel="noopener noreferrer"
                             className="text-sm text-accent-secondary hover:underline">
                            {profile.website}
                          </a>
                        </div>
                      </div>
                    )}

                    {profile.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-neutral-400"/>
                        <div>
                          <p className="font-medium">Location</p>
                          <p className="text-sm text-neutral-600">{profile.location}</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-neutral-400"/>
                      <div>
                        <p className="font-medium">Response Time</p>
                        <p className="text-sm text-neutral-600">Within 24 hours</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Send a Message</h2>
              <Card>
                <CardContent className="p-6">
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Your Name
                      </label>
                      <Input
                        type="text"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        placeholder="Enter your name"/>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        placeholder="Enter your email"/>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Project Type
                      </label>
                      <Select>
                        <SelectItem value="">Select project type</SelectItem>
                        <SelectItem value="event-production">Event Production</SelectItem>
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="performance">Performance</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Message
                      </label>
                      <Textarea
                        rows={4}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        placeholder="Tell us about your project..."/>
                    </div>

                    <Button type="submit" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Booking Information</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Accepting Bookings:</span>
                      <Badge variant={professional.acceptingBookings ? "default" : "secondary"}>
                        {professional.acceptingBookings ? "Yes" : "No"}
                      </Badge>
                    </div>

                    {professional.bookingRateMin && (
                      <div className="flex justify-between">
                        <span>Rate Range:</span>
                        <span>${professional.bookingRateMin} - ${professional.bookingRateMax || 'TBD'}/day</span>
                      </div>
                    )}

                    {professional.travelRadius && (
                      <div className="flex justify-between">
                        <span>Travel Radius:</span>
                        <span>{professional.travelRadius} miles</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span>Willing to Travel:</span>
                      <Badge variant={professional.willingToTravel ? "default" : "secondary"}>
                        {professional.willingToTravel ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Preferred Contact Method</h2>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-semantic-success"/>
                      <span>Email preferred for initial inquiries</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-accent-primary"/>
                      <span>Phone available for urgent matters</span>
                    </div>

                    <div className="text-sm text-neutral-600 mt-4">
                      <p>• Professional responds within 24 hours</p>
                      <p>• Detailed project briefs get priority</p>
                      <p>• Availability confirmed within 48 hours</p>
                    </div>
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
