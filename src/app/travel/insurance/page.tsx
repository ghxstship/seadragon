
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Travel Insurance | ATLVS + GVTEWAY',
  description: 'Protect your trip with comprehensive travel insurance coverage and peace of mind.',
}

export default function InsurancePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">Travel Insurance</h1>
        <p className="text-lg text-neutral-600 mb-8">Comprehensive coverage to protect your trip and give you peace of mind</p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <span className="text-semantic-error text-xl mr-3">️</span>
            <div>
              <h3 className="text-lg font-semibold text-red-900 mb-2">Why Travel Insurance Matters</h3>
              <p className="text-red-800 text-sm">
                Travel insurance protects against unexpected events like trip cancellations, medical emergencies,
                lost baggage, and travel delays. Don&apos;t travel without it - one unexpected incident can cost thousands.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-3xl"></span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Medical Coverage</h3>
            <p className="text-neutral-600 mb-4">Emergency medical and evacuation coverage</p>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>• Medical expenses up to $500,000</li>
              <li>• Emergency evacuation</li>
              <li>• 24/7 medical hotline</li>
              <li>• Pre-existing condition waiver</li>
            </ul>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-3xl">️</span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Trip Cancellation</h3>
            <p className="text-neutral-600 mb-4">Coverage for trip interruptions and cancellations</p>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>• Trip cancellation coverage</li>
              <li>• Trip interruption protection</li>
              <li>• Missed connection coverage</li>
              <li>• Weather-related delays</li>
            </ul>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-3xl"></span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Baggage Protection</h3>
            <p className="text-neutral-600 mb-4">Lost, stolen, or damaged baggage coverage</p>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>• Baggage loss coverage</li>
              <li>• Baggage delay compensation</li>
              <li>• Valuable items protection</li>
              <li>• Emergency clothing allowance</li>
            </ul>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-3xl"></span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Rental Car Coverage</h3>
            <p className="text-neutral-600 mb-4">Protection for rental vehicles</p>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>• Collision damage waiver</li>
              <li>• Theft protection</li>
              <li>• Personal accident coverage</li>
              <li>• Secondary coverage options</li>
            </ul>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-3xl"></span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Business Travel</h3>
            <p className="text-neutral-600 mb-4">Special coverage for business travelers</p>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>• Meeting cancellation</li>
              <li>• Laptop and equipment coverage</li>
              <li>• Business document protection</li>
              <li>• Trip delay compensation</li>
            </ul>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-3xl"></span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Adventure Sports</h3>
            <p className="text-neutral-600 mb-4">Coverage for adventure activities</p>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>• Skiing and snowboarding</li>
              <li>• Scuba diving coverage</li>
              <li>• Hiking and trekking</li>
              <li>• Water sports protection</li>
            </ul>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Choose Your Coverage</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="border-2 border-neutral-200 rounded-lg p-6 hover:border-blue-300 transition-colors">
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Basic Coverage</h3>
              <div className="text-3xl font-bold text-accent-secondary mb-4">$29<span className="text-lg text-neutral-600">/trip</span></div>
              <ul className="text-sm text-neutral-600 space-y-2 mb-6">
                <li> Medical coverage up to $50,000</li>
                <li> Trip cancellation up to $1,000</li>
                <li> Baggage coverage up to $500</li>
                <li> 24/7 assistance hotline</li>
              </ul>
              <Button className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
                Select Basic
              </Button>
            </div>

            <div className="border-2 border-green-300 bg-green-50 rounded-lg p-6 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-semantic-success text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Comprehensive</h3>
              <div className="text-3xl font-bold text-semantic-success mb-4">$59<span className="text-lg text-neutral-600">/trip</span></div>
              <ul className="text-sm text-neutral-600 space-y-2 mb-6">
                <li> Medical coverage up to $500,000</li>
                <li> Trip cancellation up to $5,000</li>
                <li> Baggage coverage up to $2,500</li>
                <li> Emergency evacuation</li>
                <li> Pre-existing condition waiver</li>
                <li> 24/7 assistance hotline</li>
              </ul>
              <Button className="w-full bg-semantic-success text-primary-foreground py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-semantic-success focus:ring-offset-2">
                Select Comprehensive
              </Button>
            </div>

            <div className="border-2 border-neutral-200 rounded-lg p-6 hover:border-purple-300 transition-colors">
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Premium Coverage</h3>
              <div className="text-3xl font-bold text-accent-primary mb-4">$99<span className="text-lg text-neutral-600">/trip</span></div>
              <ul className="text-sm text-neutral-600 space-y-2 mb-6">
                <li> Medical coverage up to $1,000,000</li>
                <li> Unlimited trip cancellation</li>
                <li> Baggage coverage up to $5,000</li>
                <li> Emergency evacuation</li>
                <li> Pre-existing condition waiver</li>
                <li> Adventure sports coverage</li>
                <li> 24/7 concierge service</li>
              </ul>
              <Button className="w-full bg-accent-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                Select Premium
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">What to Consider When Buying Insurance</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-neutral-900 mb-2">Trip Details</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Destination and travel dates</li>
                <li>• Trip cost and activities planned</li>
                <li>• Group size and ages</li>
                <li>• Adventure sports participation</li>
                <li>• Business vs. leisure travel</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-neutral-900 mb-2">Coverage Needs</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Medical coverage limits</li>
                <li>• Cancellation coverage amount</li>
                <li>• Baggage and personal effects</li>
                <li>• Pre-existing conditions</li>
                <li>• Travel delays and interruptions</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Questions About Travel Insurance?</h3>
          <p className="text-blue-800 mb-4">
            Our insurance experts can help you choose the right coverage for your trip.
            Get personalized recommendations based on your travel plans and needs.
          </p>
          <div className="flex gap-4">
            <Button className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 font-medium">
              Get Insurance Quote
            </Button>
            <Button className="bg-background text-accent-secondary border border-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 font-medium">
              Compare Plans
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
