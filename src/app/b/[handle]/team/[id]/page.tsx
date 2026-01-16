
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, MapPin, Mail, Phone, Calendar, Award, Briefcase, ExternalLink, MessageSquare } from "lucide-react"
import Link from "next/link"
import { Header } from "@/lib/design-system"

interface BrandTeamMemberPageProps {
  params: Promise<{ handle: string; id: string }>
}

export async function generateMetadata({ params }: BrandTeamMemberPageProps): Promise<Metadata> {
  try {
    const { handle, id } = await params
    const supabase = await createClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('*, brand_profiles(*)')
      .eq('slug', handle)
      .single()

    if (!profile?.brand_profiles) {
      return {
        title: 'Team Member Not Found',
        description: 'The requested team member could not be found.'
      }
    }

    return {
      title: `Team Member | ${profile.display_name}`,
      description: `Learn more about our team member at ${profile.display_name}`,
      openGraph: {
        title: `Team Member | ${profile.display_name}`,
        description: `Meet our talented team member`,
        images: profile.avatar_url ? [profile.avatar_url] : []
      }
    }
  } catch (error) {
    return {
      title: 'Team Member',
      description: 'Team member profile and information'
    }
  }
}

// Fetch team member data from database
async function getTeamMemberData(handle: string, memberId: string) {
  try {
    const supabase = await createClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('*, brand_profiles(*)')
      .eq('slug', handle)
      .single()

    if (!profile?.brand_profiles) {
      return null
    }

    // Placeholder team member data (would need team_members table)
    // For now, create sample data based on memberId
    const teamMembers = {
      'founder-ceo': {
        id: 'founder-ceo',
        name: 'Founder & CEO',
        title: 'Chief Executive Officer',
        department: 'Executive',
        avatar: '/api/placeholder/200/200',
        coverImage: '/api/placeholder/1200/400',
        bio: `Experienced leader with a passion for driving innovation and excellence in our industry. Founded the company with a vision to deliver exceptional experiences and build lasting relationships with our clients.

Under leadership, the company has achieved significant growth and industry recognition. Committed to fostering a culture of excellence and continuous improvement.`,
        email: 'ceo@example.com',
        phone: '+1 (555) 123-4567',
        location: profile.brand_profiles.location || 'Headquarters',
        joinedDate: '2020-01-01',
        yearsExperience: 15,
        education: [
          {
            degree: 'MBA',
            institution: 'Harvard Business School',
            year: '2015'
          },
          {
            degree: 'Bachelor of Business Administration',
            institution: 'University of California',
            year: '2012'
          }
        ],
        achievements: [
          { name: 'Industry Innovator Award 2023', description: 'Recognition for technological innovation in venues', year: '2023' },
          { name: 'Women in Business Leadership Award', description: 'Outstanding leadership in the business community', year: '2022' },
          { name: 'Hospitality Excellence Award', description: 'Excellence in hospitality and customer service', year: '2021' },
          { name: 'Entrepreneur of the Year', description: 'Recognition for business growth and innovation', year: '2020' }
        ],
        skills: [
          'Strategic Leadership',
          'Business Development',
          'Team Management',
          'Industry Expertise',
          'Client Relations'
        ],
        certifications: [
          'Certified Meeting Professional (CMP)',
          'Certified Hospitality Administrator (CHA)',
          'Project Management Professional (PMP)'
        ],
        experience: [
          {
            title: 'Founder & CEO',
            company: profile.displayName,
            period: '2020 - Present',
            description: 'Founded and led the company to become a leader in the industry.'
          },
          {
            title: 'General Manager',
            company: 'Previous Company',
            period: '2015 - 2020',
            description: 'Managed operations and led strategic initiatives.'
          },
          {
            title: 'Department Manager',
            company: 'Previous Company',
            period: '2012 - 2015',
            description: 'Built and managed successful teams and projects.'
          }
        ],
        socialLinks: {
          linkedin: 'https://linkedin.com/in/ceo',
          twitter: 'https://twitter.com/ceo'
        },
        stats: {
          eventsManaged: 500,
          venuesOversaw: 25,
          teamMembers: 150,
          clientSatisfaction: 98
        }
      },
      'operations-director': {
        id: 'operations-director',
        name: 'Operations Director',
        title: 'Director of Operations',
        department: 'Operations',
        avatar: '/api/placeholder/200/200',
        coverImage: '/api/placeholder/1200/400',
        bio: `Operations expert with extensive experience in process optimization and team management. Dedicated to ensuring smooth operations and exceptional service delivery across all projects.

Specializes in streamlining workflows and implementing best practices to drive efficiency and quality. Passionate about building high-performing teams and fostering a culture of continuous improvement.`,
        email: 'ops@example.com',
        phone: '+1 (555) 123-4568',
        location: profile.brand_profiles.location || 'Headquarters',
        joinedDate: '2021-03-15',
        yearsExperience: 12,
        education: [
          {
            degree: 'Master of Operations Management',
            institution: 'MIT Sloan School of Management',
            year: '2018'
          },
          {
            degree: 'Bachelor of Industrial Engineering',
            institution: 'Georgia Institute of Technology',
            year: '2015'
          }
        ],
        achievements: [
          { name: 'Operations Excellence Award 2023', description: 'Recognition for operational improvements', year: '2023' },
          { name: 'Process Optimization Champion', description: 'Led major process improvement initiatives', year: '2022' },
          { name: 'Team Leadership Recognition', description: 'Excellence in team management and development', year: '2021' },
          { name: 'Efficiency Improvement Award', description: 'Significant cost and time savings achieved', year: '2020' }
        ],
        skills: [
          'Operations Management',
          'Process Optimization',
          'Team Leadership',
          'Project Management',
          'Quality Assurance'
        ],
        certifications: [
          'Six Sigma Black Belt',
          'Lean Manufacturing Certification',
          'Project Management Professional (PMP)'
        ],
        experience: [
          {
            title: 'Director of Operations',
            company: profile.displayName,
            period: '2021 - Present',
            description: 'Led operations team and implemented process improvements.'
          },
          {
            title: 'Operations Manager',
            company: 'Previous Company',
            period: '2018 - 2021',
            description: 'Managed daily operations and optimized workflows.'
          },
          {
            title: 'Process Engineer',
            company: 'Manufacturing Company',
            period: '2015 - 2018',
            description: 'Designed and implemented process improvements.'
          }
        ],
        socialLinks: {
          linkedin: 'https://linkedin.com/in/ops-director'
        },
        stats: {
          processesOptimized: 25,
          efficiencyIncrease: 40,
          teamSize: 75,
          projectSuccess: 95
        }
      }
    }

    return teamMembers[memberId as keyof typeof teamMembers] || null
  } catch (error) {
    logger.error('Error fetching team member data', error)
    return null
  }
}

export default async function BrandTeamMemberPage({ params }: BrandTeamMemberPageProps) {
  const { handle, id } = await params
  const member = await getTeamMemberData(handle, id)

  if (!member) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Member Header */}
      <section className="py-12 px-4 bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/b/${handle}/team`}>
                <ArrowLeft className="h-4 w-4 mr-2"/>
                Back to Team
              </Link>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <Avatar className="w-32 h-32">
                <AvatarImage src={member.avatar} alt={member.name}/>
                <AvatarFallback className="text-2xl">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-display font-bold mb-2">{member.name}</h1>
              <p className="text-2xl text-accent-primary mb-4">{member.title}</p>
              <p className="text-muted-foreground mb-4">{member.department} Department</p>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4"/>
                  {member.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4"/>
                  Joined {new Date(member.joinedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4"/>
                  {member.yearsExperience} years experience
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Member Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Biography */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">About {member.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    {member.bio.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4 leading-relaxed">
                        {paragraph.trim()}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Experience */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Briefcase className="h-5 w-5"/>
                    Professional Experience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {member.experience.map((exp, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-accent-primary"/>
                          {index < member.experience.length - 1 && (
                            <div className="w-0.5 h-16 bg-accent-primary/30 mt-2"/>
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <h4 className="font-semibold text-lg">{exp.title}</h4>
                          <p className="text-accent-primary mb-2">{exp.company}</p>
                          <p className="text-sm text-muted-foreground mb-3">{exp.period}</p>
                          <p className="text-muted-foreground">{exp.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Award className="h-5 w-5"/>
                    Achievements & Recognition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {member.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="flex-shrink-0 w-10 h-10 bg-accent-primary/10 rounded-lg flex items-center justify-center">
                          <Award className="h-5 w-5 text-accent-primary"/>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{achievement.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                          <Badge variant="outline" className="text-xs">{achievement.year}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-accent-primary"/>
                    <a href={`mailto:${member.email}`} className="text-sm hover:text-accent-primary transition-colors">
                      {member.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-accent-primary"/>
                    <span className="text-sm">{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-accent-primary"/>
                    <span className="text-sm">{member.location}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Certifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {member.certifications.map((cert, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-accent-primary"/>
                        <span className="text-sm">{cert}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Education */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Education</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {member.education.map((edu, index) => (
                      <div key={index} className="border-l-2 border-accent-primary pl-4">
                        <h4 className="font-medium">{edu.degree}</h4>
                        <p className="text-sm text-accent-primary">{edu.institution}</p>
                        <p className="text-sm text-muted-foreground">{edu.year}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Connect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {member.socialLinks?.linkedin && (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2"/>
                        LinkedIn Profile
                      </a>
                    </Button>
                  )}
                  {member.socialLinks?.twitter && (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2"/>
                        Twitter Profile
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2"/>
                    Send Message
                  </Button>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Key Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    {Object.entries(member.stats).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="font-medium">
                          {typeof value === 'number' && value > 1000
                            ? `${(value / 1000).toFixed(0)}K`
                            : value
                          }
                        </span>
                      </div>
                    ))}
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
