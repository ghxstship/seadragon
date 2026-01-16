
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface ProfessionalExperiencePageProps {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: ProfessionalExperiencePageProps): Promise<Metadata> {
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
    title: `${displayName} - Experience | ATLVS + GVTEWAY`,
    description: `Professional experience and work history of ${displayName}.`,
  }
}

export default async function ProfessionalExperiencePage({ params }: ProfessionalExperiencePageProps) {
  const { handle } = await params
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, professional_profiles(*, professional_experience(*)), users(*)')
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
          <h1 className="text-3xl font-bold text-neutral-900 mb-6">{displayName} - Professional Experience</h1>

          {professional.professional_experience && professional.professional_experience.length > 0 ? (
            <div className="space-y-6">
              {professional.professional_experience.map((exp) => (
                <Card key={exp.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{exp.positionTitle}</CardTitle>
                        <p className="text-lg text-neutral-600 mt-1">{exp.companyName}</p>
                        {exp.location && (
                          <p className="text-sm text-neutral-500 mt-1">{exp.location}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-neutral-500">
                          {exp.startDate ? new Date(exp.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : ''} - {' '}
                          {exp.endDate ? new Date(exp.endDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Present'}
                        </p>
                        {exp.isCurrent && (
                          <Badge variant="secondary" className="mt-2">Current Position</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {exp.description && (
                      <p className="text-neutral-700 mb-4 leading-relaxed">{exp.description}</p>
                    )}

                    {exp.highlights && Array.isArray(exp.highlights) && exp.highlights.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-neutral-900 mb-2">Key Highlights</h4>
                        <ul className="list-disc list-inside space-y-1 text-neutral-700">
                          {exp.highlights.map((highlight, index) => (
                            <li key={index} className="text-sm">{highlight}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {exp.eventCredits && Array.isArray(exp.eventCredits) && exp.eventCredits.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-neutral-900 mb-2">Event Credits</h4>
                        <div className="flex flex-wrap gap-2">
                          {exp.eventCredits.map((credit, index) => (
                            <Badge key={index} variant="outline">{credit}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {exp.verified && (
                      <div className="mt-4">
                        <Badge variant="default">Verified Experience</Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-500">No professional experience listed.</p>
            </div>
          )}

          {professional.professional_education && professional.professional_education.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Education</h2>
              <div className="space-y-4">
                {professional.professional_education.map((edu) => (
                  <Card key={edu.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{edu.institution}</h3>
                          {edu.degree && (
                            <p className="text-sm text-neutral-600">{edu.degree}</p>
                          )}
                          {edu.fieldOfStudy && (
                            <p className="text-sm text-neutral-600">{edu.fieldOfStudy}</p>
                          )}
                          {edu.description && (
                            <p className="text-sm text-neutral-700 mt-2">{edu.description}</p>
                          )}
                        </div>
                        <div className="text-right text-sm text-neutral-500">
                          <div>
                            {edu.startYear} - {edu.endYear || 'Present'}
                          </div>
                          {edu.verified && (
                            <Badge variant="secondary" className="mt-2">Verified</Badge>
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
