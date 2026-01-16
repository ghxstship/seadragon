
import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { auth } from '@/auth'
import { createClient } from '@/lib/supabase/server'
import { withOrgContext } from '@/lib/middleware'

// GET /api/user/organizations - Get user's organizations
export const GET = withOrgContext(async () => {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    // Get user's organizations with roles
    const { data: userOrganizations, error } = await supabase
      .from('user_organizations')
      .select(`
        joined_at,
        is_active,
        organizations (
          *,
          organization_branding (*)
        ),
        roles (*)
      `)
      .eq('user_id', session.user.id)
      .eq('is_active', true)
      .order('joined_at', { ascending: false })

    if (error) {
      logger.error('Error fetching user organizations', error)
      return NextResponse.json({ error: 'Failed to fetch organizations' }, { status: 500 })
    }

    // Transform the data to match our expected format
    const organizations = (userOrganizations || []).map((userOrg) => ({
      ...(userOrg.organizations as unknown as Record<string, unknown>),
      role: userOrg.roles,
      joinedAt: userOrg.joined_at,
      isActive: userOrg.is_active
    }))

    return NextResponse.json(organizations)
  } catch (error) {
    logger.error('Error fetching user organizations', error)
    return NextResponse.json(
      { error: 'Failed to fetch organizations' },
      { status: 500 }
    )
  }
})
