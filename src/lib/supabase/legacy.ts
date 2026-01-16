
/**
 * Legacy Supabase Client
 * Maintained for backward compatibility with existing code
 * Prefer using createBrowserClient() or createServerClient() for new code
 */
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
