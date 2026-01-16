
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// GET /api/v1/news/[slug] - Get news article by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Query article from database
    const articlesData = await db.query<{
      id?: string
      slug?: string
      title?: string
      excerpt?: string
      category?: string
      author?: string
      author_bio?: string
      author_image?: string
      published_at?: string
      read_time?: string
      image?: string
      featured?: boolean
      content?: string
      tags?: string[]
      related_articles?: string[]
    }>('news_articles', {
      limit: 1
    })

    // Find the specific article by slug
    const article = articlesData.find(a => a.slug === slug || a.id === slug) || articlesData[0]

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Article not found'
          }
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      article
    })
  } catch (error) {
    logger.error('Error fetching news article', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching news article'
        }
      },
      { status: 500 }
    )
  }
}
