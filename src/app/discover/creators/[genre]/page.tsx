
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Header } from "@/lib/design-system"

export default async function CreatorsByGenre({ params }: { params: Promise<{ genre: string }> }) {
  const { genre } = await params
  const genreName = genre.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

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
            <Link href="/discover" className="hover:text-foreground">Discover</Link>
            <span>/</span>
            <Link href="/discover/creators" className="hover:text-foreground">Creators</Link>
            <span>/</span>
            <span className="text-foreground font-medium">{genreName}</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            {genreName} Artists
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover {genreName} creators and performers.
          </p>
        </div>
      </section>

      {/* Content Placeholder */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <Card>
            <CardHeader>
              <CardTitle>{genreName} Creators</CardTitle>
              <CardDescription>Creators in this genre</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                List of {genreName} creators will be displayed here.
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
