
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: 'Security Settings | ATLVS + GVTEWAY',
  description: 'Manage your account security, two-factor authentication, and active sessions.',
}

export default function HomeSettingsSecurityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Security Settings</h1>
          <p className="text-neutral-600">Keep your account secure and monitor your activity</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Two-Factor Authentication</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-neutral-900">Authenticator App</h3>
                  <p className="text-sm text-neutral-600">Use an app like Google Authenticator</p>
                </div>
                <div className="flex items-center">
                  <span className="text-semantic-success mr-2"></span>
                  <Button className="text-accent-secondary hover:text-blue-800 text-sm">
                    Configure
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-neutral-900">SMS Verification</h3>
                  <p className="text-sm text-neutral-600">Receive codes via text message</p>
                </div>
                <div className="flex items-center">
                  <span className="text-semantic-success mr-2"></span>
                  <Button className="text-accent-secondary hover:text-blue-800 text-sm">
                    Configure
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-neutral-900">Backup Codes</h3>
                  <p className="text-sm text-neutral-600">Emergency access codes</p>
                </div>
                <div className="flex items-center">
                  <span className="text-semantic-warning mr-2">○</span>
                  <Button className="text-accent-secondary hover:text-blue-800 text-sm">
                    Generate
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Password Security</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Current Password
                </label>
                <Input
                  type="password"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  New Password
                </label>
                <Input
                  type="password"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Confirm New Password
                </label>
                <Input
                  type="password"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  placeholder="Confirm new password"
                />
              </div>

              <Button className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
                Update Password
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Active Sessions</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-accent-secondary rounded-full flex items-center justify-center text-primary-foreground mr-3">
                  <span className="text-sm"></span>
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Chrome on macOS</p>
                  <p className="text-sm text-neutral-600">New York, NY • Active now</p>
                </div>
              </div>
              <span className="text-semantic-success font-medium text-sm">Current Session</span>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-semantic-success rounded-full flex items-center justify-center text-primary-foreground mr-3">
                  <span className="text-sm"></span>
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Safari on iPhone</p>
                  <p className="text-sm text-neutral-600">New York, NY • 2 hours ago</p>
                </div>
              </div>
              <Button className="text-semantic-error hover:text-red-800 text-sm">
                Revoke Access
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-accent-primary rounded-full flex items-center justify-center text-primary-foreground mr-3">
                  <span className="text-sm"></span>
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Firefox on Windows</p>
                  <p className="text-sm text-neutral-600">Los Angeles, CA • 1 day ago</p>
                </div>
              </div>
              <Button className="text-semantic-error hover:text-red-800 text-sm">
                Revoke Access
              </Button>
            </div>
          </div>

          <div className="mt-4 flex space-x-4">
            <Button className="bg-semantic-error text-primary-foreground px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-semantic-error focus:ring-offset-2">
              Revoke All Other Sessions
            </Button>
            <Button className="bg-neutral-100 text-neutral-700 px-4 py-2 rounded-md hover:bg-neutral-200">
              View All Sessions
            </Button>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Security Activity</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 border border-neutral-200 rounded-lg">
              <div className="w-8 h-8 bg-semantic-success/10 rounded-full flex items-center justify-center">
                <span className="text-semantic-success text-sm"></span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-neutral-900">Password changed</p>
                <p className="text-sm text-neutral-600">March 1, 2024 • Chrome on macOS</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 border border-neutral-200 rounded-lg">
              <div className="w-8 h-8 bg-accent-primary/10 rounded-full flex items-center justify-center">
                <span className="text-accent-secondary text-sm"></span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-neutral-900">Two-factor authentication enabled</p>
                <p className="text-sm text-neutral-600">February 15, 2024 • Safari on iPhone</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 border border-neutral-200 rounded-lg">
              <div className="w-8 h-8 bg-semantic-warning/10 rounded-full flex items-center justify-center">
                <span className="text-semantic-warning text-sm"></span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-neutral-900">New device login</p>
                <p className="text-sm text-neutral-600">February 10, 2024 • Firefox on Windows</p>
              </div>
            </div>

            <div className="flex items-start space-x-4 p-4 border border-neutral-200 rounded-lg">
              <div className="w-8 h-8 bg-semantic-error/10 rounded-full flex items-center justify-center">
                <span className="text-semantic-error text-sm"></span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-neutral-900">Failed login attempt</p>
                <p className="text-sm text-neutral-600">February 5, 2024 • Unknown device</p>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Button className="text-accent-secondary hover:text-blue-800">
              View Complete Activity Log →
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
