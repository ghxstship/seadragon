
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

// GET /api/v1/experiences/[id] - Get single experience from Supabase
// Supports lookup by ID (UUID) or handle/slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    
    // Check if id is a UUID or a handle/slug
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
    
    let experience = null
    let error = null
    
    if (isUUID) {
      // Lookup by ID
      const result = await supabase
        .from('experiences')
        .select('*')
        .eq('id', id)
        .single()
      experience = result.data
      error = result.error
    } else {
      // Lookup by handle/slug
      const result = await supabase
        .from('experiences')
        .select('*')
        .eq('handle', id)
        .single()
      experience = result.data
      error = result.error
      
      // If not found by handle, try slug field
      if (error || !experience) {
        const slugResult = await supabase
          .from('experiences')
          .select('*')
          .eq('slug', id)
          .single()
        experience = slugResult.data
        error = slugResult.error
      }
    }

    if (error || !experience) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Experience not found'
          }
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      experience,
      data: {
        experience
      }
    })
  } catch (error) {
    logger.error('Error fetching experience', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching the experience'
        }
      },
      { status: 500 }
    )
  }
}

// PUT /api/v1/experiences/[id] - Update experience in Supabase
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    const { data: updatedExperience, error } = await supabase
      .from('experiences')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error || !updatedExperience) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Experience not found'
          }
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        experience: updatedExperience
      }
    })
  } catch (error) {
    logger.error('Error updating experience', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while updating the experience'
        }
      },
      { status: 500 }
    )
  }
}

// DELETE /api/v1/experiences/[id] - Delete experience from Supabase
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Experience not found'
          }
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Experience deleted successfully'
      }
    })
  } catch (error) {
    logger.error('Error deleting experience', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while deleting the experience'
        }
      },
      { status: 500 }
    )
  }
}
