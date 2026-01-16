
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

// GET /api/v1/destinations/[id] - Get single destination from Supabase
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
    
    let destination = null
    let error = null
    
    if (isUUID) {
      // Lookup by ID
      const result = await supabase
        .from('destinations')
        .select('*')
        .eq('id', id)
        .single()
      destination = result.data
      error = result.error
    } else {
      // Lookup by handle/slug
      const result = await supabase
        .from('destinations')
        .select('*')
        .eq('handle', id)
        .single()
      destination = result.data
      error = result.error
      
      // If not found by handle, try slug field
      if (error || !destination) {
        const slugResult = await supabase
          .from('destinations')
          .select('*')
          .eq('slug', id)
          .single()
        destination = slugResult.data
        error = slugResult.error
      }
    }

    if (error || !destination) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Destination not found'
          }
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      destination,
      data: {
        destination
      }
    })
  } catch (error) {
    logger.error('Error fetching destination', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching the destination'
        }
      },
      { status: 500 }
    )
  }
}

// PUT /api/v1/destinations/[id] - Update destination in Supabase
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const body = await request.json()

    const { data: updatedDestination, error } = await supabase
      .from('destinations')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error || !updatedDestination) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Destination not found'
          }
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        destination: updatedDestination
      }
    })
  } catch (error) {
    logger.error('Error updating destination', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while updating the destination'
        }
      },
      { status: 500 }
    )
  }
}

// DELETE /api/v1/destinations/[id] - Delete destination from Supabase
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { error } = await supabase
      .from('destinations')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Destination not found'
          }
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        message: 'Destination deleted successfully'
      }
    })
  } catch (error) {
    logger.error('Error deleting destination', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while deleting the destination'
        }
      },
      { status: 500 }
    )
  }
}
