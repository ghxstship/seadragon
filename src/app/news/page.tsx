
'use client'

import { logger } from "@/lib/logger"
import { Calendar, Clock, User } from "lucide-react"
import { Input } from "@/components/ui/input"

interface NewsArticleApiResponse {
  id: string | number
  title?: string
  excerpt?: string
  category?: string
  author?: string
  published_at?: string
  created_at?: string
  read_time?: string
  image?: string
  featured?: boolean
}

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  category: string
  author: string
  publishedAt: string
  readTime: string
  image: string
  featured: boolean
}

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  category: string
  author: string
  publishedAt: string
  readTime: string
  image: string
  featured: boolean
}

const categories = [
  "All",
  "Music Festivals",
  "Venues",
  "Industry",
  "Sustainability",
  "Artists",
  "Technology"
]

export default function NewsPage() {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadNews = async () => {
      try {
        const res = await fetch('/api/v1/news')
        if (res.ok) {
          const data = await res.json()
          const articles = Array.isArray(data.articles) ? data.articles : []
          if (!cancelled) {
            setNewsArticles(articles.map((a: NewsArticleApiResponse) => ({
              id: String(a.id),
              title: String(a.title || 'Untitled Article'),
              excerpt: String(a.excerpt || ''),
              category: String(a.category || 'General'),
              author: String(a.author || 'Anonymous'),
              publishedAt: a.published_at || a.created_at || new Date().toISOString(),
              readTime: String(a.read_time || '5 min read'),
              image: a.image || '/placeholder-news.jpg',
              featured: Boolean(a.featured)
            })))
          }
        } else {
          if (!cancelled) {
            setNewsArticles([])
          }
        }
      } catch (error) {
        logger.error('Error loading news:', error)
        if (!cancelled) {
          setNewsArticles([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadNews()

    return () => { cancelled = true }
  }, [])

  const featuredArticle = newsArticles.find(article => article.featured)
  const regularArticles = newsArticles.filter(article => !article.featured)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header/>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              News & Insights
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay informed with the latest developments in live entertainment,
              industry trends, and breakthrough innovations shaping the future of events.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                size="sm"
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Article */}
      {featuredArticle && (
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="mb-8">
              <Badge variant="secondary" className="mb-4">Featured Story</Badge>
            </div>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="w-full h-64 md:h-full object-cover"/>
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <Badge variant="outline">{featuredArticle.category}</Badge>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4"/>
                      {new Date(featuredArticle.publishedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4"/>
                      {featuredArticle.readTime}
                    </div>
                  </div>
                  <h2 className="text-3xl font-display font-bold mb-4 leading-tight">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 text-lg">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4"/>
                      <span className="text-sm text-muted-foreground">
                        By {featuredArticle.author}
                      </span>
                    </div>
                    <Button asChild>
                      <Link href={`/news/${featuredArticle.id}`}>
                        Read Full Article
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Regular Articles Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-display font-bold mb-12 text-center">
            Latest Stories
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((article) => (
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

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Stories
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-display font-bold mb-4">
            Stay in the Loop
          </h2>
          <p className="text-muted-foreground mb-8">
            Get the latest news and insights delivered directly to your inbox.
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
