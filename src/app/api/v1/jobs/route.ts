
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// GET /api/v1/jobs - List job openings from database
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const department = searchParams.get('department')
    const location = searchParams.get('location')

    // Query jobs from database
    const jobsData = await db.query<{
      id?: string
      title?: string
      department?: string
      location?: string
      type?: string
      level?: string
      salary?: string
      description?: string
      requirements?: string[]
      benefits?: string[]
      featured?: boolean
      urgent?: boolean
      posted_date?: string
      created_at?: string
    }>('jobs', {
      limit,
      order: { column: 'created_at', ascending: false }
    })

    // Apply filters if provided
    let jobs = jobsData
    if (department) {
      jobs = jobs.filter(j => j.department?.toLowerCase() === department.toLowerCase())
    }
    if (location) {
      jobs = jobs.filter(j => j.location?.toLowerCase().includes(location.toLowerCase()))
    }

    return NextResponse.json({
      success: true,
      jobs,
      pagination: {
        total: jobs.length,
        limit,
        offset: 0
      }
    })
  } catch (error) {
    logger.error('Error fetching jobs', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching jobs'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/jobs - Create new job opening
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['title', 'department']
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

    // Create new job in database
    const newJob = await db.insert('jobs', {
      ...body,
      created_at: new Date().toISOString(),
      posted_date: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      job: newJob
    }, { status: 201 })
  } catch (error) {
    logger.error('Error creating job', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while creating the job'
        }
      },
      { status: 500 }
    )
  }
}
