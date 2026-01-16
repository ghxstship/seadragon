
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: 'Setup Authenticator App | ATLVS + GVTEWAY',
  description: 'Set up two-factor authentication using an authenticator app like Google Authenticator or Authy.',
}

export default function MFAAuthenticatorSetupPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl"></span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Setup Authenticator App</h1>
          <p className="text-neutral-600">Add an extra layer of security with TOTP</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Step 1: Install an Authenticator App</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 border border-neutral-200 rounded">
                  <div className="text-2xl mb-1"></div>
                  <p className="text-sm font-medium">Google Authenticator</p>
                </div>
                <div className="text-center p-3 border border-neutral-200 rounded">
                  <div className="text-2xl mb-1"></div>
                  <p className="text-sm font-medium">Authy</p>
                </div>
              </div>
              <p className="text-sm text-neutral-600 mt-3">
                Download from your app store if you haven&apos;t already
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Step 2: Scan QR Code</h3>
              <div className="bg-neutral-100 rounded-lg p-6 text-center">
                <div className="w-32 h-32 bg-background border-2 border-neutral-300 rounded mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl"></span>
                </div>
                <p className="text-sm text-neutral-600 mb-2">Scan this QR code with your authenticator app</p>
                <Button className="text-accent-secondary hover:text-blue-800 text-sm">
                  Can&apos;t scan? Enter code manually
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Step 3: Enter Verification Code</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    6-digit code from your app
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Input
                        key={i}
                        type="text"
                        maxLength={1}
                        className="w-10 h-10 text-center border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semantic-success text-lg font-semibold"
                        required/>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-semantic-success text-primary-foreground py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-semantic-success focus:ring-offset-2">
                  Enable Authenticator
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-neutral-900 mb-2">Why use an authenticator app?</h3>
          <ul className="text-sm text-neutral-600 space-y-1">
            <li>• Generates codes even without internet</li>
            <li>• More secure than SMS codes</li>
            <li>• Works on multiple devices</li>
            <li>• Backup and recovery options</li>
          </ul>
        </div>

        <div className="text-center">
          <p className="text-sm text-neutral-600">
            Prefer SMS instead?{' '}
            <a href="/auth/mfa/setup/sms" className="text-accent-secondary hover:text-blue-800">
              Set up SMS verification
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
