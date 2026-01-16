
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Sponsorship | ATLVS + GVTEWAY',
  description: 'Become a sponsor and gain visibility across our premium travel platform and events.',
}

export default function SponsorsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Sponsorship Opportunities</h1>
          <p className="text-lg text-neutral-600">Connect with premium travelers and elevate your brand</p>
        </div>

        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-8 text-primary-foreground mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Why Sponsor With Us?</h2>
            <p className="text-xl mb-6">Reach discerning travelers who value quality and authenticity</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl"></span>
                <h3 className="font-semibold mt-2">Targeted Audience</h3>
                <p className="text-sm">Premium travelers with high spending power</p>
              </div>
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl"></span>
                <h3 className="font-semibold mt-2">Global Reach</h3>
                <p className="text-sm">International platform with worldwide impact</p>
              </div>
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl"></span>
                <h3 className="font-semibold mt-2">Brand Alignment</h3>
                <p className="text-sm">Luxury and authentic travel experiences</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4"></div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Platinum Sponsorship</h3>
            <div className="text-3xl font-bold text-neutral-900 mb-4">$50,000+</div>
            <ul className="text-sm text-neutral-600 space-y-2 mb-6">
              <li> Prime logo placement</li>
              <li> Exclusive event access</li>
              <li> Social media features</li>
              <li> Press release distribution</li>
              <li> VIP experiences</li>
            </ul>
            <Button className="w-full bg-semantic-warning text-primary-foreground py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-semantic-warning focus:ring-offset-2">
              Learn More
            </Button>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6 text-center border-2 border-blue-300">
            <div className="text-4xl mb-4"></div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Gold Sponsorship</h3>
            <div className="text-3xl font-bold text-neutral-900 mb-4">$25,000+</div>
            <ul className="text-sm text-neutral-600 space-y-2 mb-6">
              <li> Prominent logo placement</li>
              <li> Event speaking opportunities</li>
              <li> Email marketing features</li>
              <li> Social media mentions</li>
              <li> Premium event tickets</li>
            </ul>
            <Button className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Learn More
            </Button>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4"></div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">Silver Sponsorship</h3>
            <div className="text-3xl font-bold text-neutral-900 mb-4">$10,000+</div>
            <ul className="text-sm text-neutral-600 space-y-2 mb-6">
              <li> Logo placement</li>
              <li> Event booth space</li>
              <li> Newsletter features</li>
              <li> Website recognition</li>
              <li> Event attendance</li>
            </ul>
            <Button className="w-full bg-neutral-600 text-primary-foreground py-2 px-4 rounded-md hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2">
              Learn More
            </Button>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Sponsorship Categories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-green-300 transition-colors">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Events</h3>
              <p className="text-sm text-neutral-600">Travel shows, workshops, and experiences</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-blue-300 transition-colors">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Digital</h3>
              <p className="text-sm text-neutral-600">Website, social media, and email marketing</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-purple-300 transition-colors">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Destinations</h3>
              <p className="text-sm text-neutral-600">Location-based partnerships and co-branding</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-orange-300 transition-colors">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Experiences</h3>
              <p className="text-sm text-neutral-600">Activity and tour sponsorships</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Sponsor Benefits</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium text-neutral-900 mb-4">Brand Visibility</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Website Presence</h4>
                    <p className="text-sm text-neutral-600">Logo and brand placement across our platform</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Social Media</h4>
                    <p className="text-sm text-neutral-600">Featured posts and stories across our channels</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Email Marketing</h4>
                    <p className="text-sm text-neutral-600">Branded newsletters and promotional emails</p>
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-4">Business Impact</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-accent-primary/10 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Lead Generation</h4>
                    <p className="text-sm text-neutral-600">Direct connections with potential customers</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-accent-primary/10 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Targeted Exposure</h4>
                    <p className="text-sm text-neutral-600">Reach travelers interested in your products/services</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-6 h-6 bg-accent-primary/10 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <div>
                    <h4 className="font-medium text-neutral-900">Partnership Opportunities</h4>
                    <p className="text-sm text-neutral-600">Collaborate on exclusive experiences and events</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Success Stories</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-neutral-900 mb-2">Luxury Resort Chain</h3>
              <p className="text-neutral-600 mb-3">
                &quot;Our platinum sponsorship led to a 40% increase in direct bookings and positioned us as
                the premier choice for luxury travelers. The ROI exceeded our expectations.&quot;
              </p>
              <p className="text-sm text-neutral-500">- Marketing Director, Paradise Resorts</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-neutral-900 mb-2">Adventure Equipment Brand</h3>
              <p className="text-neutral-600 mb-3">
                &quot;Sponsoring travel events gave us incredible exposure to outdoor enthusiasts. Our brand
                awareness increased significantly, and we saw a 25% boost in sales.&quot;
              </p>
              <p className="text-sm text-neutral-500">- CEO, Summit Gear</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Ready to Become a Sponsor?</h2>
          <p className="text-neutral-600 mb-6">Join leading brands who trust us to connect them with premium travelers</p>
          <div className="flex justify-center gap-4">
            <a href="/sponsors/opportunities" className="bg-semantic-warning text-primary-foreground px-6 py-3 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-semantic-warning focus:ring-offset-2">
              View Opportunities
            </a>
            <a href="/sponsors/inquire" className="bg-background text-semantic-warning border border-yellow-600 px-6 py-3 rounded-md hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2">
              Start Conversation
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
