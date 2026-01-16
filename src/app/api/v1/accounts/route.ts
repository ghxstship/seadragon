
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'

// GET /api/v1/accounts - Get all accounts for the current user
export async function GET(request: NextRequest) {
  try {
    // Query accounts from database
    const accountsData = await db.query<{
      id?: string
      type?: string
      name?: string
      email?: string
      avatar?: string
      role?: string
      organization?: string
      last_active?: string
      is_current?: boolean
      status?: string
      permissions?: string[]
    }>('accounts', {
      limit: 20,
      order: { column: 'last_active', ascending: false }
    })

    return NextResponse.json({
      success: true,
      accounts: accountsData,
      pagination: {
        total: accountsData.length
      }
    })
  } catch (error) {
    logger.error('Error fetching accounts', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching accounts'
        }
      },
      { status: 500 }
    )
  }
}

// POST /api/v1/accounts - Create a new account
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Missing required fields: name and email'
          }
        },
        { status: 400 }
      )
    }

    // Create new account in database
    const newAccount = await db.insert('accounts', {
      ...body,
      type: body.type || 'personal',
      status: 'active',
      is_current: false,
      permissions: body.permissions || ['read', 'write'],
      created_at: new Date().toISOString(),
      last_active: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      account: newAccount
    }, { status: 201 })
  } catch (error) {
    logger.error('Error creating account', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while creating the account'
        }
      },
      { status: 500 }
    )
  }
}
