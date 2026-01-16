
/**
 * Supabase Auth Module
 * Native Supabase Auth implementation
 */
import { createClient } from './server'
import { supabase } from '../supabase'
import { logger } from '../logger'

// Types for auth
export interface AuthUser {
  id: string
  email: string
  name?: string
  organizationId?: string
  organizationSlug?: string
  role?: string
  permissions?: string[]
  mfaRequired?: boolean
}

export interface Session {
  user: AuthUser
  accessToken?: string
  expiresAt?: number
}

// Password strength validation for PCI DSS compliance
export function validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number')
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Get the current authenticated session (server-side)
 */
export async function auth(): Promise<Session | null> {
  try {
    const client = await createClient()
    const { data: { user }, error } = await client.auth.getUser()
    
    if (error || !user) {
      return null
    }

    // Get user's organization and role info
    const { data: userOrg } = await client
      .from('user_organizations')
      .select(`
        organization_id,
        is_active,
        organizations!inner (
          id,
          slug,
          name
        ),
        roles!inner (
          id,
          name,
          permissions
        )
      `)
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()

    // Get user profile data
    const { data: userData } = await client
      .from('users')
      .select('first_name, last_name, mfa_enabled')
      .eq('id', user.id)
      .single()

    const org = userOrg?.organizations as { id: string; slug: string; name: string } | undefined
    const role = userOrg?.roles as { id: string; name: string; permissions: string[] } | undefined

    return {
      user: {
        id: user.id,
        email: user.email || '',
        name: userData ? `${userData.first_name || ''} ${userData.last_name || ''}`.trim() : undefined,
        organizationId: org?.id,
        organizationSlug: org?.slug,
        role: role?.name,
        permissions: role?.permissions || [],
        mfaRequired: userData?.mfa_enabled
      }
    }
  } catch (error) {
    logger.error('Auth error:', error)
    return null
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithCredentials(
  email: string,
  password: string,
  organizationSlug?: string
): Promise<{ user: AuthUser | null; error: string | null }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return { user: null, error: error.message }
    }

    if (!data.user) {
      return { user: null, error: 'Authentication failed' }
    }

    // If organization slug provided, verify user belongs to it
    if (organizationSlug) {
      const { data: org } = await supabase
        .from('organizations')
        .select('id')
        .eq('slug', organizationSlug)
        .single()

      if (org) {
        const { data: userOrg } = await supabase
          .from('user_organizations')
          .select('is_active')
          .eq('user_id', data.user.id)
          .eq('organization_id', org.id)
          .single()

        if (!userOrg?.is_active) {
          await supabase.auth.signOut()
          return { user: null, error: 'User not authorized for this organization' }
        }
      }
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email || ''
      },
      error: null
    }
  } catch (error) {
    return { user: null, error: 'Authentication failed' }
  }
}

/**
 * Sign in with OAuth provider
 */
export async function signInWithOAuth(provider: 'google' | 'github' | 'azure') {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
    }
  })

  return { data, error }
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}

/**
 * Sign up with email and password
 */
export async function signUp(
  email: string,
  password: string,
  metadata?: { firstName?: string; lastName?: string }
): Promise<{ user: AuthUser | null; error: string | null }> {
  // Validate password strength
  const validation = validatePasswordStrength(password)
  if (!validation.isValid) {
    return { user: null, error: validation.errors.join(', ') }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: metadata?.firstName,
        last_name: metadata?.lastName
      }
    }
  })

  if (error) {
    return { user: null, error: error.message }
  }

  if (!data.user) {
    return { user: null, error: 'Sign up failed' }
  }

  return {
    user: {
      id: data.user.id,
      email: data.user.email || ''
    },
    error: null
  }
}

/**
 * Send magic link email
 */
export async function sendMagicLink(email: string): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
    }
  })

  return { error: error?.message || null }
}

/**
 * Reset password
 */
export async function resetPassword(email: string): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`
  })

  return { error: error?.message || null }
}

/**
 * Update password
 */
export async function updatePassword(newPassword: string): Promise<{ error: string | null }> {
  const validation = validatePasswordStrength(newPassword)
  if (!validation.isValid) {
    return { error: validation.errors.join(', ') }
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword
  })

  return { error: error?.message || null }
}

