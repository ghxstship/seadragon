
import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { auth } from "@/auth"
import { createClient } from "@/lib/supabase/server"

interface SupabaseClient {
  from: (table: string) => any // Simplified for this context
}

// GET /api/analytics/overview - Get organization analytics overview
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId') || session.user.organizationId
    const period = searchParams.get('period') || '30d' // 7d, 30d, 90d, 1y

    if (!organizationId) {
      return NextResponse.json({ error: "Organization ID required" }, { status: 400 })
    }

    // Verify user has access to the organization
    const { data: userOrg, error: userOrgError } = await supabase
      .from('user_organizations')
      .select('id, organization_id, is_active')
      .eq('user_id', session.user.id)
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .single()

    if (userOrgError || !userOrg) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const periodDays = getPeriodDays(period)
    const startDate = new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000).toISOString()

    // Calculate KPIs using Supabase queries
    const [
      eventsResult,
      projectsResult,
      usersResult,
      ticketsResult,
      activeUsersResult,
      newUsersResult,
      topEventsResult,
      revenueByMonthData,
      userGrowthData
    ] = await Promise.all([
      // Total events
      supabase
        .from('events')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', startDate),

      // Total projects
      supabase
        .from('projects')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
        .gte('created_at', startDate),

      // Total users in organization
      supabase
        .from('user_organizations')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
        .eq('is_active', true),

      // Total ticket sales (from tickets table if exists)
      supabase
        .from('tickets')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'sold')
        .gte('created_at', startDate)
        .catch(() => ({ count: 0 })),

      // Active users (users with recent activity)
      supabase
        .from('user_organizations')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
        .eq('is_active', true)
        .gte('updated_at', startDate),

      // New users this period
      supabase
        .from('user_organizations')
        .select('id', { count: 'exact', head: true })
        .eq('organization_id', organizationId)
        .gte('created_at', startDate),

      // Top performing events
      supabase
        .from('events')
        .select('id, name, slug')
        .order('created_at', { ascending: false })
        .limit(5),

      // Revenue by month
      getRevenueByMonth(supabase, organizationId, startDate),

      // User growth over time
      getUserGrowth(supabase, organizationId, startDate)
    ])

    const totalRevenue = await calculateTotalRevenue(supabase, organizationId, startDate)

    return NextResponse.json({
      period,
      kpis: {
        events: eventsResult.count || 0,
        projects: projectsResult.count || 0,
        users: usersResult.count || 0,
        revenue: totalRevenue,
        ticketSales: (ticketsResult as { count: number | null }).count || 0,
        activeUsers: activeUsersResult.count || 0,
        newUsers: newUsersResult.count || 0
      },
      charts: {
        topEvents: await Promise.all((topEventsResult.data || []).map(async (event: { id: string; name: string }) => {
          const { count } = await supabase
            .from('tickets')
            .select('id', { count: 'exact', head: true })
            .eq('event_id', event.id)
          return { name: event.name, tickets: count || 0 }
        })),
        revenueByMonth: revenueByMonthData,
        userGrowth: userGrowthData
      }
    })
  } catch (error) {
    logger.error("Analytics error", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function getPeriodDays(period: string): number {
  switch (period) {
    case '7d': return 7
    case '30d': return 30
    case '90d': return 90
    case '1y': return 365
    default: return 30
  }
}

async function calculateTotalRevenue(supabase: SupabaseClient, organizationId: string, startDate: string): Promise<number> {
  // Sum completed payments for the organization
  const { data, error } = await supabase
    .from('payments')
    .select('amount')
    .eq('organization_id', organizationId)
    .eq('status', 'completed')
    .gte('created_at', startDate)

  if (error || !data) {
    return 0
  }

  return data.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0)
}

async function getRevenueByMonth(supabase: SupabaseClient, organizationId: string, startDate: string) {
  // Query actual payment/invoice data grouped by month
  const { data: payments, error } = await supabase
    .from('payments')
    .select('amount, created_at')
    .eq('organization_id', organizationId)
    .eq('status', 'completed')
    .gte('created_at', startDate)

  if (error || !payments) {
    return []
  }

  // Group by month
  const monthlyRevenue: Record<string, number> = {}
  for (const payment of payments) {
    const month = payment.created_at.slice(0, 7)
    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (Number(payment.amount) || 0)
  }

  // Convert to array sorted by month
  return Object.entries(monthlyRevenue)
    .map(([month, revenue]) => ({ month, revenue }))
    .sort((a, b) => a.month.localeCompare(b.month))
}

async function getUserGrowth(supabase: SupabaseClient, organizationId: string, startDate: string) {
  // Query actual user join dates
  const { data: userJoins, error } = await supabase
    .from('user_organizations')
    .select('created_at')
    .eq('organization_id', organizationId)
    .gte('created_at', startDate)
    .order('created_at', { ascending: true })

  if (error || !userJoins) {
    return []
  }

  // Group by date
  const dailyUsers: Record<string, number> = {}
  for (const join of userJoins) {
    const date = join.created_at.slice(0, 10)
    dailyUsers[date] = (dailyUsers[date] || 0) + 1
  }

  // Convert to cumulative array sorted by date
  const sortedDates = Object.keys(dailyUsers).sort()
  let cumulative = 0
  return sortedDates.map(date => {
    cumulative += dailyUsers[date]
    return { date, users: cumulative }
  })
}
