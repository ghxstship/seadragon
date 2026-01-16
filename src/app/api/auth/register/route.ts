
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { logger } from '@/lib/logger'
import { validateEmail } from '@/lib/validation'
import { URLS } from '@/lib/constants/config'

// POST /api/auth/register - User registration with Supabase
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ['email', 'password', 'firstName', 'lastName']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'VALIDATION_ERROR',
              message: `Missing required field: ${field}`,
              field
            }
          },
          { status: 400 }
        )
      }
    }

    const { email, password, firstName, lastName, phone, organizationName, organizationSlug, userType } = body

    // Validate email format
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: emailValidation.errors[0] || 'Invalid email format',
            field: 'email'
          }
        },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Password must be at least 8 characters long',
            field: 'password'
          }
        },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          display_name: `${firstName} ${lastName.charAt(0)}.`,
          phone: phone || null
        },
        emailRedirectTo: `${request.headers.get('origin') || URLS.DEVELOPMENT}/auth/callback`
      }
    })

    if (authError) {
      logger.error('Supabase auth signup error', { error: authError.message })
      
      if (authError.message.includes('already registered')) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'USER_EXISTS',
              message: 'An account with this email already exists'
            }
          },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AUTH_ERROR',
            message: authError.message
          }
        },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AUTH_ERROR',
            message: 'Failed to create user account'
          }
        },
        { status: 500 }
      )
    }

    // Create user profile in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: email.toLowerCase(),
        first_name: firstName,
        last_name: lastName,
        display_name: `${firstName} ${lastName.charAt(0)}.`,
        phone: phone || null,
        role: userType === 'professional' ? 'professional' : 'member',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (profileError) {
      logger.error('Profile creation error', { error: profileError.message })
      // User was created in auth but profile failed - log but don't fail the request
    }

    // If professional signup with organization, create organization
    if (userType === 'professional' && organizationName && organizationSlug) {
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name: organizationName,
          slug: organizationSlug.toLowerCase(),
          owner_id: authData.user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (!orgError && org) {
        // Add user to organization
        await supabase
          .from('user_organizations')
          .insert({
            user_id: authData.user.id,
            organization_id: org.id,
            role: 'owner',
            is_active: true,
            created_at: new Date().toISOString()
          })
      }
    }

    logger.info('User registered successfully', { userId: authData.user.id, email })

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: authData.user.id,
          email: authData.user.email,
          firstName,
          lastName,
          displayName: `${firstName} ${lastName.charAt(0)}.`
        },
        message: 'Account created successfully. Please check your email to verify your account.',
        nextSteps: [
          'Check your email for the verification link',
          'Click the link to activate your account',
          'Complete your profile to get personalized recommendations'
        ],
        verificationRequired: !authData.user.email_confirmed_at
      }
    }, { status: 201 })
  } catch (error) {
    logger.error('Registration error', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An error occurred during registration'
        }
      },
      { status: 500 }
    )
  }
}
