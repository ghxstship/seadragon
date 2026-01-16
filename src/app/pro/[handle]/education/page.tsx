
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/lib/design-system"
import { ArrowLeft, GraduationCap, MapPin, Calendar, Award, BookOpen } from "lucide-react"

interface Education {
  id: string
  institution: string
  degree: string
  field: string
  location: string
  startYear: string
  endYear: string
  gpa?: string
  honors?: string[]
  description: string
  achievements?: string[]
  relevantCourses?: string[]
}

interface ProfessionalEducationPageProps {
  params: Promise<{ handle: string }>
}

// Mock data - in real app, this would come from API based on handle
function getEducationData(handle: string) {
  const educations = {
    'diana_krall': [
      {
        id: 'berklee-college',
        institution: 'Berklee College of Music',
        degree: 'Professional Music',
        field: 'Jazz Performance',
        location: 'Boston, MA',
        startYear: '1981',
        endYear: '1983',
        gpa: '3.8',
        honors: ['Dean\'s List', 'Outstanding Jazz Performance Award'],
        description: 'Focused on jazz piano performance, music theory, and vocal training. Participated in numerous ensembles and performed at college concerts.',
        achievements: [
          'Outstanding Jazz Performance Award (1983)',
          'Featured in college jazz ensemble concerts',
          'Completed advanced music theory and composition courses'
        ],
        relevantCourses: [
          'Jazz Piano Performance',
          'Music Theory & Composition',
          'Vocal Jazz Ensemble',
          'Music History'
        ]
      },
      {
        id: 'capilano-college',
        institution: 'Capilano College',
        degree: 'Associate Degree',
        field: 'Music',
        location: 'North Vancouver, BC',
        startYear: '1978',
        endYear: '1981',
        description: 'Foundation in music theory, piano performance, and music history. Developed fundamental musical skills and stage presence.',
        achievements: [
          'Piano performance recital (1980)',
          'Music theory excellence award'
        ],
        relevantCourses: [
          'Piano Performance',
          'Music Theory',
          'Music History',
          'Ensemble Performance'
        ]
      }
    ],
    'venue_manager_pro': [
      {
        id: 'usc-marshall',
        institution: 'University of Southern California',
        degree: 'Bachelor of Science',
        field: 'Event Management',
        location: 'Los Angeles, CA',
        startYear: '2006',
        endYear: '2010',
        gpa: '3.6',
        honors: ['Event Management Honor Society', 'Outstanding Senior Project'],
        description: 'Comprehensive program covering event planning, venue management, hospitality, and business administration. Capstone project involved planning and executing a major campus event.',
        achievements: [
          'Outstanding Senior Project - Planned university career fair for 500+ attendees',
          'President of Event Management Student Association',
          'Internship at Los Angeles Convention Center'
        ],
        relevantCourses: [
          'Event Planning & Coordination',
          'Venue Management',
          'Hospitality Management',
          'Business Administration',
          'Marketing & Promotion'
        ]
      }
    ]
  }

  return educations[handle as keyof typeof educations] || []
}

export default async function ProfessionalEducationPage({ params }: ProfessionalEducationPageProps) {
  const { handle } = await params
  const educationHistory = getEducationData(handle)

  if (educationHistory.length === 0) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Profile Header */}
      <section className="py-8 px-4 bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/pro/${handle}`}>
                <ArrowLeft className="h-4 w-4 mr-2"/>
                Back to Profile
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-accent-primary"/>
              <div>
                <h1 className="text-2xl font-display font-bold">Education</h1>
                <p className="text-muted-foreground">@{handle}</p>
              </div>
            </div>
          </div>

          {/* Education Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                {educationHistory.length}
              </div>
              <div className="text-sm text-muted-foreground">Institutions</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                {educationHistory.reduce((sum: number, edu: Education) => sum + (Number(edu.endYear) - Number(edu.startYear)), 0)}
              </div>
              <div className="text-sm text-muted-foreground">Years of Study</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                {educationHistory.flatMap(edu => edu.honors || []).length}
              </div>
              <div className="text-sm text-muted-foreground">Honors & Awards</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                {educationHistory.flatMap(edu => edu.relevantCourses || []).length}
              </div>
              <div className="text-sm text-muted-foreground">Relevant Courses</div>
            </div>
          </div>
        </div>
      </section>

      {/* Education Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-8">
            {educationHistory.map((education, index) => (
              <Card key={education.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Education Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="text-2xl font-bold mb-2">{education.institution}</h2>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="default">{education.degree}</Badge>
                            <Badge variant="outline">{education.field}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3"/>
                              {education.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3"/>
                              {education.startYear} - {education.endYear}
                            </div>
                            {education.gpa && (
                              <div className="flex items-center gap-1">
                                <Award className="h-3 w-3"/>
                                GPA: {education.gpa}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {education.description}
                      </p>

                      {/* Honors & Awards */}
                      {education.honors && education.honors.length > 0 && (
                        <div className="mb-4">
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <Award className="h-4 w-4"/>
                            Honors & Awards
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {education.honors.map((honor, honorIndex) => (
                              <Badge key={honorIndex} variant="secondary" className="text-xs">
                                {honor}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Key Achievements */}
                      {education.achievements && education.achievements.length > 0 && (
                        <div className="mb-4">
                          <h3 className="font-semibold mb-2">Key Achievements</h3>
                          <ul className="space-y-1">
                            {education.achievements.map((achievement, achievementIndex) => (
                              <li key={achievementIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="w-1 h-1 rounded-full bg-accent-primary mt-2 flex-shrink-0"/>
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Relevant Courses */}
                      {education.relevantCourses && education.relevantCourses.length > 0 && (
                        <div>
                          <h3 className="font-semibold mb-2 flex items-center gap-2">
                            <BookOpen className="h-4 w-4"/>
                            Relevant Courses
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {education.relevantCourses.map((course, courseIndex) => (
                              <Badge key={courseIndex} variant="outline" className="text-xs">
                                {course}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Education Timeline */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Educational Journey</CardTitle>
              <CardDescription>
                Timeline of educational milestones and achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {educationHistory
                  .sort((a, b) => parseInt(b.startYear) - parseInt(a.startYear))
                  .map((education, index) => (
                    <div key={education.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-4 h-4 rounded-full bg-accent-primary"/>
                        {index < educationHistory.length - 1 && (
                          <div className="w-0.5 h-16 bg-accent-primary/30 mt-2"/>
                        )}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{education.institution}</h3>
                          <Badge variant="outline" className="text-xs">
                            {education.startYear} - {education.endYear}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {education.degree} in {education.field}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{education.location}</span>
                          {education.gpa && <span>GPA: {education.gpa}</span>}
                          {education.honors && <span>{education.honors.length} honors</span>}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
