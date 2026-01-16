
import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/lib/design-system'
import { CheckCircle, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Email Verified | ATLVS + GVTEWAY',
  description: 'Your email has been successfully verified. Welcome to ATLVS + GVTEWAY!',
}

export default function VerifyEmailSuccessPage() {
  return (
    <div className="min-h-screen bg-transparent text-[--text-primary]">
      <Header/>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto space-y-6">
          <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur animate-fade-in">
            <CardHeader className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-[--color-success-light] flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-8 w-8 text-[--color-success]" />
              </div>
              <CardTitle className="text-3xl leading-tight heading-anton">Email Verified!</CardTitle>
              <CardDescription className="text-[--text-secondary] body-share-tech">
                Your account is now active
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 text-center">
              <p className="text-[--text-secondary] body-share-tech">
                Thank you for verifying your email address. Your account is now fully activated and you can start exploring ATLVS + GVTEWAY.
              </p>

              <div className="bg-[--color-success-light] rounded-lg p-4 text-left space-y-2">
                <h3 className="text-sm font-medium text-[--text-primary] heading-anton">What&apos;s next?</h3>
                <ul className="text-sm text-[--text-secondary] body-share-tech space-y-1 list-disc list-inside">
                  <li>Complete your profile</li>
                  <li>Explore destinations</li>
                  <li>Book your first experience</li>
                  <li>Connect with the community</li>
                </ul>
              </div>

              <Button className="w-full h-11 rounded-full bg-[--color-accent-primary] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5">
                Continue to Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_8px_22px_rgba(0,0,0,0.07)] backdrop-blur animate-fade-in">
            <CardContent className="p-4 space-y-3">
              <h3 className="text-sm font-medium text-[--text-primary] heading-anton">Need help getting started?</h3>
              <p className="text-sm text-[--text-secondary] body-share-tech">
                Check out our guides and tutorials to make the most of your new account.
              </p>
              <div className="flex gap-3 text-sm">
                <Link href="/support/guides" className="text-[--color-accent-primary] hover:underline">View Guides →</Link>
                <Link href="/support/tutorials" className="text-[--color-accent-primary] hover:underline">Watch Tutorials →</Link>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-[--text-secondary] space-y-1">
            <p>
              Questions?{' '}
              <Link href="/contact/support" className="text-[--color-accent-primary] hover:underline inline-flex items-center gap-1">
                <ArrowLeft className="h-4 w-4"/>
                Contact Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
