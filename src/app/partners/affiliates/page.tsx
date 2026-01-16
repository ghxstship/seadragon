
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Affiliate Program | ATLVS + GVTEWAY',
  description: 'Join our affiliate program and earn commissions by promoting travel experiences.',
}

export default function AffiliatesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Affiliate Program</h1>
          <p className="text-lg text-neutral-600">Earn commissions by sharing amazing travel experiences</p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-lg p-8 text-primary-foreground mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Share. Earn. Travel.</h2>
            <p className="text-xl mb-6">Turn your passion for travel into passive income</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl"></span>
                <h3 className="font-semibold mt-2">Competitive Commissions</h3>
                <p className="text-sm">Up to 10% on bookings</p>
              </div>
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl"></span>
                <h3 className="font-semibold mt-2">Real-time Tracking</h3>
                <p className="text-sm">Monitor earnings instantly</p>
              </div>
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl"></span>
                <h3 className="font-semibold mt-2">Global Reach</h3>
                <p className="text-sm">Promote worldwide</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">How It Works</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-accent-secondary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm mr-4">1</div>
                <div>
                  <h3 className="font-medium text-neutral-900 mb-1">Sign Up</h3>
                  <p className="text-sm text-neutral-600">Create your affiliate account and get your unique tracking links</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-accent-secondary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm mr-4">2</div>
                <div>
                  <h3 className="font-medium text-neutral-900 mb-1">Share & Promote</h3>
                  <p className="text-sm text-neutral-600">Share your affiliate links on social media, blogs, or websites</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-accent-secondary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm mr-4">3</div>
                <div>
                  <h3 className="font-medium text-neutral-900 mb-1">Earn Commissions</h3>
                  <p className="text-sm text-neutral-600">Get paid when people book through your links</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-accent-secondary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm mr-4">4</div>
                <div>
                  <h3 className="font-medium text-neutral-900 mb-1">Get Paid</h3>
                  <p className="text-sm text-neutral-600">Receive monthly payouts for your earnings</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Commission Structure</h2>
            <div className="space-y-4">
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-neutral-900">Experiences & Tours</h3>
                  <span className="text-semantic-success font-bold">10%</span>
                </div>
                <p className="text-sm text-neutral-600">Guided tours, activities, and experiences</p>
              </div>
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-neutral-900">Accommodations</h3>
                  <span className="text-semantic-success font-bold">8%</span>
                </div>
                <p className="text-sm text-neutral-600">Hotels, resorts, and vacation rentals</p>
              </div>
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-neutral-900">Transportation</h3>
                  <span className="text-semantic-success font-bold">6%</span>
                </div>
                <p className="text-sm text-neutral-600">Flights, transfers, and ground transport</p>
              </div>
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-neutral-900">Memberships</h3>
                  <span className="text-semantic-success font-bold">15%</span>
                </div>
                <p className="text-sm text-neutral-600">Annual membership subscriptions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Affiliate Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Performance Dashboard</h3>
              <p className="text-sm text-neutral-600">Track clicks, conversions, and earnings in real-time</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Marketing Materials</h3>
              <p className="text-sm text-neutral-600">Banners, social media posts, and promotional content</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Email Templates</h3>
              <p className="text-sm text-neutral-600">Pre-written emails for different campaigns</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-semantic-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Mobile Links</h3>
              <p className="text-sm text-neutral-600">Shortened URLs perfect for social media</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-semantic-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Targeted Campaigns</h3>
              <p className="text-sm text-neutral-600">Seasonal and destination-specific promotions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Support</h3>
              <p className="text-sm text-neutral-600">Dedicated affiliate support team</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Success Stories</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-background rounded-lg p-6">
              <h3 className="font-semibold text-neutral-900 mb-2">Travel Blogger Extraordinaire</h3>
              <p className="text-neutral-600 mb-3">
                "I've earned over $50,000 in commissions since joining the affiliate program. The high-quality
                experiences and reliable payouts make it a no-brainer for travel content creators."
              </p>
              <p className="text-sm text-neutral-500">- Sarah Johnson, Travel Blogger</p>
            </div>
            <div className="bg-background rounded-lg p-6">
              <h3 className="font-semibold text-neutral-900 mb-2">Social Media Influencer</h3>
              <p className="text-neutral-600 mb-3">
                "The affiliate program has become my primary income source. The commissions are competitive
                and the relationship with the team is fantastic. I highly recommend it!"
              </p>
              <p className="text-sm text-neutral-500">- Mike Chen, Instagram Influencer</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-green-900 mb-4">Program Terms</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-green-900 mb-3">Eligibility</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Must be 18 years or older</li>
                <li>• Valid tax identification</li>
                <li>• Active website or social media presence</li>
                <li>• Compliance with our terms of service</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-green-900 mb-3">Payment</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Monthly payouts for earnings over $50</li>
                <li>• 30-day payment processing period</li>
                <li>• Direct deposit or PayPal payments</li>
                <li>• 1099 tax forms provided annually</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Ready to Start Earning?</h2>
          <p className="text-neutral-600 mb-6">Join thousands of successful affiliates who are earning while sharing their passion for travel</p>
          <Button className="bg-semantic-success text-primary-foreground px-8 py-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-semantic-success focus:ring-offset-2 font-semibold text-lg">
            Apply for Affiliate Program
          </Button>
        </div>
      </div>
    </div>
  )
}
