
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { Calendar, Clock, User, ArrowLeft, Filter } from "lucide-react"

// Mock news data - in a real app, this would come from a CMS or API
const allNewsArticles = [
  {
    id: "coachella-2025-lineup-announced",
    title: "Coachella 2025 Lineup Announced: Headliners Include Lana Del Rey and Tyler The Creator",
    excerpt: "The festival organizers have revealed the first wave of artists for next year's event, featuring an impressive lineup of global superstars and emerging talent.",
    category: "Music Festivals",
    author: "Sarah Johnson",
    publishedAt: "2025-01-15",
    readTime: "3 min read",
    image: "/api/placeholder/600/400",
    featured: true
  },
  {
    id: "new-venue-opens-downtown",
    title: "Historic Theater Reopens After $50M Renovation",
    excerpt: "The iconic venue returns to its former glory with state-of-the-art acoustics, modern amenities, and a renewed commitment to live entertainment.",
    category: "Venues",
    author: "Mike Chen",
    publishedAt: "2025-01-12",
    readTime: "4 min read",
    image: "/api/placeholder/600/400",
    featured: false
  },
  {
    id: "streaming-vs-live-debate",
    title: "The Future of Live Entertainment: Streaming vs. In-Person Experiences",
    excerpt: "Industry experts weigh in on how digital platforms are reshaping the live entertainment landscape and what it means for traditional venues.",
    category: "Industry",
    author: "Dr. Amanda Rodriguez",
    publishedAt: "2025-01-10",
    readTime: "6 min read",
    image: "/api/placeholder/600/400",
    featured: false
  },
  {
    id: "sustainability-in-events",
    title: "Leading Festivals Commit to Carbon-Neutral Operations by 2030",
    excerpt: "Major event organizers announce ambitious sustainability goals, including zero-waste policies and renewable energy commitments.",
    category: "Sustainability",
    author: "Emma Thompson",
    publishedAt: "2025-01-08",
    readTime: "5 min read",
    image: "/api/placeholder/600/400",
    featured: false
  },
  {
    id: "emerging-artists-spotlight",
    title: "Emerging Artists to Watch: The Next Generation of Live Entertainment",
    excerpt: "Our annual roundup of breakthrough performers who are pushing the boundaries of live music and performance art.",
    category: "Artists",
    author: "Carlos Martinez",
    publishedAt: "2025-01-05",
    readTime: "7 min read",
    image: "/api/placeholder/600/400",
    featured: false
  },
  {
    id: "tech-in-live-events",
    title: "How AI and VR Are Transforming Live Event Production",
    excerpt: "Cutting-edge technologies are revolutionizing how events are planned, executed, and experienced by audiences worldwide.",
    category: "Technology",
    author: "Dr. James Wilson",
    publishedAt: "2025-01-03",
    readTime: "8 min read",
    image: "/api/placeholder/600/400",
    featured: false
  },
  {
    id: "virtual-reality-concerts",
    title: "Virtual Reality Concerts: The Next Frontier in Live Entertainment",
    excerpt: "VR technology is creating immersive concert experiences that transcend physical limitations.",
    category: "Technology",
    author: "Dr. James Wilson",
    publishedAt: "2024-12-28",
    readTime: "6 min read",
    image: "/api/placeholder/600/400",
    featured: false
  },
  {
    id: "festival-sustainability-guide",
    title: "A Complete Guide to Sustainable Festival Practices",
    excerpt: "From waste reduction to carbon offsetting, learn how festivals are becoming environmentally responsible.",
    category: "Sustainability",
    author: "Emma Thompson",
    publishedAt: "2024-12-25",
    readTime: "9 min read",
    image: "/api/placeholder/600/400",
    featured: false
  },
  {
    id: "indie-venue-spotlight",
    title: "Rising Stars: Independent Venues Leading Innovation",
    excerpt: "Small venues are adopting cutting-edge technology and creative programming to compete with larger establishments.",
    category: "Venues",
    author: "Mike Chen",
    publishedAt: "2024-12-20",
    readTime: "5 min read",
    image: "/api/placeholder/600/400",
    featured: false
  },
  {
    id: "music-industry-trends-2025",
    title: "Music Industry Trends to Watch in 2025",
    excerpt: "From AI-assisted songwriting to blockchain-based royalties, the industry is evolving rapidly.",
    category: "Industry",
    author: "Dr. Amanda Rodriguez",
    publishedAt: "2024-12-15",
    readTime: "7 min read",
    image: "/api/placeholder/600/400",
    featured: false
  }
]

const categories = [
  "All",
  "Music Festivals",
  "Venues",
  "Industry",
  "Sustainability",
  "Artists",
  "Technology"
]

// Group articles by month/year
function groupArticlesByMonth(articles: typeof allNewsArticles) {
  const grouped: { [key: string]: typeof allNewsArticles } = {}

  articles.forEach(article => {
    const date = new Date(article.publishedAt)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthName = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })

    if (!grouped[monthName]) {
      grouped[monthName] = []
    }
    grouped[monthName].push(article)
  })

  return grouped
}

export default function ArchivePage() {
  // Sort articles by date (newest first) for archive view
  const sortedArticles = [...allNewsArticles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  )

  const groupedArticles = groupArticlesByMonth(sortedArticles)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Archive Header */}
      <section className="py-16 px-4 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/news">
                <ArrowLeft className="h-4 w-4 mr-2"/>
                Back to News
              </Link>
            </Button>
          </div>

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              News Archive
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Browse our complete collection of articles, insights, and industry updates organized chronologically.
            </p>

            {/* Archive Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-primary">
                  {allNewsArticles.length}
                </div>
                <div className="text-sm text-muted-foreground">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-primary">
                  {categories.length - 1}
                </div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-primary">
                  {Object.keys(groupedArticles).length}
                </div>
                <div className="text-sm text-muted-foreground">Months</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-primary">
                  {new Date(allNewsArticles[0]?.publishedAt || Date.now()).getFullYear()}
                </div>
                <div className="text-sm text-muted-foreground">Latest Year</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Archive Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Filter Options */}
          <div className="flex flex-wrap items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4"/>
              <span className="text-sm text-muted-foreground">Filter by:</span>
              <Button variant="outline" size="sm" className="rounded-full">
                All Categories
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Showing {allNewsArticles.length} articles
            </div>
          </div>

          {/* Monthly Archive */}
          {Object.entries(groupedArticles).map(([month, articles]) => (
            <div key={month} className="mb-12">
              <h2 className="text-2xl font-display font-bold mb-6 flex items-center gap-3">
                <Calendar className="h-6 w-6"/>
                {month}
              </h2>

              <div className="space-y-6">
                {articles.map((article) => (
                  <Card key={article.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="md:flex">
                      <div className="md:w-1/4">
                        <div className="aspect-video md:aspect-square overflow-hidden">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover"/>
                        </div>
                      </div>
                      <div className="md:w-3/4 p-6">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="outline" className="text-xs">
                            {article.category}
                          </Badge>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3"/>
                              {article.readTime}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3"/>
                              {article.author}
                            </div>
                          </div>
                        </div>

                        <h3 className="text-xl font-semibold mb-2 leading-tight">
                          <Link
                            href={`/news/${article.id}`}
                            className="hover:text-accent-primary transition-colors"
                          >
                            {article.title}
                          </Link>
                        </h3>

                        <p className="text-muted-foreground mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted-foreground">
                            Published {new Date(article.publishedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/news/${article.id}`}>
                              Read More →
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}

          {/* Load More for Older Archives */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load Older Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Archive Navigation */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-display font-bold mb-8">
            Explore News by Category
          </h2>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.slice(1).map((category) => (
              <Button
                key={category}
                variant="outline"
                asChild
                className="rounded-full"
              >
                <Link href={`/news/${encodeURIComponent(category)}`}>
                  {category}
                </Link>
              </Button>
            ))}
          </div>
          <Button asChild size="lg">
            <Link href="/news">
              Back to Latest News
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
