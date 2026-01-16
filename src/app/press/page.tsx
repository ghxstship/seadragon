
'use client'


import { logger } from "@/lib/logger"
import { FileText, Download, Camera, Mail, Users, Search, Calendar, ExternalLink, Building2, Award, TrendingUp, Globe, Newspaper, Video, Image, UserCheck, ArrowRight, Filter, Handshake } from "lucide-react"

interface PressReleaseApiResponse {
  id: string | number
  title?: string
  excerpt?: string
  description?: string
  date?: string
  created_at?: string
  category?: string
  featured?: boolean
  slug?: string
}

interface PressRelease {
  id: string
  title: string
  excerpt: string
  date: Date
  category: string
  featured: boolean
  slug: string
}

interface PressRelease {
  id: string
  title: string
  excerpt: string
  date: Date
  category: string
  featured: boolean
  slug: string
}

interface MediaCoverage {
  id: string
  outlet: string
  title: string
  excerpt: string
  date: Date
  type: 'article' | 'video' | 'podcast' | 'broadcast'
  url?: string
  logo: string
}

interface QuickFact {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
}

export default function PressPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [pressReleases, setPressReleases] = useState<PressRelease[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadPressReleases = async () => {
      try {
        // Fetch press releases from API
        const res = await fetch('/api/v1/press')
        if (res.ok) {
          const data = await res.json()
          const releases = Array.isArray(data.releases) ? data.releases : []
          const mapped: PressRelease[] = releases.map((r: PressReleaseApiResponse) => ({
            id: String(r.id),
            title: String(r.title || 'Press Release'),
            excerpt: String(r.excerpt || r.description || ''),
            date: new Date(r.date || r.created_at || Date.now()),
            category: String(r.category || 'Company'),
            featured: Boolean(r.featured),
            slug: String(r.slug || r.id)
          }))
          if (!cancelled) {
            setPressReleases(mapped)
            setLoading(false)
          }
        } else {
          if (!cancelled) {
            setPressReleases([])
            setLoading(false)
          }
        }
      } catch (error) {
        logger.error('Error loading press releases:', error)
        if (!cancelled) {
          setPressReleases([])
          setLoading(false)
        }
      }
    }

    loadPressReleases()

    return () => { cancelled = true }
  }, [])

  const filteredReleases = pressReleases.filter(release => {
    const matchesSearch = release.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         release.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || release.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [
    { id: "all", label: "All Categories" },
    { id: "Technology", label: "Technology" },
    { id: "Partnerships", label: "Partnerships" },
    { id: "Company", label: "Company" },
    { id: "Sustainability", label: "Sustainability" },
    { id: "Expansion", label: "Expansion" },
    { id: "Events", label: "Events" }
  ]

  const mediaCoverage: MediaCoverage[] = [
    {
      id: "1",
      outlet: "Forbes",
      title: "How AI is Revolutionizing Luxury Travel",
      excerpt: "Exclusive interview with ATLVS + GVTEWAY CEO on the future of personalized travel experiences.",
      date: new Date("2026-01-12"),
      type: "article",
      url: "https://forbes.com/ai-luxury-travel",
      logo: ""
    },
    {
      id: "2",
      outlet: "CNN Travel",
      title: "The Rise of Sustainable Luxury Travel",
      excerpt: "Feature story on our carbon-neutral initiatives and eco-friendly partnerships.",
      date: new Date("2026-01-08"),
      type: "video",
      url: "https://cnn.com/sustainable-luxury-travel",
      logo: ""
    },
    {
      id: "3",
      outlet: "Travel Weekly",
      title: "Tech Innovation in Travel: A Deep Dive",
      excerpt: "In-depth analysis of our platform's technology stack and industry impact.",
      date: new Date("2026-01-05"),
      type: "article",
      url: "https://travelweekly.com/tech-innovation",
      logo: ""
    },
    {
      id: "4",
      outlet: "Bloomberg TV",
      title: "Disrupting the Travel Industry",
      excerpt: "Live interview discussing market disruption and future growth strategies.",
      date: new Date("2026-01-03"),
      type: "broadcast",
      url: "https://bloomberg.com/travel-disruption",
      logo: ""
    }
  ]

  const quickFacts: QuickFact[] = [
    { label: "Founded", value: "2020", icon: Calendar },
    { label: "Headquarters", value: "New York, NY", icon: Building2 },
    { label: "Employees", value: "450+", icon: Users },
    { label: "Members", value: "250,000+", icon: UserCheck },
    { label: "Destinations", value: "500+", icon: Globe },
    { label: "Partners", value: "300+", icon: Handshake }
  ]

  const featuredReleases = pressReleases.filter(release => release.featured).slice(0, 3)

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Technology": "bg-accent-primary/10 text-blue-800",
      "Partnerships": "bg-semantic-success/10 text-green-800",
      "Company": "bg-accent-primary/10 text-purple-800",
      "Sustainability": "bg-emerald-100 text-emerald-800",
      "Expansion": "bg-semantic-warning/10 text-orange-800",
      "Events": "bg-pink-100 text-pink-800"
    }
    return colors[category] || "bg-neutral-100 text-neutral-800"
  }

  const getCoverageTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4"/>
      case 'podcast': return <Award className="h-4 w-4"/>
      case 'broadcast': return <TrendingUp className="h-4 w-4"/>
      default: return <Newspaper className="h-4 w-4"/>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header/>
        <div className="container mx-auto px-4 py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded w-1/3 mx-auto"></div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-accent-primary/10 via-accent-secondary/5 to-accent-tertiary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-primary/20 rounded-full mb-6">
              <FileText className="h-10 w-10 text-accent-primary"/>
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Press Room
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Your trusted source for ATLVS + GVTEWAY news, announcements, and media resources.
              Stay informed about our latest innovations, partnerships, and industry leadership.
            </p>

            {/* Search and Filters */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                  <Input
                    placeholder="Search press releases..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"/>
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category"/>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Press Releases */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Latest Announcements</h2>
            <p className="text-lg text-muted-foreground">
              Our most recent press releases and company updates
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {featuredReleases.map((release) => (
              <Card key={release.id} className="hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className={getCategoryColor(release.category)}>
                      {release.category}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {release.date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <CardTitle className="text-xl line-clamp-3">{release.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6 line-clamp-3">
                    {release.excerpt}
                  </p>
                  <Button variant="outline" className="w-full">
                    Read Full Release
                    <ArrowRight className="h-4 w-4 ml-2"/>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" asChild>
              <Link href="/press/releases">
                <FileText className="h-5 w-5 mr-2"/>
                View All Press Releases
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Press Resources Grid */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">Press Resources</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need for comprehensive coverage
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="text-4xl mb-4"></div>
                <h3 className="text-xl font-semibold mb-3">Press Releases</h3>
                <p className="text-muted-foreground mb-4">
                  Official announcements and company news
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/press/releases">Browse Releases</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="text-4xl mb-4"></div>
                <h3 className="text-xl font-semibold mb-3">Media Kit</h3>
                <p className="text-muted-foreground mb-4">
                  Brand assets and usage guidelines
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/press/media-kit">Download Kit</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="text-4xl mb-4"></div>
                <h3 className="text-xl font-semibold mb-3">Brand Assets</h3>
                <p className="text-muted-foreground mb-4">
                  Logos, photos, and digital assets
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/press/logos">View Assets</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardContent className="pt-8 pb-6 text-center">
                <div className="text-4xl mb-4"></div>
                <h3 className="text-xl font-semibold mb-3">Press Contact</h3>
                <p className="text-muted-foreground mb-4">
                  Get in touch with our press team
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/press/contact">Contact Us</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* All Press Releases */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">All Press Releases</h2>
              <p className="text-muted-foreground">
                {filteredReleases.length} release{filteredReleases.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" asChild>
                <Link href="/news">
                  <Newspaper className="h-4 w-4 mr-2"/>
                  News Articles
                </Link>
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {filteredReleases.map((release) => (
              <Card key={release.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getCategoryColor(release.category)}>
                          {release.category}
                        </Badge>
                        {release.featured && (
                          <Badge variant="secondary" className="bg-semantic-warning/10 text-yellow-800">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-xl font-semibold mb-3 hover:text-accent-primary cursor-pointer">
                        {release.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {release.excerpt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1"/>
                      {release.date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <Button variant="outline">
                      Read Full Release
                      <ArrowRight className="h-4 w-4 ml-2"/>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage & Quick Facts */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Media Coverage */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Newspaper className="h-5 w-5 mr-2"/>
                    Recent Media Coverage
                  </CardTitle>
                  <CardDescription>
                    ATLVS + GVTEWAY in the news
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mediaCoverage.map((coverage) => (
                      <div key={coverage.id} className="flex gap-4 p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                        <div className="text-2xl flex-shrink-0">{coverage.logo}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{coverage.outlet}</span>
                            <div className="flex items-center text-xs text-muted-foreground">
                              {getCoverageTypeIcon(coverage.type)}
                              <span className="ml-1 capitalize">{coverage.type}</span>
                            </div>
                          </div>
                          <h4 className="font-medium mb-1 hover:text-accent-primary cursor-pointer">
                            {coverage.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {coverage.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {coverage.date.toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            {coverage.url && (
                              <Button variant="ghost" size="sm" asChild>
                                <a href={coverage.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3 mr-1"/>
                                  View
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Facts */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2"/>
                    Company Facts
                  </CardTitle>
                  <CardDescription>
                    Key statistics and information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {quickFacts.map((fact, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-accent/5 rounded-lg">
                        <div className="flex items-center gap-3">
                          <fact.icon className="h-4 w-4 text-accent-primary"/>
                          <span className="text-sm font-medium">{fact.label}</span>
                        </div>
                        <span className="font-semibold">{fact.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Media Credentials */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserCheck className="h-5 w-5 mr-2"/>
                    Media Credentials
                  </CardTitle>
                  <CardDescription>
                    Accredited press access
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Apply for media credentials to access exclusive press events and embargoed content.
                  </p>
                  <Button className="w-full" asChild>
                    <Link href="/press/credentials">
                      Apply for Credentials
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-accent-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <Mail className="h-16 w-16 mx-auto mb-6 text-accent-primary"/>
          <h2 className="text-4xl font-display font-bold mb-4">Need Media Resources?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Our dedicated press team is available to assist with media inquiries, interview requests,
            and all your coverage needs. Get the information you need quickly and efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/press/contact">
                <Mail className="h-5 w-5 mr-2"/>
                Contact Press Team
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/press/media-kit">
                <Download className="h-5 w-5 mr-2"/>
                Download Media Kit
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto">
          <div className="text-center text-muted-foreground">
            <p>&copy; 2026 G H X S T S H I P Industries LLC. ATLVS + GVTEWAY Press Room.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
