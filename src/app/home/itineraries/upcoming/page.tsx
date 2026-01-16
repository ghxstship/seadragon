
import { Metadata } from 'next'
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: 'Upcoming Trips | ATLVS + GVTEWAY',
  description: 'View and manage your upcoming travel itineraries and trip plans.',
}

export default function HomeItinerariesUpcomingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Upcoming Trips</h1>
          <p className="text-neutral-600">Your next adventures await</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-4xl">🇯🇵</span>
              </div>
              <div className="absolute top-2 left-2 bg-semantic-success text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                12 days
              </div>
              <div className="absolute top-2 right-2 bg-background bg-opacity-90 text-neutral-800 px-2 py-1 rounded text-xs">
                Confirmed
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">Tokyo Adventure</h3>
              <p className="text-neutral-600 text-sm mb-3">Tokyo, Japan • March 15-22, 2024</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">4 activities planned</span>
                <span className="text-accent-secondary font-medium">View Details →</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                <span className="text-4xl">🇹🇭</span>
              </div>
              <div className="absolute top-2 left-2 bg-semantic-warning text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                45 days
              </div>
              <div className="absolute top-2 right-2 bg-semantic-warning/10 text-yellow-800 px-2 py-1 rounded text-xs">
                Pending
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">Bali Wellness Retreat</h3>
              <p className="text-neutral-600 text-sm mb-3">Ubud, Bali • April 20-27, 2024</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">6 activities planned</span>
                <span className="text-accent-secondary font-medium">View Details →</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <div className="relative">
              <div className="aspect-video bg-gradient-to-r from-orange-400 to-red-500 flex items-center justify-center">
                <span className="text-4xl">🇮🇹</span>
              </div>
              <div className="absolute top-2 left-2 bg-semantic-error text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                89 days
              </div>
              <div className="absolute top-2 right-2 bg-background bg-opacity-90 text-neutral-800 px-2 py-1 rounded text-xs">
                Confirmed
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-neutral-900 mb-2">Italian Countryside Tour</h3>
              <p className="text-neutral-600 text-sm mb-3">Tuscany, Italy • June 1-8, 2024</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">8 activities planned</span>
                <span className="text-accent-secondary font-medium">View Details →</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Trip Preparation Checklist</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
              <div className="flex items-center">
                <Input type="checkbox" className="mr-3" />
                <div>
                  <p className="font-medium text-neutral-900">Tokyo Adventure</p>
                  <p className="text-sm text-neutral-600">Confirm flight details and hotel booking</p>
                </div>
              </div>
              <span className="text-xs text-semantic-warning bg-semantic-warning/10 px-2 py-1 rounded">Due soon</span>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
              <div className="flex items-center">
                <Input type="checkbox" className="mr-3" defaultChecked />
                <div>
                  <p className="font-medium text-neutral-900">Bali Wellness Retreat</p>
                  <p className="text-sm text-neutral-600">Book airport transfer service</p>
                </div>
              </div>
              <span className="text-xs text-semantic-success bg-semantic-success/10 px-2 py-1 rounded">Completed</span>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
              <div className="flex items-center">
                <Input type="checkbox" className="mr-3" />
                <div>
                  <p className="font-medium text-neutral-900">Italian Countryside Tour</p>
                  <p className="text-sm text-neutral-600">Apply for ESTA visa waiver</p>
                </div>
              </div>
              <span className="text-xs text-neutral-600 bg-neutral-100 px-2 py-1 rounded">Not started</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Travel Reminders</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Documents to Prepare</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Passport (valid for 6+ months)</li>
                <li>• Visa requirements check</li>
                <li>• Travel insurance confirmation</li>
                <li>• COVID-19 requirements</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Health & Safety</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Vaccination records</li>
                <li>• Emergency contact info</li>
                <li>• Medical insurance details</li>
                <li>• Local emergency numbers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
