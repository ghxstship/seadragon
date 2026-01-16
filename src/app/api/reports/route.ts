
import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { auth } from "@/auth"
import { createClient } from "@/lib/supabase/server"
import {
  type ReportPayload,
  type SupabaseOrganization,
  type SupabaseWorkspace,
  type SupabaseProject,
  type SupabaseProjectDetail,
  type SupabaseEventBudget,
  type SupabaseEventDetail,
  type FinancialBudgetRecord,
  type BudgetRecord,
} from "@/types/reports"

type OrganizationRecord = SupabaseOrganization
type OrganizationWorkspace = SupabaseWorkspace
type ProjectRecord = SupabaseProject
type EventBudgetRecord = SupabaseEventBudget

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>

// GET /api/reports - Generate reports for authenticated user's organizations
export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createClient()
    const userId = session.user.id
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const organizationId = searchParams.get('organizationId')
    const projectId = searchParams.get('projectId')
    const eventId = searchParams.get('eventId')

    // Verify access to the requested organization
    if (organizationId) {
      const { data: userOrg } = await supabase
        .from('user_organizations')
        .select('id')
        .eq('user_id', userId)
        .eq('organization_id', organizationId)
        .eq('is_active', true)
        .single()
      if (!userOrg) {
        return NextResponse.json({ error: "Access denied" }, { status: 403 })
      }
    }

    let reportData: ReportPayload

    switch (type) {
      case 'organization-summary':
        reportData = await generateOrganizationSummary(supabase, organizationId!)
        break
      case 'project-summary':
        const projectReport = await generateProjectSummary(supabase, projectId!)
        if (!projectReport) {
          return NextResponse.json({ error: "Project not found" }, { status: 404 })
        }
        reportData = projectReport
        break
      case 'event-performance':
        const eventReport = await generateEventPerformance(supabase, eventId!)
        if (!eventReport) {
          return NextResponse.json({ error: "Event not found" }, { status: 404 })
        }
        reportData = eventReport
        break
      case 'financial-overview':
        reportData = await generateFinancialOverview(supabase, organizationId!)
        break
      default:
        return NextResponse.json({ error: "Invalid report type" }, { status: 400 })
    }

    return NextResponse.json({ report: reportData })
  } catch (error) {
    logger.error("Error generating report", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function generateOrganizationSummary(supabase: SupabaseServerClient, organizationId: string) {
  const { data: organization } = await supabase
    .from('organizations')
    .select('*, workspaces(*, projects(*, events(*), people(*), assets(*), places(*))), user_organizations(*), teams(*)')
    .eq('id', organizationId)
    .single()

  const orgData = organization as OrganizationRecord | null

  return {
    type: 'organization-summary' as const,
    organization: {
      name: orgData?.name ?? '',
      workspaces: orgData?.workspaces?.length || 0,
      projects: orgData?.workspaces?.reduce((acc: number, ws: OrganizationWorkspace) => acc + (ws.projects?.length || 0), 0) || 0,
      events: orgData?.workspaces?.reduce((acc: number, ws: OrganizationWorkspace) => {
        const projectEvents = ws.projects?.reduce((acc2: number, p: ProjectRecord) => acc2 + (p.events?.length || 0), 0) || 0
        return acc + projectEvents
      }, 0) || 0,
      people: orgData?.workspaces?.reduce((acc: number, ws: OrganizationWorkspace) => {
        const projectPeople = ws.projects?.reduce((acc2: number, p: ProjectRecord) => acc2 + (p.people?.length || 0), 0) || 0
        return acc + projectPeople
      }, 0) || 0,
      assets: orgData?.workspaces?.reduce((acc: number, ws: OrganizationWorkspace) => {
        const projectAssets = ws.projects?.reduce((acc2: number, p: ProjectRecord) => acc2 + (p.assets?.length || 0), 0) || 0
        return acc + projectAssets
      }, 0) || 0,
      users: orgData?.user_organizations?.length || 0,
      teams: orgData?.teams?.length || 0
    },
    generatedAt: new Date().toISOString()
  }
}

async function generateProjectSummary(supabase: SupabaseServerClient, projectId: string) {
  const { data: project } = await supabase
    .from('projects')
    .select('*, events(*, budgets(*)), people(*), assets(*), places(*), workspaces(*, organizations(*))')
    .eq('id', projectId)
    .single()

  if (!project) return null

  const projectData = project as SupabaseProjectDetail

  const totalBudget = projectData.events?.reduce(
    (acc: number, event: EventBudgetRecord) =>
      acc +
      (event.budgets?.reduce((acc2: number, budget: BudgetRecord) => acc2 + Number(budget.amount || 0), 0) || 0),
    0
  ) || 0

  return {
    type: 'project-summary' as const,
    project: {
      name: projectData.name ?? '',
      status: projectData.status ?? '',
      startDate: projectData.start_date ?? '',
      endDate: projectData.end_date ?? '',
      events: projectData.events?.length || 0,
      people: projectData.people?.length || 0,
      assets: projectData.assets?.length || 0,
      venues: projectData.places?.length || 0,
      totalBudget,
      workspace: projectData.workspaces?.name ?? '',
      organization: projectData.workspaces?.organizations?.name ?? ''
    },
    generatedAt: new Date().toISOString()
  }
}

async function generateEventPerformance(supabase: SupabaseServerClient, eventId: string) {
  const { data: event } = await supabase
    .from('events')
    .select('*, productions(*), schedules(*), budgets(*), credentials(*), tickets(*), projects(*, workspaces(*, organizations(*)))')
    .eq('id', eventId)
    .single()

  if (!event) return null

  const eventData = event as SupabaseEventDetail

  const ticketSales = eventData.tickets?.filter((t) => t.status === 'sold').length || 0
  const totalRevenue =
    eventData.tickets
      ?.filter((t: { status?: string }) => t.status === 'sold')
      .reduce((acc: number, ticket: { price?: number }) => acc + Number(ticket.price || 0), 0) || 0

  return {
    type: 'event-performance' as const,
    event: {
      name: eventData.name ?? '',
      date: eventData.start_date ?? '',
      capacity: eventData.capacity ?? null,
      ticketSales,
      attendanceRate: eventData.capacity ? (ticketSales / eventData.capacity) * 100 : 0,
      totalRevenue,
      productions: eventData.productions?.length || 0,
      schedules: eventData.schedules?.length || 0,
      credentials: eventData.credentials?.length || 0,
      project: eventData.projects?.name ?? '',
      organization: eventData.projects?.workspaces?.organizations?.name ?? ''
    },
    generatedAt: new Date().toISOString()
  }
}

async function generateFinancialOverview(supabase: SupabaseServerClient, organizationId: string) {
  const { data: budgets } = await supabase
    .from('budgets')
    .select('*, events(*, projects(*, workspaces(*)))')

  const orgBudgets =
    (budgets as FinancialBudgetRecord[] | null)?.filter(
      (b) => b.events?.projects?.workspaces?.organization_id === organizationId
    ) || []

  const totalBudget = orgBudgets.reduce((acc: number, budget) => acc + Number(budget.amount || 0), 0)
  const categoryBreakdown = orgBudgets.reduce((acc: Record<string, number>, budget) => {
    const key = budget.category || 'Uncategorized'
    acc[key] = (acc[key] || 0) + Number(budget.amount || 0)
    return acc
  }, {} as Record<string, number>)

  return {
    type: 'financial-overview' as const,
    financials: {
      totalBudget,
      categoryBreakdown,
      budgetCount: orgBudgets.length,
      organizationId
    },
    generatedAt: new Date().toISOString()
  }
}
