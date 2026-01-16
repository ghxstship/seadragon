
import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { auth } from '@/auth'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'
import { safeJsonParse } from '@/lib/safe-json'

function getOpenAI() {
  const apiKey = process.env["OPENAI_API_KEY"]
  if (!apiKey) return null
  return new OpenAI({ apiKey })
}

// POST /api/ai/tasks/generate - Generate automated tasks for an event/project
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { projectId, eventId, type, scope } = body

    if (!projectId && !eventId) {
      return NextResponse.json({ error: 'Project ID or Event ID is required' }, { status: 400 })
    }

    // Get project or event details
    const supabase = await createClient()
    let contextData = null

    if (projectId) {
      const { data } = await supabase
        .from('projects')
        .select(`
          *,
          events (
            *,
            venues (*)
          ),
          workspaces (*)
        `)
        .eq('id', projectId)
        .single()
      contextData = data
    } else if (eventId) {
      const { data } = await supabase
        .from('events')
        .select(`
          *,
          venues (*),
          projects (*)
        `)
        .eq('id', eventId)
        .single()
      contextData = data
    }

    if (!contextData) {
      return NextResponse.json({ error: 'Project or event not found' }, { status: 404 })
    }

    const systemPrompt = `You are an expert project manager and task automation AI for ATLVS + GVTEWAY.

Your role is to analyze projects/events and generate comprehensive, actionable task lists that ensure successful execution. Consider:

1. Project/Event Type and Scale
2. Timeline and Milestones
3. Required Resources and Dependencies
4. Team Roles and Responsibilities
5. Risk Factors and Contingencies
6. Quality Standards and Compliance
7. Budget and Cost Management
8. Stakeholder Communication

Generate tasks organized by:
- Phase (Planning, Pre-Event, During Event, Post-Event)
- Priority (High, Medium, Low)
- Assignee suggestions
- Dependencies and prerequisites
- Estimated duration and effort
- Success criteria

Format tasks as structured JSON with all necessary details for implementation.`

    const contextPrompt = `Generate a comprehensive task list for this ${projectId ? 'project' : 'event'}:

${JSON.stringify(contextData, null, 2)}

Task Type: ${type || 'comprehensive'}
Scope: ${scope || 'full'}

Please provide detailed, actionable tasks with priorities, assignees, timelines, and dependencies.`

    const openai = getOpenAI()
    if (!openai) {
      return NextResponse.json({ error: 'OPENAI_API_KEY is not configured' }, { status: 500 })
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: contextPrompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      return NextResponse.json({ error: 'Failed to generate tasks' }, { status: 500 })
    }

    let taskData
    try {
      taskData = safeJsonParse(response)
      if (!taskData) {
        taskData = {
          tasks: [],
          phases: ['Planning', 'Execution', 'Follow-up'],
          note: 'Unable to parse AI response'
        }
      }
    } catch {
      taskData = {
        tasks: [],
        phases: ['Planning', 'Execution', 'Follow-up'],
        note: 'Unable to parse AI response'
      }
    }

    // Optionally save generated tasks to database
    if (taskData.tasks && taskData.tasks.length > 0) {
      // This would save tasks to a tasks table if implemented
      logger.info('Generated tasks', { count: taskData.tasks.length })
    }

    return NextResponse.json({
      success: true,
      tasks: taskData,
      metadata: {
        projectId,
        eventId,
        generatedAt: new Date().toISOString(),
        userId: session.user.id,
        taskCount: taskData.tasks?.length || 0
      }
    })

  } catch (error) {
    logger.error('Error generating tasks', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/ai/tasks/optimize - Optimize existing task list
export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { tasks, constraints, priorities } = body

    if (!tasks || !Array.isArray(tasks)) {
      return NextResponse.json({ error: 'Tasks array is required' }, { status: 400 })
    }

    const systemPrompt = `You are a task optimization expert for ATLVS + GVTEWAY.

Your role is to analyze existing task lists and provide optimizations for:
- Timeline efficiency
- Resource allocation
- Dependency management
- Risk mitigation
- Cost optimization
- Quality improvement

Consider constraints like:
- Budget limitations
- Team capacity
- Time pressures
- External dependencies
- Quality requirements

Provide specific recommendations for task reordering, parallel execution, resource reassignment, and timeline adjustments.`

    const optimizationPrompt = `Optimize this task list considering the provided constraints and priorities:

Tasks: ${JSON.stringify(tasks, null, 2)}

Constraints: ${JSON.stringify(constraints || {}, null, 2)}

Priorities: ${JSON.stringify(priorities || {}, null, 2)}

Provide optimization recommendations with specific actions, timeline impacts, and success metrics.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: optimizationPrompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.6,
      response_format: { type: 'json_object' }
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      return NextResponse.json({ error: 'Failed to optimize tasks' }, { status: 500 })
    }

    let optimizationData
    try {
      optimizationData = safeJsonParse(response)
      if (!optimizationData) {
        optimizationData = {
          optimizations: [],
          note: 'Unable to parse AI response'
        }
      }
    } catch {
      optimizationData = {
        optimizations: [],
        note: 'Unable to parse AI response'
      }
    }

    return NextResponse.json({
      success: true,
      optimization: optimizationData,
      metadata: {
        taskCount: tasks.length,
        optimizedAt: new Date().toISOString(),
        userId: session.user.id
      }
    })

  } catch (error) {
    logger.error('Error optimizing tasks', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/ai/tasks/templates - Get task templates for different event types
export async function GET() {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const templates = [
      {
        id: 'music-festival-planning',
        name: 'Music Festival Planning Template',
        eventType: 'Festival',
        phases: [
          {
            name: 'Pre-Planning',
            duration: '3-6 months',
            tasks: [
              'Secure venue and dates',
              'Book headliners and artists',
              'Create preliminary budget',
              'Assemble core team',
              'Obtain necessary permits'
            ]
          },
          {
            name: 'Planning & Development',
            duration: '2-4 months',
            tasks: [
              'Develop festival theme and branding',
              'Plan stage layouts and logistics',
              'Arrange accommodations and transportation',
              'Set up ticketing system',
              'Coordinate with local authorities'
            ]
          },
          {
            name: 'Pre-Event',
            duration: '1-2 months',
            tasks: [
              'Finalize lineup and schedule',
              'Set up production infrastructure',
              'Train staff and volunteers',
              'Launch marketing campaigns',
              'Test all systems and equipment'
            ]
          },
          {
            name: 'Event Execution',
            duration: 'Event duration',
            tasks: [
              'Manage on-site operations',
              'Coordinate with performers',
              'Monitor crowd safety',
              'Handle technical issues',
              'Provide guest services'
            ]
          },
          {
            name: 'Post-Event',
            duration: '1-2 weeks',
            tasks: [
              'Dismantle equipment and clean up',
              'Process final payments',
              'Analyze event data and feedback',
              'Send thank-you communications',
              'Plan for next year'
            ]
          }
        ]
      },
      {
        id: 'corporate-conference',
        name: 'Corporate Conference Template',
        eventType: 'Conference',
        phases: [
          {
            name: 'Strategy & Planning',
            duration: '4-6 months',
            tasks: [
              'Define conference objectives',
              'Select theme and speakers',
              'Create detailed budget',
              'Book venue and dates',
              'Form planning committee'
            ]
          },
          {
            name: 'Content Development',
            duration: '3-4 months',
            tasks: [
              'Develop session agendas',
              'Coordinate with speakers',
              'Plan networking activities',
              'Design signage and materials',
              'Set up registration system'
            ]
          },
          {
            name: 'Logistics & Operations',
            duration: '1-2 months',
            tasks: [
              'Arrange catering and AV equipment',
              'Coordinate travel and accommodations',
              'Set up exhibit hall',
              'Train staff and volunteers',
              'Conduct site inspections'
            ]
          },
          {
            name: 'Event Management',
            duration: 'Event duration',
            tasks: [
              'Oversee registration and check-in',
              'Manage session timings',
              'Coordinate with vendors',
              'Handle attendee inquiries',
              'Monitor event flow'
            ]
          },
          {
            name: 'Follow-up & Analysis',
            duration: '2-4 weeks',
            tasks: [
              'Send post-event surveys',
              'Analyze attendance and feedback',
              'Process expense reports',
              'Share recordings and materials',
              'Plan future events'
            ]
          }
        ]
      }
    ]

    return NextResponse.json({
      templates,
      metadata: {
        count: templates.length,
        lastUpdated: new Date().toISOString()
      }
    })

  } catch (error) {
    logger.error('Error fetching task templates', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
