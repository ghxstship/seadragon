
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export const metadata: Metadata = {
  title: 'Join Organization | ATLVS + GVTEWAY',
  description: 'Join an existing organization workspace on ATLVS + GVTEWAY.',
}

export default function OnboardingOrganizationJoinPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl"></span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Join Organization</h1>
          <p className="text-neutral-600">Connect with your team workspace</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">How would you like to join?</h3>

              <div className="space-y-4">
                <div className="border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Input type="radio" name="joinMethod" id="invite" className="mr-3" defaultChecked />
                    <label htmlFor="invite" className="font-medium text-neutral-900">I have an invitation</label>
                  </div>
                  <p className="text-sm text-neutral-600 ml-6">Use an invitation link or code from your admin</p>
                  <div className="mt-3 ml-6">
                    <Input
                      type="text"
                      placeholder="Enter invitation code"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    />
                  </div>
                </div>

                <div className="border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Input type="radio" name="joinMethod" id="search" className="mr-3" />
                    <label htmlFor="search" className="font-medium text-neutral-900">Find my organization</label>
                  </div>
                  <p className="text-sm text-neutral-600 ml-6">Search for your company by name or domain</p>
                  <div className="mt-3 ml-6">
                    <Input
                      type="text"
                      placeholder="Organization name or email domain"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Continue
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-neutral-900 mb-2">Need help joining?</h3>
          <ul className="text-sm text-neutral-600 space-y-1">
            <li>• Ask your organization admin for an invitation</li>
            <li>• Check your email for pending invitations</li>
            <li>• Contact your IT department for assistance</li>
            <li>• Make sure you&apos;re using your work email address</li>
          </ul>
        </div>

        <div className="text-center">
          <p className="text-sm text-neutral-600">
            Don&apos;t have an organization yet?{' '}
            <Link href="/auth/onboarding/organization/create" className="text-accent-secondary hover:text-blue-800">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
