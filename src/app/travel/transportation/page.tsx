
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Getting Around | ATLVS + GVTEWAY',
  description: 'Find transportation options and get around your destination with ease.',
}

export default function TransportationPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8">Getting Around</h1>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">Ground Transportation</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="w-8 h-8 bg-accent-primary/10 rounded-full flex items-center justify-center mr-3"></span>
                <div>
                  <h4 className="font-medium text-neutral-900">Private Transfers</h4>
                  <p className="text-sm text-neutral-600">Door-to-door airport transfers</p>
                </div>
              </li>
              <li className="flex items-center">
                <span className="w-8 h-8 bg-semantic-success/10 rounded-full flex items-center justify-center mr-3"></span>
                <div>
                  <h4 className="font-medium text-neutral-900">Taxis & Rideshares</h4>
                  <p className="text-sm text-neutral-600">Uber, Lyft, and local taxis</p>
                </div>
              </li>
              <li className="flex items-center">
                <span className="w-8 h-8 bg-accent-primary/10 rounded-full flex items-center justify-center mr-3"></span>
                <div>
                  <h4 className="font-medium text-neutral-900">Bus Services</h4>
                  <p className="text-sm text-neutral-600">Public buses and shuttles</p>
                </div>
              </li>
              <li className="flex items-center">
                <span className="w-8 h-8 bg-semantic-warning/10 rounded-full flex items-center justify-center mr-3"></span>
                <div>
                  <h4 className="font-medium text-neutral-900">Public Transit</h4>
                  <p className="text-sm text-neutral-600">Subway, metro, and trains</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">Specialty Transport</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <span className="w-8 h-8 bg-semantic-error/10 rounded-full flex items-center justify-center mr-3">️</span>
                <div>
                  <h4 className="font-medium text-neutral-900">Motorcycle Tours</h4>
                  <p className="text-sm text-neutral-600">Guided motorcycle adventures</p>
                </div>
              </li>
              <li className="flex items-center">
                <span className="w-8 h-8 bg-semantic-warning/10 rounded-full flex items-center justify-center mr-3"></span>
                <div>
                  <h4 className="font-medium text-neutral-900">Bike Rentals</h4>
                  <p className="text-sm text-neutral-600">Bicycles and e-bikes</p>
                </div>
              </li>
              <li className="flex items-center">
                <span className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center mr-3"></span>
                <div>
                  <h4 className="font-medium text-neutral-900">Boat Transfers</h4>
                  <p className="text-sm text-neutral-600">Island hopping and water taxis</p>
                </div>
              </li>
              <li className="flex items-center">
                <span className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3"></span>
                <div>
                  <h4 className="font-medium text-neutral-900">Helicopter Tours</h4>
                  <p className="text-sm text-neutral-600">Aerial tours and transfers</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Transportation Planning Tips</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-blue-800">
              <li>• Book airport transfers in advance</li>
              <li>• Download local transit apps</li>
              <li>• Check for transportation passes</li>
              <li>• Consider weather when planning</li>
            </ul>
            <ul className="space-y-2 text-blue-800">
              <li>• Have local currency for taxis</li>
              <li>• Use rideshares in cities</li>
              <li>• Learn basic local phrases</li>
              <li>• Keep emergency numbers handy</li>
            </ul>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-neutral-900 mb-4">Popular Destinations</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border border-neutral-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <h4 className="font-medium text-neutral-900 mb-2">New York City</h4>
              <p className="text-sm text-neutral-600 mb-3">Subway, taxis, rideshares</p>
              <Button className="text-accent-secondary text-sm hover:text-blue-800">View transport options →</Button>
            </div>
            <div className="border border-neutral-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <h4 className="font-medium text-neutral-900 mb-2">Paris</h4>
              <p className="text-sm text-neutral-600 mb-3">Metro, buses, Vélib bikes</p>
              <Button className="text-accent-secondary text-sm hover:text-blue-800">View transport options →</Button>
            </div>
            <div className="border border-neutral-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
              <h4 className="font-medium text-neutral-900 mb-2">Tokyo</h4>
              <p className="text-sm text-neutral-600 mb-3">Shinkansen, subway, taxis</p>
              <Button className="text-accent-secondary text-sm hover:text-blue-800">View transport options →</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
