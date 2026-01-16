
import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Header } from '@/lib/design-system'

export const metadata: Metadata = {
  title: 'Magic Link Sign In | ATLVS + GVTEWAY',
  description: 'Sign in to your ATLVS + GVTEWAY account using a magic link sent to your email.',
}

export default function MagicLinkLoginPage() {
  return (
    <div className="min-h-screen bg-transparent text-[--text-primary]">
      <Header/>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto space-y-6">
          <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur animate-fade-in">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-3xl leading-tight heading-anton">Magic Link Login</CardTitle>
              <CardDescription className="text-[--text-secondary] body-share-tech">
                Get instant access with a secure link
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
                    placeholder="Enter your email"
                    required
                  />
                  <p className="text-xs text-[--text-muted] body-share-tech">
                    We&apos;ll send you a secure link to sign in instantly
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 rounded-full bg-[--color-accent-primary] text-black shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5"
                >
                  Send Magic Link
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
                  href="/auth/login/email"
                  className="block w-full h-11 rounded-full border border-[--border-default] bg-white text-[--text-primary] shadow-[0_6px_18px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 text-center leading-[44px]"
                >
                  Sign in with Password
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

          <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_8px_22px_rgba(0,0,0,0.07)] backdrop-blur animate-fade-in">
            <CardContent className="p-4 space-y-2">
              <h3 className="text-sm font-medium text-[--text-primary] heading-anton">How it works</h3>
              <ol className="text-sm text-[--text-secondary] body-share-tech space-y-1 list-decimal list-inside">
                <li>Enter your email address</li>
                <li>Check your email for a secure link</li>
                <li>Click the link to sign in instantly</li>
                <li>No passwords to remember!</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
