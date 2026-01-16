
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Accept Invitation | ATLVS + GVTEWAY',
  description: 'Accept your invitation to join an organization on ATLVS + GVTEWAY.',
}

export default function OnboardingInviteAcceptPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl"></span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">You&apos;re Invited!</h1>
          <p className="text-neutral-600">Join your team on ATLVS + GVTEWAY</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl"></span>
            </div>
            <h3 className="text-lg font-semibold text-neutral-900 mb-2">Organization Name</h3>
            <p className="text-neutral-600 mb-4">Invited by: John Doe (Admin)</p>
            <p className="text-sm text-neutral-500">
              &quot;Welcome to our travel planning team! We&apos;re excited to have you join us.&quot;
            </p>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-neutral-900 mb-2">What you&apos;ll get:</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Access to team travel planning</li>
                <li>• Shared itineraries and bookings</li>
                <li>• Company travel policies</li>
                <li>• Team communication tools</li>
              </ul>
            </div>

            <Button className="w-full bg-semantic-success text-primary-foreground py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-semantic-success focus:ring-offset-2">
              Accept Invitation
            </Button>

            <Button className="w-full bg-background text-neutral-700 border border-neutral-300 py-2 px-4 rounded-md hover:bg-gray-50">
              Decline Invitation
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-neutral-900 mb-2">Privacy & Permissions</h3>
          <p className="text-sm text-neutral-600">
            By accepting this invitation, you&apos;ll be added to the organization workspace.
            Your personal data will be shared according to the organization&apos;s privacy settings.
          </p>
        </div>
      </div>
    </div>
  )
}
