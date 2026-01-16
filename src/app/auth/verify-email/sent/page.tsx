
import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/lib/design-system'
import { ArrowLeft, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Check Your Email | ATLVS + GVTEWAY',
  description: "We've sent you a verification link. Please check your email to complete your account setup.",
}

export default function VerifyEmailSentPage() {
  return (
    <div className="min-h-screen bg-transparent text-[--text-primary]">
      <Header/>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto space-y-6">
          <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur animate-fade-in">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-3xl leading-tight heading-anton">Check Your Email</CardTitle>
              <CardDescription className="text-[--text-secondary] body-share-tech">
                We&apos;ve sent you a verification link
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 text-center">
              <div className="w-16 h-16 rounded-full bg-[--color-success-light] flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-[--color-success]" />
              </div>

              <p className="text-[--text-secondary] body-share-tech">
                We sent a verification link to your email address. Click the link in the email to verify your account and complete your registration.
              </p>

              <div className="bg-[--color-info-light] rounded-lg p-4 text-left space-y-1">
                <p className="text-sm text-[--text-primary] font-medium heading-anton">Didn&apos;t receive the email?</p>
                <p className="text-sm text-[--text-secondary] body-share-tech">
                  Check your spam folder, or click below to resend.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <Button className="h-11 rounded-full bg-[--color-accent-primary] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5">
                  Resend Verification Email
                </Button>
                <Button variant="outline" className="h-11 rounded-full border-[--border-default] bg-white text-[--text-primary]">
                  Change Email Address
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_8px_22px_rgba(0,0,0,0.07)] backdrop-blur animate-fade-in">
            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-medium text-[--text-primary] heading-anton">What happens next?</h3>
              <ol className="text-sm text-[--text-secondary] body-share-tech space-y-1 list-decimal list-inside">
                <li>Open your email inbox</li>
                <li>Find the email from ATLVS + GVTEWAY</li>
                <li>Click the verification link</li>
                <li>You&apos;ll be automatically signed in</li>
              </ol>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-[--text-secondary] space-y-1">
            <p>
              Already verified?{' '}
              <Link href="/auth/login" className="text-[--color-accent-primary] hover:underline inline-flex items-center gap-1">
                <ArrowLeft className="h-4 w-4"/>
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
