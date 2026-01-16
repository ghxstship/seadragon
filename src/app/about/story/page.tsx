
'use client'


import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/lib/design-system"
import { Building2, Users, Target, Heart, Lightbulb, Globe, Award, TrendingUp, Calendar, Star, CheckCircle, Zap, Compass, Shield } from "lucide-react"

interface StoryChapter {
  id: string
  title: string
  year: number
  description: string
  impact: string
  quote?: string
  quoteAuthor?: string
  image: string
  icon: React.ComponentType<{ className?: string }>
}

interface CoreValue {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  story: string
}

export default function AboutStoryPage() {

  const storyChapters: StoryChapter[] = [
    {
      id: "founding",
      title: "The Spark of an Idea",
      year: 2020,
      description: "It all started in a small coffee shop in San Francisco. Two friends, frustrated with the fragmented travel experience, began sketching what would become ATLVS + GVTEWAY.",
      impact: "Founded with a vision to democratize extraordinary travel experiences",
      quote: "We realized that travel should be as seamless as the experiences themselves. No more fragmented bookings, confusing interfaces, or missed opportunities.",
      quoteAuthor: "Alex Chen, Co-Founder & CEO",
      image: "/api/placeholder/400/300",
      icon: Lightbulb
    },
    {
      id: "first-platform",
      title: "Building the Foundation",
      year: 2021,
      description: "Our first platform launched with a focus on personalized travel planning. We learned that great technology serves human needs, not the other way around.",
      impact: "Established foundation for AI-powered travel recommendations",
      quote: "Technology should enhance human experiences, not complicate them. We built tools that understand travelers' dreams and make them reality.",
      quoteAuthor: "Sarah Johnson, CTO",
      image: "/api/placeholder/400/300",
      icon: Building2
    },
    {
      id: "global-expansion",
      title: "Reaching Around the World",
      year: 2022,
      description: "From a local startup to a global platform. We expanded to 25+ countries, learning that authentic travel requires deep cultural understanding.",
      impact: "Made authentic, personalized travel accessible worldwide",
      quote: "Every destination has its own story. Our job is to help travelers become part of those stories, not just visitors passing through.",
      quoteAuthor: "Marcus Rodriguez, Chief Experience Officer",
      image: "/api/placeholder/400/300",
      icon: Globe
    },
    {
      id: "ai-revolution",
      title: "The AI Revolution",
      year: 2023,
      description: "Integrating artificial intelligence transformed how travelers discover and plan. We moved from reactive to proactive travel planning.",
      impact: "Transformed travel discovery from search to personalized recommendations",
      quote: "AI isn't about replacing human judgment—it's about amplifying it. Our algorithms learn from millions of travel stories to create yours.",
      quoteAuthor: "Sarah Johnson, CTO",
      image: "/api/placeholder/400/300",
      icon: Zap
    },
    {
      id: "sustainability-commitment",
      title: "Sustainability First",
      year: 2024,
      description: "Achieving carbon neutrality and launching regenerative tourism initiatives. Travel that gives back as much as it takes.",
      impact: "Set new industry standards for responsible tourism",
      quote: "Beautiful destinations deserve to stay beautiful. Every booking now contributes to conservation and community development.",
      quoteAuthor: "Emma Davis, Chief Sustainability Officer",
      image: "/api/placeholder/400/300",
      icon: Heart
    },
    {
      id: "community-milestone",
      title: "Building a Global Community",
      year: 2025,
      description: "Reached 250,000+ members across 75 countries. A thriving community of travelers, partners, and dreamers.",
      impact: "Created the world's largest premium travel community",
      quote: "We're not just a platform—we're a movement. A global community united by the transformative power of travel.",
      quoteAuthor: "Alex Chen, Co-Founder & CEO",
      image: "/api/placeholder/400/300",
      icon: Users
    }
  ]

  const coreValues: CoreValue[] = [
    {
      icon: Compass,
      title: "Exploration",
      description: "We believe in pushing boundaries and discovering new possibilities in travel and experiences.",
      story: "From our first backpacking trip through Southeast Asia to launching experiences in remote destinations, exploration has always been our guiding star. We encourage travelers to venture beyond the ordinary and discover the extraordinary in every journey."
    },
    {
      icon: Heart,
      title: "Authenticity",
      description: "Every experience should be genuine, meaningful, and true to its cultural and natural essence.",
      story: "We learned early that the most memorable experiences come from genuine connections. Whether it's learning traditional cooking from local families or participating in cultural ceremonies, we ensure every experience is authentic and respectful."
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "We prioritize the safety, security, and well-being of our community above all else.",
      story: "A terrifying incident during our founders' travels made us realize that safety isn't optional—it's essential. We built our platform with military-grade security and 24/7 support, ensuring peace of mind for every traveler."
    },
    {
      icon: Users,
      title: "Inclusivity",
      description: "Travel and experiences should be accessible to everyone, regardless of background or ability.",
      story: "We believe travel should unite, not divide. Our platform includes accessibility features, multilingual support, and experiences designed for all abilities. Everyone deserves to experience the world's wonders."
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We continuously evolve and embrace new technologies to enhance the travel experience.",
      story: "What started as a simple idea evolved through constant innovation. From our pioneering AI recommendations to blockchain-based booking security, we never stop finding better ways to serve travelers."
    },
    {
      icon: Globe,
      title: "Sustainability",
      description: "Responsible travel that preserves our planet and supports local communities.",
      story: "Climate change threatened the destinations we love. We committed to carbon neutrality and created regenerative tourism programs that give back more than they take. Travel that heals the planet, not harms it."
    }
  ]

  const stats = [
    { label: "Countries Served", value: "75+", icon: Globe },
    { label: "Active Members", value: "250,000+", icon: Users },
    { label: "Partner Experiences", value: "5,000+", icon: Star },
    { label: "Carbon Neutral Since", value: "2024", icon: Heart },
    { label: "Team Members", value: "450+", icon: Users },
    { label: "Years of Impact", value: "5+", icon: Calendar }
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
              From a simple idea born in a coffee shop to a global movement transforming travel.
              Here&apos;s the journey that brought us here—and where we&apos;re going next.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6">
                <Users className="h-5 w-5 mr-2"/>
                Meet Our Team
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <Calendar className="h-5 w-5 mr-2"/>
                Our Timeline
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Story Timeline */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Our Journey</h2>
            <p className="text-xl text-muted-foreground">
              Five years of innovation, growth, and transformation
            </p>
          </div>

          <div className="space-y-12">
            {storyChapters.map((chapter, index) => (
              <div key={chapter.id} className="flex gap-8 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-accent-primary/20 rounded-full flex items-center justify-center">
                    <chapter.icon className="h-8 w-8 text-accent-primary"/>
                  </div>
                  {index < storyChapters.length - 1 && (
                    <div className="w-0.5 h-16 bg-border mx-auto mt-4"></div>
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-4 mb-3">
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {chapter.year}
                    </Badge>
                    <h3 className="text-2xl font-semibold">{chapter.title}</h3>
                  </div>
                  <p className="text-lg text-muted-foreground mb-4">
                    {chapter.description}
                  </p>

                  {chapter.quote && (
                    <Card className="mb-4 border-l-4 border-l-accent-primary">
                      <CardContent className="pt-6">
                        <blockquote className="text-lg italic text-muted-foreground mb-2">
                          &ldquo;{chapter.quote}&rdquo;
                        </blockquote>
                        {chapter.quoteAuthor && (
                          <cite className="text-accent-primary font-medium">
                            — {chapter.quoteAuthor}
                          </cite>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  <div className="bg-accent-primary/5 border border-accent-primary/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-accent-primary font-medium mb-1">
                      <TrendingUp className="h-4 w-4"/>
                      Impact
                    </div>
                    <p className="text-muted-foreground">{chapter.impact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground">
              The principles that guide every decision we make
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <CardContent className="pt-8 pb-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent-primary/20 flex items-center justify-center">
                    <value.icon className="h-8 w-8 text-accent-primary"/>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground mb-4">{value.description}</p>

                  <details className="text-left">
                    <summary className="cursor-pointer font-medium text-accent-primary hover:text-accent-primary/80 mb-2">
                      Read the story →
                    </summary>
                    <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                      {value.story}
                    </p>
                  </details>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact & Growth */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">The Impact We&apos;ve Created</h2>
            <p className="text-xl text-muted-foreground">
              Numbers tell part of our story, but the real impact is in the lives we&apos;ve touched
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 pb-4">
                  <stat.icon className="h-8 w-8 mx-auto mb-3 text-accent-primary"/>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-6 w-6 mr-3 text-semantic-error"/>
                  Community Impact
                </CardTitle>
                <CardDescription>
                  How our platform has transformed travel experiences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-semantic-success mt-0.5 flex-shrink-0"/>
                  <div>
                    <h4 className="font-medium mb-1">Personalized Discovery</h4>
                    <p className="text-sm text-muted-foreground">
                      Our AI has helped travelers discover 2.3 million unique experiences they never knew existed.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-semantic-success mt-0.5 flex-shrink-0"/>
                  <div>
                    <h4 className="font-medium mb-1">Local Economies</h4>
                    <p className="text-sm text-muted-foreground">
                      Generated $450M+ in revenue for local businesses and communities worldwide.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-semantic-success mt-0.5 flex-shrink-0"/>
                  <div>
                    <h4 className="font-medium mb-1">Conservation Support</h4>
                    <p className="text-sm text-muted-foreground">
                      Funded 150+ conservation projects protecting endangered wildlife and habitats.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-6 w-6 mr-3 text-semantic-warning"/>
                  Recognition & Awards
                </CardTitle>
                <CardDescription>
                  Industry recognition for innovation and impact
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-semantic-warning mt-0.5 flex-shrink-0"/>
                  <div>
                    <h4 className="font-medium mb-1">Travel Innovation Award 2025</h4>
                    <p className="text-sm text-muted-foreground">
                      Recognized for AI-powered personalization in travel planning.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-semantic-warning mt-0.5 flex-shrink-0"/>
                  <div>
                    <h4 className="font-medium mb-1">Sustainability Leadership 2024</h4>
                    <p className="text-sm text-muted-foreground">
                      Awarded for carbon-neutral operations and regenerative tourism.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-semantic-warning mt-0.5 flex-shrink-0"/>
                  <div>
                    <h4 className="font-medium mb-1">Tech Excellence Award 2023</h4>
                    <p className="text-sm text-muted-foreground">
                      Honored for innovative platform architecture and user experience.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="mb-12">
            <h2 className="text-4xl font-display font-bold mb-4">What&apos;s Next</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Our story is just beginning. Here&apos;s where we&apos;re heading in the years ahead.
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-8 pb-6">
                  <Zap className="h-12 w-12 mx-auto mb-4 text-accent-primary"/>
                  <h3 className="text-lg font-semibold mb-2">AI-Powered Experiences</h3>
                  <p className="text-sm text-muted-foreground">
                    Predictive travel planning that anticipates your needs before you know them.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-8 pb-6">
                  <Globe className="h-12 w-12 mx-auto mb-4 text-accent-secondary"/>
                  <p className="text-sm text-muted-foreground">
                    Expanding to every country, bringing authentic experiences to every corner of the world.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-8 pb-6">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-semantic-error"/>
                  <h3 className="text-lg font-semibold mb-2">Regenerative Travel</h3>
                  <p className="text-sm text-muted-foreground">
                    Every journey contributes positively to local communities and environmental conservation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-accent-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <Building2 className="h-16 w-16 mx-auto mb-6 text-accent-primary"/>
          <h2 className="text-4xl font-display font-bold mb-4">Be Part of Our Story</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join millions of travelers who have discovered that extraordinary experiences
            are waiting for those who seek them. Your next adventure starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/travel/planning">
                <Compass className="h-5 w-5 mr-2"/>
                Start Your Journey
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about/team">
                <Users className="h-5 w-5 mr-2"/>
                Meet the Team
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 G H X S T S H I P Industries LLC. ATLVS + GVTEWAY Story.</p>
            <p className="text-sm mt-2">
              Every great journey begins with a single step. Yours starts now.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
