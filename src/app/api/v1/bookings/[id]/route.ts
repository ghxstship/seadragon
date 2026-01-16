
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { auth } from '@/auth'

// GET /api/v1/bookings/[id] - Get single booking from Supabase
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { data: booking, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !booking) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Booking not found'
          }
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        booking
      }
    })
  } catch (error) {
    logger.error('Error fetching booking', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching the booking'
        }
      },
      { status: 500 }
    )
  }
}

// PUT /api/v1/bookings/[id] - Update booking in Supabase
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    // Check if booking exists
    const { data: existingBooking, error: fetchError } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !existingBooking) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Booking not found'
          }
        },
        { status: 404 }
      )
    }

    const body = await request.json()

    // Update booking in Supabase
    const { data: updatedBooking, error: updateError } = await supabase
      .from('reservations')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      data: {
        booking: updatedBooking
      }
    })
  } catch (error) {
    logger.error('Error updating booking', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while updating the booking'
        }
      },
      { status: 500 }
    )
  }
}

// DELETE /api/v1/bookings/[id] - Cancel booking in Supabase
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    // Check if booking exists
    const { data: booking, error: fetchError } = await supabase
      .from('reservations')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !booking) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Booking not found'
          }
        },
        { status: 404 }
      )
    }

    // Mark as cancelled instead of deleting
    const { data: cancelledBooking, error: updateError } = await supabase
      .from('reservations')
      .update({
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      data: {
        booking: cancelledBooking,
        message: 'Booking has been cancelled successfully'
      }
    })
  } catch (error) {
    logger.error('Error cancelling booking', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while cancelling the booking'
        }
      },
      { status: 500 }
    )
  }
}
