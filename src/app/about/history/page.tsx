
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Header } from "@/lib/design-system"

const milestones = [
  {
    year: "2026",
    title: "Foundation",
    description: "G H X S T S H I P Industries LLC founded with a vision to unify live entertainment through technology.",
    details: "Initial team assembled with industry veterans from production, technology, and creative fields."
  },
  {
    year: "2027",
    title: "ATLVS + COMPVSS Alpha",
    description: "Launch of ATLVS + COMPVSS B2B platform for event production and operations management.",
    details: "First enterprise clients onboarded, including major festivals and venue operators."
  },
  {
    year: "2028",
    title: "GVTEWAY Beta",
    description: "Introduction of GVTEWAY consumer platform for audience engagement and booking.",
    details: "Mobile app released with ticket purchasing, event discovery, and social features."
  },
  {
    year: "2029",
    title: "Platform Integration",
    description: "Full integration of ATLVS + GVTEWAY platforms with unified data architecture.",
    details: "Multi-tenant architecture implemented, enabling white-label solutions for partners."
  },
  {
    year: "2030",
    title: "AI Assistant Launch",
    description: "Introduction of intelligent AI assistant for automated task management and recommendations.",
    details: "Machine learning algorithms deployed for budget forecasting, resource optimization, and risk assessment."
  },
  {
    year: "2031",
    title: "Global Expansion",
    description: "Platform expanded to serve international markets with localization and compliance features.",
    details: "Operations established in Europe, Asia-Pacific, and Latin America regions."
  },
  {
    year: "2032",
    title: "Major Festival Partnership",
    description: "Strategic partnership with major music festival managing 400K+ attendees and $50M+ budgets.",
    details: "Full production lifecycle management implemented, from concept through reconciliation."
  },
  {
    year: "2033",
    title: "Sustainability Initiative",
    description: "Launch of sustainability tracking and carbon offset programs for events.",
    details: "Environmental impact monitoring integrated across all platform features."
  },
  {
    year: "2034",
    title: "API Ecosystem",
    description: "Open API platform released, enabling third-party integrations and developer ecosystem.",
    details: "SDK libraries released for JavaScript, Python, Ruby, and Go."
  },
  {
    year: "2035",
    title: "IPO and Public Offering",
    description: "Successful initial public offering, establishing G H X S T S H I P as a public technology company.",
    details: "Continued focus on innovation and market expansion in live entertainment technology."
  }
]

export default function History() {
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
            <Link href="/about/history" className="hover:text-foreground">Our History</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Our History
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            A decade of innovation, growth, and transformation in the live entertainment industry.
            From humble beginnings to industry leadership.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-accent-primary/20"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className="relative flex items-start">
                  {/* Timeline dot */}
                  <div className="flex-shrink-0 w-16 h-16 bg-accent-primary rounded-full flex items-center justify-center text-primary-foreground font-display font-bold text-lg z-10">
                    {milestone.year.slice(-2)}
                  </div>

                  {/* Content */}
                  <div className="ml-8 flex-1">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl">{milestone.title}</CardTitle>
                          <Badge variant="secondary">{milestone.year}</Badge>
                        </div>
                        <CardDescription className="text-base">
                          {milestone.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{milestone.details}</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Key Achievements */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Key Achievements</h2>
            <p className="text-xl text-muted-foreground">
              Milestones that shaped our journey and industry impact
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl font-display text-accent-primary">400K+</CardTitle>
                <CardDescription>Attendees Served</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Through our platform partnerships with major festivals and events
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl font-display text-accent-primary">$10M+</CardTitle>
                <CardDescription>Events Produced</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Total production value managed through our platform
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl font-display text-accent-primary">500+</CardTitle>
                <CardDescription>Team Members</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Global team of entertainment and technology professionals
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-3xl font-display text-accent-primary">50+</CardTitle>
                <CardDescription>Countries</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  International presence and market reach
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Industry Impact */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold mb-6">Industry Impact</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our platform has transformed how live entertainment is created, managed, and experienced.
                We&apos;ve introduced new standards for efficiency, sustainability, and audience engagement.
              </p>
              <div className="space-y-4">
                <div className="border-l-4 border-accent-primary pl-4">
                  <h3 className="font-semibold mb-2">Efficiency Revolution</h3>
                  <p className="text-muted-foreground">
                    Reduced production timelines by 40% and operational costs by 25% through
                    automated workflows and intelligent resource allocation.
                  </p>
                </div>
                <div className="border-l-4 border-accent-secondary pl-4">
                  <h3 className="font-semibold mb-2">Sustainability Leadership</h3>
                  <p className="text-muted-foreground">
                    Pioneered carbon tracking and offset programs, helping events reduce
                    their environmental impact by an average of 30%.
                  </p>
                </div>
                <div className="border-l-4 border-accent-tertiary pl-4">
                  <h3 className="font-semibold mb-2">Audience Innovation</h3>
                  <p className="text-muted-foreground">
                    Enhanced audience experiences through personalized recommendations,
                    seamless booking, and integrated social features.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Technology Innovation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    First-to-market features like AI-powered production planning, real-time
                    audience analytics, and automated compliance management.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Industry Standards</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Established new industry standards for data security, accessibility,
                    and operational excellence in live entertainment.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Ecosystem Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Built a thriving ecosystem of partners, developers, and integrations
                    that extend platform capabilities and market reach.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="py-20 px-4 bg-accent-primary/5">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl font-display font-bold mb-4">
            Looking Forward
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Our journey continues as we push the boundaries of what&apos;s possible in live entertainment.
            The next decade promises even greater innovation and impact.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Extended Reality</h3>
              <p className="text-sm text-muted-foreground">
                VR/AR integration for immersive hybrid experiences
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">AI Orchestration</h3>
              <p className="text-sm text-muted-foreground">
                Fully autonomous production coordination and optimization
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">Global Connectivity</h3>
              <p className="text-sm text-muted-foreground">
                Seamless cross-border collaboration and distribution
              </p>
            </div>
          </div>
          <Button size="lg" className="text-lg px-8 py-6">
            Join Our Journey
          </Button>
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
