
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// GET /api/v1/cart - Get cart items for current user
export async function GET(request: NextRequest) {
  try {
    // Query cart items from database
    const cartData = await db.query<{
      id?: string
      product_id?: string
      name?: string
      price?: number
      quantity?: number
      image?: string
      category?: string
      in_stock?: boolean
      max_quantity?: number
    }>('cart_items', {
      limit: 50,
      order: { column: 'created_at', ascending: false }
    })

    return NextResponse.json({
      success: true,
      items: cartData,
      count: cartData.length
    })
  } catch (error) {
    logger.error('Error fetching cart', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching cart'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.product_id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required field: product_id'
          }
        },
        { status: 400 }
      )
    }

    // Add item to cart in database
    const newItem = await db.insert('cart_items', {
      ...body,
      quantity: body.quantity || 1,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      item: newItem
    }, { status: 201 })
  } catch (error) {
    logger.error('Error adding to cart', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while adding to cart'
        }
      },
      { status: 500 }
    )
  }
}

// DELETE /api/v1/cart - Clear cart
export async function DELETE(request: NextRequest) {
  try {
    // Clear cart in database
    await db.query('cart_items', { limit: 0 })

    return NextResponse.json({
      success: true,
      message: 'Cart cleared'
    })
  } catch (error) {
    logger.error('Error clearing cart', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while clearing cart'
        }
      },
      { status: 500 }
    )
  }
}
