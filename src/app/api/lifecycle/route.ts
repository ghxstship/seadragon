
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { withOrgContext } from '@/lib/middleware'
import { getPhaseInfo, getNextPhase, canAccessPhase, getUserTier } from '@/lib/lifecycle'

async function handler(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
    }

    const { data: project } = await supabase
      .from('projects')
      .select(`
        *,
        events (*),
        workspaces (
          *,
          organizations (*)
        )
      `)
      .eq('id', projectId)
      .single()

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const phaseInfo = getPhaseInfo(project.status)
    const nextPhase = getNextPhase(project.status)

    const events = (project.events || []) as Array<{ id: string; name: string; status: string; start_date: string | null; end_date: string | null }>

    return NextResponse.json({
      project: {
        id: project.id,
        name: project.name,
        status: project.status,
        phaseInfo,
        nextPhase,
        canAdvance: !!nextPhase
      },
      events: events.map((event) => ({
        id: event.id,
        name: event.name,
        status: event.status,
        startDate: event.start_date,
        endDate: event.end_date
      }))
    })
  } catch (error) {
    logger.error('Error fetching project phase', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/lifecycle/advance - Advance project to next phase
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { projectId } = body

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 })
    }

    // Get current project
    const { data: project } = await supabase
      .from('projects')
      .select(`
        *,
        workspaces (
          organization_id
        )
      `)
      .eq('id', projectId)
      .single()

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Get authenticated user info from middleware context
    const userId = (global as unknown as { currentUserId: string }).currentUserId
    const organizationId = (project.workspaces as { organization_id: string })?.organization_id

    // Get user's role in the organization
    const { data: userOrg } = await supabase
      .from('user_organizations')
      .select('*, roles(*)')
      .eq('user_id', userId)
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .single()

    if (!userOrg) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const roleName = (userOrg.roles as { name: string } | null)?.name || 'member'
    const userTier = getUserTier(roleName)
    const nextPhase = getNextPhase(project.status)

    if (!nextPhase) {
      return NextResponse.json({ error: 'Project is already in final phase' }, { status: 400 })
    }

    // Check if user can access the next phase
    if (!canAccessPhase(nextPhase, userTier)) {
      return NextResponse.json({ error: 'Insufficient permissions to advance to this phase' }, { status: 403 })
    }

    // Advance the project phase
    const { data: updatedProject, error } = await supabase
      .from('projects')
      .update({ status: nextPhase })
      .eq('id', projectId)
      .select(`
        *,
        events (*),
        workspaces (
          *,
          organizations (*)
        )
      `)
      .single()

    if (error) {
      logger.error('Error updating project', error)
      return NextResponse.json({ error: 'Failed to advance project' }, { status: 500 })
    }

    // Log the phase change
    await supabase
      .from('activities')
      .insert({
        user_id: userId,
        action: 'update',
        entity: 'Project',
        entity_id: projectId,
        details: {
          field: 'status',
          oldValue: project.status,
          newValue: nextPhase,
          phaseTransition: true
        }
      })

    const newPhaseInfo = getPhaseInfo(nextPhase)

    return NextResponse.json({
      project: {
        id: updatedProject.id,
        name: updatedProject.name,
        status: updatedProject.status,
        phaseInfo: newPhaseInfo,
        nextPhase: getNextPhase(updatedProject.status)
      },
      message: `Project advanced to ${newPhaseInfo.name} phase`
    })
  } catch (error) {
    logger.error('Error advancing project phase', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export const GET = withOrgContext(handler, { requireAuth: true })
