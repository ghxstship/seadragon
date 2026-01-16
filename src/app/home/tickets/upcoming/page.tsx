
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Upcoming Event Tickets | ATLVS + GVTEWAY',
  description: 'View your tickets for upcoming events and manage your event attendance.',
}

export default function HomeTicketsUpcomingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Upcoming Event Tickets</h1>
          <p className="text-neutral-600">Your next experiences are waiting</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl"></span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">Broadway Musical: Hamilton</h3>
                <p className="text-neutral-600 mb-2">Richard Rodgers Theatre, New York • March 20, 2024</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="bg-semantic-success/10 text-green-800 px-2 py-1 rounded">VIP Package</span>
                  <span className="text-neutral-500">8:00 PM</span>
                </div>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-neutral-600">Ticket #HAM-2024-001</span>
                <span className="text-sm font-medium text-semantic-success">Confirmed</span>
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1 bg-accent-secondary text-primary-foreground py-2 px-4 rounded text-sm hover:bg-accent-tertiary">
                  View Ticket
                </Button>
                <Button className="flex-1 bg-background text-neutral-700 border border-neutral-300 py-2 px-4 rounded text-sm hover:bg-gray-50">
                  Add to Calendar
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl"></span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">Jazz Night at Blue Note</h3>
                <p className="text-neutral-600 mb-2">Blue Note Jazz Club, New York • March 25, 2024</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="bg-accent-primary/10 text-blue-800 px-2 py-1 rounded">Premium Seating</span>
                  <span className="text-neutral-500">7:30 PM</span>
                </div>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-neutral-600">Ticket #JAZZ-2024-015</span>
                <span className="text-sm font-medium text-semantic-success">Confirmed</span>
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1 bg-accent-secondary text-primary-foreground py-2 px-4 rounded text-sm hover:bg-accent-tertiary">
                  View Ticket
                </Button>
                <Button className="flex-1 bg-background text-neutral-700 border border-neutral-300 py-2 px-4 rounded text-sm hover:bg-gray-50">
                  Add to Calendar
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-16 h-16 bg-semantic-success/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl"></span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">Modern Art Exhibition</h3>
                <p className="text-neutral-600 mb-2">MoMA, New York • April 2-30, 2024</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="bg-semantic-success/10 text-green-800 px-2 py-1 rounded">General Admission</span>
                  <span className="text-neutral-500">All day</span>
                </div>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-neutral-600">Ticket #ART-2024-089</span>
                <span className="text-sm font-medium text-semantic-success">Confirmed</span>
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1 bg-accent-secondary text-primary-foreground py-2 px-4 rounded text-sm hover:bg-accent-tertiary">
                  View Ticket
                </Button>
                <Button className="flex-1 bg-background text-neutral-700 border border-neutral-300 py-2 px-4 rounded text-sm hover:bg-gray-50">
                  Add to Calendar
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-16 h-16 bg-semantic-warning/10 rounded-lg flex items-center justify-center">
                <span className="text-2xl"></span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">NYC Marathon Spectator Pass</h3>
                <p className="text-neutral-600 mb-2">Various Locations, New York • April 14, 2024</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="bg-semantic-warning/10 text-orange-800 px-2 py-1 rounded">Spectator Pass</span>
                  <span className="text-neutral-500">6:00 AM - 6:00 PM</span>
                </div>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-neutral-600">Ticket #MAR-2024-234</span>
                <span className="text-sm font-medium text-semantic-warning">Pending</span>
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1 bg-accent-secondary text-primary-foreground py-2 px-4 rounded text-sm hover:bg-accent-tertiary">
                  View Details
                </Button>
                <Button className="flex-1 bg-background text-neutral-700 border border-neutral-300 py-2 px-4 rounded text-sm hover:bg-gray-50">
                  Contact Support
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Ticket Management Tips</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Before the Event</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Download tickets to your phone</li>
                <li>• Check venue location and parking</li>
                <li>• Review event policies and rules</li>
                <li>• Share tickets with friends if allowed</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-2">At the Venue</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Arrive early for check-in</li>
                <li>• Bring valid ID for age-restricted events</li>
                <li>• Have your ticket QR code ready</li>
                <li>• Follow venue staff instructions</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Ticket Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Button className="p-4 border border-neutral-200 rounded-lg hover:border-blue-300 transition-colors text-left">
              <div className="text-lg mb-2"></div>
              <h3 className="font-medium text-neutral-900 mb-1">Transfer Tickets</h3>
              <p className="text-sm text-neutral-600">Send tickets to friends</p>
            </Button>
            <Button className="p-4 border border-neutral-200 rounded-lg hover:border-green-300 transition-colors text-left">
              <div className="text-lg mb-2"></div>
              <h3 className="font-medium text-neutral-900 mb-1">Sell Tickets</h3>
              <p className="text-sm text-neutral-600">Resell if permitted</p>
            </Button>
            <Button className="p-4 border border-neutral-200 rounded-lg hover:border-purple-300 transition-colors text-left">
              <div className="text-lg mb-2">⬆️</div>
              <h3 className="font-medium text-neutral-900 mb-1">Upgrade Tickets</h3>
              <p className="text-sm text-neutral-600">Get better seats</p>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
