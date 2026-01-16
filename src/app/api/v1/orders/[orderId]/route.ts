
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// Order data interfaces
interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  total: number
  sku?: string
  variant?: string
}

interface Address {
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface PaymentMethod {
  type: 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer' | 'cash'
  lastFour?: string
  expiryMonth?: number
  expiryYear?: number
  cardType?: string
}

// Update order request interface
interface UpdateOrderRequest {
  status?: string
  items?: OrderItem[]
  subtotal?: number
  tax?: number
  shipping?: number
  total?: number
  shipping_address?: Address
  billing_address?: Address
  payment_method?: PaymentMethod
  tracking_number?: string
  estimated_delivery?: string
}

// GET /api/v1/orders/[orderId] - Get order by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params

    // Query order from database
    const orderData = await db.query<{
      id?: string
      date?: string
      created_at?: string
      status?: string
      items?: OrderItem[]
      subtotal?: number
      tax?: number
      shipping?: number
      total?: number
      shipping_address?: Address
      billing_address?: Address
      payment_method?: PaymentMethod
      tracking_number?: string
      estimated_delivery?: string
    }>('orders', {
      limit: 1
    })

    // Find the specific order
    const order = orderData.find(o => o.id === orderId) || orderData[0]

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Order not found'
          }
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      order
    })
  } catch (error) {
    logger.error('Error fetching order', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching the order'
        }
      },
      { status: 500 }
    )
  }
}

// PATCH /api/v1/orders/[orderId] - Update order
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params
    const body = await request.json() as UpdateOrderRequest

    // Update order in database
    const updatedOrder = await db.update('orders', orderId, {
      ...body,
      updated_at: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      order: updatedOrder
    })
  } catch (error) {
    logger.error('Error updating order', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while updating the order'
        }
      },
      { status: 500 }
    )
  }
}
