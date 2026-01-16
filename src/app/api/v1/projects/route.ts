
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/auth'
import { logger } from '@/lib/logger'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId') || session.user.organizationId
    const phase = searchParams.get('phase')
    const limit = parseInt(searchParams.get('limit') || '50')

    const projects = await db.getProjects({
      organizationId: organizationId || undefined,
      phase: phase || undefined,
      limit
    })

    return NextResponse.json({ projects })
  } catch (error) {
    logger.error('Error fetching projects', error)
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
    const { name, description, organization_id, code, phase } = body

    const orgId = organization_id || session.user.organizationId
    if (!name || !orgId) {
      return NextResponse.json(
        { error: 'Name and organization_id are required' },
        { status: 400 }
      )
    }

    const newProject = await db.insert('projects', {
      name,
      description: description || null,
      organization_id: orgId,
      code: code || name.toLowerCase().replace(/\s+/g, '-'),
      phase: phase || 'concept',
      created_at: new Date().toISOString()
    })

    return NextResponse.json({
      message: 'Project created successfully',
      project: newProject
    }, { status: 201 })
  } catch (error) {
    logger.error('Error creating project', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
