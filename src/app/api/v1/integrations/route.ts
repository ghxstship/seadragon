
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// GET /api/v1/integrations - Get all available integrations
export async function GET(request: NextRequest) {
  try {
    // Query integrations from database
    const integrationsData = await db.query<{
      id?: string
      name?: string
      category?: string
      description?: string
      icon?: string
      benefits?: string[]
      connected?: boolean
      last_sync?: string
      status?: string
      required?: boolean
    }>('integrations', {
      limit: 100,
      order: { column: 'name', ascending: true }
    })

    return NextResponse.json({
      success: true,
      integrations: integrationsData,
      pagination: {
        total: integrationsData.length
      }
    })
  } catch (error) {
    logger.error('Error fetching integrations', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching integrations'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/integrations - Connect an integration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.integration_id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required field: integration_id'
          }
        },
        { status: 400 }
      )
    }

    // Update integration status in database
    const updatedIntegration = await db.update('integrations', body.integration_id, {
      connected: true,
      status: 'connected',
      last_sync: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      integration: updatedIntegration
    })
  } catch (error) {
    logger.error('Error connecting integration', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while connecting the integration'
        }
      },
      { status: 500 }
    )
  }
}
