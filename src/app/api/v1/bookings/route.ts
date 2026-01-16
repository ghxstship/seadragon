
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// GET /api/v1/bookings - List bookings from database
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Query bookings from database
    const bookings = await db.query('reservations', {
      filters: {
        ...(userId ? { user_id: userId } : {}),
        ...(status ? { status } : {})
      },
      order: { column: 'created_at', ascending: false },
      limit
    })

    return NextResponse.json({
      success: true,
      data: {
        bookings,
        pagination: {
          total: bookings.length,
          limit,
          offset: 0,
          hasNext: false,
          hasPrev: false
        }
      }
    })
  } catch (error) {
    logger.error('Error fetching bookings', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching bookings'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/bookings - Create new booking
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['user_id', 'experience_id', 'participants']
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

    // Create new booking in database
    const newBooking = await db.insert('reservations', {
      user_id: body.user_id,
      experience_id: body.experience_id,
      event_id: body.event_id || null,
      booking_date: body.booking_date || new Date().toISOString(),
      participants: body.participants,
      total_amount: body.total_amount || 0,
      currency: body.currency || 'USD',
      status: 'pending',
      payment_status: 'pending',
      notes: body.notes || null,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      data: {
        booking: newBooking,
        nextSteps: [
          "Complete payment to confirm booking",
          "Check email for booking confirmation",
          "Contact provider for any special requests"
        ]
      }
    }, { status: 201 })
  } catch (error) {
    logger.error('Error creating booking', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while creating the booking'
        }
      },
      { status: 500 }
    )
  }
}
