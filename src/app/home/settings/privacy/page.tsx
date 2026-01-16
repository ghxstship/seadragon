
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: 'Privacy Settings | ATLVS + GVTEWAY',
  description: 'Control your privacy settings, data sharing preferences, and visibility options.',
}

export default function HomeSettingsPrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Privacy Settings</h1>
          <p className="text-neutral-600">Manage how your information is shared and who can see it</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Profile Visibility</h2>
            <div className="space-y-4">
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Input type="radio" name="visibility" id="public" className="mr-3" defaultChecked />
                  <label htmlFor="public" className="font-medium text-neutral-900">Public</label>
                </div>
                <p className="text-sm text-neutral-600 ml-6">Anyone can see your profile, posts, and activity</p>
              </div>

              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Input type="radio" name="visibility" id="connections" className="mr-3" />
                  <label htmlFor="connections" className="font-medium text-neutral-900">Connections Only</label>
                </div>
                <p className="text-sm text-neutral-600 ml-6">Only people you're connected with can see your profile</p>
              </div>

              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Input type="radio" name="visibility" id="private" className="mr-3" />
                  <label htmlFor="private" className="font-medium text-neutral-900">Private</label>
                </div>
                <p className="text-sm text-neutral-600 ml-6">Your profile is hidden from search and public view</p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Data Sharing</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Analytics & Improvements</label>
                  <p className="text-sm text-neutral-600">Help us improve by sharing anonymous usage data</p>
                </div>
                <Input type="checkbox" defaultChecked className="ml-3" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Personalized Recommendations</label>
                  <p className="text-sm text-neutral-600">Use your data to suggest relevant experiences</p>
                </div>
                <Input type="checkbox" defaultChecked className="ml-3" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Marketing Communications</label>
                  <p className="text-sm text-neutral-600">Receive updates about new features and travel deals</p>
                </div>
                <Input type="checkbox" className="ml-3" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Third-Party Sharing</label>
                  <p className="text-sm text-neutral-600">Allow sharing with trusted partners</p>
                </div>
                <Input type="checkbox" className="ml-3" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Communication Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Receive Messages from Connections</label>
                  <p className="text-sm text-neutral-600">Allow direct messages from people you're connected with</p>
                </div>
                <Input type="checkbox" defaultChecked className="ml-3" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Allow Connection Requests</label>
                  <p className="text-sm text-neutral-600">Let others send you connection requests</p>
                </div>
                <Input type="checkbox" defaultChecked className="ml-3" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Show Online Status</label>
                  <p className="text-sm text-neutral-600">Let others see when you're active</p>
                </div>
                <Input type="checkbox" defaultChecked className="ml-3" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-neutral-700">Read Receipts</label>
                  <p className="text-sm text-neutral-600">Show when you've read messages</p>
                </div>
                <Input type="checkbox" className="ml-3" />
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Blocked Users</h2>
            <div className="space-y-4">
              <p className="text-sm text-neutral-600">
                You haven't blocked any users yet. Blocked users won't be able to contact you or view your profile.
              </p>

              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-4 text-center">
                <div className="text-4xl text-neutral-400 mb-2"></div>
                <p className="text-neutral-600 mb-1">No blocked users</p>
                <p className="text-sm text-neutral-500">Users you block will appear here</p>
              </div>

              <div className="text-center">
                <Button className="text-accent-secondary hover:text-blue-800 text-sm">
                  Manage Blocked Users
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Data Management</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-neutral-200 rounded-lg">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Download My Data</h3>
              <p className="text-sm text-neutral-600 mb-3">Get a copy of all your data</p>
              <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-accent-tertiary">
                Request Export
              </Button>
            </div>

            <div className="text-center p-4 border border-neutral-200 rounded-lg">
              <div className="w-12 h-12 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Data Portability</h3>
              <p className="text-sm text-neutral-600 mb-3">Transfer your data to another service</p>
              <Button className="bg-semantic-success text-primary-foreground px-4 py-2 rounded text-sm hover:bg-green-700">
                Transfer Data
              </Button>
            </div>

            <div className="text-center p-4 border border-red-200 rounded-lg">
              <div className="w-12 h-12 bg-semantic-error/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">️</span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Delete My Data</h3>
              <p className="text-sm text-neutral-600 mb-3">Permanently delete your account</p>
              <Button className="bg-semantic-error text-primary-foreground px-4 py-2 rounded text-sm hover:bg-red-700">
                Delete Account
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Privacy Commitment</h2>
          <p className="text-neutral-600 mb-4">
            We are committed to protecting your privacy and giving you control over your data.
            Your privacy settings are always respected across all our services.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="/legal/privacy" className="text-accent-secondary hover:text-blue-800">
              Privacy Policy →
            </a>
            <a href="/legal/terms" className="text-accent-secondary hover:text-blue-800">
              Terms of Service →
            </a>
            <a href="/support/privacy" className="text-accent-secondary hover:text-blue-800">
              Privacy Support →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
