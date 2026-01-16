
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { ArrowLeft, Users, MapPin, Mail, Phone, Calendar, Award, Star, Briefcase } from "lucide-react"

interface BrandTeamPageProps {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: BrandTeamPageProps): Promise<Metadata> {
  try {
    const { handle } = await params
    const supabase = await createClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('*, brand_profiles(*)')
      .eq('slug', handle)
      .single()

    if (!profile?.brand_profiles) {
      return {
        title: 'Brand Team Not Found',
        description: 'The requested brand team could not be found.'
      }
    }

    return {
      title: `${profile.display_name} - Our Team | OpusZero`,
      description: `Meet the ${profile.display_name} team. Learn about our leadership and talented professionals`,
      openGraph: {
        title: `${profile.display_name} - Our Team`,
        description: profile.brand_profiles.description,
        images: profile.avatar_url ? [profile.avatar_url] : []
      }
    }
  } catch (error) {
    return {
      title: 'Brand Team',
      description: 'Meet our leadership team and professionals'
    }
  }
}
// Fetch brand team data from database
async function getBrandData(handle: string) {
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

    const brandProfile = profile.brand_profiles

    // Create sample team members (would need team_members table)
    const team = [
      {
        id: 'founder-ceo',
        name: 'Founder & CEO',
        title: 'Chief Executive Officer',
        department: 'Executive',
        avatar: '/api/placeholder/150/150',
        bio: 'Experienced leader driving innovation and excellence in our industry.',
        email: 'ceo@example.com',
        phone: '+1 (555) 123-4567',
        location: brandProfile.location || 'Headquarters',
        joinedDate: '2020-01-01',
        experience: 10,
        achievements: ['Industry Leader', 'Innovation Award'],
        skills: ['Leadership', 'Strategy', 'Business Development'],
        socialLinks: {
          linkedin: 'https://linkedin.com/in/ceo'
        }
      },
      {
        id: 'operations-director',
        name: 'Operations Director',
        title: 'Director of Operations',
        department: 'Operations',
        avatar: '/api/placeholder/150/150',
        bio: 'Expert in operations management and process optimization.',
        email: 'ops@example.com',
        phone: '+1 (555) 123-4568',
        location: brandProfile.location || 'Headquarters',
        joinedDate: '2021-03-15',
        experience: 8,
        achievements: ['Operations Excellence', 'Process Improvement'],
        skills: ['Operations Management', 'Process Optimization', 'Team Leadership'],
        socialLinks: {
          linkedin: 'https://linkedin.com/in/ops-director'
        }
      },
      {
        id: 'creative-director',
        name: 'Creative Director',
        title: 'Creative Director',
        department: 'Creative',
        avatar: '/api/placeholder/150/150',
        bio: 'Creative visionary bringing innovative ideas to life.',
        email: 'creative@example.com',
        phone: '+1 (555) 123-4569',
        location: brandProfile.location || 'Headquarters',
        joinedDate: '2022-06-01',
        experience: 6,
        achievements: ['Creative Excellence', 'Design Innovation'],
        skills: ['Creative Direction', 'Design', 'Innovation'],
        socialLinks: {
          linkedin: 'https://linkedin.com/in/creative-director',
          instagram: 'https://instagram.com/creative'
        }
      }
    ]

    // Create departments
    const departments = [...new Set(team.map(t => t.department))]

    // Calculate stats (placeholder)
    const stats = {
      totalEmployees: brandProfile.employeeCount || team.length,
      averageTenure: 3.5,
      departments: departments.length,
      locations: 1
    }

    return {
      handle: profile.slug,
      name: profile.displayName,
      logo: profile.avatarUrl || '/api/placeholder/200/100',
      team,
      departments,
      stats
    }
  } catch (error) {
    logger.error('Error fetching brand team data', error)
    return null
  }
}

export default async function BrandTeamPage({ params }: BrandTeamPageProps) {
  const { handle } = await params
  const brand = await getBrandData(handle)

  if (!brand) {
    notFound()
  }

  // Group team members by department
  const teamByDepartment = brand.team.reduce((acc: Record<string, typeof brand.team>, member: typeof brand.team[number]) => {
    if (!acc[member.department]) {
      acc[member.department] = []
    }
    acc[member.department].push(member)
    return acc
  }, {} as Record<string, typeof brand.team>)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Team Header */}
      <section className="py-8 px-4 bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/b/${handle}`}>
                <ArrowLeft className="h-4 w-4 mr-2"/>
                Back to Profile
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <Users className="h-8 w-8 text-accent-primary"/>
              <div>
                <h1 className="text-2xl font-display font-bold">{brand.name} Team</h1>
                <p className="text-muted-foreground">Meet the people behind our success</p>
              </div>
            </div>
            <Button>
              <Mail className="h-4 w-4 mr-2"/>
              Contact Team
            </Button>
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                {brand.stats.totalEmployees}
              </div>
              <div className="text-sm text-muted-foreground">Team Members</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                {brand.stats.averageTenure}
              </div>
              <div className="text-sm text-muted-foreground">Avg Tenure (Years)</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                {brand.stats.departments}
              </div>
              <div className="text-sm text-muted-foreground">Departments</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                {brand.stats.locations}
              </div>
              <div className="text-sm text-muted-foreground">Locations</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {brand.departments.map((department: string) => {
            const departmentMembers = teamByDepartment[department] || []

            if (departmentMembers.length === 0) return null

            return (
              <div key={department} className="mb-12">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Briefcase className="h-6 w-6 text-accent-primary"/>
                  {department} ({departmentMembers.length})
                </h2>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {departmentMembers.map((member: typeof brand.team[number]) => (
                    <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={member.avatar} alt={member.name}/>
                            <AvatarFallback>{member.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">
                              <Link
                                href={`/b/${handle}/team/${member.id}`}
                                className="hover:text-accent-primary transition-colors"
                              >
                                {member.name}
                              </Link>
                            </h3>
                            <p className="text-accent-primary font-medium mb-2">{member.title}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3"/>
                                {member.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3"/>
                                {member.experience}y exp
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                          {member.bio}
                        </p>

                        {/* Skills */}
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {member.skills.slice(0, 3).map((skill: string) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Achievements */}
                        {member.achievements.length > 0 && (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-1">
                              {member.achievements.slice(0, 2).map((achievement: string) => (
                                <Badge key={achievement} variant="outline" className="text-xs">
                                  <Award className="h-3 w-3 mr-1"/>
                                  {achievement}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Contact */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                            <Mail className="h-3 w-3"/>
                          </Button>
                          <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                            <Phone className="h-3 w-3"/>
                          </Button>
                          {member.socialLinks?.linkedin && (
                            <Button variant="ghost" size="sm" className="p-1 h-6 w-6" asChild>
                              <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                                <span className="text-xs">in</span>
                              </a>
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Join Our Team */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-display font-bold mb-4">
            Join Our Team
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Be part of a team that&apos;s passionate about creating extraordinary experiences
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href={`/b/${handle}/careers`}>
                View Open Positions
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={`/b/${handle}/contact`}>
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
