
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Header } from "@/lib/design-system"

const communityStats = [
  { label: "Active Users", value: "2.5M+", description: "Monthly active platform users" },
  { label: "Events Created", value: "50K+", description: "Events produced annually" },
  { label: "Global Reach", value: "150+", description: "Countries with active communities" },
  { label: "Partner Organizations", value: "1K+", description: "Venues, festivals, and promoters" }
]

const communityPrograms = [
  {
    title: "Creator Incubator",
    description: "Supporting emerging artists and producers with resources, mentorship, and platform access.",
    features: ["Mentorship program", "Resource grants", "Platform discounts", "Marketing support"],
    participants: "500+ creators"
  },
  {
    title: "Venue Network",
    description: "Connecting venue operators with artists, promoters, and production teams for seamless collaboration.",
    features: ["Venue database", "Booking tools", "Capacity matching", "Technical specs"],
    participants: "2K+ venues"
  },
  {
    title: "Education Initiative",
    description: "Providing training, workshops, and certification programs for industry professionals.",
    features: ["Online courses", "Live workshops", "Certifications", "Career development"],
    participants: "10K+ learners"
  },
  {
    title: "Sustainability Coalition",
    description: "Uniting industry leaders to advance environmental responsibility and sustainable practices.",
    features: ["Carbon tracking", "Offset programs", "Best practices", "Policy advocacy"],
    participants: "200+ organizations"
  }
]

const communityStories = [
  {
    name: "Maria Rodriguez",
    role: "Independent Festival Producer",
    location: "Barcelona, Spain",
    story: "The ATLVS + COMPVSS platform transformed how I manage my festival. What used to take weeks of coordination now happens seamlessly. The community support and resources have been invaluable for growth.",
    achievement: "Grew festival from 5K to 25K attendees in 3 years"
  },
  {
    name: "Alex Chen",
    role: "Venue Operations Manager",
    location: "Tokyo, Japan",
    story: "GVTEWAY helped us engage with our audience like never before. The analytics and community features have increased repeat attendance by 40% and opened new revenue streams.",
    achievement: "Increased venue utilization by 35%"
  },
  {
    name: "Jordan Taylor",
    role: "Emerging DJ/Producer",
    location: "New York, USA",
    story: "As someone just starting out, the creator incubator program gave me the tools and connections I needed to turn my passion into a career. The mentorship was life-changing.",
    achievement: "Signed first major label deal"
  }
]

export default function Community() {
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
            <span className="text-foreground font-medium">Community</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            Our Community
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            A global network of creators, producers, venues, and fans united by passion for
            live entertainment. Together, we&apos;re building the future of experiences.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {communityStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-display font-bold text-accent-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-medium mb-1">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Programs */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Community Programs</h2>
            <p className="text-xl text-muted-foreground">
              Initiatives designed to support, connect, and empower our community members
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {communityPrograms.map((program, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{program.title}</CardTitle>
                    <Badge variant="secondary">{program.participants}</Badge>
                  </div>
                  <CardDescription className="text-base">
                    {program.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {program.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-accent-primary rounded-full"></div>
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Stories */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Community Stories</h2>
            <p className="text-xl text-muted-foreground">
              Real stories from community members whose lives and careers have been transformed
            </p>
          </div>

          <div className="grid md:grid-cols-1 gap-8">
            {communityStories.map((story, index) => (
              <Card key={index} className="md:flex">
                <div className="md:w-1/3 p-6 flex items-center justify-center bg-accent-primary/5">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-accent-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-xl font-display font-bold text-accent-primary">
                        {story.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <h3 className="font-semibold">{story.name}</h3>
                    <p className="text-sm text-muted-foreground">{story.role}</p>
                    <p className="text-xs text-muted-foreground mt-1">{story.location}</p>
                  </div>
                </div>
                <div className="md:w-2/3 p-6">
                  <blockquote className="text-lg italic text-muted-foreground mb-4">
                    &ldquo;{story.story}&rdquo;
                  </blockquote>
                  <div className="bg-accent-secondary/10 rounded-lg p-3">
                    <p className="text-sm font-medium text-accent-secondary">
                      {story.achievement}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold mb-6">Community Guidelines</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our community thrives on respect, collaboration, and shared passion for live entertainment.
                These guidelines help ensure everyone has a positive experience.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent-primary rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold mb-1">Respect All Members</h3>
                    <p className="text-sm text-muted-foreground">
                      Treat everyone with kindness and respect, regardless of experience level or background.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent-primary rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold mb-1">Collaborate Constructively</h3>
                    <p className="text-sm text-muted-foreground">
                      Share knowledge, provide feedback, and support each other&apos;s growth and success.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent-primary rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold mb-1">Maintain Professionalism</h3>
                    <p className="text-sm text-muted-foreground">
                      Keep discussions professional and focused on advancing the industry and community.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Community Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Our community managers and moderators are here to help ensure everyone has
                    a positive experience on the platform.
                  </p>
                  <Button variant="outline" className="w-full">
                    Contact Community Support
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Join the Conversation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Connect with fellow community members through forums, events, and social features.
                  </p>
                  <Button className="w-full">
                    Explore Community Forums
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-4xl font-display font-bold mb-4">
            Get Involved
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join our thriving community and be part of something bigger.
            Whether you&apos;re a creator, producer, or fan, there&apos;s a place for you here.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <h3 className="font-semibold mb-2">For Creators</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Access resources, mentorship, and opportunities to grow your career.
              </p>
              <Button variant="outline" size="sm">Join as Creator</Button>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">For Professionals</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Connect with industry peers and advance your professional network.
              </p>
              <Button variant="outline" size="sm">Join as Pro</Button>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">For Fans</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Discover amazing experiences and connect with fellow enthusiasts.
              </p>
              <Button variant="outline" size="sm">Join as Fan</Button>
            </div>
          </div>
          <Button size="lg" className="text-lg px-8 py-6">
            Join Our Community
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
