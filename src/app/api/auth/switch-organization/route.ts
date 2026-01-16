
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { auth } from '@/auth'
import { createClient } from '@/lib/supabase/server'

// POST /api/auth/switch-organization - Switch user's current organization
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { organizationId } = await request.json()

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      )
    }

    // Verify user has access to this organization
    const { data: userOrg } = await supabase
      .from('user_organizations')
      .select(`
        is_active,
        organizations (*),
        roles (*)
      `)
      .eq('user_id', session.user.id)
      .eq('organization_id', organizationId)
      .single()

    if (!userOrg || !userOrg.is_active) {
      return NextResponse.json(
        { error: 'Access denied to this organization' },
        { status: 403 }
      )
    }

    // Log the organization switch
    await supabase
      .from('activities')
      .insert({
        user_id: session.user.id,
        action: 'switch_organization',
        entity: 'organization',
        entity_id: organizationId,
        details: {
          fromOrganizationId: session.user.organizationId,
          toOrganizationId: organizationId
        }
      })

    const org = userOrg.organizations as unknown as { id: string; name: string; slug: string }

    // The actual organization switching is handled by the client-side
    // session update and middleware. This endpoint just validates access.

    return NextResponse.json({
      success: true,
      organization: {
        id: org.id,
        name: org.name,
        slug: org.slug,
        role: userOrg.roles
      }
    })
  } catch (error) {
    logger.error('Error switching organization', error)
    return NextResponse.json(
      { error: 'Failed to switch organization' },
      { status: 500 }
    )
  }
}
