
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: 'Privacy Settings | ATLVS + GVTEWAY',
  description: 'Configure your privacy and data sharing preferences for ATLVS + GVTEWAY.',
}

export default function OnboardingPreferencesPrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl"></span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Privacy Settings</h1>
          <p className="text-neutral-600">Control your data and privacy preferences</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <form className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Profile Visibility</h3>

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
                  <p className="text-sm text-neutral-600 ml-6">Only your connections can see your full profile</p>
                </div>

                <div className="border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Input type="radio" name="visibility" id="private" className="mr-3" />
                    <label htmlFor="private" className="font-medium text-neutral-900">Private</label>
                  </div>
                  <p className="text-sm text-neutral-600 ml-6">Profile is hidden, only basic info visible</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Data Sharing</h3>

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
                    <label className="text-sm font-medium text-neutral-700">Location Services</label>
                    <p className="text-sm text-neutral-600">Access location for better local recommendations</p>
                  </div>
                  <Input type="checkbox" className="ml-3" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Communication Preferences</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Receive Messages from Connections</label>
                    <p className="text-sm text-neutral-600">Allow direct messages from people you&apos;re connected with</p>
                  </div>
                  <Input type="checkbox" defaultChecked className="ml-3" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Allow Friend Requests</label>
                    <p className="text-sm text-neutral-600">Let others send you connection requests</p>
                  </div>
                  <Input type="checkbox" defaultChecked className="ml-3" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Show Online Status</label>
                    <p className="text-sm text-neutral-600">Let others see when you&apos;re active</p>
                  </div>
                  <Input type="checkbox" defaultChecked className="ml-3" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Data Management</h3>

              <div className="space-y-3">
                <Button className="w-full text-left px-4 py-3 border border-neutral-200 rounded-lg hover:border-neutral-300 transition-colors">
                  <div className="font-medium text-neutral-900">Download My Data</div>
                  <div className="text-sm text-neutral-600">Get a copy of all your data</div>
                </Button>

                <Button className="w-full text-left px-4 py-3 border border-red-200 rounded-lg hover:border-red-300 transition-colors">
                  <div className="font-medium text-red-900">Delete My Account</div>
                  <div className="text-sm text-semantic-error">Permanently delete your account and data</div>
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-semantic-success text-primary-foreground py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-semantic-success focus:ring-offset-2"
            >
              Save Privacy Settings
            </Button>
          </form>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-neutral-900 mb-2">Privacy Commitment</h3>
          <p className="text-sm text-neutral-600">
            We are committed to protecting your privacy. These settings help you control how your information is used and shared.
            Learn more about our{' '}
            <a href="/legal/privacy" className="text-accent-secondary hover:text-blue-800">
              Privacy Policy
            </a>
            .
          </p>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-neutral-600">
            <a href="/auth/onboarding/preferences" className="text-accent-secondary hover:text-blue-800">
              ← Back to main preferences
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
