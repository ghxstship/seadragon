
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// GET /api/v1/destinations/[id]/about - Get about info for a destination
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Query destination about data from database
    const destinationsData = await db.query<{
      id?: string
      slug?: string
      name?: string
      description?: string
      overview?: string
      history?: string
      culture?: string
      geography?: Record<string, string>
      demographics?: Record<string, string>
      economy?: Record<string, unknown>
      attractions?: Array<Record<string, unknown>>
      cuisine?: Record<string, string[]>
      transportation?: Record<string, string[]>
      best_time_to_visit?: Record<string, string>
      safety?: Record<string, unknown>
      emergency_contacts?: Array<Record<string, string>>
    }>('destinations', {
      limit: 1
    })

    // Find the destination by id
    const destination = destinationsData.find(d => d.id === id || d.slug === id)

    if (destination) {
      return NextResponse.json({
        success: true,
        destinationId: id,
        about: {
          name: destination.name || id.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
          description: destination.description || '',
          overview: destination.overview || destination.description || '',
          history: destination.history || '',
          culture: destination.culture || '',
          geography: destination.geography || {},
          demographics: destination.demographics || {},
          economy: destination.economy || {},
          attractions: destination.attractions || [],
          cuisine: destination.cuisine || {},
          transportation: destination.transportation || {},
          bestTimeToVisit: destination.best_time_to_visit || {},
          safety: destination.safety || {},
          emergencyContacts: destination.emergency_contacts || []
        }
      })
    }

    // Return empty about data if destination not found
    return NextResponse.json({
      success: true,
      destinationId: id,
      about: null
    })
  } catch (error) {
    logger.error('Error fetching destination about', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching destination about info'
        }
      },
      { status: 500 }
    )
  }
}
