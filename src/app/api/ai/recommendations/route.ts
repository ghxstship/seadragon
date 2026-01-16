
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('ai_recommendations')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      recommendations: data || []
    })
  } catch (error) {
    logger.error('Error fetching AI recommendations:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch recommendations'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, context, type } = body

    const supabase = await createClient()

    // Generate recommendations based on user data and context
    let query = supabase
      .from('ai_recommendations')
      .select('*')

    if (userId) {
      query = query.eq('user_id', userId)
    }

    if (type) {
      query = query.eq('type', type)
    }

    if (context) {
      // Add context-based filtering (e.g., tags, categories)
      query = query.contains('tags', [context])
    }

    const { data, error } = await query
      .order('relevance_score', { ascending: false })
      .limit(10)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      recommendations: data || []
    })
  } catch (error) {
    logger.error('Error generating AI recommendations:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to generate recommendations'
    }, { status: 500 })
  }
}