
import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { auth } from "@/auth"
import { createClient } from "@/lib/supabase/server"
import type { SupabaseClient } from '@supabase/supabase-js'



// Type definitions for reports
interface ReportFilters {
  [key: string]: unknown
}

interface EventFromDB {
  id: string
  name: string
  start_date: string
  capacity: number | null
  created_at: string
}

interface TicketWithEventName {
  id: string
  price: number
  event_id: string
  status: string
  created_at: string
  events: { name: string }[]
}

interface TicketWithEventDetails {
  id: string
  price: number
  status: string
  event_id: string
  created_at: string
  events: { id: string; name: string; start_date: string }[]
}

interface UserFromDB {
  id: string
  first_name: string | null
  last_name: string | null
  email: string
}

interface EventReportData {
  totalEvents: number
  totalTicketsSold: number
  totalRevenue: number
  events: EventPerformanceItem[]
}

interface EventPerformanceItem {
  id: string
  name: string
  date: string
  ticketsSold: number
  capacity: number | null
  fillRate: number
  revenue: number
}

interface FinancialReportData {
  totalBudget: number
  totalRevenue: number
  netProfit: number
  profitMargin: number
  budgetByCategory: Record<string, number>
  revenueByEvent: Record<string, number>
}

interface UserActivityReportData {
  totalActivities: number
  uniqueUsers: number
  activitiesByType: Record<string, number>
  topUsers: UserActivityStats[]
}

interface UserActivityStats {
  user: { id: string; firstName: string | null; lastName: string | null; email: string }
  totalActivities: number
  activitiesByType: Record<string, number>
}

interface TicketSalesReportData {
  totalTickets: number
  soldTickets: number
  availableTickets: number
  totalRevenue: number
  averageTicketPrice: number
  salesByEvent: Record<string, number>
  salesOverTime: Record<string, number>
}

type ReportData = EventReportData | FinancialReportData | UserActivityReportData | TicketSalesReportData

interface Report {
  id: string
  type: string
  organizationId: string
  generatedBy: string
  generatedAt: string
  dateRange: { start: string; end: string }
  filters: ReportFilters
  data: ReportData
}

// POST /api/reports/generate - Generate a custom report
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const {
      reportType,
      organizationId = session.user.organizationId,
      dateRange,
      filters = {},
      format = 'json'
    } = body

    const supabase = await createClient()

    if (!reportType) {
      return NextResponse.json({ error: "Report type is required" }, { status: 400 })
    }

    // Verify user has access to the organization
    const { data: userOrg } = await supabase
      .from('user_organizations')
      .select('id')
      .eq('user_id', session.user.id)
      .eq('organization_id', organizationId)
      .eq('is_active', true)
      .single()

    if (!userOrg) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }

    const startDate = dateRange?.start ? new Date(dateRange.start) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const endDate = dateRange?.end ? new Date(dateRange.end) : new Date()

    let reportData: ReportData

    // Generate report based on type
    switch (reportType) {
      case 'event-performance':
        reportData = await generateEventPerformanceReport(supabase, organizationId, startDate, endDate, filters)
        break
      case 'financial-summary':
        reportData = await generateFinancialSummaryReport(supabase, organizationId, startDate, endDate, filters)
        break
      case 'user-activity':
        reportData = await generateUserActivityReport(supabase, organizationId, startDate, endDate, filters)
        break
      case 'ticket-sales':
        reportData = await generateTicketSalesReport(supabase, organizationId, startDate, endDate, filters)
        break
      default:
        return NextResponse.json({ error: "Invalid report type" }, { status: 400 })
    }

    const report = {
      id: `report_${Date.now()}`,
      type: reportType,
      organizationId,
      generatedBy: session.user.id,
      generatedAt: new Date().toISOString(),
      dateRange: { start: startDate.toISOString(), end: endDate.toISOString() },
      filters,
      data: reportData
    }

    // Store report in database
    await supabase
      .from('activities')
      .insert({
        user_id: session.user.id,
        action: "report_generated",
        entity: "report",
        entity_id: report.id,
        details: {
          reportType,
          dateRange: report.dateRange,
          filters
        }
      })

    // Format response based on requested format
    if (format === 'csv') {
      return generateCSVResponse(report)
    } else if (format === 'pdf') {
      return generatePDFResponse(report)
    }

    return NextResponse.json({ report })
  } catch (error) {
    logger.error("Report generation error", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function generateEventPerformanceReport(
  supabase: SupabaseClient,
  _organizationId: string,
  startDate: Date,
  endDate: Date,
  _filters: ReportFilters
) {
  // Get events for the organization within date range
  const { data: events } = await supabase
    .from('events')
    .select('id, name, start_date, capacity, created_at')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())

  const eventList = events || []

  // Get tickets for these events
  const eventIds = eventList.map((e: EventFromDB) => e.id)
  const { data: tickets } = await supabase
    .from('tickets')
    .select('id, event_id, price, status')
    .in('event_id', eventIds.length > 0 ? eventIds : ['none'])
    .eq('status', 'sold')

  const ticketList = tickets || []

  // Calculate metrics
  const ticketsByEvent = ticketList.reduce((acc: Record<string, Array<{ price: number }>>, ticket) => {
    if (!acc[ticket.event_id]) acc[ticket.event_id] = []
    acc[ticket.event_id]!.push({ price: Number(ticket.price) || 0 })
    return acc
  }, {})

  return {
    totalEvents: eventList.length,
    totalTicketsSold: ticketList.length,
    totalRevenue: ticketList.reduce((sum, ticket) => sum + (Number(ticket.price) || 0), 0),
    events: eventList.map(event => {
      const eventTickets = ticketsByEvent[event.id] || []
      return {
        id: event.id,
        name: event.name,
        date: event.start_date,
        ticketsSold: eventTickets.length,
        capacity: event.capacity,
        fillRate: event.capacity ? (eventTickets.length / event.capacity) * 100 : 0,
        revenue: eventTickets.reduce((sum, t) => sum + t.price, 0)
      }
    })
  }
}

async function generateFinancialSummaryReport(supabase: SupabaseClient, _organizationId: string, startDate: Date, endDate: Date, _filters: ReportFilters): Promise<FinancialReportData> {
  // Get budgets within date range
  const { data: budgets } = await supabase
    .from('budgets')
    .select('id, amount, category, event_id, created_at')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())

  const budgetList = budgets || []

  // Get sold tickets within date range
  const { data: tickets } = await supabase
    .from('tickets')
    .select('id, price, event_id, status, created_at, events(name)')
    .eq('status', 'sold')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())

  const ticketList = tickets || []

  const totalBudget = budgetList.reduce((sum, budget) => sum + (Number(budget.amount) || 0), 0)
  const totalRevenue = ticketList.reduce((sum, ticket) => sum + (Number(ticket.price) || 0), 0)
  const netProfit = totalRevenue - totalBudget

  return {
    totalBudget,
    totalRevenue,
    netProfit,
    profitMargin: totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0,
    budgetByCategory: budgetList.reduce((acc: Record<string, number>, budget) => {
      const category = budget.category || 'Uncategorized'
      acc[category] = (acc[category] || 0) + (Number(budget.amount) || 0)
      return acc
    }, {} as Record<string, number>),
    revenueByEvent: ticketList.reduce((acc: Record<string, number>, ticket: TicketWithEventName) => {
      const eventName = ticket.events?.[0]?.name || 'Unknown Event'
      acc[eventName] = (acc[eventName] || 0) + (Number(ticket.price) || 0)
      return acc
    }, {} as Record<string, number>)
  }
}

async function generateUserActivityReport(supabase: SupabaseClient, _organizationId: string, startDate: Date, endDate: Date, _filters: ReportFilters): Promise<UserActivityReportData> {
  // Get activities within date range
  const { data: activities } = await supabase
    .from('activities')
    .select('id, user_id, action, created_at')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())

  const activityList = activities || []

  // Get user details for activities
  const userIds = [...new Set(activityList.map(a => a.user_id))]
  const { data: users } = await supabase
    .from('platform_users')
    .select('id, first_name, last_name, email')
    .in('id', userIds.length > 0 ? userIds : ['none'])

  const userMap = (users || []).reduce((acc: Record<string, UserFromDB>, user) => {
    acc[user.id] = user
    return acc
  }, {} as Record<string, UserFromDB>)

  const userStats = activityList.reduce((acc: Record<string, UserActivityStats>, activity) => {
    const userId = activity.user_id
    if (!acc[userId]) {
      const user = userMap[userId] || { id: userId, first_name: null, last_name: null, email: '' }
      acc[userId] = {
        user: { id: user.id, firstName: user.first_name, lastName: user.last_name, email: user.email },
        totalActivities: 0,
        activitiesByType: {}
      }
    }
    acc[userId].totalActivities++
    acc[userId].activitiesByType[activity.action] = (acc[userId].activitiesByType[activity.action] || 0) + 1
    return acc
  }, {} as Record<string, UserActivityStats>)

  return {
    totalActivities: activityList.length,
    uniqueUsers: Object.keys(userStats).length,
    activitiesByType: activityList.reduce((acc: Record<string, number>, activity) => {
      acc[activity.action] = (acc[activity.action] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    topUsers: (Object.values(userStats) as UserActivityStats[])
      .sort((a: UserActivityStats, b: UserActivityStats) => b.totalActivities - a.totalActivities)
      .slice(0, 10)
  }
}

async function generateTicketSalesReport(supabase: SupabaseClient, _organizationId: string, startDate: Date, endDate: Date, _filters: ReportFilters): Promise<TicketSalesReportData> {
  // Get tickets within date range
  const { data: tickets } = await supabase
    .from('tickets')
    .select('id, price, status, event_id, created_at, events(id, name, start_date)')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())

  const ticketList = tickets || []
  const soldTickets = ticketList.filter(ticket => ticket.status === 'sold')
  const totalRevenue = soldTickets.reduce((sum, ticket) => sum + (Number(ticket.price) || 0), 0)

  return {
    totalTickets: ticketList.length,
    soldTickets: soldTickets.length,
    availableTickets: ticketList.length - soldTickets.length,
    totalRevenue,
    averageTicketPrice: soldTickets.length > 0 ? totalRevenue / soldTickets.length : 0,
    salesByEvent: soldTickets.reduce((acc: Record<string, number>, ticket: TicketWithEventDetails) => {
      const eventName = ticket.events?.[0]?.name || 'Unknown Event'
      acc[eventName] = (acc[eventName] || 0) + 1
      return acc
    }, {} as Record<string, number>),
    salesOverTime: soldTickets.reduce((acc: Record<string, number>, ticket) => {
      const date = ticket.created_at?.split('T')[0] || 'unknown'
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }
}

function generateCSVResponse(report: Report): NextResponse {
  // Simplified CSV generation - in production you'd use a proper CSV library
  let csv = 'Report Type,Generated At,Organization ID\n'
  csv += `${report.type},${report.generatedAt},${report.organizationId}\n\n`

  // Add data rows based on report type
  if (report.type === 'event-performance') {
    csv = csv + 'Event Name,Date,Tickets Sold,Capacity,Fill Rate,Revenue\n'
    ;(report.data as EventReportData).events.forEach((event: EventPerformanceItem) => {
      csv += `"${event.name}","${event.date}","${event.ticketsSold}","${event.capacity}","${event.fillRate.toFixed(1)}%","$${event.revenue.toFixed(2)}"\n`
    })
  }

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${report.type}-report.csv"`
    }
  })
}

function generatePDFResponse(report: Report): NextResponse {
  // Placeholder for PDF generation - would need pdf-lib or similar
  return NextResponse.json({
    error: "PDF export not yet implemented",
    reportId: report.id
  }, { status: 501 })
}
