
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// GET /api/v1/destinations/[id]/gallery - Get gallery for a destination
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Query gallery images from database
    const imagesData = await db.query<{
      id?: string
      url?: string
      title?: string
      description?: string
      category?: string
      photographer?: string
      date?: string
      destination_slug?: string
    }>('gallery_images', {
      limit: 50,
      order: { column: 'created_at', ascending: false }
    })

    // Query gallery videos from database
    const videosData = await db.query<{
      id?: string
      url?: string
      thumbnail?: string
      title?: string
      description?: string
      duration?: string
      category?: string
      date?: string
      destination_slug?: string
    }>('gallery_videos', {
      limit: 20,
      order: { column: 'created_at', ascending: false }
    })

    // Filter by destination slug if needed
    const filteredImages = imagesData.filter(i => 
      !i.destination_slug || i.destination_slug === id
    )
    const filteredVideos = videosData.filter(v => 
      !v.destination_slug || v.destination_slug === id
    )

    return NextResponse.json({
      success: true,
      destinationId: id,
      images: filteredImages,
      videos: filteredVideos,
      pagination: {
        totalImages: filteredImages.length,
        totalVideos: filteredVideos.length
      }
    })
  } catch (error) {
    logger.error('Error fetching gallery', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching gallery'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/destinations/[id]/gallery - Add a gallery item
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { type, ...itemData } = body

    // Validate required fields
    if (!itemData.url || !itemData.title) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required fields: url and title',
          }
        },
        { status: 400 }
      )
    }

    const tableName = type === 'video' ? 'gallery_videos' : 'gallery_images'

    // Create new gallery item in database
    const newItem = await db.insert(tableName, {
      ...itemData,
      destination_id: id,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      item: newItem
    }, { status: 201 })
  } catch (error) {
    logger.error('Error creating gallery item', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while creating the gallery item'
        }
      },
      { status: 500 }
    )
  }
}
