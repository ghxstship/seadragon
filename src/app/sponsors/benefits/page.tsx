
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sponsor Benefits | ATLVS + GVTEWAY',
  description: 'Discover the comprehensive benefits and value of sponsoring our travel platform.',
}

export default function BenefitsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Sponsor Benefits</h1>
          <p className="text-lg text-neutral-600">Comprehensive value and ROI from your sponsorship investment</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4"></div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Targeted Reach</h3>
            <p className="text-neutral-600">Connect with affluent, well-traveled consumers who spend 3x more on travel</p>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4"></div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Measurable ROI</h3>
            <p className="text-neutral-600">Detailed analytics, lead tracking, and performance reporting</p>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4"></div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Brand Partnership</h3>
            <p className="text-neutral-600">Associate your brand with luxury, authenticity, and premium experiences</p>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6 text-center">
            <div className="text-4xl mb-4"></div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Global Exposure</h3>
            <p className="text-neutral-600">International platform reaching travelers in 50+ countries</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-primary-foreground mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Our Audience</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-background bg-opacity-10 rounded-lg p-4">
                <div className="text-2xl font-bold mb-2">2.5M+</div>
                <h3 className="font-semibold mb-1">Monthly Visitors</h3>
                <p className="text-sm">Active users engaging with our content</p>
              </div>
              <div className="bg-background bg-opacity-10 rounded-lg p-4">
                <div className="text-2xl font-bold mb-2">$85K</div>
                <h3 className="font-semibold mb-1">Average Annual Spend</h3>
                <p className="text-sm">Per traveler on premium experiences</p>
              </div>
              <div className="bg-background bg-opacity-10 rounded-lg p-4">
                <div className="text-2xl font-bold mb-2">45+</div>
                <h3 className="font-semibold mb-1">Countries Reached</h3>
                <p className="text-sm">Global audience across continents</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Comprehensive Benefits Package</h2>

          <div className="space-y-6">
            <div className="border-l-4 border-accent-primary pl-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Digital Presence & Branding</h3>
              <ul className="text-neutral-600 space-y-1">
                <li>• Prime logo placement on homepage and key pages</li>
                <li>• Custom branded content and landing pages</li>
                <li>• Social media features and dedicated posts</li>
                <li>• Email newsletter sponsorship and features</li>
                <li>• Press release distribution and media coverage</li>
              </ul>
            </div>

            <div className="border-l-4 border-semantic-success pl-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Event & Experience Access</h3>
              <ul className="text-neutral-600 space-y-1">
                <li>• VIP invitations to exclusive travel events</li>
                <li>• Speaking opportunities at industry conferences</li>
                <li>• Private experiences and destination previews</li>
                <li>• Behind-the-scenes access and tours</li>
                <li>• Networking with industry leaders and influencers</li>
              </ul>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Marketing & Lead Generation</h3>
              <ul className="text-neutral-600 space-y-1">
                <li>• Direct access to qualified leads and prospects</li>
                <li>• Custom audience targeting and segmentation</li>
                <li>• Co-branded marketing campaigns</li>
                <li>• Influencer partnerships and collaborations</li>
                <li>• Performance-based marketing opportunities</li>
              </ul>
            </div>

            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Data & Analytics</h3>
              <ul className="text-neutral-600 space-y-1">
                <li>• Real-time performance dashboard</li>
                <li>• Detailed analytics and conversion tracking</li>
                <li>• Audience insights and demographic data</li>
                <li>• ROI measurement and reporting</li>
                <li>• Custom research and market analysis</li>
              </ul>
            </div>

            <div className="border-l-4 border-semantic-error pl-6">
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Partnership & Collaboration</h3>
              <ul className="text-neutral-600 space-y-1">
                <li>• Co-creation of exclusive experiences</li>
                <li>• Product integration and testing opportunities</li>
                <li>• Joint marketing initiatives</li>
                <li>• Cross-promotion with other premium brands</li>
                <li>• Long-term strategic partnerships</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Success Metrics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-neutral-900">Brand Awareness Increase</span>
                <span className="font-bold text-semantic-success">+45%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-neutral-900">Website Traffic Growth</span>
                <span className="font-bold text-semantic-success">+120%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-neutral-900">Lead Generation</span>
                <span className="font-bold text-semantic-success">+85%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-neutral-900">Social Media Engagement</span>
                <span className="font-bold text-semantic-success">+200%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-neutral-900">Sales Conversion Rate</span>
                <span className="font-bold text-semantic-success">+35%</span>
              </div>
            </div>
            <p className="text-sm text-neutral-500 mt-4">*Average results from our top performing sponsorships</p>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Exclusive Sponsor Perks</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="w-8 h-8 bg-semantic-warning/10 text-yellow-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5">VIP</span>
                <div>
                  <h3 className="font-medium text-neutral-900">Priority Booking Access</h3>
                  <p className="text-sm text-neutral-600">Skip the lines and get first access to sold-out experiences</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-8 h-8 bg-accent-primary/10 text-blue-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Complimentary Experiences</h3>
                  <p className="text-sm text-neutral-600">Free access to premium experiences for your team</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-8 h-8 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Custom Reporting</h3>
                  <p className="text-sm text-neutral-600">Tailored analytics and performance insights</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-8 h-8 bg-accent-primary/10 text-purple-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Dedicated Support</h3>
                  <p className="text-sm text-neutral-600">Personal account manager and 24/7 support</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Testimonials</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-background rounded-lg p-6">
              <p className="text-neutral-600 mb-4">
                &quot;Our platinum sponsorship delivered exceptional ROI. We saw a 150% increase in qualified leads
                and our brand association with premium travel positioned us perfectly in our market.&quot;
              </p>
              <p className="text-sm font-medium text-neutral-900">- Sarah Chen, CMO, Luxury Resorts International</p>
            </div>
            <div className="bg-background rounded-lg p-6">
              <p className="text-neutral-600 mb-4">
                &quot;The data and analytics provided were outstanding. We could track every aspect of our campaign
                performance and optimize in real-time. Highly recommend for any brand serious about ROI.&quot;
              </p>
              <p className="text-sm font-medium text-neutral-900">- Michael Rodriguez, CEO, Adventure Gear Co.</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Ready to Experience These Benefits?</h2>
          <p className="text-neutral-600 mb-6">Join our successful sponsors and see the difference premium partnership makes</p>
          <div className="flex justify-center gap-4">
            <Link href="/sponsors/opportunities" className="bg-semantic-warning text-primary-foreground px-6 py-3 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-semantic-warning focus:ring-offset-2">
              View Opportunities
            </Link>
            <Link href="/sponsors/inquire" className="bg-background text-semantic-warning border border-yellow-600 px-6 py-3 rounded-md hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2">
              Start Your Partnership
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
