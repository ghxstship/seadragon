
'use client'


import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/lib/design-system"
import { Users, Target, Heart, Lightbulb, Globe, Award, TrendingUp, Calendar, MapPin, Building2, Star, ArrowRight, CheckCircle, Zap, Compass, Shield } from "lucide-react"

interface CompanyValue {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  color: string
}

interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  image: string
  linkedin?: string
  expertise: string[]
}

interface Milestone {
  year: number
  title: string
  description: string
  impact: string
  icon: React.ComponentType<{ className?: string }>
}

interface Statistic {
  label: string
  value: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

export default function AboutPage() {
  const [activeValue, setActiveValue] = useState(0)

  const companyValues: CompanyValue[] = [
    {
      icon: Compass,
      title: "Exploration",
      description: "We believe in pushing boundaries and discovering new possibilities in travel and experiences.",
      color: "bg-accent-primary/10"
    },
    {
      icon: Heart,
      title: "Authenticity",
      description: "Every experience should be genuine, meaningful, and true to its cultural and natural essence.",
      color: "bg-semantic-error/10"
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "We prioritize the safety, security, and well-being of our community above all else.",
      color: "bg-semantic-success/10"
    },
    {
      icon: Users,
      title: "Inclusivity",
      description: "Travel and experiences should be accessible to everyone, regardless of background or ability.",
      color: "bg-accent-primary/10"
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We continuously evolve and embrace new technologies to enhance the travel experience.",
      color: "bg-semantic-warning/10"
    },
    {
      icon: Globe,
      title: "Sustainability",
      description: "Responsible travel that preserves our planet and supports local communities.",
      color: "bg-emerald-100"
    }
  ]

  const leadershipTeam: TeamMember[] = [
    {
      id: "alex-chen",
      name: "Alex Chen",
      role: "Chief Executive Officer",
      bio: "Former VP of Global Operations at major travel platforms. Passionate about democratizing extraordinary travel experiences.",
      image: "/api/placeholder/150/150",
      linkedin: "https://linkedin.com/in/alexchen",
      expertise: ["Strategy", "Operations", "Travel Industry"]
    },
    {
      id: "sarah-johnson",
      name: "Sarah Johnson",
      role: "Chief Technology Officer",
      bio: "AI and machine learning expert with 15+ years in tech. Previously led engineering at innovative travel startups.",
      image: "/api/placeholder/150/150",
      linkedin: "https://linkedin.com/in/sarahjohnson",
      expertise: ["AI/ML", "Engineering", "Product Development"]
    },
    {
      id: "marcus-rodriguez",
      name: "Marcus Rodriguez",
      role: "Chief Experience Officer",
      bio: "Award-winning experience designer with background in hospitality and entertainment. Focuses on creating magical moments.",
      image: "/api/placeholder/150/150",
      linkedin: "https://linkedin.com/in/marcusrodriguez",
      expertise: ["UX Design", "Hospitality", "Experience Design"]
    },
    {
      id: "emma-davis",
      name: "Emma Davis",
      role: "Chief Sustainability Officer",
      bio: "Environmental scientist and sustainability expert. Leads our commitment to responsible and regenerative travel.",
      image: "/api/placeholder/150/150",
      linkedin: "https://linkedin.com/in/emmadavis",
      expertise: ["Sustainability", "Environmental Science", "Policy"]
    }
  ]

  const milestones: Milestone[] = [
    {
      year: 2020,
      title: "Company Founded",
      description: "ATLVS + GVTEWAY was born from a simple idea: travel should be extraordinary for everyone.",
      impact: "Started with a vision to revolutionize travel experiences",
      icon: Building2
    },
    {
      year: 2021,
      title: "First Platform Launch",
      description: "Launched our initial travel planning platform, serving 10,000+ users in the first year.",
      impact: "Established foundation for personalized travel experiences",
      icon: Zap
    },
    {
      year: 2022,
      title: "Global Expansion",
      description: "Expanded operations to 25+ countries with localized experiences and partnerships.",
      impact: "Made authentic travel accessible worldwide",
      icon: Globe
    },
    {
      year: 2023,
      title: "AI Integration",
      description: "Introduced AI-powered personalization and recommendation systems.",
      impact: "Transformed how travelers discover and plan experiences",
      icon: Lightbulb
    },
    {
      year: 2024,
      title: "Sustainability Leadership",
      description: "Achieved carbon-neutral operations and launched regenerative travel initiatives.",
      impact: "Set new industry standards for responsible tourism",
      icon: Award
    },
    {
      year: 2025,
      title: "Community Milestone",
      description: "Reached 250,000+ active members and 500+ global partners.",
      impact: "Built the world's largest premium travel community",
      icon: Users
    }
  ]

  const statistics: Statistic[] = [
    {
      label: "Active Members",
      value: "250,000+",
      description: "Premium travelers worldwide",
      icon: Users
    },
    {
      label: "Destinations",
      value: "500+",
      description: "Unique locations covered",
      icon: MapPin
    },
    {
      label: "Global Partners",
      value: "300+",
      description: "Trusted collaborators",
      icon: Building2
    },
    {
      label: "Team Members",
      value: "450+",
      description: "Passionate professionals",
      icon: Users
    },
    {
      label: "Countries Served",
      value: "75+",
      description: "Global presence",
      icon: Globe
    },
    {
      label: "Carbon Neutral",
      value: "100%",
      description: "Since 2024 operations",
      icon: Award
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-accent-primary/10 via-accent-secondary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-primary/20 rounded-full mb-6">
              <Building2 className="h-10 w-10 text-accent-primary"/>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Our Story
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Born from a simple belief: travel should transform lives, connect cultures,
              and create memories that last forever. We&apos;re building the future of extraordinary experiences.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                <Users className="h-5 w-5 mr-2"/>
                Meet Our Team
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Calendar className="h-5 w-5 mr-2"/>
                Our Journey
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-display font-bold mb-6">Our Mission</h2>
              <p className="text-xl text-muted-foreground mb-6">
                To democratize extraordinary travel experiences by connecting passionate travelers
                with authentic, sustainable, and transformative adventures worldwide.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                We believe that travel has the power to change lives, bridge cultures, and create
                lasting connections. Our platform makes it possible for everyone to discover and
                experience the world&apos;s most remarkable destinations and activities.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-semantic-success mt-0.5 flex-shrink-0"/>
                  <div>
                    <h4 className="font-semibold mb-1">Personalized Discovery</h4>
                    <p className="text-muted-foreground">AI-powered recommendations tailored to your interests</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-semantic-success mt-0.5 flex-shrink-0"/>
                  <div>
                    <h4 className="font-semibold mb-1">Sustainable Travel</h4>
                    <p className="text-muted-foreground">Carbon-neutral operations and regenerative tourism initiatives</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-semantic-success mt-0.5 flex-shrink-0"/>
                  <div>
                    <h4 className="font-semibold mb-1">Local Expertise</h4>
                    <p className="text-muted-foreground">Authentic experiences curated by local experts and communities</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {statistics.map((stat, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 pb-4">
                    <stat.icon className="h-8 w-8 mx-auto mb-3 text-accent-primary"/>
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">{stat.label}</div>
                    <div className="text-xs text-muted-foreground">{stat.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground">
              The principles that guide every decision we make
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {companyValues.map((value, index) => (
              <Card
                key={index}
                className={`hover:shadow-xl transition-shadow cursor-pointer ${
                  activeValue === index ? 'ring-2 ring-accent-primary' : ''
                }`}
                onClick={() => setActiveValue(index)}
              >
                <CardContent className="pt-8 pb-6 text-center">
                  <div className={`text-4xl mb-4 w-16 h-16 mx-auto rounded-full flex items-center justify-center ${value.color}`}>
                    <value.icon className="h-8 w-8 text-accent-primary"/>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Timeline */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Our Journey</h2>
            <p className="text-xl text-muted-foreground">
              From humble beginnings to global travel leaders
            </p>
          </div>

          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className="flex gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-accent-primary/20 rounded-full flex items-center justify-center">
                    <milestone.icon className="h-8 w-8 text-accent-primary"/>
                  </div>
                  {index < milestones.length - 1 && (
                    <div className="w-0.5 h-16 bg-border mx-auto mt-4"></div>
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-4 mb-3">
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {milestone.year}
                    </Badge>
                    <h3 className="text-2xl font-semibold">{milestone.title}</h3>
                  </div>
                  <p className="text-lg text-muted-foreground mb-4">
                    {milestone.description}
                  </p>
                  <div className="bg-accent-primary/5 border border-accent-primary/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-accent-primary font-medium mb-1">
                      <TrendingUp className="h-4 w-4"/>
                      Impact
                    </div>
                    <p className="text-muted-foreground">{milestone.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Leadership Team</h2>
            <p className="text-xl text-muted-foreground">
              Meet the visionaries driving our mission forward
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadershipTeam.map((member) => (
              <Card key={member.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-square bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl"></div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-accent-primary font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {member.bio}
                  </p>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {member.expertise.slice(0, 2).map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                    {member.linkedin && (
                      <Button variant="ghost" size="sm" className="w-full text-xs">
                        <Users className="h-3 w-3 mr-1"/>
                        LinkedIn Profile
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/about/team">
                <Users className="h-5 w-5 mr-2"/>
                Meet the Full Team
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Platform Overview */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">The Platform</h2>
            <p className="text-xl text-muted-foreground">
              Two complementary platforms working together to serve the entire travel ecosystem
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Card className="border-accent-primary/20 hover:shadow-xl transition-shadow">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl"></div>
                  <div>
                    <CardTitle className="text-2xl text-accent-primary">ATLVS + COMPVSS</CardTitle>
                    <CardDescription className="text-lg">
                      Professional Operations Platform
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Comprehensive tools for travel professionals, partners, and businesses.
                  Manage operations, bookings, partnerships, and analytics with enterprise-grade solutions.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-semantic-success"/>
                    <span>Operations Management</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-semantic-success"/>
                    <span>Partner Portal</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-semantic-success"/>
                    <span>Analytics Dashboard</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-semantic-success"/>
                    <span>Revenue Management</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-semantic-success"/>
                    <span>Team Collaboration</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-semantic-success"/>
                    <span>API Integration</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-accent-secondary/20 hover:shadow-xl transition-shadow">
              <CardHeader className="pb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl"></div>
                  <div>
                    <CardTitle className="text-2xl text-accent-secondary">GVTEWAY</CardTitle>
                    <CardDescription className="text-lg">
                      Consumer Experience Platform
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Seamless, personalized experience for travelers. Discover, book, and enjoy
                  extraordinary adventures with AI-powered recommendations and community features.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-semantic-success"/>
                    <span>AI Recommendations</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-semantic-success"/>
                    <span>Easy Booking</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-semantic-success"/>
                    <span>Mobile App</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-semantic-success"/>
                    <span>Community Reviews</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-semantic-success"/>
                    <span>24/7 Support</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-semantic-success"/>
                    <span>Travel Insurance</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-accent-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <Award className="h-16 w-16 mx-auto mb-6 text-accent-primary"/>
          <h2 className="text-4xl font-display font-bold mb-4">Join Our Community</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Whether you&apos;re a traveler seeking extraordinary experiences, a professional in the travel industry,
            or a partner looking to collaborate, there&apos;s a place for you in our ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/travel/planning">
                <Compass className="h-5 w-5 mr-2"/>
                Start Your Journey
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/partners/become-partner">
                <Building2 className="h-5 w-5 mr-2"/>
                Become a Partner
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 G H X S T S H I P Industries LLC. ATLVS + GVTEWAY.</p>
            <p className="text-sm mt-2">
              Building the future of extraordinary travel experiences, one adventure at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
