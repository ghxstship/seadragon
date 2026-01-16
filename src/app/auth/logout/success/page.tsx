
import { Metadata } from 'next'
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Signed Out | ATLVS + GVTEWAY',
  description: 'You have been successfully signed out of your ATLVS + GVTEWAY account.',
}

export default function LogoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl"></span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Signed Out Successfully</h1>
          <p className="text-neutral-600">You have been signed out of your account</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <div className="text-center">
            <p className="text-neutral-600 mb-6">
              Thank you for using ATLVS + GVTEWAY. You have been securely signed out of your account.
            </p>

            <div className="space-y-4">
              <Button asChild className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
                <Link href="/auth/login">
                  Sign In Again
                </Link>
              </Button>

              <Link href="/" className="block w-full bg-background text-neutral-700 border border-neutral-300 py-2 px-4 rounded-md hover:bg-gray-50">
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-neutral-900 mb-2">Security Tips</h3>
          <ul className="text-sm text-neutral-600 space-y-1">
            <li>• Always sign out when using shared devices</li>
            <li>• Clear your browser cache for extra security</li>
            <li>• Use strong, unique passwords</li>
            <li>• Enable two-factor authentication</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
