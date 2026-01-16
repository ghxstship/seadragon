
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Header } from "@/lib/design-system"

export default function DiscoverGroups() {
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
            <Link href="/home" className="hover:text-foreground">Member Home</Link>
            <span>/</span>
            <Link href="/home/community" className="hover:text-foreground">Community</Link>
            <span>/</span>
            <Link href="/home/community/groups" className="hover:text-foreground">Groups</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Discover</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Discover Groups
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Find and join new community groups.
          </p>
        </div>
      </section>

      {/* Discover Groups Placeholder */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <Card>
            <CardHeader>
              <CardTitle>Available Groups</CardTitle>
              <CardDescription>Discover and join community groups</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                List of available groups to join will be displayed here.
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
