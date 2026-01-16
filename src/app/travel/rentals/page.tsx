
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Rentals | ATLVS + GVTEWAY',
  description: 'Rent cars, equipment, and more for your perfect trip.',
}

export default function RentalsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8">Rentals</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-4xl"></span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Car Rentals</h3>
            <p className="text-neutral-600 mb-4">Economy to luxury vehicles for getting around</p>
            <ul className="text-sm text-neutral-600 space-y-1 mb-4">
              <li>• One-way rentals available</li>
              <li>• GPS and child seats included</li>
              <li>• 24/7 roadside assistance</li>
              <li>• Flexible pickup/drop-off</li>
            </ul>
            <Button className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Browse Cars
            </Button>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-4xl">️</span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Motorcycles & Scooters</h3>
            <p className="text-neutral-600 mb-4">Explore on two wheels with style and freedom</p>
            <ul className="text-sm text-neutral-600 space-y-1 mb-4">
              <li>• Automatic and manual options</li>
              <li>• Helmet and safety gear included</li>
              <li>• Perfect for island hopping</li>
              <li>• Fuel efficient and fun</li>
            </ul>
            <Button className="w-full bg-semantic-success text-primary-foreground py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-semantic-success focus:ring-offset-2">
              Browse Motorcycles
            </Button>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-4xl"></span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Bicycles & E-Bikes</h3>
            <p className="text-neutral-600 mb-4">Pedal power for eco-friendly exploration</p>
            <ul className="text-sm text-neutral-600 space-y-1 mb-4">
              <li>• Electric assist available</li>
              <li>• Locks and lights included</li>
              <li>• Great for city touring</li>
              <li>• Healthier way to travel</li>
            </ul>
            <Button className="w-full bg-accent-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
              Browse Bikes
            </Button>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-4xl"></span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Boats & Yachts</h3>
            <p className="text-neutral-600 mb-4">Navigate waterways in style</p>
            <ul className="text-sm text-neutral-600 space-y-1 mb-4">
              <li>• From dinghies to luxury yachts</li>
              <li>• Captain and crew options</li>
              <li>• Perfect for coastal exploration</li>
              <li>• Sunset cruises available</li>
            </ul>
            <Button className="w-full bg-teal-600 text-primary-foreground py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2">
              Browse Boats
            </Button>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-4xl">️</span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Camping Gear</h3>
            <p className="text-neutral-600 mb-4">Everything you need for outdoor adventures</p>
            <ul className="text-sm text-neutral-600 space-y-1 mb-4">
              <li>• Tents, sleeping bags, pads</li>
              <li>• Cooking equipment included</li>
              <li>• GPS and navigation tools</li>
              <li>• Emergency supplies</li>
            </ul>
            <Button className="w-full bg-semantic-warning text-primary-foreground py-2 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
              Browse Gear
            </Button>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-4xl"></span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Photography Equipment</h3>
            <p className="text-neutral-600 mb-4">Capture memories with professional gear</p>
            <ul className="text-sm text-neutral-600 space-y-1 mb-4">
              <li>• DSLR and mirrorless cameras</li>
              <li>• Lenses and tripods included</li>
              <li>• Underwater housings available</li>
              <li>• Drone rentals for aerial shots</li>
            </ul>
            <Button className="w-full bg-semantic-error text-primary-foreground py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-semantic-error focus:ring-offset-2">
              Browse Equipment
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Rental Policies & Tips</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-neutral-900 mb-2">Before You Rent</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Check age requirements (usually 21+ for cars)</li>
                <li>• Valid driver&apos;s license required</li>
                <li>• Credit card needed for security deposit</li>
                <li>• International licenses may be required</li>
                <li>• Book in advance for peak seasons</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-neutral-900 mb-2">Insurance & Coverage</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Basic coverage included with rental</li>
                <li>• Additional insurance available</li>
                <li>• Check your personal auto insurance</li>
                <li>• Damage waiver options</li>
                <li>• Theft protection available</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
