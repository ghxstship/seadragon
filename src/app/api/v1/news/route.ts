
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// GET /api/v1/news - Get all news articles
export async function GET(request: NextRequest) {
  try {
    // Query news articles from database
    const articlesData = await db.query<{
      id?: string
      slug?: string
      title?: string
      excerpt?: string
      description?: string
      category?: string
      author?: string
      published_at?: string
      created_at?: string
      read_time?: string
      image?: string
      image_url?: string
      featured?: boolean
    }>('news_articles', {
      limit: 50,
      order: { column: 'published_at', ascending: false }
    })

    return NextResponse.json({
      success: true,
      articles: articlesData,
      pagination: {
        total: articlesData.length
      }
    })
  } catch (error) {
    logger.error('Error fetching news articles', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching news articles'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/news - Create a news article
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required field: title'
          }
        },
        { status: 400 }
      )
    }

    // Create new article in database
    const newArticle = await db.insert('news_articles', {
      ...body,
      published_at: body.published_at || new Date().toISOString(),
      created_at: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      article: newArticle
    }, { status: 201 })
  } catch (error) {
    logger.error('Error creating news article', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while creating the article'
        }
      },
      { status: 500 }
    )
  }
}
