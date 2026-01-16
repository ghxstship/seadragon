
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const metadata: Metadata = {
  title: 'Notification Preferences | ATLVS + GVTEWAY',
  description: 'Configure your email and push notification preferences for ATLVS + GVTEWAY.',
}

export default function OnboardingPreferencesNotificationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl"></span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Notification Settings</h1>
          <p className="text-neutral-600">Choose what you want to be notified about</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <form className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Email Notifications</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Booking Confirmations</label>
                    <p className="text-sm text-neutral-600">When bookings are confirmed or modified</p>
                  </div>
                  <Input type="checkbox" defaultChecked className="ml-3" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Travel Reminders</label>
                    <p className="text-sm text-neutral-600">Upcoming trips and check-in reminders</p>
                  </div>
                  <Input type="checkbox" defaultChecked className="ml-3" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Price Alerts</label>
                    <p className="text-sm text-neutral-600">When flight/hotel prices drop</p>
                  </div>
                  <Input type="checkbox" defaultChecked className="ml-3" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Account Security</label>
                    <p className="text-sm text-neutral-600">Login attempts and security alerts</p>
                  </div>
                  <Input type="checkbox" defaultChecked className="ml-3" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Marketing Updates</label>
                    <p className="text-sm text-neutral-600">New features and travel deals</p>
                  </div>
                  <Input type="checkbox" className="ml-3" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Newsletter</label>
                    <p className="text-sm text-neutral-600">Weekly travel inspiration</p>
                  </div>
                  <Input type="checkbox" className="ml-3" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Push Notifications</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Mobile App Alerts</label>
                    <p className="text-sm text-neutral-600">Booking updates and reminders</p>
                  </div>
                  <Input type="checkbox" defaultChecked className="ml-3" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Flight Status</label>
                    <p className="text-sm text-neutral-600">Delays and gate changes</p>
                  </div>
                  <Input type="checkbox" defaultChecked className="ml-3" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-neutral-700">Check-in Reminders</label>
                    <p className="text-sm text-neutral-600">24 hours before departure</p>
                  </div>
                  <Input type="checkbox" defaultChecked className="ml-3" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Frequency Settings</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Email Digest
                  </label>
                  <Select defaultValue="realtime">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time (immediate)</SelectItem>
                      <SelectItem value="daily">Daily summary</SelectItem>
                      <SelectItem value="weekly">Weekly digest</SelectItem>
                      <SelectItem value="never">Never</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Quiet Hours
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="time"
                      defaultValue="22:00"
                      className="px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    />
                    <Input
                      type="time"
                      defaultValue="08:00"
                      className="px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    />
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">No notifications between these hours</p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
            >
              Save Notification Preferences
            </Button>
          </form>
        </div>

        <div className="text-center">
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
