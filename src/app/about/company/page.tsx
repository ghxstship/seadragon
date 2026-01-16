
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Header } from "@/lib/design-system"

export default function Company() {
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
          <Link href="/about" className="hover:text-foreground">About</Link>
          <span>/</span>
          <span className="text-foreground font-medium">Our Company</span>
        </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Our Company
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Founded in 2026, G H X S T S H I P Industries LLC is revolutionizing the live entertainment industry
            through innovative technology and unified platform solutions.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold mb-6">The G H X S T S H I P Vision</h2>
              <p className="text-lg text-muted-foreground mb-6">
                G H X S T S H I P Industries LLC emerged from a simple observation: the live entertainment industry
                was fragmented, inefficient, and disconnected. Producers struggled with disparate tools,
                audiences had limited access, and the magic of live experiences was often lost in operational complexity.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Our founders, veterans of the entertainment industry with decades of experience in production,
                technology, and audience engagement, set out to build the unified platform that would transform
                how live entertainment is created, managed, and experienced.
              </p>
              <p className="text-lg text-muted-foreground">
                Today, ATLVS + GVTEWAY serves as the single source of truth for the entire entertainment
                lifecycle, from the initial creative spark to the final audience applause.
              </p>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Founded</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">2026</p>
                  <p className="text-muted-foreground">Silicon Valley, California</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Headquarters</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">San Francisco</p>
                  <p className="text-muted-foreground">Global Operations</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Industry</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">Live Entertainment</p>
                  <p className="text-muted-foreground">Technology & Software</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">What We Do</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We build technology that empowers the entire entertainment ecosystem
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Empower Creators</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Provide artists, producers, and creators with the tools they need to bring their visions to life.
                </p>
                <ul className="space-y-2 text-sm">
                  <li>• Production planning tools</li>
                  <li>• Resource management</li>
                  <li>• Creative collaboration</li>
                  <li>• Performance analytics</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Enable Producers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Support venue operators and event producers with comprehensive operational platforms.
                </p>
                <ul className="space-y-2 text-sm">
                  <li>• End-to-end project management</li>
                  <li>• Financial tracking</li>
                  <li>• Team coordination</li>
                  <li>• Compliance management</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Connect Audiences</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Create seamless experiences for audiences to discover, book, and engage with live entertainment.
                </p>
                <ul className="space-y-2 text-sm">
                  <li>• Event discovery</li>
                  <li>• Ticket purchasing</li>
                  <li>• Social engagement</li>
                  <li>• Personalized recommendations</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Leadership Team</h2>
            <p className="text-xl text-muted-foreground">
              Industry veterans driving the future of live entertainment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-accent-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-display font-bold text-accent-primary">CEO</span>
                </div>
                <CardTitle>Jane Smith</CardTitle>
                <CardDescription>Chief Executive Officer</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  20+ years in live entertainment production, former executive at major festivals and venues.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-accent-secondary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-display font-bold text-accent-secondary">CTO</span>
                </div>
                <CardTitle>Mike Johnson</CardTitle>
                <CardDescription>Chief Technology Officer</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Former tech lead at enterprise software companies, specializing in scalable platform architecture.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="w-24 h-24 bg-accent-tertiary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-display font-bold text-accent-tertiary">CCO</span>
                </div>
                <CardTitle>Sarah Chen</CardTitle>
                <CardDescription>Chief Creative Officer</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Award-winning creative director with experience across theater, music, and experiential entertainment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl font-display font-bold mb-4">
            Join Our Mission
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Be part of transforming live entertainment for the digital age.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 py-6">
              View Careers
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Contact Us
            </Button>
          </div>
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
