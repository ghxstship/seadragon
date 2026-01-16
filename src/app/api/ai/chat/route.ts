
import { NextRequest, NextResponse } from "next/server"
import { logger } from "@/lib/logger"
import { auth } from "@/auth"
import { createClient } from "@/lib/supabase/server"
import OpenAI from "openai"
import type { SupabaseClient } from '@supabase/supabase-js'



// Type definitions for AI chat context
interface EventWithRelations {
  id: string
  name: string
  startDate: Date
  capacity: number | null
  tickets?: { price?: { toNumber: () => number } }[]
  budgets?: { amount: { toNumber: () => number } }[]
}

interface ProjectWithEvents {
  id: string
  name: string
  events: EventWithRelations[]
}

interface ContextData {
  organizations: unknown[]
  projects: ProjectWithEvents[]
  recentActivities: unknown[]
  predictiveData: PredictiveData | null
  currentOrganization: {
    organization?: { name: string }
    role?: { name: string; permissions: string[] }
  } | undefined
}

interface PredictiveData {
  attendanceTrend: { trend: string; confidence: number; averageRate?: number }
  revenueTrend: { trend: string; confidence: number; averageRevenue: number }
  optimizationSuggestions: OptimizationSuggestion[]
  upcomingPredictions: ProjectPrediction[]
}

interface OptimizationSuggestion {
  type: string
  title: string
  description: string
  impact: string
  events: string[]
}

interface ProjectPrediction {
  project: string
  predictedAttendance: string
  confidence: string
  recommendation: string
}

interface ChatUser {
  name?: string | null
  email?: string | null
}
function getOpenAI() {
  const apiKey = process.env["OPENAI_API_KEY"]
  if (!apiKey) {
    return null
  }
  return new OpenAI({
    apiKey,
  })
}

// POST /api/ai/chat - Handle chat messages
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { message } = body

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const supabase = await createClient()

    const userId = session.user.id
    const organizationId = session.user.organizationId || ''

    // Gather context about the user's organization and projects
    const contextData = await gatherContextData(supabase, userId, organizationId)

    // Create the system prompt with context
    const systemPrompt = createSystemPrompt(contextData, session.user)

    const openai = getOpenAI()
    if (!openai) {
      return NextResponse.json({ error: "OPENAI_API_KEY is not configured" }, { status: 500 })
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })

    const aiResponse = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response."

    // Log the conversation for audit trail via Supabase
    await supabase
      .from('activity_logs')
      .insert({
        user_id: userId,
        action: "ai_chat",
        entity_type: "ai_chat",
        entity_id: "ai_chat",
        metadata: {
          message,
          response: aiResponse,
          organizationId
        }
      })

    return NextResponse.json({
      response: aiResponse,
      context: contextData
    })
  } catch (error) {
    logger.error("Error in AI chat", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function gatherContextData(supabase: SupabaseClient, userId: string, organizationId: string) {
  // Get user's organizations and roles via Supabase
  const { data: userOrganizations } = await supabase
    .from('user_organizations')
    .select(`
      id,
      organization_id,
      organization:organization_id(id, name, slug),
      role:role_id(id, name, permissions)
    `)
    .eq('user_id', userId)
    .eq('is_active', true)

  // Get projects for the current organization via Supabase
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('organization_id', organizationId)
    .limit(50)

  // Get recent activities via Supabase
  const { data: recentActivities } = await supabase
    .from('activity_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)

  // Get predictive analytics data
  const predictiveData = await generatePredictiveAnalytics(organizationId, projects || [])

  return {
    organizations: userOrganizations || [],
    projects: projects || [],
    recentActivities: recentActivities || [],
    predictiveData,
    currentOrganization: (userOrganizations || []).find((uo: { organization_id: string }) => uo.organization_id === organizationId)
  }
}

async function generatePredictiveAnalytics(organizationId: string, projects: ProjectWithEvents[]): Promise<PredictiveData> {
  // Simple predictive analytics based on historical data
  const events = projects.flatMap(p => p.events)
  const recentEvents = events.filter(e => new Date(e.startDate) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))

  // Predict attendance trends
  const attendanceTrend = calculateAttendanceTrend(recentEvents)

  // Predict revenue trends
  const revenueTrend = calculateRevenueTrend(recentEvents)

  // Identify optimization opportunities
  const optimizationSuggestions = generateOptimizationSuggestions(projects, events)

  return {
    attendanceTrend,
    revenueTrend,
    optimizationSuggestions,
    upcomingPredictions: generateUpcomingPredictions(projects)
  }
}

function calculateAttendanceTrend(events: EventWithRelations[]) {
  if (events.length < 2) return { trend: 'stable', confidence: 0.5 }

  const attendanceRates = events.map(e => e.capacity ? (e.tickets?.length || 0) / e.capacity : 0)
  const avgRate = attendanceRates.reduce((a, b) => a + b, 0) / attendanceRates.length

  if (avgRate > 0.8) return { trend: 'high', confidence: 0.8, averageRate: avgRate }
  if (avgRate < 0.5) return { trend: 'low', confidence: 0.7, averageRate: avgRate }
  return { trend: 'stable', confidence: 0.6, averageRate: avgRate }
}

function calculateRevenueTrend(events: EventWithRelations[]) {
  if (events.length < 2) return { trend: 'stable', confidence: 0.5, averageRevenue: 0 }

  const revenues = events.map(e => e.tickets?.reduce((sum, t) => sum + (t.price?.toNumber() || 0), 0) || 0)
  const avgRevenue = revenues.reduce((a, b) => a + b, 0) / revenues.length

  return {
    trend: avgRevenue > 10000 ? 'strong' : avgRevenue > 5000 ? 'moderate' : 'weak',
    confidence: 0.75,
    averageRevenue: avgRevenue
  }
}

function generateOptimizationSuggestions(projects: ProjectWithEvents[], events: EventWithRelations[]): OptimizationSuggestion[] {
  const suggestions = []

  // Budget optimization
  const highBudgetEvents = events.filter(e => e.budgets?.some(b => b.amount.toNumber() > 50000))
  if (highBudgetEvents.length > 0) {
    suggestions.push({
      type: 'budget',
      title: 'High-budget events detected',
      description: 'Consider optimizing costs for events with budgets over $50,000',
      impact: 'high',
      events: highBudgetEvents.map(e => e.name)
    })
  }

  // Attendance optimization
  const lowAttendanceEvents = events.filter(e => {
    const attendance = e.tickets?.length || 0
    const capacity = e.capacity || 1
    return (attendance / capacity) < 0.6
  })
  if (lowAttendanceEvents.length > 0) {
    suggestions.push({
      type: 'attendance',
      title: 'Low attendance events',
      description: 'Events with attendance below 60% may need marketing optimization',
      impact: 'medium',
      events: lowAttendanceEvents.map(e => e.name)
    })
  }

  // Scheduling optimization
  const overlappingEvents = findOverlappingEvents(events)
  if (overlappingEvents.length > 0) {
    suggestions.push({
      type: 'scheduling',
      title: 'Event scheduling conflicts',
      description: 'Multiple events scheduled close together may cause resource conflicts',
      impact: 'medium',
      events: overlappingEvents
    })
  }

  return suggestions
}

function findOverlappingEvents(events: EventWithRelations[]): string[] {
  const conflicts = []
  for (let i = 0; i < events.length; i++) {
    for (let j = i + 1; j < events.length; j++) {
      const event1 = events[i]
      const event2 = events[j]
      const diff = Math.abs(new Date(event1.startDate).getTime() - new Date(event2.startDate).getTime())
      if (diff < 7 * 24 * 60 * 60 * 1000) { // Within 7 days
        conflicts.push(`${event1.name} and ${event2.name}`)
      }
    }
  }
  return conflicts
}

function generateUpcomingPredictions(projects: ProjectWithEvents[]): ProjectPrediction[] {
  const predictions: ProjectPrediction[] = []

  projects.forEach(project => {
    if (project.events.length > 0) {
      const avgAttendance = project.events.reduce((sum, e) => {
        const attendance = e.tickets?.length || 0
        const capacity = e.capacity || 1
        return sum + (attendance / capacity)
      }, 0) / project.events.length

      predictions.push({
        project: project.name,
        predictedAttendance: `${(avgAttendance * 100).toFixed(1)}%`,
        confidence: 'medium',
        recommendation: avgAttendance > 0.8 ? 'Maintain current strategy' : 'Increase marketing efforts'
      })
    }
  })

  return predictions
}

function createSystemPrompt(contextData: ContextData, user: ChatUser) {
  const { organizations, projects, currentOrganization, predictiveData } = contextData

  return `You are ATLVS + COMPVSS AI, an intelligent assistant for the ATLVS + GVTEWAY live entertainment platform.

Your role is to help users with:
- Project management and planning
- Event coordination and scheduling
- Budget analysis and financial tracking
- Team collaboration and communication
- Resource allocation and logistics
- Performance analytics and reporting
- Predictive analytics and trend analysis
- Automated workflow optimization
- Strategic recommendations and insights

Current User Context:
- Name: ${user.name || 'User'}
- Email: ${user.email}
- Organization: ${currentOrganization?.organization?.name || 'Unknown'}
- Role: ${currentOrganization?.role?.name || 'Unknown'}
- Permissions: ${JSON.stringify(currentOrganization?.role?.permissions || [])}

Organization Overview:
- Total Organizations: ${organizations.length}
- Current Organization Projects: ${projects.length}
- Active Events: ${projects.reduce((acc: number, p: ProjectWithEvents) => acc + p.events.length, 0)}
- Predictive Analytics Available: ${predictiveData ? 'Yes' : 'No'}

Predictive Insights:
${predictiveData ? `
- Attendance Trend: ${predictiveData.attendanceTrend.trend} (${((predictiveData.attendanceTrend.averageRate || 0) * 100).toFixed(1)}% average)
- Revenue Trend: ${predictiveData.revenueTrend.trend} ($${predictiveData.revenueTrend.averageRevenue.toLocaleString()} average)
- Optimization Opportunities: ${predictiveData.optimizationSuggestions.length} identified
- Upcoming Predictions: ${predictiveData.upcomingPredictions.length} available
` : 'No predictive data available'}

Key Capabilities:
1. Answer questions about projects, events, budgets, and team members
2. Help with scheduling and timeline management
3. Provide insights on budget utilization and cost optimization
4. Assist with resource allocation and vendor coordination
5. Generate reports and analytics with predictive insights
6. Offer strategic recommendations for performance improvement
7. Identify optimization opportunities and workflow automation
8. Provide predictive analytics for attendance and revenue forecasting
9. Suggest automated workflows and process improvements
10. Help with compliance and regulatory requirements

Advanced AI Features:
- Predictive Analytics: Analyze historical data to forecast attendance, revenue, and performance trends
- Optimization Engine: Identify cost-saving opportunities, scheduling conflicts, and efficiency improvements
- Automated Recommendations: Suggest optimal pricing, marketing strategies, and resource allocation
- Workflow Automation: Recommend automated processes for repetitive tasks and notifications
- Anomaly Detection: Identify unusual patterns in financial data, attendance, or operational metrics

Guidelines:
- Be helpful, professional, and proactive
- Provide specific, actionable advice with confidence levels
- Ask clarifying questions when needed
- Suggest best practices from the live entertainment industry
- Maintain context awareness of the user's current organization and projects
- Respect user permissions and data privacy
- Use predictive analytics to provide forward-looking insights
- Recommend automation opportunities when appropriate

If you don't have enough information to answer a question, ask for clarification or suggest where the user can find the information in the platform.`
}
