
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

// GET /api/v1/analytics - Get analytics data from Supabase
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'overview'
    const organizationId = searchParams.get('organizationId')

    // Fetch counts from Supabase tables
    const [usersResult, projectsResult, eventsResult, tasksResult] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*', { count: 'exact', head: true }),
      supabase.from('tasks').select('*', { count: 'exact', head: true }),
    ])

    const totalUsers = usersResult.count || 0
    const totalProjects = projectsResult.count || 0
    const totalEvents = eventsResult.count || 0
    const totalTasks = tasksResult.count || 0

    // Get active tasks count
    const { count: activeTasks } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .in('status', ['pending', 'in_progress'])

    // Get completed tasks count
    const { count: completedTasks } = await supabase
      .from('tasks')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')

    const responseData: Record<string, unknown> = {
      overview: {
        totalUsers,
        totalProjects,
        totalEvents,
        totalTasks,
        activeTasks: activeTasks || 0,
        completedTasks: completedTasks || 0,
        taskCompletionRate: totalTasks > 0 ? ((completedTasks || 0) / totalTasks * 100).toFixed(1) : 0
      }
    }

    // Add type-specific data
    if (type === 'projects') {
      const { data: recentProjects } = await supabase
        .from('projects')
        .select('id, name, phase, created_at')
        .order('created_at', { ascending: false })
        .limit(5)
      responseData.recentProjects = recentProjects || []
    }

    if (type === 'events') {
      const { data: upcomingEvents } = await supabase
        .from('events')
        .select('id, name, start_date, status')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(5)
      responseData.upcomingEvents = upcomingEvents || []
    }

    return NextResponse.json({
      success: true,
      data: {
        type,
        organizationId,
        analytics: responseData,
        generatedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    logger.error('Error fetching analytics', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred while fetching analytics data'
        }
      },
      { status: 500 }
    )
  }
}
