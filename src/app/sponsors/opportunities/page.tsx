
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sponsorship Opportunities | ATLVS + GVTEWAY',
  description: 'Explore detailed sponsorship packages and opportunities for your brand.',
}

export default function OpportunitiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Sponsorship Opportunities</h1>
          <p className="text-lg text-neutral-600">Find the perfect sponsorship package for your brand</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Available Packages</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-neutral-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-neutral-300 px-4 py-3 text-left font-semibold text-neutral-900">Package</th>
                  <th className="border border-neutral-300 px-4 py-3 text-center font-semibold text-neutral-900">Platinum</th>
                  <th className="border border-neutral-300 px-4 py-3 text-center font-semibold text-neutral-900">Gold</th>
                  <th className="border border-neutral-300 px-4 py-3 text-center font-semibold text-neutral-900">Silver</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-neutral-300 px-4 py-3 font-medium">Investment</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center font-bold">$50,000+</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center font-bold">$25,000+</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center font-bold">$10,000+</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-neutral-300 px-4 py-3 font-medium">Logo Placement</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">Prime homepage</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">Prominent</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">Standard</td>
                </tr>
                <tr>
                  <td className="border border-neutral-300 px-4 py-3 font-medium">Event Access</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">Exclusive VIP</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">Premium</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">Standard</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-neutral-300 px-4 py-3 font-medium">Social Media</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">Dedicated posts</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">Featured mentions</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">Regular posts</td>
                </tr>
                <tr>
                  <td className="border border-neutral-300 px-4 py-3 font-medium">Email Marketing</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">Custom campaigns</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">Featured placement</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">Newsletter feature</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-neutral-300 px-4 py-3 font-medium">Press Release</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">Full distribution</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">Targeted</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">Basic</td>
                </tr>
                <tr>
                  <td className="border border-neutral-300 px-4 py-3 font-medium">Analytics</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">Comprehensive</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">Detailed</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">Basic</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Event Sponsorship</h2>
            <div className="space-y-4">
              <div className="border border-neutral-200 rounded-lg p-4">
                <h3 className="font-medium text-neutral-900 mb-2">Travel Tech Summit</h3>
                <p className="text-sm text-neutral-600 mb-2">Annual conference for travel industry leaders</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-500">March 15-17, 2024</span>
                  <span className="font-bold text-semantic-success">$35,000</span>
                </div>
              </div>
              <div className="border border-neutral-200 rounded-lg p-4">
                <h3 className="font-medium text-neutral-900 mb-2">Adventure Travel Expo</h3>
                <p className="text-sm text-neutral-600 mb-2">Showcase outdoor and adventure experiences</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-500">June 8-10, 2024</span>
                  <span className="font-bold text-semantic-success">$28,000</span>
                </div>
              </div>
              <div className="border border-neutral-200 rounded-lg p-4">
                <h3 className="font-medium text-neutral-900 mb-2">Luxury Travel Showcase</h3>
                <p className="text-sm text-neutral-600 mb-2">Premium travel experiences and destinations</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-500">September 12-14, 2024</span>
                  <span className="font-bold text-semantic-success">$42,000</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Digital Sponsorship</h2>
            <div className="space-y-4">
              <div className="border border-neutral-200 rounded-lg p-4">
                <h3 className="font-medium text-neutral-900 mb-2">Homepage Banner</h3>
                <p className="text-sm text-neutral-600 mb-2">Prime placement on our homepage</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-500">3-month rotation</span>
                  <span className="font-bold text-accent-secondary">$12,000</span>
                </div>
              </div>
              <div className="border border-neutral-200 rounded-lg p-4">
                <h3 className="font-medium text-neutral-900 mb-2">Newsletter Sponsorship</h3>
                <p className="text-sm text-neutral-600 mb-2">Featured in weekly newsletter</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-500">Monthly feature</span>
                  <span className="font-bold text-accent-secondary">$8,000</span>
                </div>
              </div>
              <div className="border border-neutral-200 rounded-lg p-4">
                <h3 className="font-medium text-neutral-900 mb-2">Social Media Takeover</h3>
                <p className="text-sm text-neutral-600 mb-2">Control our social media for a day</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-500">One-day campaign</span>
                  <span className="font-bold text-accent-secondary">$15,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Custom Sponsorship Packages</h2>
          <p className="text-neutral-600 mb-6">
            Don&apos;t see exactly what you&apos;re looking for? We can create a custom sponsorship package
            tailored to your brand's goals and target audience.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-background rounded-lg p-4 text-center">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Destination Partnership</h3>
              <p className="text-sm text-neutral-600">Co-brand a specific destination or region</p>
            </div>
            <div className="bg-background rounded-lg p-4 text-center">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Experience Sponsorship</h3>
              <p className="text-sm text-neutral-600">Sponsor specific activities or experiences</p>
            </div>
            <div className="bg-background rounded-lg p-4 text-center">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Content Collaboration</h3>
              <p className="text-sm text-neutral-600">Partner on content creation and distribution</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">ROI & Measurement</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-blue-900 mb-3">What We Track</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Website traffic and engagement</li>
                <li>• Social media impressions and interactions</li>
                <li>• Email open rates and click-throughs</li>
                <li>• Event attendance and lead generation</li>
                <li>• Brand mentions and sentiment analysis</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-3">Reporting</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Monthly performance reports</li>
                <li>• Real-time dashboard access</li>
                <li>• Custom analytics setup</li>
                <li>• ROI analysis and recommendations</li>
                <li>• Competitive benchmarking</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Ready to Discuss Sponsorship?</h2>
          <p className="text-neutral-600 mb-6">Let&apos;s create a partnership that delivers results for your brand</p>
          <div className="flex justify-center gap-4">
            <Link href="/sponsors/inquire" className="bg-semantic-warning text-primary-foreground px-6 py-3 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-semantic-warning focus:ring-offset-2">
              Start Inquiry
            </Link>
            <Link href="/sponsors/case-studies" className="bg-background text-semantic-warning border border-yellow-600 px-6 py-3 rounded-md hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2">
              View Case Studies
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
