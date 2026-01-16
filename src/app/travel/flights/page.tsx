
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const metadata: Metadata = {
  title: 'Flights | ATLVS + GVTEWAY',
  description: 'Search and book flights to your destination with competitive rates.',
}

export default function FlightsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8">Flights</h1>

        <div className="bg-background rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Search Flights</h2>

          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="from" className="block text-sm font-medium text-neutral-700 mb-2">
                  From
                </label>
                <Input
                  type="text"
                  id="from"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  placeholder="Departure city or airport"/>
              </div>

              <div>
                <label htmlFor="to" className="block text-sm font-medium text-neutral-700 mb-2">
                  To
                </label>
                <Input
                  type="text"
                  id="to"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  placeholder="Destination city or airport"/>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="departure" className="block text-sm font-medium text-neutral-700 mb-2">
                  Departure Date
                </label>
                <Input
                  type="date"
                  id="departure"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"/>
              </div>

              <div>
                <label htmlFor="return" className="block text-sm font-medium text-neutral-700 mb-2">
                  Return Date
                </label>
                <Input
                  type="date"
                  id="return"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"/>
              </div>

              <div>
                <label htmlFor="passengers" className="block text-sm font-medium text-neutral-700 mb-2">
                  Passengers
                </label>
                <Select
                  id="passengers"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                >
                  <SelectItem value="1-adult">1 Adult</SelectItem>
                  <SelectItem value="2-adults">2 Adults</SelectItem>
                  <SelectItem value="3-adults">3 Adults</SelectItem>
                  <SelectItem value="4-adults">4+ Adults</SelectItem>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Flight Class
              </label>
              <div className="flex space-x-4">
                {['Economy', 'Premium Economy', 'Business', 'First Class'].map((classType) => (
                  <label key={classType} className="flex items-center">
                    <Input
                      type="radio"
                      name="class"
                      value={classType.toLowerCase().replace(' ', '-')}
                      className="border-neutral-300 text-accent-secondary focus:ring-accent-primary"
                      defaultChecked={classType === 'Economy'}/>
                    <span className="ml-2 text-sm text-neutral-700">{classType}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <Input
                type="checkbox"
                id="flexible"
                className="rounded border-neutral-300 text-accent-secondary focus:ring-accent-primary"/>
              <label htmlFor="flexible" className="ml-2 text-sm text-neutral-700">
                My dates are flexible (±3 days)
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent-secondary text-primary-foreground py-3 px-6 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 font-medium"
            >
              Search Flights
            </Button>
          </form>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Flight Booking Tips</h3>
          <ul className="space-y-2 text-neutral-600">
            <li>• Book flights 2-3 months in advance for the best rates</li>
            <li>• Be flexible with dates to find cheaper options</li>
            <li>• Check for airline sales and promotional codes</li>
            <li>• Consider nearby airports for more flight options</li>
            <li>• Review baggage fees and policies before booking</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
