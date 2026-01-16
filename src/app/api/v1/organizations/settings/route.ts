
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// GET /api/v1/organizations/settings - Get organization settings
export async function GET(request: NextRequest) {
  try {
    // Query organization settings from database
    const orgsData = await db.query<{
      id?: string
      name?: string
      description?: string
      logo?: string
      website?: string
      email?: string
      phone?: string
      address?: string
      city?: string
      state?: string
      country?: string
      timezone?: string
      currency?: string
      language?: string
      settings?: Record<string, unknown>
      created_at?: string
    }>('organizations', {
      limit: 1
    })

    const organization = orgsData[0] || null

    return NextResponse.json({
      success: true,
      organization,
      settings: organization?.settings || {}
    })
  } catch (error) {
    logger.error('Error fetching organization settings', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching organization settings'
        }
      },
      { status: 500 }
    )
  }
}

// PUT /api/v1/organizations/settings - Update organization settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    // Get current organization
    const orgsData = await db.query<{ id?: string }>('organizations', { limit: 1 })
    const orgId = orgsData[0]?.id

    if (!orgId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Organization not found'
          }
        },
        { status: 404 }
      )
    }

    // Update organization settings
    const updated = await db.update('organizations', orgId, {
      ...body,
      updated_at: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      organization: updated
    })
  } catch (error) {
    logger.error('Error updating organization settings', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while updating organization settings'
        }
      },
      { status: 500 }
    )
  }
}
