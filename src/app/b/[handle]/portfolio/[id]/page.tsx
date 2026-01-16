
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { Header } from '@/lib/design-system'
import { logger } from '@/lib/logger'
import { ArrowLeft, Calendar, Users, Award, Star, Share2, Download, CheckCircle, Target, TrendingUp } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

interface BrandPortfolioItemPageProps {
  params: Promise<{ handle: string; id: string }>
}

interface PortfolioItem {
  id: string
  title: string
  category: string
  type: string
  year: string
  client: string
  location: string
  duration: string
  attendees: number
  budget: string
  images: string[]
  overview: string
  challenge: string
  solution: string
  results: Array<{ metric: string; value: string; description: string }>
  highlights: string[]
  technologies: string[]
  team: Array<{ name: string; role: string; avatar: string }>
  testimonial: { quote: string; author: string; title: string; avatar: string }
  awards: Array<{ name: string; issuer: string }>
}

type MediaItem = string | { url: string; [key: string]: unknown }

async function getPortfolioItemData(handle: string, itemId: string): Promise<PortfolioItem | null> {
  try {
    const supabase = await createClient()
    
    // First get the brand profile by handle/slug
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, slug, brand_profiles(description)')
      .eq('slug', handle)
      .single()

    if (!profile) {
      logger.error('Brand profile not found', profileError)
      return null
    }

    const safeProfile = profile as NonNullable<typeof profile>

    const brandProfile = Array.isArray(safeProfile.brand_profiles)
      ? safeProfile.brand_profiles[0]
      : safeProfile.brand_profiles

    if (!brandProfile) {
      logger.error('Brand profile not found')
      return null
    }

    // Fetch portfolio item from brand_portfolio scoped to the brand
    const { data: portfolioItem, error } = await supabase
      .from('brand_portfolio')
      .select('id, project_type, title, client, date, location, description, results, media, testimonial, tags, "createdAt"')
      .eq('brand_id', safeProfile.id)
      .eq('id', itemId)
      .single()

    if (error || !portfolioItem) {
      logger.error('Portfolio item not found', error)
      return null
    }

    const media = Array.isArray(portfolioItem.media) ? portfolioItem.media : []
    const firstMedia = media.find((item: MediaItem) => item && typeof item === 'object' && 'url' in item) || media[0]
    const images = [
      typeof firstMedia === 'string' ? firstMedia : (firstMedia && typeof firstMedia === 'object' && 'url' in firstMedia ? firstMedia.url : '/api/placeholder/800/450'),
      ...media.slice(1).map((m: MediaItem) => (typeof m === 'string' ? m : (m && typeof m === 'object' && 'url' in m ? m.url : ''))).filter(Boolean)
    ] as string[]

    const tags = Array.isArray(portfolioItem.tags) ? portfolioItem.tags.filter((t) => typeof t === 'string') : []
    const highlights: string[] = tags.length ? tags : portfolioItem.results ? [portfolioItem.results].filter(Boolean) as string[] : []

    const year = portfolioItem.date
      ? new Date(portfolioItem.date).getFullYear().toString()
      : portfolioItem.createdAt
        ? new Date(portfolioItem.createdAt).getFullYear().toString()
        : ''

    return {
      id: portfolioItem.id,
      title: portfolioItem.title || 'Untitled Project',
      category: portfolioItem.project_type || 'Project',
      type: portfolioItem.project_type || 'Project',
      year,
      client: portfolioItem.client || '',
      location: portfolioItem.location || '',
      duration: portfolioItem.location || '',
      attendees: 0,
      budget: '',
      images: images.length ? images : ['/api/placeholder/800/450'],
      overview: portfolioItem.description || '',
      challenge: '',
      solution: '',
      results: [],
      highlights,
      technologies: [],
      team: [],
      testimonial: portfolioItem.testimonial
        ? { quote: portfolioItem.testimonial, author: '', title: '', avatar: '' }
        : { quote: '', author: '', title: '', avatar: '' },
      awards: []
    }
  } catch (error) {
    logger.error('Error fetching portfolio item:', error)
    return null
  }
}

export default async function BrandPortfolioItemPage({ params }: BrandPortfolioItemPageProps) {
  const { handle, id } = await params
  const item = await getPortfolioItemData(handle, id)

  if (!item) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Project Hero */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/b/${handle}/portfolio`}>
                <ArrowLeft className="h-4 w-4 mr-2"/>
                Back to Portfolio
              </Link>
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Project Images */}
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden relative">
                <Image
                  src={item.images[0]}
                  alt={item.title}
                  fill
                  className="object-cover"/>
              </div>
              {item.images.length > 1 && (
                <div className="grid grid-cols-2 gap-4">
                  {item.images.slice(1).map((image: string, index: number) => (
                    <div key={index} className="aspect-video rounded-lg overflow-hidden relative">
                      <Image
                        src={image}
                        alt={`${item.title} ${index + 2}`}
                        fill
                        className="object-cover"/>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{item.category}</Badge>
                  <Badge variant="secondary">{item.year}</Badge>
                </div>
                <h1 className="text-3xl font-bold mb-4">{item.title}</h1>
                <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium">Client:</span>
                    <p>{item.client}</p>
                  </div>
                  <div>
                    <span className="font-medium">Location:</span>
                    <p>{item.location}</p>
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span>
                    <p>{item.duration}</p>
                  </div>
                  <div>
                    <span className="font-medium">Attendees:</span>
                    <p>{item.attendees.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <Separator/>

              {/* Project Overview */}
              <div>
                <h2 className="text-xl font-semibold mb-3">Project Overview</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {item.overview}
                </p>
              </div>

              {/* Key Results */}
              <div>
                <h2 className="text-xl font-semibold mb-3">Key Results</h2>
                <div className="grid grid-cols-2 gap-4">
                  {item.results.map((result, index) => (
                    <div key={index} className="text-center p-4 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-accent-primary mb-1">
                        {result.value}
                      </div>
                      <div className="text-sm font-medium mb-1">{result.metric}</div>
                      <div className="text-xs text-muted-foreground">{result.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button>
                  <Download className="h-4 w-4 mr-2"/>
                  Download Case Study
                </Button>
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2"/>
                  Share Project
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-12 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Challenge & Solution */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5"/>
                    The Challenge
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.challenge}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5"/>
                    Our Solution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {item.solution.split('\n').map((line, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-4 w-4 text-accent-primary mt-0.5 flex-shrink-0"/>
                        <span className="text-muted-foreground">{line.trim()}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Highlights & Technologies */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5"/>
                    Project Highlights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {item.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Star className="h-4 w-4 text-accent-primary mt-0.5 flex-shrink-0"/>
                        <span className="text-muted-foreground">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Technologies & Tools</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {item.technologies.map((tech, index) => (
                      <Badge key={index} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Team & Testimonials */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Project Team */}
            <Card>
              <CardHeader>
                <CardTitle>Project Team</CardTitle>
                <CardDescription>
                  The talented professionals who made this project a success
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {item.team.map((member, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Image
                        src={member.avatar}
                        alt={member.name}
                        width={40}
                        height={40}
                        className="rounded-full"/>
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-muted-foreground">{member.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Client Testimonial */}
            <Card>
              <CardHeader>
                <CardTitle>Client Testimonial</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Image
                    src={item.testimonial.avatar}
                    alt={item.testimonial.author}
                    width={64}
                    height={64}
                    className="rounded-full flex-shrink-0"/>
                  <div>
                    <blockquote className="text-muted-foreground italic mb-3">
                      &ldquo;{item.testimonial.quote}&rdquo;
                    </blockquote>
                    <div className="font-medium">{item.testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{item.testimonial.title}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Awards */}
          {item.awards && item.awards.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5"/>
                  Awards & Recognition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {item.awards.map((award, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                      <Award className="h-6 w-6 text-accent-primary flex-shrink-0"/>
                      <div>
                        <h4 className="font-medium">{award.name}</h4>
                        <p className="text-sm text-muted-foreground">{award.issuer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Related Projects */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-display font-bold mb-4">
            Explore More Projects
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            See more of our work and success stories
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href={`/b/${handle}/portfolio`}>
                View Full Portfolio
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={`/b/${handle}/contact`}>
                Start Your Project
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
