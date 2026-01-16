
'use client'

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { logger } from "@/lib/logger"
import { ArrowLeft, MapPin, Calendar, Building, Award, Users, ExternalLink } from "lucide-react"

interface ProfessionalExperienceDetailPageProps {
  params: Promise<{ handle: string; id: string }>
}

interface ExperienceData {
  id: string
  title: string
  company: string
  companyWebsite?: string
  location: string
  employmentType: string
  startDate: string
  endDate: string | null
  description: string
  achievements: string[]
  skills: string[]
  keyProjects: { name: string; description: string; year: string; type: string }[]
  references: { name: string; title: string; relationship: string; contact: string }[]
}

export default function ProfessionalExperienceDetailPage({ params }: ProfessionalExperienceDetailPageProps) {
  const { handle, id } = use(params)
  const [experience, setExperience] = useState<ExperienceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!handle || !id) return
    const fetchExperience = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/v1/profiles/${handle}/experiences/${id}`)
        if (res.ok) {
          const data = await res.json()
          const exp = data.experience || data.data?.experience
          if (exp) {
            setExperience({
              id: exp.id || id,
              title: exp.title || 'Experience',
              company: exp.company || 'Company',
              companyWebsite: exp.company_website,
              location: exp.location || 'Location',
              employmentType: exp.employment_type || 'Full-time',
              startDate: exp.start_date || new Date().toISOString(),
              endDate: exp.end_date,
              description: exp.description || '',
              achievements: exp.achievements || [],
              skills: exp.skills || [],
              keyProjects: exp.key_projects || [],
              references: exp.references || []
            })
          }
        }
      } catch (error) {
        logger.error('Error fetching experience:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchExperience()
  }, [handle, id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading experience...</div>
      </div>
    )
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Experience Not Found</h1>
          <p className="text-muted-foreground">This experience does not exist.</p>
          <Link href={`/pro/${handle}`} className="text-accent-primary mt-4 inline-block">Back to Profile</Link>
        </div>
      </div>
    )
  }

  const isCurrentPosition = !experience.endDate
  const duration = isCurrentPosition
    ? `${new Date(experience.startDate).getFullYear()} - Present`
    : `${new Date(experience.startDate).getFullYear()} - ${new Date(experience.endDate!).getFullYear()}`

return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Profile Header */}
      <section className="py-8 px-4 bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/pro/${handle}/experience`}>
                <ArrowLeft className="h-4 w-4 mr-2"/>
                Back to Experience
              </Link>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-display font-bold">{experience.title}</h1>
                {isCurrentPosition && (
                  <Badge variant="default" className="text-xs">
                    Current Position
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4"/>
                  <a
                    href={experience.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-accent-primary transition-colors"
                  >
                    {experience.company}
                  </a>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4"/>
                  {experience.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4"/>
                  {duration}
                </div>
              </div>
              <Badge variant="outline" className="text-sm">
                {experience.employmentType}
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Job Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Role Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    {experience.description.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 leading-relaxed">
                        {paragraph.trim()}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Key Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Award className="h-5 w-5"/>
                    Key Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {experience.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-accent-primary mt-2 flex-shrink-0"/>
                        <span className="text-muted-foreground">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Key Projects */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Key Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {experience.keyProjects.map((project, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold">{project.name}</h4>
                          <Badge variant="outline" className="text-xs">
                            {project.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{project.description}</p>
                        <div className="text-xs text-muted-foreground">
                          {project.year}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Skills Used */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Skills Utilized</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {experience.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Duration & Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Employment Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="font-medium text-sm">Duration:</span>
                    <p className="text-sm text-muted-foreground">{duration}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Employment Type:</span>
                    <p className="text-sm text-muted-foreground">{experience.employmentType}</p>
                  </div>
                  <div>
                    <span className="font-medium text-sm">Location:</span>
                    <p className="text-sm text-muted-foreground">{experience.location}</p>
                  </div>
                </CardContent>
              </Card>

              {/* References */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">References</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {experience.references.map((reference, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <h4 className="font-medium text-sm">{reference.name}</h4>
                        <p className="text-xs text-muted-foreground mb-1">{reference.title}</p>
                        <p className="text-xs text-muted-foreground mb-2">{reference.relationship}</p>
                        <p className="text-xs text-muted-foreground">{reference.contact}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2"/>
                    View Company Website
                  </Button>
                  <Button variant="outline" className="w-full">
                    Request Reference
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/pro/${handle}`}>
                      View Full Profile
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
