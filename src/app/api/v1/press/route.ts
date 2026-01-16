
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// GET /api/v1/press - List press releases from database
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')

    // Query press releases from database
    const pressData = await db.query<{
      id?: string
      title?: string
      excerpt?: string
      description?: string
      date?: string
      category?: string
      featured?: boolean
      slug?: string
      created_at?: string
    }>('press_releases', {
      limit,
      order: { column: 'created_at', ascending: false }
    })

    // Apply filters if provided
    let releases = pressData
    if (category) {
      releases = releases.filter(r => r.category?.toLowerCase() === category.toLowerCase())
    }
    if (featured === 'true') {
      releases = releases.filter(r => r.featured)
    }

    return NextResponse.json({
      success: true,
      releases,
      pagination: {
        total: releases.length,
        limit,
        offset: 0
      }
    })
  } catch (error) {
    logger.error('Error fetching press releases', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching press releases'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/press - Create new press release
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['title', 'excerpt']
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

    // Create new press release in database
    const newRelease = await db.insert('press_releases', {
      ...body,
      created_at: new Date().toISOString(),
      date: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      release: newRelease
    }, { status: 201 })
  } catch (error) {
    logger.error('Error creating press release', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while creating the press release'
        }
      },
      { status: 500 }
    )
  }
}
