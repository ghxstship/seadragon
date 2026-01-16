
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Organization Setup | ATLVS + GVTEWAY',
  description: 'Set up or join an organization to collaborate with your team on ATLVS + GVTEWAY.',
}

export default function OnboardingOrganizationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl"></span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Organization Setup</h1>
          <p className="text-neutral-600">Work with your team or create a new organization</p>
        </div>

        <div className="space-y-4 mb-6">
          <a href="/auth/onboarding/organization/create" className="block">
            <div className="bg-background rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-semantic-success/10 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl"></span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">Create New Organization</h3>
                  <p className="text-neutral-600">Start fresh with a new team workspace</p>
                </div>
              </div>
              <ul className="text-sm text-neutral-600 space-y-1 ml-16">
                <li>• Full admin control</li>
                <li>• Custom branding</li>
                <li>• Team management tools</li>
              </ul>
            </div>
          </a>

          <a href="/auth/onboarding/organization/join" className="block">
            <div className="bg-background rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-accent-primary/10 rounded-lg flex items-center justify-center mr-4">
                  <span className="text-2xl"></span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">Join Existing Organization</h3>
                  <p className="text-neutral-600">Connect with your current team</p>
                </div>
              </div>
              <ul className="text-sm text-neutral-600 space-y-1 ml-16">
                <li>• Use existing workspace</li>
                <li>• Collaborate with colleagues</li>
                <li>• Access shared resources</li>
              </ul>
            </div>
          </a>

          <Button className="w-full bg-background text-neutral-700 border border-neutral-300 py-3 px-4 rounded-md hover:bg-gray-50">
            Skip for now - use personal account
          </Button>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-neutral-900 mb-2">Organization Benefits</h3>
          <ul className="text-sm text-neutral-600 space-y-1">
            <li>• Centralized team management</li>
            <li>• Shared bookings and itineraries</li>
            <li>• Bulk discounts and enterprise pricing</li>
            <li>• Advanced analytics and reporting</li>
            <li>• Custom integrations and API access</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
