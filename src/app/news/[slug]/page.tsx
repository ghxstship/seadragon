
'use client'

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { createSafeMarkdownHtml } from '@/lib/sanitize'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Header } from "@/lib/design-system"
import { logger } from "@/lib/logger"
import { Calendar, Clock, User, ArrowLeft, Share2, Bookmark, ThumbsUp } from "lucide-react"

interface NewsArticle {
  id: string
  title: string
  excerpt: string
  category: string
  author: string
  authorBio: string
  authorImage: string
  publishedAt: string
  readTime: string
  image: string
  featured: boolean
  content: string
  tags: string[]
  relatedArticles: string[]
}

interface NewsArticlePageProps {
  params: Promise<{ slug: string }>
}

export default function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = use(params)
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadArticle = async () => {
      try {
        const res = await fetch(`/api/v1/news/${slug}`)
        if (res.ok) {
          const data = await res.json()
          const a = data.article || data
          if (!cancelled && a) {
            setArticle({
              id: String(a.id || slug),
              title: String(a.title || ''),
              excerpt: String(a.excerpt || ''),
              category: String(a.category || ''),
              author: String(a.author || ''),
              authorBio: String(a.author_bio || a.authorBio || ''),
              authorImage: a.author_image || a.authorImage || '/placeholder-avatar.jpg',
              publishedAt: String(a.published_at || a.publishedAt || ''),
              readTime: String(a.read_time || a.readTime || ''),
              image: a.image || '/placeholder-news.jpg',
              featured: Boolean(a.featured),
              content: String(a.content || ''),
              tags: Array.isArray(a.tags) ? a.tags : [],
              relatedArticles: Array.isArray(a.related_articles || a.relatedArticles) ? (a.related_articles || a.relatedArticles) : []
            })
          }
        }
      } catch (error) {
        logger.error('Error loading article:', error)
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadArticle()

    return () => { cancelled = true }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading article...</div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Article Not Found</h1>
          <p className="text-muted-foreground">The article {slug} does not exist.</p>
          <Link href="/news" className="text-accent-primary mt-4 inline-block">Back to News</Link>
        </div>
      </div>
    )
  }

  // Render the article content
  const contentHtml = createSafeMarkdownHtml(article.content)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" size="sm" asChild className="mb-6">
          <Link href="/news">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Link>
        </Button>

        <Badge className="mb-4">{article.category}</Badge>
        
        <h1 className="text-4xl font-display font-bold mb-4">{article.title}</h1>
        
        <div className="flex items-center gap-4 text-muted-foreground mb-6">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{article.publishedAt}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{article.readTime}</span>
          </div>
        </div>

        {article.image && (
          <div className="aspect-video bg-muted rounded-lg mb-8 overflow-hidden">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        <Separator className="my-8" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Like
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {article.tags.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary">{tag}</Badge>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
