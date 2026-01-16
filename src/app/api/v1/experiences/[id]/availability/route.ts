
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// GET /api/v1/experiences/[id]/availability - Get availability slots for an experience
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Query availability slots from database
    const slotsData = await db.query<{
      id?: string
      date?: string
      time?: string
      available?: boolean
      capacity?: number
      booked?: number
      price?: number
      experience_slug?: string
      created_at?: string
    }>('experience_availability', {
      limit: 100,
      order: { column: 'date', ascending: true }
    })

    // Filter by experience slug if needed
    const filtered = slotsData.filter(slot => 
      !slot.experience_slug || slot.experience_slug === id
    )

    return NextResponse.json({
      success: true,
      experienceId: id,
      slots: filtered,
      pagination: {
        total: filtered.length
      }
    })
  } catch (error) {
    logger.error('Error fetching experience availability', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching availability'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/experiences/[id]/availability - Add availability slot
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Validate required fields
    if (!body.date || !body.time) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required fields: date and time'
          }
        },
        { status: 400 }
      )
    }

    // Create new availability slot in database
    const newSlot = await db.insert('experience_availability', {
      ...body,
      experience_id: id,
      available: body.available !== false,
      booked: 0,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      slot: newSlot
    }, { status: 201 })
  } catch (error) {
    logger.error('Error creating availability slot', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while creating the availability slot'
        }
      },
      { status: 500 }
    )
  }
}
