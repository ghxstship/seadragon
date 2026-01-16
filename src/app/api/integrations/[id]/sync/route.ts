
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { auth } from '@/lib/auth'

interface RouteParams {
  params: Promise<{ id: string }>
}

// POST /api/integrations/[id]/sync - Trigger integration sync
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params
    const session = await auth()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    const { syncType = 'incremental', force = false } = body

    // Mock sync initiation
    const syncId = `sync_${Date.now()}`
    const syncResult = {
      syncId,
      status: 'started',
      syncType,
      force,
      estimatedCompletion: new Date(Date.now() + 300000).toISOString(), // 5 minutes from now
      startedAt: new Date().toISOString()
    }

    return NextResponse.json(syncResult, { status: 202 })
  } catch (error) {
    logger.error('Error triggering sync', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
