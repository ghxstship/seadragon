
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const metadata: Metadata = {
  title: 'Account Settings | ATLVS + GVTEWAY',
  description: 'Manage your account information, security settings, and preferences.',
}

export default function HomeSettingsAccountPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Account Settings</h1>
          <p className="text-neutral-600">Manage your account information and preferences</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-background rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Personal Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-neutral-900">john.doe@example.com</span>
                    <Button className="text-accent-secondary hover:text-blue-800 text-sm">
                      Change
                    </Button>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">Verified </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Phone Number
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-neutral-900">+1 (555) 123-4567</span>
                    <Button className="text-accent-secondary hover:text-blue-800 text-sm">
                      Change
                    </Button>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">Verified </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Username
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-neutral-900">@johndoe</span>
                    <Button className="text-accent-secondary hover:text-blue-800 text-sm">
                      Change
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Password & Security</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Password
                  </label>
                  <div className="flex items-center space-x-2">
                    <span className="text-neutral-900">••••••••</span>
                    <Button className="text-accent-secondary hover:text-blue-800 text-sm">
                      Change
                    </Button>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">Last changed 3 months ago</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Two-Factor Authentication
                  </label>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-900">Enabled</span>
                    <Button className="text-accent-secondary hover:text-blue-800 text-sm">
                      Manage
                    </Button>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">SMS verification active</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-background rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Account Preferences</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Default Currency
                  </label>
                  <Select defaultValue="usd">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="jpy">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Time Zone
                  </label>
                  <Select defaultValue="et">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select time zone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="et">Eastern Time (ET)</SelectItem>
                      <SelectItem value="pt">Pacific Time (PT)</SelectItem>
                      <SelectItem value="ct">Central Time (CT)</SelectItem>
                      <SelectItem value="utc">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Language
                  </label>
                  <Select defaultValue="en-us">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en-us">English (US)</SelectItem>
                      <SelectItem value="en-uk">English (UK)</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Account Actions</h2>
              <div className="space-y-3">
                <Button className="w-full text-left px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg">
                  <div className="font-medium">Download My Data</div>
                  <div className="text-sm text-neutral-600">Get a copy of all your data</div>
                </Button>

                <Button className="w-full text-left px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg">
                  <div className="font-medium">Transfer Account</div>
                  <div className="text-sm text-neutral-600">Move to a different account</div>
                </Button>

                <Button className="w-full text-left px-4 py-3 text-semantic-error hover:bg-red-50 rounded-lg">
                  <div className="font-medium">Delete Account</div>
                  <div className="text-sm text-semantic-error">Permanently delete your account</div>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Account Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div>
                <p className="font-medium text-neutral-900">Account created</p>
                <p className="text-sm text-neutral-600">January 15, 2023</p>
              </div>
              <span className="text-semantic-success font-medium">Active</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div>
                <p className="font-medium text-neutral-900">Last login</p>
                <p className="text-sm text-neutral-600">March 10, 2024 • Chrome on macOS</p>
              </div>
              <span className="text-accent-secondary font-medium">Recent</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-background rounded-lg">
              <div>
                <p className="font-medium text-neutral-900">Email verified</p>
                <p className="text-sm text-neutral-600">January 15, 2023</p>
              </div>
              <span className="text-semantic-success font-medium">Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
