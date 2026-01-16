
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Header } from '@/lib/design-system'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Enter Code | ATLVS + GVTEWAY',
  description: 'Enter the verification code sent to your phone to complete phone verification.',
}

export default function VerifyPhoneSentPage() {
  return (
    <div className="min-h-screen bg-transparent text-[--text-primary]">
      <Header />

      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex w-16 h-16 bg-[--color-accent-primary]/15 rounded-full items-center justify-center mx-auto">
              <span className="text-2xl text-[--color-accent-primary]">●</span>
            </div>
            <h1 className="text-4xl heading-anton">Enter Verification Code</h1>
            <p className="text-[--text-secondary] body-share-tech">We sent a 6-digit code to your phone</p>
          </div>

          <Card className="border border-[--border-default] bg-[--surface-default]/90 shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="heading-anton text-2xl">Verify your phone</CardTitle>
              <CardDescription className="text-[--text-secondary] body-share-tech">Enter the code below to continue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-sm text-[--text-secondary] body-share-tech">
                    Verification Code
                  </label>
                  <div className="flex gap-3 justify-center">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Input
                        key={i}
                        type="text"
                        maxLength={1}
                        className="w-12 h-12 text-center text-lg font-semibold border-[--border-default]"
                        required
                      />
                    ))}
                  </div>
                  <p className="text-xs text-[--text-muted] body-share-tech text-center">Enter the 6-digit code sent to your phone</p>
                </div>

                <Button type="submit" className="w-full h-11 rounded-full bg-[--color-accent-primary] text-white shadow-[0_10px_24px_rgba(0,0,0,0.16)] transition hover:-translate-y-0.5">
                  Verify Phone Number
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border border-[--border-default] bg-[--surface-default]/80 shadow-[0_8px_22px_rgba(0,0,0,0.07)] backdrop-blur">
            <CardHeader>
              <CardTitle className="heading-anton text-xl">Didn&apos;t receive the code?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-[--text-secondary] body-share-tech space-y-2">
                <li>• Wait a few minutes for delivery</li>
                <li>• Check your spam/junk folder</li>
                <li>• Ensure your phone number is correct</li>
                <li>• <Button variant="link" className="p-0 text-[--color-accent-primary]">Resend code</Button> (available in 30 seconds)</li>
              </ul>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-sm text-[--text-secondary] body-share-tech">
              Wrong number?{' '}
              <Link href="/auth/verify-phone" className="text-[--color-accent-primary] hover:underline">
                Change phone number
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
