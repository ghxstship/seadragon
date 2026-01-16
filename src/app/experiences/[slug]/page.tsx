
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { Calendar, MapPin, Clock, Users, DollarSign, Star, CheckCircle, ArrowLeft } from "lucide-react"

// Fetch experience data from database
async function getExperienceData(slug: string) {
  try {
    const supabase = await createClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('*, experience_profiles(*)')
      .eq('slug', slug)
      .single()

    if (!profile?.experience_profiles) {
      return null
    }

    const experienceProfile = profile.experience_profiles

    // Create experience data from profile (placeholder - would need proper mapping)
    return {
      slug: profile.slug,
      name: profile.displayName,
      description: experienceProfile.description || 'Experience description not available',
      type: experienceProfile.category || 'Experience',
      duration: experienceProfile.duration || 120, // minutes
      price: experienceProfile.price || 50000,
      currency: experienceProfile.currency || 'USD',
      maxCapacity: experienceProfile.maxCapacity || 1000,
      minCapacity: experienceProfile.minCapacity || 100,
      images: experienceProfile.images || ['/api/placeholder/400/300'],
      featured: experienceProfile.featured || false,
      status: experienceProfile.status || 'active',
      metadata: {
        includes: experienceProfile.includes || ['Professional Production', 'Technical Support'],
        requirements: experienceProfile.requirements || ['Suitable venue', 'Technical access'],
        setupTime: experienceProfile.setupTime || '4 hours',
        strikeTime: experienceProfile.strikeTime || '2 hours'
      }
    }
  } catch (error) {
    logger.error('Error fetching experience data', error)
    return null
  }
}

interface ExperiencePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ExperiencePageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const supabase = await createClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('*, experience_profiles(*)')
      .eq('slug', slug)
      .single()

    if (!profile?.experience_profiles) {
      return {
        title: 'Experience Not Found',
        description: 'The requested experience could not be found.'
      }
    }

    return {
      title: `${profile.display_name} | OpusZero Experiences`,
      description: profile.experience_profiles.description || `Experience: ${profile.display_name}`,
      openGraph: {
        title: profile.display_name,
        description: profile.experience_profiles.description,
        images: profile.avatar_url ? [profile.avatar_url] : []
      }
    }
  } catch (error) {
    return {
      title: 'Experience',
      description: 'Experience details and booking information'
    }
  }
}

export default async function ExperienceDetailPage({ params }: ExperiencePageProps) {
  const { slug } = await params
  const experience = await getExperienceData(slug)

  if (!experience) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-display font-bold">ATLVS + GVTEWAY</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="/" className="text-sm font-medium hover:text-accent-primary">Home</a>
            <a href="/search" className="text-sm font-medium hover:text-accent-primary">Search</a>
            <a href="/destinations" className="text-sm font-medium hover:text-accent-primary">Destinations</a>
            <a href="/experiences" className="text-sm font-medium hover:text-accent-primary">Experiences</a>
            <a href="/events" className="text-sm font-medium hover:text-accent-primary">Events</a>
            <a href="/about" className="text-sm font-medium hover:text-accent-primary">About</a>
          </nav>
          <div className="flex items-center space-x-2">
            <Button variant="ghost">Sign In</Button>
            <Button>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-96 bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20">
        <div className="absolute inset-0 bg-neutral-900/50"/>
        <div className="relative container mx-auto px-4 py-20 h-full flex items-center">
          <div className="max-w-4xl">
            <Badge variant="secondary" className="mb-4">{experience.type}</Badge>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-primary-foreground mb-6">
              {experience.name}
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl">
              {experience.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-background text-foreground hover:bg-background/90">
                Book Now - ${experience.price?.toLocaleString()}
              </Button>
              <Button size="lg" variant="outline" className="border-white text-primary-foreground hover:bg-background hover:text-foreground">
                Request Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* About */}
            <section>
              <h2 className="text-3xl font-display font-bold mb-6">Experience Details</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {experience.description}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  This comprehensive production package includes everything you need to deliver
                  an exceptional live entertainment experience. Our team handles all technical
                  aspects, allowing you to focus on creating memorable moments for your audience.
                </p>
              </div>
            </section>

            {/* What's Included */}
            <section>
              <h2 className="text-3xl font-display font-bold mb-6">What's Included</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {experience.metadata.includes.map((item: string, index: number) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-accent-primary rounded-full"/>
                        <p className="font-medium">{item}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Technical Specifications */}
            <section>
              <h2 className="text-3xl font-display font-bold mb-6">Technical Specifications</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Duration</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-accent-primary">
                      {Math.floor(experience.duration / 60)}h {experience.duration % 60}m
                    </p>
                    <p className="text-sm text-muted-foreground">Performance time</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Capacity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-accent-primary">
                      {experience.minCapacity?.toLocaleString()} - {experience.maxCapacity?.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Audience size</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Setup Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-accent-primary">
                      {experience.metadata.setupTime}
                    </p>
                    <p className="text-sm text-muted-foreground">Load-in & setup</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Strike Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-accent-primary">
                      {experience.metadata.strikeTime}
                    </p>
                    <p className="text-sm text-muted-foreground">Load-out & cleanup</p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Requirements */}
            <section>
              <h2 className="text-3xl font-display font-bold mb-6">Venue Requirements</h2>
              <div className="space-y-4">
                {experience.metadata.requirements.map((req: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent-primary rounded-full mt-2"/>
                    <p className="text-muted-foreground">{req}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>Complete production package</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-4xl font-bold text-accent-primary mb-2">
                    ${experience.price?.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    {experience.currency} - All inclusive
                  </p>
                  <Button className="w-full mb-3">Book Now</Button>
                  <Button variant="outline" className="w-full">Request Custom Quote</Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
                <CardDescription>Ready to book this experience?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full">Download Technical Rider</Button>
                <Button variant="outline" className="w-full">View Sample Contract</Button>
                <Button variant="outline" className="w-full">Contact Production Team</Button>
              </CardContent>
            </Card>

            {/* Related Experiences */}
            <Card>
              <CardHeader>
                <CardTitle>Similar Experiences</CardTitle>
                <CardDescription>Other options you might like</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-muted rounded-lg"/>
                    <div>
                      <p className="font-semibold">VIP Concert Package</p>
                      <p className="text-sm text-muted-foreground">Enhanced production with VIP amenities</p>
                      <p className="text-sm font-semibold text-accent-primary">$125,000</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-muted rounded-lg"/>
                    <div>
                      <p className="font-semibold">Broadcast Package</p>
                      <p className="text-sm text-muted-foreground">Live streaming and broadcast setup</p>
                      <p className="text-sm font-semibold text-accent-primary">$95,000</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
