
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: 'Where to Stay | ATLVS + GVTEWAY',
  description: 'Find the perfect accommodation for your trip with our curated selection.',
}

export default function AccommodationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8">Where to Stay</h1>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search destinations..."
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"/>
            </div>
            <div className="flex gap-2">
              <Input
                type="date"
                className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"/>
              <Input
                type="date"
                className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"/>
            </div>
            <Button className="px-6 py-3 bg-accent-secondary text-primary-foreground rounded-lg hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Search
            </Button>
          </div>

          <div className="flex flex-wrap gap-4">
            <select className="px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
              <option>Property Type</option>
              <option>Hotel</option>
              <option>Resort</option>
              <option>Villa</option>
              <option>Apartment</option>
              <option>Hostel</option>
            </select>

            <select className="px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
              <option>Price Range</option>
              <option>$0 - $100</option>
              <option>$100 - $300</option>
              <option>$300 - $600</option>
              <option>$600+</option>
            </select>

            <select className="px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
              <option>Amenities</option>
              <option>Pool</option>
              <option>Spa</option>
              <option>Gym</option>
              <option>WiFi</option>
              <option>Breakfast</option>
            </select>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample accommodation cards */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-neutral-200"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">Luxury Resort</h3>
                <p className="text-neutral-600 mb-2">Paradise Island</p>
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {''.repeat(4)}{''.repeat(1)}
                  </div>
                  <span className="ml-2 text-sm text-neutral-600">(128 reviews)</span>
                </div>
                <p className="text-neutral-900 font-semibold">$299/night</p>
                <Button className="mt-4 w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Accommodation Types</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl"></span>
              </div>
              <h4 className="font-medium text-neutral-900">Hotels</h4>
              <p className="text-sm text-neutral-600">Full-service accommodations</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">️</span>
              </div>
              <h4 className="font-medium text-neutral-900">Resorts</h4>
              <p className="text-sm text-neutral-600">All-inclusive luxury</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl"></span>
              </div>
              <h4 className="font-medium text-neutral-900">Villas</h4>
              <p className="text-sm text-neutral-600">Private homes</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-semantic-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl"></span>
              </div>
              <h4 className="font-medium text-neutral-900">Apartments</h4>
              <p className="text-sm text-neutral-600">Extended stays</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
