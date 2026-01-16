
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { ArrowLeft, MapPin, Clock, DollarSign, Users, Star, Heart, Share2, Send } from "lucide-react"

interface BrandCareersPageProps {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: BrandCareersPageProps): Promise<Metadata> {
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
        title: 'Brand Careers Not Found',
        description: 'The requested brand careers could not be found.'
      }
    }

    return {
      title: `Careers at ${profile.display_name} | OpusZero`,
      description: `Join the ${profile.display_name} team. Explore career opportunities and current job openings`,
      openGraph: {
        title: `Careers at ${profile.display_name}`,
        description: profile.brand_profiles.description,
        images: profile.avatar_url ? [profile.avatar_url] : []
      }
    }
  } catch (error) {
    return {
      title: 'Brand Careers',
      description: 'Explore career opportunities and job openings'
    }
  }
}

// Fetch brand careers data from database
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

    // Create sample careers (would need careers/job_postings table)
    const careers = [
      {
        id: 'senior-coordinator',
        title: 'Senior Event Coordinator',
        department: 'Operations',
        location: brandProfile.location || 'Remote',
        type: 'Full-time',
        experience: '3-5 years',
        salary: '$65,000 - $85,000',
        posted: new Date().toISOString().split('T')[0],
        description: 'Lead event coordination for high-profile projects and ensure exceptional client experiences.',
        requirements: [
          '3+ years of event coordination experience',
          'Strong project management skills',
          'Excellent communication and interpersonal skills',
          'Proficiency in event management software',
          'Ability to work flexible hours including weekends'
        ],
        benefits: [
          'Competitive salary and performance bonuses',
          'Health, dental, and vision insurance',
          'Professional development opportunities',
          'Flexible work arrangements',
          '401(k) with company match'
        ],
        highlights: [
          'Work on high-profile events',
          'Collaborate with industry leaders',
          'Fast-paced, dynamic environment',
          'Professional growth opportunities'
        ]
      },
      {
        id: 'technical-specialist',
        title: 'Technical Specialist',
        department: 'Technical',
        location: brandProfile.location || 'Remote',
        type: 'Full-time',
        experience: '2-4 years',
        salary: '$55,000 - $75,000',
        posted: new Date().toISOString().split('T')[0],
        description: 'Manage audio, video, and lighting equipment for events and ensure flawless technical execution.',
        requirements: [
          '2+ years of technical experience in live events',
          'Knowledge of audio, video, and lighting systems',
          'Strong problem-solving skills',
          'Ability to lift heavy equipment (up to 50 lbs)',
          'Flexible schedule including evenings and weekends'
        ],
        benefits: [
          'Competitive salary and overtime pay',
          'Health and dental insurance',
          'Equipment training and certification',
          'Professional development stipend',
          'Team building events'
        ],
        highlights: [
          'Work with state-of-the-art equipment',
          'Be part of high-profile productions',
          'Continuous learning opportunities',
          'Collaborative team environment'
        ]
      }
    ]

    // Create culture data (placeholder)
    const culture = {
      values: ['Innovation', 'Excellence', 'Collaboration', 'Sustainability'],
      perks: ['Flexible Hours', 'Professional Development', 'Team Events', 'Health Benefits'],
      diversity: 'We celebrate diversity and are committed to creating an inclusive workplace where all employees feel valued and respected.'
    }

    // Calculate stats (placeholder)
    const stats = {
      employees: brandProfile.employeeCount || 10,
      departments: 5,
      averageTenure: 4.2,
      openPositions: careers.length
    }

    return {
      handle: profile.slug,
      name: profile.displayName,
      logo: profile.avatarUrl || '/api/placeholder/200/100',
      careers,
      culture,
      stats
    }
  } catch (error) {
    logger.error('Error fetching brand careers data', error)
    return null
  }
}

export default async function BrandCareersPage({ params }: BrandCareersPageProps) {
  const { handle } = await params
  const brand = await getBrandData(handle)

  if (!brand) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Careers Header */}
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
                <h1 className="text-2xl font-display font-bold">Careers at {brand.name}</h1>
                <p className="text-muted-foreground">Join our team and help create extraordinary experiences</p>
              </div>
            </div>
            <Button>
              <Send className="h-4 w-4 mr-2"/>
              Submit Resume
            </Button>
          </div>

          {/* Careers Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                {brand.stats.employees}
              </div>
              <div className="text-sm text-muted-foreground">Team Members</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                {brand.stats.departments}
              </div>
              <div className="text-sm text-muted-foreground">Departments</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                {brand.stats.averageTenure}
              </div>
              <div className="text-sm text-muted-foreground">Avg Tenure (Years)</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                {brand.stats.openPositions}
              </div>
              <div className="text-sm text-muted-foreground">Open Positions</div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Open Positions</h2>
            <p className="text-muted-foreground">
              Join our team and be part of creating extraordinary experiences
            </p>
          </div>

          <div className="grid gap-6">
            {brand.careers.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold mb-2">
                            <Link
                              href={`/b/${handle}/careers/${job.id}`}
                              className="hover:text-accent-primary transition-colors"
                            >
                              {job.title}
                            </Link>
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                            <Badge variant="outline">{job.department}</Badge>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3"/>
                              {job.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3"/>
                              {job.type}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-accent-primary mb-1">
                            {job.salary}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {job.experience} experience
                          </div>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {job.description}
                      </p>

                      {/* Highlights */}
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Why Join Us:</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.highlights.map((highlight, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {highlight}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Posted {new Date(job.posted).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Heart className="h-3 w-3 mr-1"/>
                            Save
                          </Button>
                          <Button size="sm" asChild>
                            <Link href={`/b/${handle}/careers/${job.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {brand.careers.length === 0 && (
            <div className="text-center py-16">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4"/>
              <h3 className="text-lg font-semibold mb-2">No open positions</h3>
              <p className="text-muted-foreground mb-4">
                We don&apos;t have any open positions right now, but we&apos;re always looking for talented people.
              </p>
              <Button>Submit Your Resume</Button>
            </div>
          )}
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">
              Life at {brand.name}
            </h2>
            <p className="text-xl text-muted-foreground">
              Discover what makes working here special
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Values */}
            <Card>
              <CardHeader>
                <CardTitle>Our Values</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {brand.culture.values.map((value) => (
                    <Badge key={value} variant="outline">
                      {value}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Perks */}
            <Card>
              <CardHeader>
                <CardTitle>Perks & Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {brand.culture.perks.map((perk, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-accent-primary"/>
                      <span className="text-sm">{perk}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Diversity */}
            <Card>
              <CardHeader>
                <CardTitle>Diversity & Inclusion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {brand.culture.diversity}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-display font-bold mb-4">
            Ready to Join Our Team?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Even if we don&apos;t have the perfect role listed, we&apos;d love to hear from you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              <Send className="h-4 w-4 mr-2"/>
              Submit Your Resume
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
