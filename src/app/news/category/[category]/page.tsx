
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Header } from "@/lib/design-system"
import { Calendar, Clock, User, ArrowLeft } from "lucide-react"

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
    content: "Full article content would go here..."
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
    content: "Full article content would go here..."
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
    content: "Full article content would go here..."
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
    content: "Full article content would go here..."
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
    content: "Full article content would go here..."
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
    content: "Full article content would go here..."
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
    content: "Full article content would go here..."
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
    content: "Full article content would go here..."
  }
]

const categories = [
  "Music Festivals",
  "Venues",
  "Industry",
  "Sustainability",
  "Artists",
  "Technology"
]

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params

  // Decode URL-encoded category (e.g., "Music%20Festivals" -> "Music Festivals")
  const decodedCategory = decodeURIComponent(category)

  // Validate category exists
  if (!categories.includes(decodedCategory)) {
    notFound()
  }

  // Filter articles by category
  const categoryArticles = allNewsArticles.filter(
    article => article.category === decodedCategory
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Category Header */}
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
            <Badge variant="secondary" className="mb-4 text-lg px-4 py-2">
              {decodedCategory}
            </Badge>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              {decodedCategory} News
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest developments and insights in {decodedCategory.toLowerCase()}.
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {categoryArticles.length === 0 ? (
            <div className="text-center py-16">
              <h2 className="text-2xl font-display font-bold mb-4">
                No articles found
              </h2>
              <p className="text-muted-foreground mb-8">
                There are currently no articles in the {decodedCategory} category.
              </p>
              <Button asChild>
                <Link href="/news">View All News</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <p className="text-muted-foreground">
                  {categoryArticles.length} article{categoryArticles.length !== 1 ? 's' : ''} in {decodedCategory}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categoryArticles.map((article) => (
                  <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {article.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {article.readTime}
                        </span>
                      </div>
                      <CardTitle className="text-xl leading-tight line-clamp-2">
                        <Link
                          href={`/news/${article.id}`}
                          className="hover:text-accent-primary transition-colors"
                        >
                          {article.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="line-clamp-3 mb-4">
                        {article.excerpt}
                      </CardDescription>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3"/>
                          {article.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3"/>
                          {new Date(article.publishedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Related Categories */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-display font-bold mb-8">
            Explore Other Categories
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {categories
              .filter(cat => cat !== decodedCategory)
              .map((cat) => (
                <Button
                  key={cat}
                  variant="outline"
                  asChild
                  className="rounded-full"
                >
                  <Link href={`/news/${encodeURIComponent(cat)}`}>
                    {cat}
                  </Link>
                </Button>
              ))}
          </div>
        </div>
      </section>
    </div>
  )
}

// Generate static params for all categories
export async function generateStaticParams() {
  return categories.map((category) => ({
    category: encodeURIComponent(category),
  }))
}
