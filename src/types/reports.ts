export type ReportType =
  | 'organization-summary'
  | 'project-summary'
  | 'event-performance'
  | 'financial-overview'

export interface OrganizationSummaryReport {
  type: 'organization-summary'
  organization: {
    name?: string
    workspaces: number
    projects: number
    events: number
    people: number
    assets: number
    users: number
    teams: number
  }
  generatedAt: string
}

export interface ProjectSummaryReport {
  type: 'project-summary'
  project: {
    name?: string
    status?: string
    startDate?: string
    endDate?: string
    events: number
    people: number
    assets: number
    venues: number
    totalBudget: number
    workspace?: string
    organization?: string
  }
  generatedAt: string
}

export interface EventPerformanceReport {
  type: 'event-performance'
  event: {
    name?: string
    date?: string
    capacity?: number | null
    ticketSales: number
    attendanceRate: number
    totalRevenue: number
    productions: number
    schedules: number
    credentials: number
    project?: string
    organization?: string
  }
  generatedAt: string
}

export interface FinancialOverviewReport {
  type: 'financial-overview'
  financials: {
    totalBudget: number
    categoryBreakdown: Record<string, number>
    budgetCount: number
    organizationId: string
  }
  generatedAt: string
}

export type ReportPayload =
  | OrganizationSummaryReport
  | ProjectSummaryReport
  | EventPerformanceReport
  | FinancialOverviewReport

// Supabase row helper types (minimal fields used)
export type SupabaseOrganization = {
  name?: string
  workspaces?: SupabaseWorkspace[]
  user_organizations?: unknown[]
  teams?: unknown[]
}

export type SupabaseWorkspace = {
  projects?: SupabaseProject[]
}

export type SupabaseProject = {
  events?: SupabaseEventBudget[]
  people?: unknown[]
  assets?: unknown[]
  places?: unknown[]
}

export type SupabaseEventBudget = {
  budgets?: BudgetRecord[]
}

export type SupabaseProjectDetail = {
  name?: string
  status?: string
  start_date?: string
  end_date?: string
  events?: SupabaseEventBudget[]
  people?: unknown[]
  assets?: unknown[]
  places?: unknown[]
  workspaces?: { name?: string; organizations?: { name?: string } }
}

export type SupabaseEventDetail = {
  name?: string
  start_date?: string
  capacity?: number
  tickets?: { status?: string; price?: number }[]
  productions?: unknown[]
  schedules?: unknown[]
  credentials?: unknown[]
  projects?: { name?: string; workspaces?: { organizations?: { name?: string } } }
}

export type FinancialBudgetRecord = {
  amount?: number
  category?: string
  events?: { projects?: { workspaces?: { organization_id?: string } } }
}

export type BudgetRecord = { amount?: number; category?: string }
