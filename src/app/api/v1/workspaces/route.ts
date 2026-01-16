
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')
    const limit = parseInt(searchParams.get('limit') || '50')

    const workspaces = await db.getWorkspaces({
      organizationId: organizationId || undefined,
      limit
    })

    return NextResponse.json({ workspaces })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, organization_id, slug } = body

    if (!name || !organization_id) {
      return NextResponse.json(
        { error: 'Name and organization_id are required' },
        { status: 400 }
      )
    }

    const newWorkspace = await db.insert('workspaces', {
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description: description || null,
      organization_id,
      is_default: false,
      is_archived: false,
      created_at: new Date().toISOString()
    })

    return NextResponse.json({
      message: 'Workspace created successfully',
      workspace: newWorkspace
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
