
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { auth } from '@/auth'
import { db } from '@/lib/db'

// GET /api/bookings - Get user's bookings from database
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Query bookings from database
    const bookings = await db.query('reservations', {
      filters: { user_id: session.user.id, ...(status ? { status } : {}) },
      order: { column: 'created_at', ascending: false },
      limit
    })

    return NextResponse.json({
      bookings,
      total: bookings.length,
      hasMore: false
    })
  } catch (error) {
    logger.error('Error fetching bookings', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/bookings - Create new booking
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      experience_id,
      date,
      guests,
      total_amount,
      notes
    } = body

    // Validate required fields
    if (!experience_id || !date || !guests) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create new booking in database
    const newBooking = await db.insert('reservations', {
      experience_id,
      user_id: session.user.id,
      date,
      guests,
      total_amount: total_amount || 0,
      status: 'confirmed',
      notes: notes || null,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({
      booking: newBooking,
      message: 'Booking created successfully'
    }, { status: 201 })
  } catch (error) {
    logger.error('Error creating booking', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
