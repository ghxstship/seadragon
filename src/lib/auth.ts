
/**
 * Authentication Module
 * Uses Supabase Auth
 */
export {
  auth,
  signOut,
  signInWithCredentials,
  signInWithOAuth,
  signUp,
  sendMagicLink,
  resetPassword,
  updatePassword,
  validatePasswordStrength,
  type AuthUser,
  type Session
} from '@/lib/supabase/auth'

export { signIn } from '@/lib/supabase/client-auth'

// Legacy handlers export for compatibility (no-op since Supabase handles routes)
export const handlers = {
  GET: async () => new Response('Use Supabase Auth', { status: 200 }),
  POST: async () => new Response('Use Supabase Auth', { status: 200 })
}
