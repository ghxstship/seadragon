
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { ArrowLeft, MapPin, Phone, Mail, Clock, Send, MessageSquare, Calendar, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface BrandContactPageProps {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: BrandContactPageProps): Promise<Metadata> {
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
        title: 'Brand Contact Not Found',
        description: 'The requested brand contact information could not be found.'
      }
    }

    return {
      title: `Contact ${profile.display_name} | OpusZero`,
      description: `Get in touch with ${profile.display_name}. Contact information, offices, and inquiry forms`,
      openGraph: {
        title: `Contact ${profile.display_name}`,
        description: profile.brand_profiles.description,
        images: profile.avatar_url ? [profile.avatar_url] : []
      }
    }
  } catch (error) {
    return {
      title: 'Brand Contact',
      description: 'Contact information and inquiry forms'
    }
  }
}

// Fetch brand contact data from database
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

    // Create contact information from brand profile fields
    const contact = {
      general: {
        email: brandProfile.email || 'contact@example.com',
        phone: brandProfile.phone || '+1 (555) 123-4567',
        address: brandProfile.address || 'Address not available'
      },
      sales: {
        email: 'sales@example.com',
        phone: brandProfile.phone
      },
      support: {
        email: 'support@example.com',
        phone: brandProfile.phone
      },
      careers: {
        email: 'careers@example.com'
      },
      partnerships: {
        email: 'partnerships@example.com',
        phone: brandProfile.phone
      },
      press: {
        email: 'press@example.com',
        phone: brandProfile.phone
      }
    }

    // Create offices (placeholder - would need offices table)
    const offices = [
      {
        name: 'Main Office',
        address: brandProfile.address || 'Address not available',
        phone: brandProfile.phone || '+1 (555) 123-4567',
        email: brandProfile.email || 'contact@example.com',
        hours: 'Monday - Friday: 9:00 AM - 6:00 PM'
      }
    ]

    return {
      handle: profile.slug,
      name: profile.displayName,
      logo: profile.avatarUrl || '/api/placeholder/200/100',
      contact,
      offices,
      responseTime: 'We typically respond to inquiries within 24 hours during business days.',
      availability: 'Available for consultations Monday through Friday, 9 AM to 6 PM.'
    }
  } catch (error) {
    logger.error('Error fetching brand contact data', error)
    return null
  }
}

export default async function BrandContactPage({ params }: BrandContactPageProps) {
  const { handle } = await params
  const brand = await getBrandData(handle)

  if (!brand) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Contact Header */}
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
              <MessageSquare className="h-8 w-8 text-accent-primary"/>
              <div>
                <h1 className="text-2xl font-display font-bold">Contact {brand.name}</h1>
                <p className="text-muted-foreground">Get in touch with our team</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we&apos;ll get back to you as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">First Name</label>
                        <Input
                          type="text"
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
                          placeholder="Your first name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Last Name</label>
                        <Input
                          type="text"
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
                          placeholder="Your last name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Email Address</label>
                      <Input
                        type="email"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Phone Number (Optional)</label>
                      <Input
                        type="tel"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Subject</label>
                      <Select>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Inquiry</SelectItem>
                          <SelectItem value="event-planning">Event Planning</SelectItem>
                          <SelectItem value="partnership">Partnership Opportunities</SelectItem>
                          <SelectItem value="venue-rental">Venue Rental</SelectItem>
                          <SelectItem value="careers">Careers</SelectItem>
                          <SelectItem value="media">Media Inquiry</SelectItem>
                          <SelectItem value="support">Support</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">Message</label>
                      <Textarea
                        rows={6}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary resize-none"
                        placeholder="Tell us how we can help you..."/>
                    </div>

                    <div className="flex items-center gap-4">
                      <Input type="checkbox" id="newsletter" className="rounded" />
                      <label htmlFor="newsletter" className="text-sm text-muted-foreground">
                        Subscribe to our newsletter for updates and special offers
                      </label>
                    </div>

                    <Button type="submit" className="w-full">
                      <Send className="h-4 w-4 mr-2"/>
                      Send Message
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      {brand.responseTime}
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              {/* General Contact */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">General Inquiries</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-accent-primary"/>
                    <a href={`mailto:${brand.contact.general.email}`} className="text-sm hover:text-accent-primary transition-colors">
                      {brand.contact.general.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-accent-primary"/>
                    <span className="text-sm">{brand.contact.general.phone}</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-4 w-4 text-accent-primary mt-0.5"/>
                    <span className="text-sm">{brand.contact.general.address}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Department Contacts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Department Contacts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {brand.contact.sales && (
                    <div>
                      <h4 className="font-medium text-sm mb-1">Sales & Bookings</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3"/>
                          <a href={`mailto:${brand.contact.sales.email}`} className="hover:text-accent-primary transition-colors">
                            {brand.contact.sales.email}
                          </a>
                        </div>
                        {brand.contact.sales.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3"/>
                            {brand.contact.sales.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {brand.contact.support && (
                    <div>
                      <h4 className="font-medium text-sm mb-1">Support</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3"/>
                          <a href={`mailto:${brand.contact.support.email}`} className="hover:text-accent-primary transition-colors">
                            {brand.contact.support.email}
                          </a>
                        </div>
                        {brand.contact.support.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3"/>
                            {brand.contact.support.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {brand.contact.careers && (
                    <div>
                      <h4 className="font-medium text-sm mb-1">Careers</h4>
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3"/>
                          <a href={`mailto:${brand.contact.careers.email}`} className="hover:text-accent-primary transition-colors">
                            {brand.contact.careers.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {brand.contact.partnerships && (
                    <div>
                      <h4 className="font-medium text-sm mb-1">Partnerships</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3"/>
                          <a href={`mailto:${brand.contact.partnerships.email}`} className="hover:text-accent-primary transition-colors">
                            {brand.contact.partnerships.email}
                          </a>
                        </div>
                        {brand.contact.partnerships.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3"/>
                            {brand.contact.partnerships.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {brand.contact.press && (
                    <div>
                      <h4 className="font-medium text-sm mb-1">Press & Media</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3"/>
                          <a href={`mailto:${brand.contact.press.email}`} className="hover:text-accent-primary transition-colors">
                            {brand.contact.press.email}
                          </a>
                        </div>
                        {brand.contact.press.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3"/>
                            {brand.contact.press.phone}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Office Locations */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Office Locations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {brand.offices.map((office, index) => (
                      <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                        <h4 className="font-medium mb-2">{office.name}</h4>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0"/>
                            <span>{office.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-3 w-3"/>
                            <span>{office.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3"/>
                            <a href={`mailto:${office.email}`} className="hover:text-accent-primary transition-colors">
                              {office.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3"/>
                            <span>{office.hours}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Availability */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Business Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {brand.availability}
                  </p>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/b/${handle}/services`}>
                      View Our Services
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/b/${handle}/careers`}>
                      Join Our Team
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/b/${handle}/portfolio`}>
                      View Our Work
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
