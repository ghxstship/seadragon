
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// GET /api/v1/products - List products from database
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    // Query products from database
    const productsData = await db.query<{
      id?: string
      name?: string
      price?: number
      original_price?: number
      rating?: number
      review_count?: number
      image?: string
      category?: string
      brand?: string
      in_stock?: boolean
      is_new?: boolean
      is_sale?: boolean
      tags?: string[]
      description?: string
      variants?: string[]
      created_at?: string
    }>('products', {
      limit,
      order: { column: 'created_at', ascending: false }
    })

    // Apply filters if provided
    let products = productsData
    if (category) {
      products = products.filter(p => 
        p.category?.toLowerCase() === category.toLowerCase()
      )
    }
    if (search) {
      const searchLower = search.toLowerCase()
      products = products.filter(p =>
        p.name?.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.brand?.toLowerCase().includes(searchLower)
      )
    }

    return NextResponse.json({
      success: true,
      products,
      pagination: {
        total: products.length,
        limit,
        offset: 0
      }
    })
  } catch (error) {
    logger.error('Error fetching products', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching products'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['name', 'price']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: `Missing required field: ${field}`,
              field
            }
          },
          { status: 400 }
        )
      }
    }

    // Create new product in database
    const newProduct = await db.insert('products', {
      ...body,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      product: newProduct
    }, { status: 201 })
  } catch (error) {
    logger.error('Error creating product', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while creating the product'
        }
      },
      { status: 500 }
    )
  }
}
