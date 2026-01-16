
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Check Your Email | ATLVS + GVTEWAY',
  description: "We've sent you a verification link. Please check your email to complete your account setup.",
}

export default function VerifyEmailSentPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl"></span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Check Your Email</h1>
          <p className="text-neutral-600">We&apos;ve sent you a verification link</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <div className="text-center">
            <p className="text-neutral-600 mb-6">
              We sent a verification link to your email address. Click the link in the email to verify your account and complete your registration.
            </p>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Didn&apos;t receive the email?</strong><br/>
                Check your spam folder, or click below to resend.
              </p>
            </div>

            <Button className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 mb-4">
              Resend Verification Email
            </Button>

            <Button className="w-full bg-background text-accent-secondary border border-blue-600 py-2 px-4 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Change Email Address
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-neutral-900 mb-2">What happens next?</h3>
          <ol className="text-sm text-neutral-600 space-y-1">
            <li>1. Open your email inbox</li>
            <li>2. Find the email from ATLVS + GVTEWAY</li>
            <li>3. Click the verification link</li>
            <li>4. You&apos;ll be automatically signed in</li>
          </ol>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-neutral-600">
            Already verified?{' '}
            <a href="/auth/login" className="text-accent-secondary hover:text-blue-800">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
