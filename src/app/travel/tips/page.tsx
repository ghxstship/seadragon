
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Travel Tips | ATLVS + GVTEWAY',
  description: 'Essential travel tips and advice for a smooth and enjoyable journey.',
}

export default function TravelTipsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-neutral-900 mb-4">Travel Tips</h1>
        <p className="text-lg text-neutral-600 mb-8">Expert advice to make your travels smoother and more enjoyable</p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <div className="bg-background rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Planning & Preparation</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-accent-primary/10 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">1</span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Research Your Destination</h4>
                    <p className="text-sm text-neutral-600">Check visa requirements, health recommendations, and local customs before booking.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-accent-primary/10 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">2</span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Create a Flexible Itinerary</h4>
                    <p className="text-sm text-neutral-600">Plan key activities but leave room for spontaneous discoveries.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-accent-primary/10 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">3</span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Pack Smart</h4>
                    <p className="text-sm text-neutral-600">Make a packing list and check weather forecasts. Pack versatile clothing.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-background rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Health & Safety</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-semantic-error/10 text-red-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">!</span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Travel Insurance</h4>
                    <p className="text-sm text-neutral-600">Never travel without comprehensive coverage for medical emergencies and trip cancellations.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-semantic-error/10 text-red-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">!</span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Health Precautions</h4>
                    <p className="text-sm text-neutral-600">Check CDC recommendations and get necessary vaccinations.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-semantic-error/10 text-red-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">!</span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Stay Aware</h4>
                    <p className="text-sm text-neutral-600">Keep valuables secure and be mindful of your surroundings.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-background rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">During Your Trip</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Respect Local Customs</h4>
                    <p className="text-sm text-neutral-600">Learn basic greetings and cultural norms. Dress appropriately.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Try Local Food</h4>
                    <p className="text-sm text-neutral-600">Food is culture. Be adventurous but listen to your body.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Stay Connected</h4>
                    <p className="text-sm text-neutral-600">Download offline maps and keep emergency contacts handy.</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-background rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-4">Money & Budgeting</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-semantic-warning/10 text-yellow-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">$</span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Budget Wisely</h4>
                    <p className="text-sm text-neutral-600">Track expenses and set daily spending limits.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-semantic-warning/10 text-yellow-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">$</span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Use Local Currency</h4>
                    <p className="text-sm text-neutral-600">Exchange money at banks or official bureaus, not airports.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-semantic-warning/10 text-yellow-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">$</span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Save on Fees</h4>
                    <p className="text-sm text-neutral-600">Use ATM fees wisely and avoid dynamic currency conversion.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Destination-Specific Tips</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-background rounded-lg p-4">
              <h4 className="font-medium text-neutral-900 mb-2">Asia</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Remove shoes indoors</li>
                <li>• Use both hands for business cards</li>
                <li>• Haggling is expected at markets</li>
                <li>• Public displays of affection vary</li>
              </ul>
            </div>
            <div className="bg-background rounded-lg p-4">
              <h4 className="font-medium text-neutral-900 mb-2">Europe</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Tipping is appreciated but not required</li>
                <li>• Many places close for lunch</li>
                <li>• Learn basic phrases</li>
                <li>• Respect siesta hours in Spain</li>
              </ul>
            </div>
            <div className="bg-background rounded-lg p-4">
              <h4 className="font-medium text-neutral-900 mb-2">Americas</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Gratuity often included in bills</li>
                <li>• Time is flexible</li>
                <li>• Personal space varies</li>
                <li>• Always carry ID</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Need Help Planning?</h3>
          <p className="text-blue-800 mb-4">
            Our travel experts are here to help you prepare for your trip. Get personalized advice
            based on your destination and travel style.
          </p>
          <Button className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 font-medium">
            Get Expert Advice
          </Button>
        </div>
      </div>
    </div>
  )
}
