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

// POST /api/ai/event-planning - Generate event planning suggestions
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      eventType,
      audienceSize,
      budget,
      date,
      venue,
      preferences,
      constraints
    } = body

    if (!eventType) {
      return NextResponse.json({ error: 'Event type is required' }, { status: 400 })
    }

    const systemPrompt = `You are an expert event planning AI assistant for ATLVS + GVTEWAY, a comprehensive entertainment platform.

Your role is to provide intelligent, actionable event planning recommendations based on:
- Event type and scale
- Audience demographics and preferences
- Budget constraints
- Venue capabilities and logistics
- Timeline and scheduling
- Technical requirements
- Risk mitigation
- Sustainability considerations

Provide detailed, structured recommendations that include:
1. Overall event concept and theme
2. Venue and layout recommendations
3. Technical requirements (sound, lighting, video, etc.)
4. Timeline and milestones
5. Budget breakdown suggestions
6. Staffing recommendations
7. Marketing and promotion strategies
8. Risk assessment and contingency plans
9. Sustainability initiatives
10. Success metrics and evaluation criteria

Format your response as a structured JSON object with clear sections and actionable items.`

    const userPrompt = `Please create a comprehensive event planning recommendation for:

Event Type: ${eventType}
${audienceSize ? `Audience Size: ${audienceSize}` : ''}
${budget ? `Budget: ${budget}` : ''}
${date ? `Date: ${date}` : ''}
${venue ? `Venue: ${venue}` : ''}
${preferences ? `Preferences: ${JSON.stringify(preferences)}` : ''}
${constraints ? `Constraints: ${JSON.stringify(constraints)}` : ''}

Please provide detailed planning recommendations including timeline, budget breakdown, technical requirements, and success metrics.`

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
          content: userPrompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
      response_format: { type: 'json_object' }
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      return NextResponse.json({ error: 'Failed to generate planning recommendations' }, { status: 500 })
    }

    let planningData
    try {
      planningData = safeJsonParse(response)
      if (!planningData) {
        planningData = {
          suggestions: [],
          note: 'Unable to parse AI response'
        }
      }
    } catch {
      planningData = {
        suggestions: [],
        note: 'Unable to parse AI response'
      }
    }

    return NextResponse.json({
      success: true,
      planning: planningData,
      metadata: {
        eventType,
        generatedAt: new Date().toISOString(),
        userId: session.user.id
      }
    })

  } catch (error) {
    logger.error('Error generating event planning', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/ai/event-planning/templates - Get event planning templates
export async function GET() {
  try {
    const session = await auth()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Pre-defined event planning templates
    const templates = [
      {
        id: 'music-festival',
        name: 'Music Festival',
        description: 'Large-scale outdoor music festival with multiple stages',
        audienceSize: '5000-50000',
        typicalBudget: '$50000-$500000',
        duration: '1-3 days',
        keyConsiderations: [
          'Weather contingency plans',
          'Multiple stage coordination',
          'Camping and accommodation logistics',
          'Traffic and parking management',
          'Waste management and recycling',
          'Medical and security staffing'
        ]
      },
      {
        id: 'corporate-conference',
        name: 'Corporate Conference',
        description: 'Professional conference with keynote speakers and workshops',
        audienceSize: '100-1000',
        typicalBudget: '$25000-$150000',
        duration: '1-2 days',
        keyConsiderations: [
          'AV equipment for presentations',
          'Networking opportunities',
          'Catering and dietary requirements',
          'Branding and signage',
          'Registration and check-in process',
          'Post-event follow-up and analytics'
        ]
      },
      {
        id: 'intimate-concert',
        name: 'Intimate Concert',
        description: 'Small venue acoustic or electric concert experience',
        audienceSize: '50-500',
        typicalBudget: '$5000-$25000',
        duration: '2-4 hours',
        keyConsiderations: [
          'Sound quality optimization',
          'Intimate audience engagement',
          'VIP and meet-and-greet opportunities',
          'Merchandise and concessions',
          'Photography and social media',
          'Acoustic treatment and lighting'
        ]
      },
      {
        id: 'theater-production',
        name: 'Theater Production',
        description: 'Stage play, musical, or performance art production',
        audienceSize: '100-2000',
        typicalBudget: '$15000-$200000',
        duration: '1-3 hours',
        keyConsiderations: [
          'Rehearsal space and schedule',
          'Costume and makeup design',
          'Set construction and props',
          'Sound design and reinforcement',
          'Lighting design and programming',
          'Front of house and backstage operations'
        ]
      },
      {
        id: 'wedding-reception',
        name: 'Wedding Reception',
        description: 'Elegant wedding celebration with entertainment',
        audienceSize: '50-300',
        typicalBudget: '$10000-$75000',
        duration: '4-6 hours',
        keyConsiderations: [
          'Ceremony and reception coordination',
          'Catering and beverage service',
          'Photography and videography',
          'DJ or live entertainment',
          'Decor and floral arrangements',
          'Guest list and RSVP management'
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
    logger.error('Error fetching event planning templates', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
