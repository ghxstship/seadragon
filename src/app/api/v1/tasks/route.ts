
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
    const projectId = searchParams.get('projectId')
    const assignedTo = searchParams.get('assignedTo')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    const tasks = await db.getTasks({
      organizationId: organizationId || undefined,
      projectId: projectId || undefined,
      assignedTo: assignedTo || undefined,
      status: status || undefined,
      limit
    })

    return NextResponse.json({ tasks })
  } catch (error) {
    logger.error('Error fetching tasks', error)
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
    const { title, description, assigned_to, organization_id, project_id, priority, due_date } = body

    const orgId = organization_id || session.user.organizationId
    if (!title || !orgId) {
      return NextResponse.json(
        { error: 'Title and organization_id are required' },
        { status: 400 }
      )
    }

    const newTask = await db.createTask({
      title,
      description: description || null,
      assigned_to: assigned_to || null,
      organization_id: orgId,
      project_id: project_id || null,
      priority: priority || 'medium',
      due_date: due_date || null,
      created_by: session.user.id,
    })

    return NextResponse.json({
      message: 'Task created successfully',
      task: newTask
    }, { status: 201 })
  } catch (error) {
    logger.error('Error creating task', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
