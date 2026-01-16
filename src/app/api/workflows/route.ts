
// API route for workflow management
// Handles CRUD operations for workflows, states, and transitions

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { workflowStateManager, createEventLifecycleWorkflow, createOperationalWorkflow } from '@/lib/workflow-state-manager'
import { workflowValidator } from '@/lib/workflow-validation'
import { auth } from '@/auth'

// GET /api/workflows - List workflows
export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const organizationId = searchParams.get('organizationId')

    // Fetch workflows from Supabase custom_workflows table
    let query = supabase
      .from('custom_workflows')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })

    if (type) {
      query = query.eq('workflow_type', type)
    }

    if (status) {
      query = query.eq('is_active', status === 'active')
    }

    if (organizationId) {
      query = query.eq('organization_id', organizationId)
    }

    const { data, error, count } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      workflows: data || [],
      total: count || 0
    })

  } catch (error) {
    logger.error('Error fetching workflows', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/workflows - Create new workflow
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { workflowId, type, initialData, priority, tags, assignedTo } = body

    if (!workflowId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: workflowId, type' },
        { status: 400 }
      )
    }

    let workflowState

    try {
      if (type === 'event-lifecycle') {
        workflowState = await createEventLifecycleWorkflow(
          workflowId,
          initialData || {},
          session.user.id
        )
      } else if (type === 'operational') {
        workflowState = await createOperationalWorkflow(
          workflowId,
          initialData || {},
          session.user.id
        )
      } else {
        return NextResponse.json(
          { error: 'Invalid workflow type' },
          { status: 400 }
        )
      }

      // Apply additional settings
      if (priority || tags || assignedTo) {
        await workflowStateManager.updateWorkflow(
          workflowState.id,
          {
            metadata: {
              ...workflowState.metadata,
              priority: priority || workflowState.metadata.priority,
              tags: tags || workflowState.metadata.tags,
              assignedTo: assignedTo || workflowState.metadata.assignedTo,
              updatedAt: new Date()
            }
          },
          session.user.id
        )
      }

      return NextResponse.json({
        workflow: workflowState,
        message: 'Workflow created successfully'
      }, { status: 201 })

    } catch (error) {
      logger.error('Error creating workflow', error)
      return NextResponse.json(
        { error: 'Failed to create workflow' },
        { status: 500 }
      )
    }

  } catch (error) {
    logger.error('Error in workflow creation', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/workflows/[id] - Update workflow
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const workflowId = searchParams.get('id')

    if (!workflowId) {
      return NextResponse.json(
        { error: 'Workflow ID is required' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { action, data, toPhase, toStep, reason } = body

    let result

    switch (action) {
      case 'update':
        result = await workflowStateManager.updateWorkflow(
          workflowId,
          data,
          session.user.id
        )
        break

      case 'transition':
        if (!toPhase || !toStep) {
          return NextResponse.json(
            { error: 'toPhase and toStep are required for transition' },
            { status: 400 }
          )
        }
        result = await workflowStateManager.transitionWorkflow(
          workflowId,
          toPhase,
          toStep,
          session.user.id,
          reason
        )
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      workflow: result,
      message: 'Workflow updated successfully'
    })

  } catch (error) {
    logger.error('Error updating workflow', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/workflows/[id] - Delete workflow
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const workflowId = searchParams.get('id')

    if (!workflowId) {
      return NextResponse.json(
        { error: 'Workflow ID is required' },
        { status: 400 }
      )
    }

    // Implement workflow deletion
    await workflowStateManager.deleteWorkflow(workflowId, session.user.id)
    logger.action('delete_workflow', { workflowId })

    return NextResponse.json({
      message: 'Workflow deleted successfully'
    })

  } catch (error) {
    logger.error('Error deleting workflow', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
