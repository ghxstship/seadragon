
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { auth } from '@/auth'

// GET /api/v1/media - List media files from Supabase with filtering
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // Extract query parameters
    const uploadedBy = searchParams.get('uploadedBy')
    const category = searchParams.get('category')
    const entityType = searchParams.get('entityType')
    const entityId = searchParams.get('entityId')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('media')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Apply filters
    if (uploadedBy) {
      query = query.eq('uploaded_by', uploadedBy)
    }

    if (category) {
      query = query.eq('category', category)
    }

    if (entityType) {
      query = query.eq('entity_type', entityType)
    }

    if (entityId) {
      query = query.eq('entity_id', entityId)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data: media, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: {
        media: media || [],
        pagination: {
          total: count || 0,
          limit,
          offset,
          hasNext: offset + limit < (count || 0),
          hasPrev: offset > 0
        },
        filters: {
          applied: {
            uploadedBy,
            category,
            entityType,
            entityId,
            status
          }
        }
      }
    })
  } catch (error) {
    logger.error('Error fetching media', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching media files'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/media - Upload new media file to Supabase
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()

    // Validate required fields
    const { filename, mime_type, size, category } = body
    if (!filename || !mime_type || !size) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required fields: filename, mime_type, size'
          }
        },
        { status: 400 }
      )
    }

    // Create new media record in Supabase
    const { data: newMedia, error } = await supabase
      .from('media')
      .insert({
        filename,
        mime_type,
        size,
        category: category || 'general',
        uploaded_by: session.user?.id,
        entity_id: body.entity_id || null,
        entity_type: body.entity_type || null,
        status: 'active',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: {
        media: newMedia,
        message: 'Media file uploaded successfully'
      }
    }, { status: 201 })
  } catch (error) {
    logger.error('Error uploading media', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while uploading the media file'
        }
      },
      { status: 500 }
    )
  }
}
