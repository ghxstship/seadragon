
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/lib/design-system"
import { ArrowLeft, Building, MapPin, Calendar, Users, Award, Target, TrendingUp, Globe, Phone, Mail } from "lucide-react"

interface BrandAboutPageProps {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: BrandAboutPageProps): Promise<Metadata> {
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
        title: 'Brand Not Found',
        description: 'The requested brand profile could not be found.'
      }
    }

    return {
      title: `${profile.displayName} - About | OpusZero`,
      description: profile.brand_profiles.description || `${profile.displayName} - Learn about our mission, vision, and values`,
      openGraph: {
        title: `${profile.displayName} - About`,
        description: profile.brand_profiles.description,
        images: profile.avatarUrl ? [profile.avatarUrl] : []
      }
    }
  } catch (error) {
    return {
      title: 'Brand About',
      description: 'Learn about our company mission and values'
    }
  }
}
// Fetch brand data from database
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

    // Create services array (would need separate services table or JSON field)
    const services = [
      'Venue Rental & Management',
      'Full-Service Event Production',
      'Technical Support & AV Services',
      'Catering & Hospitality Services',
      'Event Marketing & Promotion'
    ]

    // Create values array (would need separate values table or JSON field)
    const values = [
      'Innovation - Embracing new technologies and creative solutions',
      'Sustainability - Environmental responsibility in all operations',
      'Excellence - Uncompromising quality in service delivery',
      'Integrity - Transparency and ethical business practices',
      'Collaboration - Building strong partnerships with clients and partners'
    ]

    // Create achievements (placeholder - would need achievements table)
    const achievements = [
      { name: 'Venue of the Year', year: '2023', description: 'Industry recognition for venue excellence' },
      { name: 'Sustainability Award', year: '2022', description: 'Leadership in eco-friendly event practices' },
      { name: 'Innovation Prize', year: '2021', description: 'Technology integration in event management' }
    ]

    // Calculate stats (placeholder - would need real analytics)
    const stats = {
      totalEvents: 2500,
      venuesManaged: 25,
      citiesCovered: 12,
      annualRevenue: 45000000,
      clientRetention: 92
    }

    return {
      handle: profile.slug,
      name: profile.displayName,
      logo: profile.avatarUrl || '/api/placeholder/200/100',
      coverImage: brandProfile.coverImage || '/api/placeholder/1200/400',
      tagline: brandProfile.tagline || 'Building amazing experiences',
      industry: brandProfile.industry || 'Business Services',
      founded: brandProfile.foundedYear?.toString() || '2020',
      location: brandProfile.location || 'Location TBD',
      employees: brandProfile.employeeCount || 10,
      description: brandProfile.description || 'Company description not available',
      mission: brandProfile.mission || 'Company mission not available',
      vision: brandProfile.vision || 'Company vision not available',
      values,
      services,
      achievements,
      stats,
      contact: {
        phone: brandProfile.phone || '+1 (555) 123-4567',
        email: brandProfile.email || 'contact@example.com',
        website: brandProfile.website || 'https://example.com',
        address: brandProfile.address || 'Address not available'
      }
    }
  } catch (error) {
    logger.error('Error fetching brand data', error)
    return null
  }
}

export default async function BrandAboutPage({ params }: BrandAboutPageProps) {
  const { handle } = await params
  const brand = await getBrandData(handle)

  if (!brand) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Brand Header */}
      <section className="py-12 px-4 bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/b/${handle}`}>
                <ArrowLeft className="h-4 w-4 mr-2"/>
                Back to Profile
              </Link>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex-shrink-0">
              <Image
                src={brand.logo}
                alt={brand.name}
                width={128}
                height={64}
                className="w-32 h-16 object-contain bg-background rounded-lg p-2 shadow-lg"/>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-display font-bold mb-2">{brand.name}</h1>
              <p className="text-2xl text-muted-foreground mb-4">{brand.tagline}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Building className="h-4 w-4"/>
                  {brand.industry}
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4"/>
                  {brand.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4"/>
                  Founded {brand.founded}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4"/>
                  {brand.employees} employees
                </div>
              </div>
              <Badge variant="outline" className="text-sm">
                Verified Business
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Company Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">About {brand.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none text-muted-foreground">
                    {brand.description.split('\n').map((paragraph: string, index: number) => (
                      <p key={index} className="mb-4 leading-relaxed">
                        {paragraph.trim()}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Mission & Vision */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Target className="h-5 w-5"/>
                      Mission
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {brand.mission}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <TrendingUp className="h-5 w-5"/>
                      Vision
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {brand.vision}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Values */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Our Values</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {brand.values.map((value, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-accent-primary mt-2 flex-shrink-0"/>
                        <div>
                          <h4 className="font-medium mb-1">{value.split(' - ')[0]}</h4>
                          <p className="text-sm text-muted-foreground">{value.split(' - ')[1]}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Services & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {brand.services.map((service, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="w-2 h-2 rounded-full bg-accent-primary"/>
                        <span className="text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Award className="h-5 w-5"/>
                    Achievements & Recognition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {brand.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="flex-shrink-0 w-12 h-12 bg-accent-primary/10 rounded-lg flex items-center justify-center">
                          <Award className="h-6 w-6 text-accent-primary"/>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{achievement.name}</h4>
                          <p className="text-sm text-muted-foreground mb-1">{achievement.description}</p>
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
              {/* Company Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Company Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(brand.stats).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="font-medium">
                          {typeof value === 'number' && value > 1000
                            ? `${(value / 1000000).toFixed(1)}M`
                            : typeof value === 'number'
                            ? value.toLocaleString()
                            : value
                          }
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-accent-primary"/>
                    <span className="text-sm">{brand.contact.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-accent-primary"/>
                    <span className="text-sm">{brand.contact.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-accent-primary"/>
                    <a
                      href={brand.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent-primary hover:underline"
                    >
                      {brand.contact.website}
                    </a>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-accent-primary mt-0.5"/>
                    <span className="text-sm">{brand.contact.address}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" asChild>
                    <Link href={`/b/${handle}/contact`}>
                      Contact Us
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/b/${handle}/services`}>
                      View Services
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/b/${handle}/careers`}>
                      Join Our Team
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Social Proof */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Trusted By</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>• Fortune 500 Companies</p>
                    <p>• Celebrity Clients</p>
                    <p>• International Brands</p>
                    <p>• Non-Profit Organizations</p>
                    <p>• Government Agencies</p>
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
