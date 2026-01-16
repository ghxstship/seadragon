'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function InviteClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-semantic-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl"></span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Invite Your Team</h1>
          <p className="text-neutral-600">Get your colleagues onboard</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <form className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Send Invitations</h3>

              <div className="space-y-3">
                {[1, 2].map((idx) => (
                  <div className="flex gap-2" key={idx}>
                    <Input
                      type="email"
                      placeholder={idx === 1 ? "colleague@company.com" : "another@company.com"}
                      className="flex-1 px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <Button
                      type="button"
                      className="px-3 py-2 bg-neutral-100 text-neutral-600 rounded-md hover:bg-neutral-200"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                className="mt-3 w-full py-2 text-semantic-warning border border-orange-600 rounded-md hover:bg-orange-50"
              >
                + Add Another Email
              </Button>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                Personal Message (Optional)
              </label>
              <Textarea
                id="message"
                rows={3}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Add a personal note to your invitation..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Invitation Settings
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <Input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-sm">Send welcome email</span>
                </label>
                <label className="flex items-center">
                  <Input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-sm">Require email verification</span>
                </label>
                <label className="flex items-center">
                  <Input type="checkbox" className="mr-3" />
                  <span className="text-sm">Auto-add to default projects</span>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-semantic-warning text-primary-foreground py-2 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              Send Invitations
            </Button>
          </form>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-neutral-900 mb-2">Bulk Import</h3>
          <p className="text-sm text-neutral-600 mb-3">
            Have a lot of team members? Import from CSV or connect your directory.
          </p>
          <div className="flex gap-2">
            <Button className="flex-1 py-2 px-3 bg-background border border-neutral-300 rounded text-sm hover:bg-gray-50">
              Upload CSV
            </Button>
            <Button className="flex-1 py-2 px-3 bg-background border border-neutral-300 rounded text-sm hover:bg-gray-50">
              Connect Directory
            </Button>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-neutral-600">
            Skip for now?{' '}
            <Button className="text-accent-secondary hover:text-blue-800">
              Continue to dashboard
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}
