
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { createClient } from '@/lib/supabase/server'
import { withOrgContext } from '@/lib/middleware'

async function handler(request: NextRequest) {
  try {
    const supabase = await createClient()
    const urlParts = request.url.split('/')
    const organizationId = urlParts[urlParts.length - 2] // Extract from /api/organizations/[id]/branding

    if (!organizationId) {
      return NextResponse.json({ error: 'Organization ID required' }, { status: 400 })
    }

    const { data: branding, error } = await supabase
      .from('organization_branding')
      .select('*')
      .eq('organization_id', organizationId)
      .single()

    if (error || !branding) {
      return NextResponse.json({ error: 'Branding not found' }, { status: 404 })
    }

    return NextResponse.json(branding)
  } catch (error) {
    logger.error('Error fetching branding', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export const GET = withOrgContext(handler, { requireAuth: true })
