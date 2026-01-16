
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Membership Benefits | ATLVS + GVTEWAY',
  description: 'Discover all the exclusive benefits and perks of our membership program.',
}

export default function MembershipBenefitsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Membership Benefits</h1>
          <p className="text-lg text-neutral-600">Unlock exclusive perks and premium experiences with your membership</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-4xl"></span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Savings & Discounts</h3>
            <ul className="text-sm text-neutral-600 space-y-2">
              <li>• Up to 20% off on all bookings</li>
              <li>• Exclusive member-only pricing</li>
              <li>• Early bird booking discounts</li>
              <li>• Seasonal sale previews</li>
              <li>• Preferred partner rates</li>
            </ul>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-4xl"></span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Priority Access</h3>
            <ul className="text-sm text-neutral-600 space-y-2">
              <li>• Early booking windows</li>
              <li>• VIP event invitations</li>
              <li>• Exclusive experience access</li>
              <li>• Premium seating options</li>
              <li>• Skip-the-line privileges</li>
            </ul>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-4xl"></span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Travel Credits</h3>
            <ul className="text-sm text-neutral-600 space-y-2">
              <li>• Annual travel credit bonuses</li>
              <li>• Birthday travel credits</li>
              <li>• Referral credit rewards</li>
              <li>• Milestone celebration credits</li>
              <li>• Loyalty program multipliers</li>
            </ul>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-4xl">️</span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Concierge Service</h3>
            <ul className="text-sm text-neutral-600 space-y-2">
              <li>• 24/7 travel support</li>
              <li>• Personal trip planning</li>
              <li>• Emergency assistance</li>
              <li>• Special request handling</li>
              <li>• VIP arrangements</li>
            </ul>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-4xl"></span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Exclusive Experiences</h3>
            <ul className="text-sm text-neutral-600 space-y-2">
              <li>• Members-only events</li>
              <li>• Behind-the-scenes access</li>
              <li>• Celebrity meet & greets</li>
              <li>• Private tours</li>
              <li>• Limited availability experiences</li>
            </ul>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-4xl">️</span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Travel Protection</h3>
            <ul className="text-sm text-neutral-600 space-y-2">
              <li>• Trip cancellation coverage</li>
              <li>• Travel delay protection</li>
              <li>• Baggage loss insurance</li>
              <li>• Medical emergency coverage</li>
              <li>• 24/7 emergency hotline</li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-primary-foreground mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Tier-Specific Benefits</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-background bg-opacity-10 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Explorer</h3>
                <ul className="text-sm space-y-1">
                  <li>• 5% booking discount</li>
                  <li>• $25 travel credits</li>
                  <li>• Email support</li>
                  <li>• Member deals access</li>
                </ul>
              </div>
              <div className="bg-background bg-opacity-10 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Adventurer</h3>
                <ul className="text-sm space-y-1">
                  <li>• 10% booking discount</li>
                  <li>• $100 travel credits</li>
                  <li>• Priority booking</li>
                  <li>• 24/7 chat support</li>
                  <li>• Exclusive events</li>
                </ul>
              </div>
              <div className="bg-background bg-opacity-10 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">VIP</h3>
                <ul className="text-sm space-y-1">
                  <li>• 15% booking discount</li>
                  <li>• $250 travel credits</li>
                  <li>• VIP priority booking</li>
                  <li>• Personal concierge</li>
                  <li>• Airport lounge access</li>
                </ul>
              </div>
              <div className="bg-background bg-opacity-10 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Legend</h3>
                <ul className="text-sm space-y-1">
                  <li>• 20% booking discount</li>
                  <li>• $500 travel credits</li>
                  <li>• Instant booking priority</li>
                  <li>• Dedicated concierge</li>
                  <li>• Global lounge access</li>
                  <li>• Private jet credits</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">Loyalty Rewards</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-accent-primary pl-4">
                <h4 className="font-medium text-neutral-900">Travel Milestones</h4>
                <p className="text-sm text-neutral-600">Earn bonus credits for every trip completed</p>
              </div>
              <div className="border-l-4 border-semantic-success pl-4">
                <h4 className="font-medium text-neutral-900">Referral Program</h4>
                <p className="text-sm text-neutral-600">Get credits for each friend who joins</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium text-neutral-900">Tier Upgrades</h4>
                <p className="text-sm text-neutral-600">Automatic upgrades based on travel frequency</p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-neutral-900 mb-4">Community Perks</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-semantic-error pl-4">
                <h4 className="font-medium text-neutral-900">Member Forums</h4>
                <p className="text-sm text-neutral-600">Connect with fellow travelers and share tips</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-medium text-neutral-900">Expert Webinars</h4>
                <p className="text-sm text-neutral-600">Learn from travel experts and influencers</p>
              </div>
              <div className="border-l-4 border-teal-500 pl-4">
                <h4 className="font-medium text-neutral-900">Photo Contests</h4>
                <p className="text-sm text-neutral-600">Share your travel photos for prizes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Real Member Stories</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-background rounded-lg p-4">
              <p className="text-neutral-600 text-sm mb-3">
                "The membership paid for itself on the first trip. The 15% discount and priority booking got us into sold-out experiences we never could have accessed otherwise."
              </p>
              <p className="text-sm font-medium text-neutral-900">- VIP Member Sarah K.</p>
            </div>
            <div className="bg-background rounded-lg p-4">
              <p className="text-neutral-600 text-sm mb-3">
                "Having a personal concierge changed everything. They handled all the details so I could focus on enjoying my vacation. Worth every penny!"
              </p>
              <p className="text-sm font-medium text-neutral-900">- Legend Member Michael T.</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Ready to Unlock These Benefits?</h2>
          <p className="text-neutral-600 mb-6">Join our membership program today and start experiencing travel like never before.</p>
          <div className="flex justify-center gap-4">
            <a href="/memberships/tiers" className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Compare Tiers
            </a>
            <a href="/memberships/join" className="bg-semantic-success text-primary-foreground px-6 py-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-semantic-success focus:ring-offset-2">
              Join Now
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
