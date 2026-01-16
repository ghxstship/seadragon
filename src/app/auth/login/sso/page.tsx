
import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Header } from '@/lib/design-system'

export const metadata: Metadata = {
  title: 'SSO Sign In | ATLVS + GVTEWAY',
  description: "Sign in to your ATLVS + GVTEWAY account using your organization's SSO provider.",
}

export default function SSOLoginPage() {
  return (
    <div className="min-h-screen bg-transparent text-[--text-primary]">
      <Header/>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto space-y-6">
          <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur animate-fade-in">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-3xl leading-tight heading-anton">Enterprise Sign In</CardTitle>
              <CardDescription className="text-[--text-secondary] body-share-tech">
                Sign in with your organization&apos;s SSO
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <form className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-[--text-secondary] body-share-tech">
                    Work Email Address
                  </label>
                  <Input
                    type="email"
                    id="email"
                    placeholder="name@company.com"
                    required
                  />
                  <p className="text-xs text-[--text-muted] body-share-tech">
                    Enter your work email to find your SSO provider
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 rounded-full bg-[--color-accent-primary] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5"
                >
                  Continue with SSO
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
                  Sign in with Email
                </Link>
                <Link
                  href="/auth/login/magic-link"
                  className="block w-full h-11 rounded-full border border-[--border-default] bg-white text-[--text-primary] shadow-[0_6px_18px_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 text-center leading-[44px]"
                >
                  Use Magic Link
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
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="text-sm font-medium text-[--text-primary] heading-anton">Popular SSO Providers</h3>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {['Google Workspace', 'Microsoft Azure AD', 'Okta', 'OneLogin'].map((provider) => (
                    <Button
                      key={provider}
                      variant="outline"
                      className="h-10 rounded-xl border border-[--border-default] bg-white text-[--text-primary] shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition text-sm"
                    >
                      {provider}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[--border-default] space-y-2">
                <h4 className="text-sm font-medium text-[--text-primary] heading-anton">SSO Benefits</h4>
                <ul className="text-sm text-[--text-secondary] body-share-tech space-y-1 list-disc list-inside">
                  <li>Single sign-on across all platforms</li>
                  <li>Enhanced security with enterprise controls</li>
                  <li>Automatic account provisioning</li>
                  <li>Centralized user management</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
