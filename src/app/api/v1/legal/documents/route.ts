
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// GET /api/v1/legal/documents - Get all legal documents
export async function GET(request: NextRequest) {
  try {
    // Query legal documents from database
    const documentsData = await db.query<{
      id?: string
      title?: string
      description?: string
      category?: string
      last_updated?: string
      updated_at?: string
      version?: string
      status?: string
      download_url?: string
      view_url?: string
      size?: string
      importance?: string
    }>('legal_documents', {
      limit: 50,
      order: { column: 'last_updated', ascending: false }
    })

    return NextResponse.json({
      success: true,
      documents: documentsData,
      pagination: {
        total: documentsData.length
      }
    })
  } catch (error) {
    logger.error('Error fetching legal documents', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching legal documents'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/legal/documents - Create a legal document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required field: title'
          }
        },
        { status: 400 }
      )
    }

    // Create new document in database
    const newDocument = await db.insert('legal_documents', {
      ...body,
      status: body.status || 'draft',
      version: body.version || '1.0.0',
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      document: newDocument
    }, { status: 201 })
  } catch (error) {
    logger.error('Error creating legal document', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while creating the document'
        }
      },
      { status: 500 }
    )
  }
}
