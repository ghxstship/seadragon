
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Membership Tiers | ATLVS + GVTEWAY',
  description: 'Compare our membership tiers and find the perfect plan for your travel needs.',
}

export default function MembershipTiersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Choose Your Membership Tier</h1>
          <p className="text-lg text-neutral-600">Find the perfect membership level for your travel style and needs</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6 border-2 border-neutral-200">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Explorer</h3>
              <div className="text-3xl font-bold text-neutral-900 mb-2">$99<span className="text-lg text-neutral-600">/year</span></div>
              <p className="text-sm text-neutral-600">Perfect for occasional travelers</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                5% discount on bookings
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Basic travel credits ($25/year)
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Email support
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Member-only deals
              </li>
            </ul>
            <Button className="w-full bg-neutral-600 text-primary-foreground py-2 px-4 rounded-md hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2">
              Select Explorer
            </Button>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6 border-2 border-blue-300 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-accent-secondary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
              Best Value
            </div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Adventurer</h3>
              <div className="text-3xl font-bold text-neutral-900 mb-2">$199<span className="text-lg text-neutral-600">/year</span></div>
              <p className="text-sm text-neutral-600">Great for regular travelers</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                10% discount on bookings
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Travel credits ($100/year)
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Priority booking access
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                24/7 chat support
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Exclusive member events
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Free cancellation (48h)
              </li>
            </ul>
            <Button className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Select Adventurer
            </Button>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6 border-2 border-purple-300">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">VIP</h3>
              <div className="text-3xl font-bold text-neutral-900 mb-2">$399<span className="text-lg text-neutral-600">/year</span></div>
              <p className="text-sm text-neutral-600">For luxury travelers</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                15% discount on bookings
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Travel credits ($250/year)
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                VIP booking priority
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Personal concierge
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Exclusive VIP events
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Free cancellation (24h)
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Airport lounge access
              </li>
            </ul>
            <Button className="w-full bg-accent-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
              Select VIP
            </Button>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6 border-2 border-gold-300">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Legend</h3>
              <div className="text-3xl font-bold text-neutral-900 mb-2">$799<span className="text-lg text-neutral-600">/year</span></div>
              <p className="text-sm text-neutral-600">Ultimate luxury experience</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                20% discount on bookings
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Travel credits ($500/year)
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Instant booking priority
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Dedicated concierge
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Private Legend events
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Free cancellation (anytime)
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Global lounge access
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Private jet charter credits
              </li>
            </ul>
            <Button className="w-full bg-semantic-warning text-primary-foreground py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-semantic-warning focus:ring-offset-2">
              Select Legend
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Compare All Features</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-neutral-300">
              <thead>
                <tr className="bg-neutral-100">
                  <th className="border border-neutral-300 px-4 py-3 text-left font-semibold text-neutral-900">Feature</th>
                  <th className="border border-neutral-300 px-4 py-3 text-center font-semibold text-neutral-900">Explorer</th>
                  <th className="border border-neutral-300 px-4 py-3 text-center font-semibold text-neutral-900">Adventurer</th>
                  <th className="border border-neutral-300 px-4 py-3 text-center font-semibold text-neutral-900">VIP</th>
                  <th className="border border-neutral-300 px-4 py-3 text-center font-semibold text-neutral-900">Legend</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-neutral-300 px-4 py-3 font-medium">Booking Discount</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">5%</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">10%</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">15%</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">20%</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-neutral-300 px-4 py-3 font-medium">Travel Credits</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">$25</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">$100</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">$250</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">$500</td>
                </tr>
                <tr>
                  <td className="border border-neutral-300 px-4 py-3 font-medium">Priority Booking</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center"></td>
                  <td className="border border-neutral-300 px-4 py-3 text-center"></td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">VIP</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">Instant</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-neutral-300 px-4 py-3 font-medium">Concierge Support</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">Email</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">24/7 Chat</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">Personal</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">Dedicated</td>
                </tr>
                <tr>
                  <td className="border border-neutral-300 px-4 py-3 font-medium">Exclusive Events</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center"></td>
                  <td className="border border-neutral-300 px-4 py-3 text-center"></td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">VIP</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">Private</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-neutral-300 px-4 py-3 font-medium">Free Cancellation</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center"></td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">48h</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">24h</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">Anytime</td>
                </tr>
                <tr>
                  <td className="border border-neutral-300 px-4 py-3 font-medium">Lounge Access</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center"></td>
                  <td className="border border-neutral-300 px-4 py-3 text-center"></td>
                  <td className="border border-neutral-300 px-4 py-3 text-center"></td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">Global</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-neutral-300 px-4 py-3 font-medium">Private Jet Credits</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center"></td>
                  <td className="border border-neutral-300 px-4 py-3 text-center"></td>
                  <td className="border border-neutral-300 px-4 py-3 text-center"></td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">$5,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Not Sure Which Tier is Right for You?</h2>
          <p className="text-neutral-600 mb-6">Take our quick quiz to find your perfect membership level, or contact our membership specialists for personalized recommendations.</p>
          <div className="flex justify-center gap-4">
            <Button className="bg-semantic-success text-primary-foreground px-6 py-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-semantic-success focus:ring-offset-2">
              Take Membership Quiz
            </Button>
            <Button className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Contact Specialist
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
