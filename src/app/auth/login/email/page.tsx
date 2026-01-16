
import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Header } from '@/lib/design-system'

export const metadata: Metadata = {
  title: 'Sign In | ATLVS + GVTEWAY',
  description: 'Sign in to your ATLVS + GVTEWAY account using email and password.',
}

export default function EmailLoginPage() {
  return (
    <div className="min-h-screen bg-transparent text-[--text-primary]">
      <Header/>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto space-y-6">
          <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur animate-fade-in">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-3xl leading-tight heading-anton">Welcome Back</CardTitle>
              <CardDescription className="text-[--text-secondary] body-share-tech">
                Sign in to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <form className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-[--text-secondary] body-share-tech">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    id="email"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-[--text-secondary] body-share-tech">
                    Password
                  </label>
                  <Input
                    type="password"
                    id="password"
                    required
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-[--text-secondary] body-share-tech">
                    <input
                      type="checkbox"
                      id="remember"
                      className="h-4 w-4 rounded border-[--border-default] text-[--color-accent-primary] focus:ring-[--color-accent-primary]"
                    />
                    Remember me
                  </label>
                  <Link href="/auth/forgot-password" className="text-[--color-accent-primary] hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 rounded-full bg-[--color-accent-primary] text-black shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5"
                >
                  Sign In
                </Button>
              </form>

              <div className="relative flex items-center justify-center">
                <span className="absolute inset-x-0 h-px bg-[--border-default]" />
                <span className="relative bg-[--surface-default] px-3 text-[11px] uppercase tracking-[0.18em] text-[--text-muted] body-share-tech">
                  or
                </span>
              </div>

              <div className="space-y-2">
                <Link
                  href="/auth/login/magic-link"
                  className="block w-full h-11 rounded-full border border-[--border-default] bg-white text-[--text-primary] shadow-[0_6px_18px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 text-center leading-[44px]"
                >
                  Send Magic Link
                </Link>
                <Link
                  href="/auth/login/sso"
                  className="block w-full h-11 rounded-full border border-[--border-default] bg-white text-[--text-primary] shadow-[0_6px_18px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 text-center leading-[44px]"
                >
                  Sign in with SSO
                </Link>
              </div>

              <div className="text-center text-sm text-[--text-secondary] space-y-1">
                <p>
                  Don&apos;t have an account?{' '}
                  <Link href="/auth/signup" className="text-[--color-accent-primary] hover:underline">
                    Sign up
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
