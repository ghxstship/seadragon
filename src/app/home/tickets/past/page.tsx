
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Past Event Tickets | ATLVS + GVTEWAY',
  description: 'Review your attended events and access past ticket information.',
}

export default function HomeTicketsPastPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Past Event Tickets</h1>
          <p className="text-neutral-600">Your event history and memories</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl"></span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">Cirque du Soleil: O</h3>
                <p className="text-neutral-600 mb-2">Bellagio, Las Vegas • January 15, 2024</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="bg-neutral-100 text-neutral-800 px-2 py-1 rounded">Attended</span>
                  <span className="text-neutral-500"></span>
                </div>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-neutral-600">Ticket #CIRQUE-2024-045</span>
                <span className="text-sm text-neutral-500">Used</span>
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1 bg-accent-secondary text-primary-foreground py-2 px-4 rounded text-sm hover:bg-accent-tertiary">
                  View Photos
                </Button>
                <Button className="flex-1 bg-background text-neutral-700 border border-neutral-300 py-2 px-4 rounded text-sm hover:bg-gray-50">
                  Write Review
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl"></span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">Taylor Swift: The Eras Tour</h3>
                <p className="text-neutral-600 mb-2">MetLife Stadium, New York • December 8, 2023</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="bg-neutral-100 text-neutral-800 px-2 py-1 rounded">Attended</span>
                  <span className="text-neutral-500"></span>
                </div>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-neutral-600">Ticket #TS-2023-112</span>
                <span className="text-sm text-neutral-500">Used</span>
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1 bg-accent-secondary text-primary-foreground py-2 px-4 rounded text-sm hover:bg-accent-tertiary">
                  View Photos
                </Button>
                <Button className="flex-1 bg-background text-neutral-700 border border-neutral-300 py-2 px-4 rounded text-sm hover:bg-gray-50">
                  Write Review
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">️</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">Metropolitan Museum Gala</h3>
                <p className="text-neutral-600 mb-2">The Met, New York • November 20, 2023</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="bg-neutral-100 text-neutral-800 px-2 py-1 rounded">Attended</span>
                  <span className="text-neutral-500"></span>
                </div>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-neutral-600">Ticket #MET-2023-078</span>
                <span className="text-sm text-neutral-500">Used</span>
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1 bg-accent-secondary text-primary-foreground py-2 px-4 rounded text-sm hover:bg-accent-tertiary">
                  View Photos
                </Button>
                <Button className="flex-1 bg-background text-neutral-700 border border-neutral-300 py-2 px-4 rounded text-sm hover:bg-gray-50">
                  Write Review
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl"></span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">Shakespeare in the Park</h3>
                <p className="text-neutral-600 mb-2">Central Park, New York • October 15, 2023</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="bg-neutral-100 text-neutral-800 px-2 py-1 rounded">Attended</span>
                  <span className="text-neutral-500"></span>
                </div>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-neutral-600">Ticket #SHAKESPEARE-2023-034</span>
                <span className="text-sm text-neutral-500">Used</span>
              </div>
              <div className="flex space-x-2">
                <Button className="flex-1 bg-accent-secondary text-primary-foreground py-2 px-4 rounded text-sm hover:bg-accent-tertiary">
                  View Photos
                </Button>
                <Button className="flex-1 bg-background text-neutral-700 border border-neutral-300 py-2 px-4 rounded text-sm hover:bg-gray-50">
                  Write Review
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Event History Stats</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-secondary mb-1">24</div>
              <div className="text-sm text-neutral-600">Events Attended</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-semantic-success mb-1">$2,840</div>
              <div className="text-sm text-neutral-600">Total Spent</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent-primary mb-1">4.8</div>
              <div className="text-sm text-neutral-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-semantic-warning mb-1">12</div>
              <div className="text-sm text-neutral-600">Reviews Written</div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Discover More Events</h2>
          <p className="text-blue-800 mb-4">
            Based on your past attendance, here are some events you might enjoy.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-background rounded-lg p-4">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-lg flex items-center justify-center mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Broadway Shows</h3>
              <p className="text-sm text-neutral-600">Musicals and plays</p>
            </div>
            <div className="bg-background rounded-lg p-4">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-lg flex items-center justify-center mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Live Music</h3>
              <p className="text-sm text-neutral-600">Concerts and festivals</p>
            </div>
            <div className="bg-background rounded-lg p-4">
              <div className="w-12 h-12 bg-semantic-success/10 rounded-lg flex items-center justify-center mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Art Exhibitions</h3>
              <p className="text-sm text-neutral-600">Museums and galleries</p>
            </div>
          </div>
          <div className="mt-4 text-center">
            <Button className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-lg hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Browse Events
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
