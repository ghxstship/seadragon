
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { db } from '@/lib/db'
import { auth } from '@/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId') || session.user.organizationId
    const limit = parseInt(searchParams.get('limit') || '50')

    const users = await db.getUsers({
      organizationId: organizationId || undefined,
      limit
    })

    return NextResponse.json({ users })
  } catch (error) {
    logger.error('Error fetching users', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { full_name, email, organization_id } = body

    const orgId = organization_id || session.user.organizationId
    if (!full_name || !email || !orgId) {
      return NextResponse.json(
        { error: 'full_name, email, and organization_id are required' },
        { status: 400 }
      )
    }

    const newUser = await db.createUser({
      full_name,
      email,
      organization_id: orgId,
      is_active: true
    })

    return NextResponse.json({
      message: 'User created successfully',
      user: newUser
    }, { status: 201 })
  } catch (error) {
    logger.error('Error creating user', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
