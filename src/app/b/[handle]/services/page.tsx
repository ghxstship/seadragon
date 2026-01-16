
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Briefcase, CheckCircle, Star, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { Header } from '@/lib/design-system'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface BrandServicesPageProps {
  params: Promise<{ handle: string }>
}

interface BrandService {
  id: string
  name: string
  category: string
  description: string
  features: string[]
  startingPrice?: string
  duration?: string
  popular: boolean
  rating?: number
  reviews?: number
}

interface BrandData {
  handle: string
  name: string
  logo?: string | null
  services: BrandService[]
  categories: string[]
  stats: {
    totalServices: number
    activeServices: number
  }
}

export async function generateMetadata({ params }: BrandServicesPageProps): Promise<Metadata> {
  try {
    const { handle } = await params
    const supabase = await createClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, display_name, avatar_url, brand_profiles(description)')
      .eq('slug', handle)
      .single()

    if (!profile) {
      return {
        title: 'Brand Services Not Found',
        description: 'The requested brand services could not be found.'
      }
    }

    const safeProfile = profile as NonNullable<typeof profile>

    const brandProfile = Array.isArray(safeProfile.brand_profiles)
      ? safeProfile.brand_profiles[0]
      : safeProfile.brand_profiles

    if (!brandProfile) {
      return {
        title: 'Brand Services Not Found',
        description: 'The requested brand services could not be found.'
      }
    }

    return {
      title: `${safeProfile.display_name} - Services | OpusZero`,
      description: `${brandProfile.description || `Explore ${safeProfile.display_name}'s professional services and offerings`}`,
      openGraph: {
        title: `${safeProfile.display_name} - Services`,
        description: brandProfile.description,
        images: safeProfile.avatar_url ? [safeProfile.avatar_url] : []
      }
    }
  } catch (error) {
    return {
      title: 'Brand Services',
      description: 'Explore our professional services and offerings'
    }
  }
}
async function getBrandData(handle: string): Promise<BrandData | null> {
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

    const { data: services, error: servicesError } = await supabase
      .from('brand_services')
      .select('id, service_name, category, description, features, pricing_model, price_from, status, order_index')
      .eq('brand_id', brandId)
      .eq('status', 'active')
      .order('order_index', { ascending: true })

    if (servicesError) {
      logger.error('Error fetching brand services', servicesError)
      return null
    }

    const mappedServices: BrandService[] = (services || []).map((service) => ({
      id: service.id,
      name: service.service_name,
      category: service.category,
      description: service.description,
      features: Array.isArray(service.features) ? service.features : [],
      startingPrice: service.price_from ? `$${Number(service.price_from).toLocaleString()}` : undefined,
      duration: service.pricing_model === 'hourly' ? 'Per hour' : service.pricing_model === 'fixed' ? 'Fixed price' : service.pricing_model === 'custom' ? 'Custom' : 'Contact for pricing',
      popular: service.order_index <= 2,
      rating: undefined,
      reviews: undefined
    }))

    const categories = [...new Set(mappedServices.map((s) => s.category))]

    const stats = {
      totalServices: mappedServices.length,
      activeServices: mappedServices.length
    }

    return {
      handle: profile.slug,
      name: profile.display_name,
      logo: profile.avatar_url,
      services: mappedServices,
      categories,
      stats
    }
  } catch (error) {
    logger.error('Error fetching brand services data', error)
    return null
  }
}

export default async function BrandServicesPage({ params }: BrandServicesPageProps) {
  const { handle } = await params
  const brand = await getBrandData(handle)

  if (!brand) {
    notFound()
  }

  const servicesByCategory = brand.services.reduce<Record<string, BrandService[]>>((acc, service) => {
    acc[service.category] = acc[service.category] || []
    acc[service.category].push(service)
    return acc
  }, {})

  const popularServices = brand.services.filter((service) => service.popular)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Services Header */}
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
                <h1 className="text-2xl font-display font-bold">{brand.name} Services</h1>
                <p className="text-muted-foreground">Professional services and solutions</p>
              </div>
            </div>
            <Button>
              Request Quote
            </Button>
          </div>

          {/* Services Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl">
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                {brand.stats.totalServices}
              </div>
              <div className="text-sm text-muted-foreground">Services Offered</div>
            </div>
            <div className="text-center p-4 bg-background/50 rounded-lg">
              <div className="text-2xl font-bold text-accent-primary">
                {brand.stats.activeServices}
              </div>
              <div className="text-sm text-muted-foreground">Active Services</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Popular Services */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Star className="h-6 w-6 text-accent-primary"/>
              <h2 className="text-2xl font-bold">Popular Services</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularServices.map((service) => (
                <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">
                          <Link
                            href={`/b/${handle}/services/${service.id}`}
                            className="hover:text-accent-primary transition-colors"
                          >
                            {service.name}
                          </Link>
                        </h3>
                        <Badge variant="outline" className="mb-3">
                          {service.category}
                        </Badge>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        Popular
                      </Badge>
                    </div>

                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                      {service.description}
                    </p>

                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="font-medium mb-2 text-sm">Key Features:</h4>
                      <ul className="space-y-1">
                        {service.features.slice(0, 3).map((feature, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-accent-primary flex-shrink-0"/>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current"/>
                        {service.rating}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4"/>
                        {service.reviews} reviews
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold text-accent-primary">
                          {service.startingPrice}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {service.duration}
                        </div>
                      </div>
                      <Button asChild>
                        <Link href={`/b/${handle}/services/${service.id}`}>
                          Learn More
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* All Services by Category */}
          {brand.categories.map((category) => {
            const categoryServices = servicesByCategory[category] || []

            if (categoryServices.length === 0) return null

            return (
              <div key={category} className="mb-12">
                <h2 className="text-2xl font-bold mb-6">{category}</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {categoryServices.map((service) => (
                    <Card key={service.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold">
                            <Link
                              href={`/b/${handle}/services/${service.id}`}
                              className="hover:text-accent-primary transition-colors"
                            >
                              {service.name}
                            </Link>
                          </h3>
                          {service.popular && (
                            <Badge variant="secondary" className="text-xs">
                              Popular
                            </Badge>
                          )}
                        </div>

                        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                          {service.description}
                        </p>

                        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current"/>
                            {service.rating}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3"/>
                            {service.reviews} reviews
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-lg font-bold text-accent-primary">
                              {service.startingPrice}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {service.duration}
                            </div>
                          </div>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/b/${handle}/services/${service.id}`}>
                              View Details
                            </Link>
                          </Button>
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

      {/* CTA Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-display font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Let&apos;s discuss how our services can help bring your vision to life
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href={`/b/${handle}/contact`}>
                Request a Quote
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href={`/b/${handle}/portfolio`}>
                View Our Work
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
