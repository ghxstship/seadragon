
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// GET /api/v1/payments - List payments from database
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const bookingId = searchParams.get('bookingId')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Query payments from database
    const payments = await db.query('payments', {
      filters: {
        ...(userId ? { user_id: userId } : {}),
        ...(bookingId ? { booking_id: bookingId } : {}),
        ...(status ? { status } : {})
      },
      order: { column: 'created_at', ascending: false },
      limit
    })

    return NextResponse.json({
      success: true,
      data: {
        payments,
        pagination: {
          total: payments.length,
          limit,
          offset: 0,
          hasNext: false,
          hasPrev: false
        }
      }
    })
  } catch (error) {
    logger.error('Error fetching payments', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching payments'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/payments - Process new payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['booking_id', 'user_id', 'amount', 'currency']
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

    // Validate amount
    if (body.amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Amount must be greater than 0',
            field: 'amount'
          }
        },
        { status: 400 }
      )
    }

    // Create new payment in database
    const newPayment = await db.insert('payments', {
      booking_id: body.booking_id,
      user_id: body.user_id,
      amount: body.amount,
      currency: body.currency,
      status: 'pending',
      payment_method: body.payment_method || 'card',
      description: body.description || null,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      data: {
        payment: newPayment,
        nextSteps: [
          "Complete payment using the provided client secret",
          "Payment will be processed securely",
          "Confirmation will be sent via email"
        ]
      }
    }, { status: 201 })
  } catch (error) {
    logger.error('Error processing payment', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while processing the payment'
        }
      },
      { status: 500 }
    )
  }
}
