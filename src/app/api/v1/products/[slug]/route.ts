
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// Product data interfaces
interface ProductReview {
  id: string
  user_id: string
  user_name: string
  rating: number
  title?: string
  comment?: string
  verified: boolean
  helpful: number
  created_at: string
}

// GET /api/v1/products/[slug] - Get product by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Query product from database
    const productsData = await db.query<{
      id?: string
      slug?: string
      name?: string
      description?: string
      long_description?: string
      price?: number
      original_price?: number
      category?: string
      brand?: string
      sku?: string
      in_stock?: boolean
      inventory?: number
      images?: string[]
      rating?: number
      reviews?: number
      specifications?: Record<string, string>
      features?: string[]
      reviews_data?: ProductReview[]
    }>('products', {
      limit: 1
    })

    // Find the specific product by slug
    const product = productsData.find(p => p.slug === slug) || productsData[0]

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Product not found'
          }
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      product
    })
  } catch (error) {
    logger.error('Error fetching product', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching product'
        }
      },
      { status: 500 }
    )
  }
}
