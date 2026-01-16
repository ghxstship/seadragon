'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/lib/design-system'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [organizationSlug, setOrganizationSlug] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleOAuthSignIn = async (provider: 'google' | 'azure') => {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) {
        setError(error.message)
      }
    } catch {
      setError('OAuth sign in failed. Please try again.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const supabase = createClient()
      
      // Sign in with Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message || 'Invalid credentials')
        return
      }

      if (data.user) {
        // Fetch user profile to check role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        const role = profile?.role || 'user'
        
        if (role === 'platform_dev' || role === 'super_admin' || role === 'admin' || role === 'team') {
          router.push('/dashboard')
        } else {
          router.push('/home')
        }
        router.refresh()
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-transparent text-[--text-primary]">
      {/* Header */}
      <Header/>

      {/* Login Form */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-3xl leading-tight" style={{ fontFamily: 'Anton, var(--font-sans)' }}>Welcome Back</CardTitle>
              <CardDescription className="text-[--text-secondary]" style={{ fontFamily: 'Share Tech, sans-serif' }}>
                Sign in to your ATLVS + GVTEWAY account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Organization Slug */}
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    type="text"
                    placeholder="your-organization"
                    value={organizationSlug}
                    onChange={(e) => setOrganizationSlug(e.target.value)}
                    required/>
                  <p className="text-xs text-muted-foreground">
                    Enter your organization slug (the part before .{searchParams.get('domain') || 'platform.com'})
                  </p>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required/>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required/>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4"/>
                      ) : (
                        <Eye className="h-4 w-4"/>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center space-x-2 text-sm text-destructive bg-destructive/10 p-3 rounded">
                    <AlertCircle className="h-4 w-4"/>
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <Button type="submit" className="w-full h-11 rounded-full bg-[--color-accent-primary] text-black shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              {/* Alternative Sign In Options */}
              <div className="space-y-5">
                <div className="relative flex items-center justify-center">
                  <span className="absolute inset-x-0 h-px bg-[--border-default]" />
                  <span className="relative bg-[--surface-default] px-3 text-[11px] uppercase tracking-[0.18em] text-[--text-muted]" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                    Or continue with
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full h-11 rounded-xl border border-[--border-default] bg-white text-neutral-900 shadow-[0_6px_18px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5" onClick={() => handleOAuthSignIn('google')}>
                    <svg className="w-4 h-4 mr-2 text-neutral-700" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" className="w-full h-11 rounded-xl border border-[--border-default] bg-white text-neutral-900 shadow-[0_6px_18px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5" onClick={() => handleOAuthSignIn('azure')}>
                    <svg className="w-4 h-4 mr-2 text-neutral-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.75.098.118.112.221.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.747-1.378 0 0-.599 2.282-.744 2.84-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001.012.017z"/>
                    </svg>
                    Microsoft
                  </Button>
                </div>

                <Button variant="ghost" className="w-full text-sm text-[--text-primary]" asChild>
                  <Link href="/auth/login/magic-link">
                    Send me a magic link instead
                  </Link>
                </Button>
              </div>

              {/* Links */}
              <div className="text-center space-y-2">
                <Link
                  href="/auth/forgot-password"
                  className="text-sm text-[--color-accent-primary] hover:underline"
                >
                  Forgot your password?
                </Link>
                <div className="text-sm text-muted-foreground">
                  Don&apos;t have an account?{' '}
                  <Link href="/auth/signup" className="text-[--color-accent-primary] hover:underline">
                    Sign up
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Credentials */}
          <Card className="mt-6 border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2" style={{ fontFamily: 'Share Tech, sans-serif' }}>
                <Badge variant="secondary">Demo</Badge>
                Test Credentials
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <div><strong>Organization:</strong> demo</div>
              <div><strong>Email:</strong> admin@demo.com</div>
              <div><strong>Password:</strong> demo123</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LoginForm />
    </Suspense>
  )
}
