
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Revoke Session | ATLVS + GVTEWAY',
  description: 'Revoke access for a specific session or device from your ATLVS + GVTEWAY account.',
}

export default function RevokeSessionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-semantic-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl"></span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Revoke Session</h1>
          <p className="text-neutral-600">Sign out of this device or session</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-neutral-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl"></span>
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">Safari on iPhone</h3>
            <p className="text-neutral-600 mb-4">New York, NY • Last active 2 hours ago</p>
          </div>

          <div className="bg-red-50 rounded-lg p-4 mb-6">
            <h4 className="text-sm font-medium text-red-900 mb-2">Are you sure?</h4>
            <p className="text-sm text-red-800">
              This will immediately sign out the device from your account.
              The user will need to sign in again to access ATLVS + GVTEWAY.
            </p>
          </div>

          <div className="space-y-4">
            <Button className="w-full bg-semantic-error text-primary-foreground py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-semantic-error focus:ring-offset-2">
              Revoke This Session
            </Button>

            <Button className="w-full bg-background text-neutral-700 border border-neutral-300 py-2 px-4 rounded-md hover:bg-gray-50">
              Cancel
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-neutral-900 mb-2">Why revoke sessions?</h3>
          <ul className="text-sm text-neutral-600 space-y-1">
            <li>• Protect your account if a device is lost or stolen</li>
            <li>• Sign out of shared or public computers</li>
            <li>• Remove access from old or unused devices</li>
            <li>• Maintain account security and privacy</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
