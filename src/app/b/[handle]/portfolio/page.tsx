
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Briefcase, Eye, Calendar, Users, Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { Header } from '@/lib/design-system'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Image from 'next/image'

interface MediaItem {
  url?: string
  type?: string
  alt?: string
}

interface BrandPortfolioPageProps {
  params: Promise<{ handle: string }>
}

interface PortfolioProject {
  id: string
  title: string
  category: string
  type: string
  description: string
  image: string
  year: string
  client?: string
  attendees: number
  duration?: string
  highlights: string[]
  technologies: string[]
  testimonial?: {
    quote?: string
    author?: string
    title?: string
    avatar?: string
  }
}

interface BrandPortfolioData {
  handle: string
  name: string
  logo?: string | null
  portfolio: PortfolioProject[]
  categories: string[]
  stats: {
    totalProjects: number
    satisfiedClients: number
    averageRating?: number | null
    yearsExperience?: number | null
  }
}

export async function generateMetadata({ params }: BrandPortfolioPageProps): Promise<Metadata> {
  try {
    const { handle } = await params
    const supabase = await createClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, avatar_url, brand_profiles(description)')
      .eq('slug', handle)
      .single()

    if (!profile) {
      return {
        title: 'Brand Portfolio Not Found',
        description: 'The requested brand portfolio could not be found.'
      }
    }

    const safeProfile = profile as NonNullable<typeof profile>

    const brandProfile = Array.isArray(safeProfile.brand_profiles)
      ? safeProfile.brand_profiles[0]
      : safeProfile.brand_profiles

    if (!brandProfile) {
      return {
        title: 'Brand Portfolio Not Found',
        description: 'The requested brand portfolio could not be found.'
      }
    }

    return {
      title: `${safeProfile.display_name} - Portfolio | OpusZero`,
      description: `${brandProfile.description || `Explore ${safeProfile.display_name}'s portfolio and past projects`}`,
      openGraph: {
        title: `${safeProfile.display_name} - Portfolio`,
        description: brandProfile.description,
        images: safeProfile.avatar_url ? [safeProfile.avatar_url] : []
      }
    }
  } catch (error) {
    return {
      title: 'Brand Portfolio',
      description: 'Explore our past projects and work'
    }
  }
}
async function getBrandData(handle: string): Promise<BrandPortfolioData | null> {
  try {
    const supabase = await createClient()
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, slug, display_name, avatar_url, brand_profiles(description)')
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

    if (profileError || !brandProfile) {
      logger.error('Brand profile not found', profileError)
      return null
    }

    const brandId = safeProfile.id

    const { data: portfolioRows, error: portfolioError } = await supabase
      .from('brand_portfolio')
      .select('id, project_type, title, client, date, location, description, results, media, testimonial, featured, tags, "createdAt"')
      .eq('brand_id', brandId)
      .order('createdAt', { ascending: false })

    if (portfolioError) {
      logger.error('Error fetching brand portfolio', portfolioError)
      return null
    }

    const portfolio: PortfolioProject[] = (portfolioRows || []).map((project) => {
      const media = Array.isArray(project.media) ? project.media : []
      const firstMedia = media.find((item: MediaItem) => item?.url) || media[0]
      const image = typeof firstMedia === 'string' ? firstMedia : firstMedia?.url

      const tags = Array.isArray(project.tags) ? project.tags.filter((t) => typeof t === 'string') : []
      const highlights: string[] = tags.length ? tags : project.results ? [project.results].filter(Boolean) as string[] : []

      const year = project.date
        ? new Date(project.date).getFullYear().toString()
        : project.createdAt
          ? new Date(project.createdAt).getFullYear().toString()
          : ''

      return {
        id: project.id,
        title: project.title || 'Untitled Project',
        category: project.project_type || 'Project',
        type: project.project_type || 'Project',
        description: project.description || '',
        image: image || '/api/placeholder/800/450',
        year,
        client: project.client || '',
        attendees: 0,
        duration: project.location || '',
        highlights,
        technologies: [],
        testimonial: project.testimonial
          ? { quote: project.testimonial }
          : undefined
      }
    })

    const categories = [...new Set(portfolio.map((p) => p.category))]

    const clientsCount = new Set(
      portfolio.map((p) => p.client).filter(Boolean)
    ).size

    const yearsExperience = portfolio.reduce<number | null>((acc, project) => {
      if (!project.year) return acc
      const numericYear = Number(project.year)
      if (!Number.isFinite(numericYear)) return acc
      const candidate = new Date().getFullYear() - numericYear
      if (candidate < 0) return acc
      if (acc === null) return candidate
      return Math.max(acc, candidate)
    }, null)

    const stats = {
      totalProjects: portfolio.length,
      satisfiedClients: clientsCount,
      averageRating: null,
      yearsExperience
    }

    return {
      handle: safeProfile.slug,
      name: safeProfile.display_name,
      logo: safeProfile.avatar_url,
      portfolio,
      categories,
      stats
    }
  } catch (error) {
    logger.error('Error fetching brand portfolio data', error)
    return null
  }
}

export default async function BrandPortfolioPage({ params }: BrandPortfolioPageProps) {
  const { handle } = await params
  const brand = await getBrandData(handle)

  if (!brand) {
    notFound()
  }

  // Group portfolio by category
  const portfolioByCategory = brand.portfolio.reduce<Record<string, PortfolioProject[]>>((acc, project) => {
    if (!acc[project.category]) {
      acc[project.category] = []
    }
    acc[project.category].push(project)
    return acc
  }, {} as Record<string, typeof brand.portfolio>)

  const featuredProjects = brand.portfolio.slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Portfolio Header */}
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
              <Briefcase className="h-8 w-8 text-accent-primary"/>
              <div>
                <h1 className="text-2xl font-display font-bold">{brand.name} Portfolio</h1>
                <p className="text-muted-foreground">Showcase of our work and success stories</p>
              </div>
            </div>
            <Button>
              <Eye className="h-4 w-4 mr-2"/>
              View All Work
            </Button>
          </div>

          {/* Portfolio Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                {brand.stats.totalProjects}
              </div>
              <div className="text-sm text-muted-foreground">Total Projects</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                {brand.stats.satisfiedClients}
              </div>
              <div className="text-sm text-muted-foreground">Satisfied Clients</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                {brand.stats.averageRating}
              </div>
              <div className="text-sm text-muted-foreground">Average Rating</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                {brand.stats.yearsExperience}
              </div>
              <div className="text-sm text-muted-foreground">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <Tabs defaultValue="featured" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="featured">Featured</TabsTrigger>
              {brand.categories.slice(0, 4).map((category) => (
                <TabsTrigger key={category} value={category.toLowerCase().replace(/\s+/g, '-')}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Featured Projects */}
            <TabsContent value="featured" className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Featured Projects</h2>
                <p className="text-muted-foreground">Our most successful and impactful work</p>
              </div>

              <div className="grid gap-8">
                {featuredProjects.map((project) => (
                  <Card key={project.id} className="overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/3 relative h-64 md:h-full">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                        />
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h2 className="text-2xl font-bold">
                                <Link
                                  href={`/b/${handle}/portfolio/${project.id}`}
                                  className="hover:text-accent-primary transition-colors"
                                >
                                  {project.title}
                                </Link>
                              </h2>
                              <Badge variant="secondary">{project.year}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                              <Badge variant="outline">{project.category}</Badge>
                              <Badge variant="outline">{project.type}</Badge>
                              <span>{project.client}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4"/>
                                {project.attendees.toLocaleString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4"/>
                                {project.duration}
                              </div>
                            </div>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {project.description}
                        </p>

                        {/* Highlights */}
                        <div className="mb-4">
                          <h3 className="font-semibold mb-2">Key Highlights:</h3>
                          <div className="flex flex-wrap gap-2">
                            {project.highlights.map((highlight, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {highlight}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Technologies */}
                        <div className="mb-4">
                          <h3 className="font-semibold mb-2">Technologies Used:</h3>
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Testimonial */}
                        {project.testimonial && (
                          <div className="bg-muted/50 p-4 rounded-lg mb-4">
                            <blockquote className="text-sm italic text-muted-foreground mb-2">
                              &ldquo;{project.testimonial.quote}&rdquo;
                            </blockquote>
                            <p className="text-xs font-medium">
                              {project.testimonial.author}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center gap-3">
                          <Button asChild>
                            <Link href={`/b/${handle}/portfolio/${project.id}`}>
                              View Full Case Study
                            </Link>
                          </Button>
                          <Button variant="outline">
                            <Star className="h-4 w-4 mr-2"/>
                            Add to Favorites
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Category Tabs */}
            {brand.categories.map((category) => (
              <TabsContent key={category} value={category.toLowerCase().replace(/\s+/g, '-')} className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2">{category}</h2>
                  <p className="text-muted-foreground">
                    {portfolioByCategory[category]?.length || 0} projects in {category.toLowerCase()}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {portfolioByCategory[category]?.map((project) => (
                    <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                      <div className="aspect-video overflow-hidden">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <CardContent className="p-4">
                        <CardTitle className="text-lg mb-2 line-clamp-2">
                          <Link
                            href={`/b/${handle}/portfolio/${project.id}`}
                            className="hover:text-accent-primary transition-colors"
                          >
                            {project.title}
                          </Link>
                        </CardTitle>

                        <CardDescription className="text-sm line-clamp-2 mb-3">
                          {project.description}
                        </CardDescription>

                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                          <Badge variant="outline" className="text-xs">
                            {project.category}
                          </Badge>
                          <span>{project.year}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3"/>
                              {project.attendees.toLocaleString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3"/>
                              {project.duration}
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/b/${handle}/portfolio/${project.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-display font-bold mb-4">
            Ready to Create Something Amazing?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Let&rsquo;s discuss how we can bring your vision to life
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href={`/b/${handle}/contact`}>
                Start Your Project
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={`/b/${handle}/services`}>
                View Our Services
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
