
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ProfessionalAboutPageProps {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: ProfessionalAboutPageProps): Promise<Metadata> {
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
    title: `${displayName} - Professional Profile | ATLVS + GVTEWAY`,
    description: profile.professional_profiles.bio_short || `Professional profile of ${displayName}.`,
  }
}

export default async function ProfessionalAboutPage({ params }: ProfessionalAboutPageProps) {
  const { handle } = await params
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, professional_profiles(*, professional_education(*), professional_experience(*), professional_portfolio(*)), users(*)')
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
          <h1 className="text-3xl font-bold text-neutral-900 mb-6">About {displayName}</h1>

          {professional.bioShort && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-3">Professional Summary</h2>
              <p className="text-neutral-700 leading-relaxed">{professional.bioShort}</p>
            </div>
          )}

          {professional.bioLong && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-3">Detailed Bio</h2>
              <p className="text-neutral-700 leading-relaxed whitespace-pre-line">{professional.bioLong}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Professional Details</h2>
              <div className="space-y-4">
                {professional.headline && (
                  <div>
                    <span className="font-medium text-neutral-900">Headline:</span>
                    <p className="mt-1 text-neutral-700">{professional.headline}</p>
                  </div>
                )}

                {professional.specializations && (
                  <div>
                    <span className="font-medium text-neutral-900">Specializations:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Array.isArray(professional.specializations) && professional.specializations.map((spec: string, index: number) => (
                        <Badge key={index} variant="secondary">{spec}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {professional.yearsExperience && (
                  <div>
                    <span className="font-medium text-neutral-900">Years of Experience:</span>
                    <span className="ml-2 text-neutral-700">{professional.yearsExperience} years</span>
                  </div>
                )}

                {professional.equipmentOwned && (
                  <div>
                    <span className="font-medium text-neutral-900">Equipment:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Array.isArray(professional.equipmentOwned) && professional.equipmentOwned.map((equipment, index) => (
                        <Badge key={index} variant="outline">{equipment}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Skills & Certifications</h2>
              <div className="space-y-4">
                {professional.skills && (
                  <div>
                    <span className="font-medium text-neutral-900">Skills:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Array.isArray(professional.skills) && professional.skills.map((skill, index) => (
                        <Badge key={index} variant="default">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {professional.certifications && (
                  <div>
                    <span className="font-medium text-neutral-900">Certifications:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Array.isArray(professional.certifications) && professional.certifications.map((cert, index) => (
                        <Badge key={index} variant="secondary">{cert}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {professional.unionMemberships && (
                  <div>
                    <span className="font-medium text-neutral-900">Union Memberships:</span>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Array.isArray(professional.unionMemberships) && professional.unionMemberships.map((union, index) => (
                        <Badge key={index} variant="outline">{union}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {professional.professional_experience && professional.professional_experience.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-4">Recent Experience</h2>
              <div className="space-y-4">
                {professional.professional_experience.slice(0, 3).map((exp) => (
                  <Card key={exp.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{exp.positionTitle}</h3>
                          <p className="text-sm text-neutral-600">{exp.companyName}</p>
                          {exp.description && (
                            <p className="text-sm text-neutral-700 mt-2">{exp.description}</p>
                          )}
                        </div>
                        <div className="text-right text-sm text-neutral-500">
                          {exp.startDate && (
                            <div>
                              {new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
