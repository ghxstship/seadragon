
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { auth } from '@/lib/auth'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/integrations/[id] - Get integration details from Supabase
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { data: integration, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !integration) {
      return NextResponse.json({ error: 'Integration not found' }, { status: 404 })
    }

    return NextResponse.json(integration)
  } catch (error) {
    logger.error('Error fetching integration', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/integrations/[id] - Update integration in Supabase
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const supabase = await createClient()
    const body = await request.json()
    const { name, description, settings, is_active } = body

    const { data: updatedIntegration, error } = await supabase
      .from('integrations')
      .update({
        name,
        description,
        settings,
        is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(updatedIntegration)
  } catch (error) {
    logger.error('Error updating integration', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/integrations/[id] - Delete integration from Supabase
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const { error } = await supabase
      .from('integrations')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ message: 'Integration deleted successfully' })
  } catch (error) {
    logger.error('Error deleting integration', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
