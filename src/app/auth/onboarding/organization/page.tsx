
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: 'Organization Setup | ATLVS + GVTEWAY',
  description: 'Set up or join an organization to collaborate with your team on ATLVS + GVTEWAY.',
}

export default function OnboardingOrganizationPage() {
  return (
    <div className="min-h-screen bg-transparent text-[--text-primary]">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-[--color-accent-primary]/15 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl text-[--color-accent-primary]">ORG</span>
            </div>
            <h1 className="text-3xl heading-anton">Organization Setup</h1>
            <p className="text-[--text-secondary] body-share-tech">Work with your team or create a new organization</p>
          </div>

          <div className="space-y-4">
            <Link href="/auth/onboarding/organization/create" className="block">
              <div className="border border-[--border-default] bg-[--surface-default]/90 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur p-6 hover:-translate-y-0.5 transition">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-semantic-success/10 rounded-lg flex items-center justify-center mr-4 text-semantic-success">
                    <span className="text-2xl">+</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[--text-primary]">Create New Organization</h3>
                    <p className="text-[--text-secondary] body-share-tech">Start fresh with a new team workspace</p>
                  </div>
                </div>
                <ul className="text-sm text-[--text-secondary] body-share-tech space-y-1 ml-16">
                  <li>• Full admin control</li>
                  <li>• Custom branding</li>
                  <li>• Team management tools</li>
                </ul>
              </div>
            </Link>

            <Link href="/auth/onboarding/organization/join" className="block">
              <div className="border border-[--border-default] bg-[--surface-default]/90 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] backdrop-blur p-6 hover:-translate-y-0.5 transition">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-[--color-accent-primary]/10 rounded-lg flex items-center justify-center mr-4 text-[--color-accent-primary]">
                    <span className="text-2xl">→</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[--text-primary]">Join Existing Organization</h3>
                    <p className="text-[--text-secondary] body-share-tech">Connect with your current team</p>
                  </div>
                </div>
                <ul className="text-sm text-[--text-secondary] body-share-tech space-y-1 ml-16">
                  <li>• Use existing workspace</li>
                  <li>• Collaborate with colleagues</li>
                  <li>• Access shared resources</li>
                </ul>
              </div>
            </Link>

            <Button className="w-full h-11 rounded-full border-[--border-default] bg-[--surface-default] text-[--text-primary]">
              Skip for now - use personal account
            </Button>
          </div>

          <div className="border border-[--border-default] bg-[--surface-hover] rounded-2xl p-4">
            <h3 className="text-sm font-medium text-[--text-primary] mb-2 heading-anton">Organization Benefits</h3>
            <ul className="text-sm text-[--text-secondary] body-share-tech space-y-1">
              <li>• Centralized team management</li>
              <li>• Shared bookings and itineraries</li>
              <li>• Bulk discounts and enterprise pricing</li>
              <li>• Advanced analytics and reporting</li>
              <li>• Custom integrations and API access</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
