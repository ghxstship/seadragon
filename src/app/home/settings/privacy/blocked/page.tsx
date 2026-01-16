
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: 'Blocked Users | ATLVS + GVTEWAY',
  description: 'Manage your list of blocked users and control who can interact with you.',
}

export default function HomeSettingsPrivacyBlockedPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Blocked Users</h1>
          <p className="text-neutral-600">Manage users you've blocked from interacting with you</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Currently Blocked</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-neutral-600 font-semibold">XX</span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">User Removed</h3>
                  <p className="text-sm text-neutral-600">This user account has been deleted</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-neutral-500">Blocked Feb 2024</span>
                <Button className="text-accent-secondary hover:text-blue-800 text-sm">
                  Unblock
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-semantic-error/10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-semantic-error font-semibold">SP</span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Spam Account</h3>
                  <p className="text-sm text-neutral-600">Blocked for sending unwanted messages</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-neutral-500">Blocked Jan 2024</span>
                <Button className="text-accent-secondary hover:text-blue-800 text-sm">
                  Unblock
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-semantic-warning/10 rounded-full flex items-center justify-center mr-4">
                  <span className="text-semantic-warning font-semibold">HU</span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Harassment User</h3>
                  <p className="text-sm text-neutral-600">Blocked for inappropriate behavior</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-neutral-500">Blocked Dec 2023</span>
                <Button className="text-accent-secondary hover:text-blue-800 text-sm">
                  Unblock
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium text-neutral-900 mb-2">What happens when you block someone?</h3>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>• They can't send you messages or connection requests</li>
              <li>• They can't see your posts or profile</li>
              <li>• They won't see your activity in mutual groups</li>
              <li>• Existing connections are removed</li>
              <li>• You won't see their content or notifications</li>
            </ul>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Block a User</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Search for a user to block
              </label>
              <div className="flex space-x-2">
                <Input
                  type="text"
                  placeholder="Enter username or email"
                  className="flex-1 px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
                <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
                  Search
                </Button>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-start">
                <div className="w-5 h-5 bg-semantic-warning rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-primary-foreground text-xs">!</span>
                </div>
                <div>
                  <h3 className="font-medium text-yellow-900 mb-1">Important Note</h3>
                  <p className="text-sm text-yellow-800">
                    Blocking should only be used for users who violate our community guidelines or make you feel uncomfortable.
                    Consider reporting abusive behavior to our moderation team instead of just blocking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Additional Privacy Controls</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Message Filtering</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <Input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-sm">Block messages from non-connections</span>
                </label>
                <label className="flex items-center">
                  <Input type="checkbox" className="mr-3" />
                  <span className="text-sm">Filter spam and suspicious messages</span>
                </label>
                <label className="flex items-center">
                  <Input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-sm">Hide read receipts</span>
                </label>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Content Visibility</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <Input type="checkbox" className="mr-3" />
                  <span className="text-sm">Hide my posts from search engines</span>
                </label>
                <label className="flex items-center">
                  <Input type="checkbox" className="mr-3" />
                  <span className="text-sm">Limit profile visibility to connections only</span>
                </label>
                <label className="flex items-center">
                  <Input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-sm">Don't show when I'm online</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Button className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-lg hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Save Privacy Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
