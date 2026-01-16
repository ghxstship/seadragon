
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// Professional data interfaces
interface ProfessionalStats {
  projects_completed?: number
  years_experience?: number
  client_satisfaction?: number
  response_time?: string
  active_projects?: number
}

interface PricingStructure {
  consultation?: {
    price: number
    currency: string
    duration: number // minutes
  }
  project_based?: {
    min_price: number
    max_price: number
    currency: string
    estimated_duration: string
  }
  hourly?: {
    rate: number
    currency: string
    min_hours: number
  }
}

// GET /api/v1/professionals/[handle] - Get professional profile by handle
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await params

    // Query professional from database
    const professionalsData = await db.query<{
      id?: string
      handle?: string
      name?: string
      type?: string
      tagline?: string
      description?: string
      logo?: string
      cover_image?: string
      location?: string
      phone?: string
      email?: string
      website?: string
      founded?: string
      verified?: boolean
      badges?: string[]
      stats?: ProfessionalStats
      hours?: Record<string, string>
      services?: string[]
      specialties?: string[]
      pricing?: PricingStructure
    }>('professionals', {
      limit: 1
    })

    // Find the specific professional by handle
    const professional = professionalsData.find(p => p.handle === handle) || professionalsData[0]

    if (!professional) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Professional not found'
          }
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      professional
    })
  } catch (error) {
    logger.error('Error fetching professional profile', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching professional profile'
        }
      },
      { status: 500 }
    )
  }
}
