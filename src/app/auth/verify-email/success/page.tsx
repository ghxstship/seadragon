
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Email Verified | ATLVS + GVTEWAY',
  description: 'Your email has been successfully verified. Welcome to ATLVS + GVTEWAY!',
}

export default function VerifyEmailSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl"></span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Email Verified!</h1>
          <p className="text-neutral-600">Your account is now active</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <div className="text-center">
            <p className="text-neutral-600 mb-6">
              Thank you for verifying your email address. Your account is now fully activated and you can start exploring ATLVS + GVTEWAY.
            </p>

            <div className="space-y-4">
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-green-900 mb-2">What&apos;s next?</h3>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Complete your profile</li>
                  <li>• Explore destinations</li>
                  <li>• Book your first experience</li>
                  <li>• Connect with the community</li>
                </ul>
              </div>

              <Button className="w-full bg-semantic-success text-primary-foreground py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-semantic-success focus:ring-offset-2">
                Continue to Dashboard
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-neutral-900 mb-2">Need help getting started?</h3>
          <p className="text-sm text-neutral-600 mb-3">
            Check out our guides and tutorials to make the most of your new account.
          </p>
          <div className="flex gap-2">
            <a href="/support/guides" className="text-accent-secondary hover:text-blue-800 text-sm">
              View Guides →
            </a>
            <a href="/support/tutorials" className="text-accent-secondary hover:text-blue-800 text-sm">
              Watch Tutorials →
            </a>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-neutral-600">
            Questions?{' '}
            <a href="/contact/support" className="text-accent-secondary hover:text-blue-800">
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
