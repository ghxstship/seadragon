
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const metadata: Metadata = {
  title: 'Airport Transfers | ATLVS + GVTEWAY',
  description: 'Book private airport transfers, shuttles, and ground transportation worldwide. Reliable, comfortable, and convenient transfers.',
}

export default function TransfersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Airport Transfers</h1>
          <p className="text-lg text-neutral-600">Reliable ground transportation to get you where you need to go</p>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg p-8 text-primary-foreground mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Seamless Transportation</h2>
            <p className="text-xl mb-6">From airport to destination with comfort and reliability</p>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl mb-2 block"></span>
                <h3 className="font-semibold">Private Transfers</h3>
                <p className="text-sm">Door-to-door service</p>
              </div>
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl mb-2 block"></span>
                <h3 className="font-semibold">Shared Shuttles</h3>
                <p className="text-sm">Budget-friendly option</p>
              </div>
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl mb-2 block"></span>
                <h3 className="font-semibold">Taxis & Rideshares</h3>
                <p className="text-sm">Flexible transportation</p>
              </div>
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl mb-2 block"></span>
                <h3 className="font-semibold">24/7 Service</h3>
                <p className="text-sm">Always available</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">Book Your Transfer</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Pickup Location</label>
              <Input
                type="text"
                placeholder="Airport or address"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Drop-off Location</label>
              <Input
                type="text"
                placeholder="Hotel or address"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Date & Time</label>
              <Input
                type="datetime-local"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">Passengers</label>
              <Select className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                <SelectItem value="1-passenger">1 Passenger</SelectItem>
                <SelectItem value="2-passengers">2 Passengers</SelectItem>
                <SelectItem value="3-passengers">3 Passengers</SelectItem>
                <SelectItem value="4-passengers">4 Passengers</SelectItem>
                <SelectItem value="5-passengers">5+ Passengers</SelectItem>
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center">
                <Input type="checkbox" className="mr-2" />
                Return transfer
              </label>
              <label className="flex items-center">
                <Input type="checkbox" className="mr-2" />
                Meet & greet
              </label>
              <label className="flex items-center">
                <Input type="checkbox" className="mr-2" />
                Child seats available
              </label>
            </div>
            <Button className="bg-accent-secondary text-primary-foreground py-2 px-6 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Search Transfers
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Transfer Options</h2>
            <div className="space-y-4">
              <div className="border border-neutral-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-neutral-900">Private Car</h3>
                  <span className="text-accent-secondary font-medium">From $45</span>
                </div>
                <p className="text-sm text-neutral-600 mb-2">Sedan for 1-3 passengers with driver</p>
                <div className="flex items-center text-xs text-neutral-500">
                  <span> Air-conditioned</span>
                  <span className="mx-2">•</span>
                  <span>WiFi available</span>
                  <span className="mx-2">•</span>
                  <span>Meet & greet</span>
                </div>
              </div>
              <div className="border border-neutral-200 rounded-lg p-4 hover:border-green-300 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-neutral-900">Executive Van</h3>
                  <span className="text-semantic-success font-medium">From $85</span>
                </div>
                <p className="text-sm text-neutral-600 mb-2">Luxury van for 1-6 passengers</p>
                <div className="flex items-center text-xs text-neutral-500">
                  <span> Premium service</span>
                  <span className="mx-2">•</span>
                  <span>Extra luggage space</span>
                  <span className="mx-2">•</span>
                  <span>Professional driver</span>
                </div>
              </div>
              <div className="border border-neutral-200 rounded-lg p-4 hover:border-purple-300 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-neutral-900">Shared Shuttle</h3>
                  <span className="text-accent-primary font-medium">From $25</span>
                </div>
                <p className="text-sm text-neutral-600 mb-2">Budget-friendly shared transportation</p>
                <div className="flex items-center text-xs text-neutral-500">
                  <span> Multiple stops</span>
                  <span className="mx-2">•</span>
                  <span>Fixed routes</span>
                  <span className="mx-2">•</span>
                  <span>Most economical</span>
                </div>
              </div>
              <div className="border border-neutral-200 rounded-lg p-4 hover:border-orange-300 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-neutral-900">Luxury SUV</h3>
                  <span className="text-semantic-warning font-medium">From $120</span>
                </div>
                <p className="text-sm text-neutral-600 mb-2">Premium SUV for special occasions</p>
                <div className="flex items-center text-xs text-neutral-500">
                  <span> High-end vehicle</span>
                  <span className="mx-2">•</span>
                  <span>Extra comfort</span>
                  <span className="mx-2">•</span>
                  <span>VIP service</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Popular Routes</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border border-neutral-200 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                <div>
                  <span className="font-medium text-neutral-900">JFK → Manhattan</span>
                  <p className="text-sm text-neutral-600">45-60 min • From $55</p>
                </div>
                <span className="text-accent-secondary">→</span>
              </div>
              <div className="flex justify-between items-center p-3 border border-neutral-200 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                <div>
                  <span className="font-medium text-neutral-900">LAX → Hollywood</span>
                  <p className="text-sm text-neutral-600">30-45 min • From $45</p>
                </div>
                <span className="text-accent-secondary">→</span>
              </div>
              <div className="flex justify-between items-center p-3 border border-neutral-200 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                <div>
                  <span className="font-medium text-neutral-900">Heathrow → Central London</span>
                  <p className="text-sm text-neutral-600">45-75 min • From £65</p>
                </div>
                <span className="text-accent-secondary">→</span>
              </div>
              <div className="flex justify-between items-center p-3 border border-neutral-200 rounded hover:bg-gray-50 transition-colors cursor-pointer">
                <div>
                  <span className="font-medium text-neutral-900">CDG → Paris Center</span>
                  <p className="text-sm text-neutral-600">35-50 min • From €55</p>
                </div>
                <span className="text-accent-secondary">→</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Transfer Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Real-time Tracking</h3>
              <p className="text-sm text-neutral-600">Track your driver and ETA</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">️</span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">24/7 Support</h3>
              <p className="text-sm text-neutral-600">Always available assistance</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Child Seats</h3>
              <p className="text-sm text-neutral-600">Safety seats for children</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-semantic-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Refreshments</h3>
              <p className="text-sm text-neutral-600">Water and snacks provided</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-semantic-error/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">WiFi Access</h3>
              <p className="text-sm text-neutral-600">Stay connected during travel</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Accessible Vehicles</h3>
              <p className="text-sm text-neutral-600">Accessibility accessible options</p>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Booking Policies</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Cancellation</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Free cancellation up to 2 hours before pickup</li>
                <li>• 50% refund 2-24 hours before</li>
                <li>• No refund within 2 hours</li>
                <li>• Weather-related cancellations: full refund</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Important Information</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Drivers wait 30 minutes at airports</li>
                <li>• Additional waiting time: $50/hour</li>
                <li>• Flight delays: automatic rescheduling</li>
                <li>• Maximum 2 checked bags per person</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Payment</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Pay now or at pickup</li>
                <li>• All major credit cards accepted</li>
                <li>• No cash payments for pre-bookings</li>
                <li>• Currency conversion may apply</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Safety & Security</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Licensed and insured drivers</li>
                <li>• Vehicle safety inspections</li>
                <li>• GPS tracking for all rides</li>
                <li>• Emergency contact numbers</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Transfer Planning Tips</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">⏰</span>
              </div>
              <h3 className="font-medium text-blue-900 mb-1">Book in Advance</h3>
              <p className="text-sm text-blue-800">Reserve transfers for busy travel times</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-blue-900 mb-1">Provide Details</h3>
              <p className="text-sm text-blue-800">Include terminal, airline, and flight number</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-blue-900 mb-1">Stay Connected</h3>
              <p className="text-sm text-blue-800">Keep your phone on for driver updates</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-semantic-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-blue-900 mb-1">Pack Smart</h3>
              <p className="text-sm text-blue-800">Travel light and use wheeled luggage</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Ready for Stress-Free Travel?</h2>
          <p className="text-neutral-600 mb-6">Let us handle your transportation so you can focus on your adventure</p>
          <div className="flex justify-center gap-4">
            <a href="/book/packages" className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Book with Flight Package
            </a>
            <a href="/contact/support" className="bg-background text-accent-secondary border border-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Transfer Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
