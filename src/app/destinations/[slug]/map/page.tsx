
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Header } from "@/lib/design-system"

interface DestinationMapPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: DestinationMapPageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const supabase = await createClient()
    const { data: profile } = await supabase
      .from('profiles')
      .select('*, destination_profiles(*)')
      .eq('slug', slug)
      .single()

    if (!profile?.destination_profiles) {
      return {
        title: 'Destination Map Not Found',
        description: 'The requested destination map could not be found.'
      }
    }

    return {
      title: `${profile.display_name} Interactive Map | OpusZero Destinations`,
      description: `Interactive map of ${profile.display_name} with venues and directions`,
      openGraph: {
        title: `${profile.display_name} Map`,
        description: `Interactive map of ${profile.display_name} with venues and directions`,
        images: profile.avatar_url ? [profile.avatar_url] : []
      }
    }
  } catch (error) {
    return {
      title: 'Destination Map',
      description: 'Interactive map of the destination with venues and directions'
    }
  }
}

export default async function Map({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const destinationName = slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Breadcrumb */}
      <nav className="bg-muted/50 px-4 py-3">
        <div className="container mx-auto">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link href="/destinations" className="hover:text-foreground">Destinations</Link>
            <span>/</span>
            <Link href={`/destinations/${slug}`} className="hover:text-foreground">{destinationName}</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Map</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            {destinationName} Map
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Interactive map of {destinationName} with venues and directions.
          </p>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <Card>
            <CardHeader>
              <CardTitle>{destinationName} Interactive Map</CardTitle>
              <CardDescription>Venue map and directions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Interactive map will be displayed here, showing venues, points of interest, and directions.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 G H X S T S H I P Industries LLC. ATLVS + GVTEWAY Super App.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
