
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface ProfessionalSkillsPageProps {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: ProfessionalSkillsPageProps): Promise<Metadata> {
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
    title: `${displayName} - Skills | ATLVS + GVTEWAY`,
    description: `Professional skills and expertise of ${displayName}.`,
  }
}

export default async function ProfessionalSkillsPage({ params }: ProfessionalSkillsPageProps) {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-background rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-6">{displayName} - Skills & Expertise</h1>

          {professional.skills && Array.isArray(professional.skills) && professional.skills.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Skills</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {professional.skills.map((skill, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{skill}</span>
                        <Badge variant="secondary">Expert</Badge>
                      </div>
                      <Progress value={85} className="mt-2"/>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {professional.specializations && Array.isArray(professional.specializations) && professional.specializations.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Specializations</h2>
              <div className="flex flex-wrap gap-3">
                {professional.specializations.map((spec, index) => (
                  <Badge key={index} variant="default" className="text-sm px-3 py-1">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {professional.equipmentOwned && Array.isArray(professional.equipmentOwned) && professional.equipmentOwned.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Equipment & Tools</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {professional.equipmentOwned.map((equipment, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <span className="font-medium">{equipment}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {professional.travelRadius && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Service Area</h2>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Travel Radius:</span>
                    <span>{professional.travelRadius} miles</span>
                    {professional.willingToTravel && (
                      <Badge variant="secondary">Willing to Travel</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {(professional.bookingRateMin || professional.bookingRateMax) && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Rates</h2>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {professional.bookingRateMin && (
                      <div>
                        <span className="font-medium">Minimum Rate:</span>
                        <span className="ml-2">${professional.bookingRateMin}/day</span>
                      </div>
                    )}
                    {professional.bookingRateMax && (
                      <div>
                        <span className="font-medium">Maximum Rate:</span>
                        <span className="ml-2">${professional.bookingRateMax}/day</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Availability</h2>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {professional.openToWork && (
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Open to Work</Badge>
                      </div>
                    )}
                    {professional.openToHire && (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Open to Hire</Badge>
                      </div>
                    )}
                    {professional.acceptingBookings && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Accepting Bookings</Badge>
                      </div>
                    )}
                    {!professional.openToWork && !professional.openToHire && !professional.acceptingBookings && (
                      <span className="text-neutral-500">Not currently available</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Certifications</h2>
              {professional.certifications && Array.isArray(professional.certifications) && professional.certifications.length > 0 ? (
                <div className="space-y-2">
                  {professional.certifications.map((cert, index) => (
                    <Card key={index}>
                      <CardContent className="p-3">
                        <span className="font-medium text-sm">{cert}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500">No certifications listed</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
