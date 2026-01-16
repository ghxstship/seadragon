
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'App Integrations | ATLVS + GVTEWAY',
  description: 'Connect your favorite apps and services to enhance your travel experience.',
}

export default function HomeSettingsIntegrationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">App Integrations</h1>
          <p className="text-neutral-600">Connect your favorite apps to streamline your travel planning</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Calendar & Productivity</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-accent-secondary rounded-lg flex items-center justify-center text-primary-foreground mr-3">
                    <span className="text-sm">G</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">Google Calendar</h3>
                    <p className="text-sm text-neutral-600">Sync trips and add events</p>
                  </div>
                </div>
                <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-accent-tertiary">
                  Connect
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-semantic-success rounded-lg flex items-center justify-center text-primary-foreground mr-3">
                    <span className="text-sm">O</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">Outlook Calendar</h3>
                    <p className="text-sm text-neutral-600">Microsoft calendar integration</p>
                  </div>
                </div>
                <Button className="bg-semantic-success text-primary-foreground px-4 py-2 rounded text-sm hover:bg-green-700">
                  Connect
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-accent-primary rounded-lg flex items-center justify-center text-primary-foreground mr-3">
                    <span className="text-sm">T</span>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Create travel task lists</p>
                  </div>
                </div>
                <Button className="bg-accent-primary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-purple-700">
                  Connect
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-semantic-warning rounded-lg flex items-center justify-center text-primary-foreground mr-3">
                    <span className="text-sm">N</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">Notion</h3>
                    <p className="text-sm text-neutral-600">Trip planning templates</p>
                  </div>
                </div>
                <Button className="bg-semantic-warning text-primary-foreground px-4 py-2 rounded text-sm hover:bg-orange-700">
                  Connect
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Social Media</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-accent-primary rounded-lg flex items-center justify-center text-primary-foreground mr-3">
                    <span className="text-sm">f</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">Facebook</h3>
                    <p className="text-sm text-neutral-600">Import travel photos</p>
                  </div>
                </div>
                <span className="text-semantic-success text-sm">Connected</span>
              </div>

              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-sky-500 rounded-lg flex items-center justify-center text-primary-foreground mr-3">
                    <span className="text-sm">t</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">Twitter</h3>
                    <p className="text-sm text-neutral-600">Share travel updates</p>
                  </div>
                </div>
                <span className="text-semantic-success text-sm">Connected</span>
              </div>

              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-pink-600 rounded-lg flex items-center justify-center text-primary-foreground mr-3">
                    <span className="text-sm">i</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">Instagram</h3>
                    <p className="text-sm text-neutral-600">Photo backup and sharing</p>
                  </div>
                </div>
                <Button className="bg-pink-600 text-primary-foreground px-4 py-2 rounded text-sm hover:bg-pink-700">
                  Connect
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-semantic-error rounded-lg flex items-center justify-center text-primary-foreground mr-3">
                    <span className="text-sm">y</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">YouTube</h3>
                    <p className="text-sm text-neutral-600">Travel video uploads</p>
                  </div>
                </div>
                <Button className="bg-semantic-error text-primary-foreground px-4 py-2 rounded text-sm hover:bg-red-700">
                  Connect
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Travel Services</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-semantic-error rounded-lg flex items-center justify-center text-primary-foreground mr-3">
                    <span className="text-sm">A</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">Airbnb</h3>
                    <p className="text-sm text-neutral-600">Import saved listings</p>
                  </div>
                </div>
                <Button className="bg-semantic-error text-primary-foreground px-4 py-2 rounded text-sm hover:bg-semantic-error">
                  Connect
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-accent-tertiary rounded-lg flex items-center justify-center text-primary-foreground mr-3">
                    <span className="text-sm">B</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">Booking.com</h3>
                    <p className="text-sm text-neutral-600">Sync reservations</p>
                  </div>
                </div>
                <Button className="bg-accent-tertiary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-accent-tertiary">
                  Connect
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-neutral-900 rounded-lg flex items-center justify-center text-primary-foreground mr-3">
                    <span className="text-sm">U</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">Uber</h3>
                    <p className="text-sm text-neutral-600">Ride history and preferences</p>
                  </div>
                </div>
                <Button className="bg-neutral-900 text-primary-foreground px-4 py-2 rounded text-sm hover:bg-neutral-800">
                  Connect
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-semantic-success rounded-lg flex items-center justify-center text-primary-foreground mr-3">
                    <span className="text-sm">T</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">TripAdvisor</h3>
                    <p className="text-sm text-neutral-600">Reviews and bookmarks</p>
                  </div>
                </div>
                <Button className="bg-semantic-success text-primary-foreground px-4 py-2 rounded text-sm hover:bg-green-700">
                  Connect
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Health & Fitness</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-semantic-error rounded-lg flex items-center justify-center text-primary-foreground mr-3">
                    <span className="text-sm">S</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">Strava</h3>
                    <p className="text-sm text-neutral-600">Activity tracking and routes</p>
                  </div>
                </div>
                <span className="text-semantic-success text-sm">Connected</span>
              </div>

              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-semantic-warning rounded-lg flex items-center justify-center text-primary-foreground mr-3">
                    <span className="text-sm">F</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">Fitbit</h3>
                    <p className="text-sm text-neutral-600">Health metrics and goals</p>
                  </div>
                </div>
                <Button className="bg-semantic-warning text-primary-foreground px-4 py-2 rounded text-sm hover:bg-semantic-warning">
                  Connect
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-accent-secondary rounded-lg flex items-center justify-center text-primary-foreground mr-3">
                    <span className="text-sm">M</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">MyFitnessPal</h3>
                    <p className="text-sm text-neutral-600">Nutrition tracking</p>
                  </div>
                </div>
                <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-accent-tertiary">
                  Connect
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-semantic-success rounded-lg flex items-center justify-center text-primary-foreground mr-3">
                    <span className="text-sm">W</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900">Withings</h3>
                    <p className="text-sm text-neutral-600">Smart scale and health data</p>
                  </div>
                </div>
                <Button className="bg-semantic-success text-primary-foreground px-4 py-2 rounded text-sm hover:bg-semantic-success">
                  Connect
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Connected Apps</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-neutral-200 rounded-lg">
              <div className="w-12 h-12 bg-accent-secondary rounded-lg flex items-center justify-center mx-auto mb-3 text-primary-foreground">
                <span className="text-lg">f</span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Facebook</h3>
              <p className="text-sm text-neutral-600 mb-3">Connected March 2023</p>
              <Button className="text-semantic-error hover:text-red-800 text-sm">
                Disconnect
              </Button>
            </div>

            <div className="text-center p-4 border border-neutral-200 rounded-lg">
              <div className="w-12 h-12 bg-sky-500 rounded-lg flex items-center justify-center mx-auto mb-3 text-primary-foreground">
                <span className="text-lg">t</span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Twitter</h3>
              <p className="text-sm text-neutral-600 mb-3">Connected Feb 2024</p>
              <Button className="text-semantic-error hover:text-red-800 text-sm">
                Disconnect
              </Button>
            </div>

            <div className="text-center p-4 border border-neutral-200 rounded-lg">
              <div className="w-12 h-12 bg-semantic-error rounded-lg flex items-center justify-center mx-auto mb-3 text-primary-foreground">
                <span className="text-lg">S</span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Strava</h3>
              <p className="text-sm text-neutral-600 mb-3">Connected Jan 2024</p>
              <Button className="text-semantic-error hover:text-red-800 text-sm">
                Disconnect
              </Button>
            </div>

            <div className="text-center p-4 border border-neutral-200 rounded-lg">
              <div className="w-12 h-12 bg-accent-secondary rounded-lg flex items-center justify-center mx-auto mb-3 text-primary-foreground">
                <span className="text-lg">G</span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Google</h3>
              <p className="text-sm text-neutral-600 mb-3">Connected Dec 2023</p>
              <Button className="text-semantic-error hover:text-red-800 text-sm">
                Disconnect
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Integration Benefits</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Seamless Sync</h3>
              <p className="text-sm text-neutral-600">Automatically sync data across platforms</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Enhanced Features</h3>
              <p className="text-sm text-neutral-600">Unlock advanced features and capabilities</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Secure Connections</h3>
              <p className="text-sm text-neutral-600">All integrations use industry-standard security</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
