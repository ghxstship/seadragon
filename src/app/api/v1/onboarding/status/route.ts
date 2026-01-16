
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// GET /api/v1/onboarding/status - Get onboarding status for current user
export async function GET(request: NextRequest) {
  try {
    // Query onboarding status from database
    const statusData = await db.query<{
      id?: string
      user_id?: string
      completed_steps?: string[]
      current_step?: string
      started_at?: string
      completed_at?: string
    }>('onboarding_status', {
      limit: 1
    })

    const status = statusData[0] || {
      completedSteps: [],
      currentStep: 'profile'
    }

    return NextResponse.json({
      success: true,
      completedSteps: status.completed_steps || [],
      currentStep: status.current_step || 'profile',
      startedAt: status.started_at,
      completedAt: status.completed_at
    })
  } catch (error) {
    logger.error('Error fetching onboarding status', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching onboarding status'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/onboarding/status - Update onboarding status
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Update onboarding status in database
    const updatedStatus = await db.insert('onboarding_status', {
      completed_steps: body.completedSteps || [],
      current_step: body.currentStep,
      updated_at: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      status: updatedStatus
    })
  } catch (error) {
    logger.error('Error updating onboarding status', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while updating onboarding status'
        }
      },
      { status: 500 }
    )
  }
}
