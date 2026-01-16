
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: 'Join Membership | ATLVS + GVTEWAY',
  description: 'Sign up for our exclusive membership program and unlock premium travel benefits.',
}

export default function MembershipJoinPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Join Our Membership</h1>
          <p className="text-lg text-neutral-600">Start your premium travel journey today</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Choose Your Membership Tier</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="border-2 border-blue-300 rounded-lg p-6 bg-blue-50">
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Individual Membership</h3>
              <p className="text-neutral-600 mb-4">Perfect for solo travelers and couples</p>
              <div className="text-2xl font-bold text-accent-secondary mb-4">$199/year</div>
              <ul className="text-sm text-neutral-600 space-y-2 mb-6">
                <li> 10% discount on all bookings</li>
                <li> $100 annual travel credits</li>
                <li> Priority booking access</li>
                <li> 24/7 concierge support</li>
                <li> Exclusive member events</li>
              </ul>
              <label className="flex items-center mb-4">
                <Input type="radio" name="tier" value="individual" className="mr-2" defaultChecked />
                <span className="text-neutral-900">Select Individual</span>
              </label>
            </div>

            <div className="border-2 border-green-300 rounded-lg p-6 bg-green-50">
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Family Membership</h3>
              <p className="text-neutral-600 mb-4">Includes up to 6 family members</p>
              <div className="text-2xl font-bold text-semantic-success mb-4">$399/year</div>
              <ul className="text-sm text-neutral-600 space-y-2 mb-6">
                <li> All individual benefits</li>
                <li> Family travel planning</li>
                <li> Kids' adventure discounts</li>
                <li> Family event invitations</li>
                <li> Childcare recommendations</li>
              </ul>
              <label className="flex items-center mb-4">
                <Input type="radio" name="tier" value="family" className="mr-2" />
                <span className="text-neutral-900">Select Family</span>
              </label>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Personal Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-2">
                  First Name
                </label>
                <Input
                  type="text"
                  id="firstName"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-2">
                  Last Name
                </label>
                <Input
                  type="text"
                  id="lastName"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  required
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <Input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                required
              />
            </div>

            <div className="mt-6">
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                Phone Number
              </label>
              <Input
                type="tel"
                id="phone"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Payment Information</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="cardNumber" className="block text-sm font-medium text-neutral-700 mb-2">
                  Card Number
                </label>
                <Input
                  type="text"
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="expiry" className="block text-sm font-medium text-neutral-700 mb-2">
                    Expiry Date
                  </label>
                  <Input
                    type="text"
                    id="expiry"
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="cvv" className="block text-sm font-medium text-neutral-700 mb-2">
                    CVV
                  </label>
                  <Input
                    type="text"
                    id="cvv"
                    placeholder="123"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <div className="flex items-start">
              <Input
                type="checkbox"
                id="terms"
                className="mt-1 mr-3"
                required
              />
              <label htmlFor="terms" className="text-sm text-neutral-600">
                I agree to the <a href="/legal/terms" className="text-accent-secondary hover:text-blue-800">Terms of Service</a> and <a href="/legal/privacy" className="text-accent-secondary hover:text-blue-800">Privacy Policy</a>.
                I understand that membership fees are billed annually and can be cancelled anytime.
              </label>
            </div>

            <div className="flex items-start mt-4">
              <Input
                type="checkbox"
                id="marketing"
                className="mt-1 mr-3"
              />
              <label htmlFor="marketing" className="text-sm text-neutral-600">
                I would like to receive exclusive offers, travel tips, and updates via email.
              </label>
            </div>
          </div>

          <div className="mt-8">
            <Button
              type="submit"
              className="w-full bg-accent-secondary text-primary-foreground py-3 px-6 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 font-medium"
            >
              Complete Membership Signup
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Membership Details</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-neutral-900 mb-2">Billing & Cancellation</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Annual billing with automatic renewal</li>
                <li>• Cancel anytime with no penalties</li>
                <li>• Prorated refunds for early cancellation</li>
                <li>• Secure payment processing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-neutral-900 mb-2">Getting Started</h4>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Instant access to member benefits</li>
                <li>• Welcome email with exclusive offers</li>
                <li>• Personal concierge introduction</li>
                <li>• Member dashboard activation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
