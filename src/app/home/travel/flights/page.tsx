
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: 'Flight Bookings | ATLVS + GVTEWAY',
  description: 'Manage your flight reservations and travel plans.',
}

export default function HomeTravelFlightsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Flight Bookings</h1>
          <p className="text-neutral-600">Your upcoming and past flights</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Upcoming Flights</h2>
            <div className="space-y-4">
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-neutral-900">Tokyo (NRT) → New York (JFK)</h3>
                    <p className="text-sm text-neutral-600">Japan Airlines • Flight JL 789</p>
                  </div>
                  <span className="bg-semantic-success/10 text-green-800 text-xs px-2 py-1 rounded">Confirmed</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-neutral-500">Departure</p>
                    <p className="font-medium">March 15, 2024</p>
                    <p className="text-neutral-600">10:30 AM</p>
                  </div>
                  <div>
                    <p className="text-neutral-500">Arrival</p>
                    <p className="font-medium">March 15, 2024</p>
                    <p className="text-neutral-600">2:45 PM</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-neutral-600">Seat 14A • Economy</span>
                  <Button className="text-accent-secondary hover:text-blue-800 text-sm">View Details</Button>
                </div>
              </div>

              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-neutral-900">New York (JFK) → Bali (DPS)</h3>
                    <p className="text-sm text-neutral-600">Garuda Indonesia • Flight GA 456</p>
                  </div>
                  <span className="bg-semantic-warning/10 text-yellow-800 text-xs px-2 py-1 rounded">Pending</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-neutral-500">Departure</p>
                    <p className="font-medium">April 20, 2024</p>
                    <p className="text-neutral-600">11:15 PM</p>
                  </div>
                  <div>
                    <p className="text-neutral-500">Arrival</p>
                    <p className="font-medium">April 22, 2024</p>
                    <p className="text-neutral-600">8:30 AM</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-neutral-600">Seat TBA • Premium Economy</span>
                  <Button className="text-accent-secondary hover:text-blue-800 text-sm">View Details</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Flight Tools</h2>
            <div className="space-y-4">
              <Button className="w-full bg-accent-secondary text-primary-foreground py-3 px-4 rounded-lg hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
                Book New Flight
              </Button>

              <div className="space-y-3">
                <div className="p-4 border border-neutral-200 rounded-lg">
                  <h3 className="font-medium text-neutral-900 mb-2">Flight Status</h3>
                  <p className="text-sm text-neutral-600 mb-3">Check real-time flight updates</p>
                  <Input
                    type="text"
                    placeholder="Enter flight number"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  />
                  <Button className="w-full mt-2 bg-neutral-100 text-neutral-700 py-2 px-4 rounded-md hover:bg-neutral-200">
                    Check Status
                  </Button>
                </div>

                <div className="p-4 border border-neutral-200 rounded-lg">
                  <h3 className="font-medium text-neutral-900 mb-2">Travel Alerts</h3>
                  <p className="text-sm text-neutral-600 mb-3">Set up notifications for your flights</p>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <Input type="checkbox" className="mr-3" defaultChecked />
                      <span className="text-sm">Gate changes</span>
                    </label>
                    <label className="flex items-center">
                      <Input type="checkbox" className="mr-3" defaultChecked />
                      <span className="text-sm">Delays over 30 minutes</span>
                    </label>
                    <label className="flex items-center">
                      <Input type="checkbox" className="mr-3" />
                      <span className="text-sm">Cancellation alerts</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Flight History</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="text-left py-3 px-4 font-medium text-neutral-900">Route</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-900">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-900">Flight</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-neutral-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">Paris → New York</td>
                  <td className="py-3 px-4">Dec 10, 2023</td>
                  <td className="py-3 px-4">AF 123</td>
                  <td className="py-3 px-4"><span className="bg-neutral-100 text-neutral-800 text-xs px-2 py-1 rounded">Completed</span></td>
                  <td className="py-3 px-4"><Button className="text-accent-secondary hover:text-blue-800 text-sm">Receipt</Button></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">New York → Santorini</td>
                  <td className="py-3 px-4">Oct 5, 2023</td>
                  <td className="py-3 px-4">DL 789</td>
                  <td className="py-3 px-4"><span className="bg-neutral-100 text-neutral-800 text-xs px-2 py-1 rounded">Completed</span></td>
                  <td className="py-3 px-4"><Button className="text-accent-secondary hover:text-blue-800 text-sm">Receipt</Button></td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 px-4">Queenstown → Auckland</td>
                  <td className="py-3 px-4">Aug 20, 2023</td>
                  <td className="py-3 px-4">NZ 456</td>
                  <td className="py-3 px-4"><span className="bg-neutral-100 text-neutral-800 text-xs px-2 py-1 rounded">Completed</span></td>
                  <td className="py-3 px-4"><Button className="text-accent-secondary hover:text-blue-800 text-sm">Receipt</Button></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Travel Tips</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Before You Fly</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Check visa requirements for your destination</li>
                <li>• Download boarding passes to your phone</li>
                <li>• Arrive at the airport 2-3 hours early</li>
                <li>• Pack essentials in carry-on luggage</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-2">During Your Flight</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Stay hydrated and move around when possible</li>
                <li>• Use noise-canceling headphones</li>
                <li>• Keep important documents accessible</li>
                <li>• Follow crew instructions at all times</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
