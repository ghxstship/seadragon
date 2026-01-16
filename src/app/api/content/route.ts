
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// GET /api/content - Get content items from database
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Query content from database
    const content = await db.query('content', {
      filters: {
        ...(category ? { category } : {}),
        ...(status ? { status } : {}),
        ...(type ? { type } : {})
      },
      order: { column: 'created_at', ascending: false },
      limit
    })

    return NextResponse.json({
      data: content,
      total: content.length,
      limit,
      offset: 0
    })
  } catch (error) {
    logger.error('Error fetching content', error)
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}

// POST /api/content - Upload new content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const { title, type, created_by } = body
    if (!title || !type || !created_by) {
      return NextResponse.json(
        { error: 'Missing required fields: title, type, created_by' },
        { status: 400 }
      )
    }

    // Create new content item in database
    const newContent = await db.insert('content', {
      title,
      description: body.description || null,
      type,
      file_name: body.file_name || null,
      file_size: body.file_size || null,
      mime_type: body.mime_type || null,
      category: body.category || 'General',
      status: 'draft',
      created_by,
      created_at: new Date().toISOString()
    })

    return NextResponse.json(newContent, { status: 201 })
  } catch (error) {
    logger.error('Error creating content', error)
    return NextResponse.json(
      { error: 'Failed to create content' },
      { status: 500 }
    )
  }
}
