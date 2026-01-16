
/**
 * Client-side auth helpers for Supabase
 */
import { createClient } from './client'

/**
 * Sign in (client-side)
 */
export async function signIn(provider: 'credentials' | 'google' | 'github' | 'azure', options?: {
  email?: string
  password?: string
  redirectTo?: string
}) {
  const supabase = createClient()

  if (provider === 'credentials') {
    if (!options?.email || !options?.password) {
      throw new Error('Email and password required')
    }
    return supabase.auth.signInWithPassword({
      email: options.email,
      password: options.password
    })
  }

  return supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: options?.redirectTo || `${window.location.origin}/auth/callback`
    }
  })
}

/**
 * Sign out (client-side)
 */
export async function signOut() {
  const supabase = createClient()
  return supabase.auth.signOut()
}

/**
 * Get current session (client-side)
 */
export async function getSession() {
  const supabase = createClient()
  return supabase.auth.getSession()
}

/**
 * Get current user (client-side)
 */
export async function getUser() {
  const supabase = createClient()
  return supabase.auth.getUser()
}
