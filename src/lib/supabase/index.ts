
/**
 * Supabase Client Exports
 * Centralized exports for Supabase clients
 */

// Re-export the legacy client for backward compatibility
export { supabase } from './legacy'

// Export client creators
export { createClient as createBrowserClient } from './client'
export { createClient as createServerClient } from './server'
export { updateSession } from './middleware'
