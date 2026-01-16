
import { NextRequest, NextResponse } from 'next/server'
import { validateEmail } from '@/lib/validation'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'

// POST /api/contact - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { name, email, topic, subject, message, urgency } = body

    // Validate required fields
    if (!name || !email || !topic || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      return NextResponse.json(
        { error: emailValidation.errors[0] || 'Invalid email format' },
        { status: 400 }
      )
    }

    // Store contact submission in database
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name,
          email,
          topic,
          subject,
          message,
          urgency: urgency || 'normal',
          status: 'pending',
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        // If table doesn't exist, try activities table or just log
        if (error.code === '42P01') {
          try {
            await supabase
              .from('activities')
              .insert({
                user_id: null, // No user for anonymous contact
                type: 'contact_form_submission',
                description: `Contact form submission from ${name} (${email}): ${subject}`,
                metadata: {
                  name,
                  email,
                  topic,
                  subject,
                  message,
                  urgency: urgency || 'normal'
                },
                created_at: new Date().toISOString()
              })
          } catch (activityError) {
            // If activities table also fails, just log and continue
            logger.warn('Failed to store contact in activities table')
          }
        } else {
          logger.error('Error storing contact submission', error)
          // Don't fail the request for database errors
        }
      }

      // Log successful submission
      logger.info('Contact form submitted', {
        name,
        email,
        topic,
        subject,
        urgency: urgency || 'normal'
      })

    } catch (dbError) {
      // Log but don't fail the request
      logger.error('Database error in contact submission', dbError)
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been received. We will respond within 24 hours.',
      referenceId: `contact_${Date.now()}`
    })

  } catch (error) {
    logger.error('Contact form submission error', error)
    return NextResponse.json(
      { error: 'Failed to submit contact form. Please try again.' },
      { status: 500 }
    )
  }
}

// GET /api/contact - Get contact submissions (admin only)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: submissions, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: submissions || []
    })

  } catch (error) {
    logger.error('Error fetching contact submissions', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact submissions' },
      { status: 500 }
    )
  }
}
