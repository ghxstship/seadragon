
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sponsor Case Studies | ATLVS + GVTEWAY',
  description: 'Real results and success stories from our sponsorship partnerships.',
}

export default function CaseStudiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Sponsor Case Studies</h1>
          <p className="text-lg text-neutral-600">Real results from successful sponsorship partnerships</p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-8 text-primary-foreground mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Proven Results</h2>
            <p className="text-xl mb-6">See how our sponsors achieve measurable success</p>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold mb-1">250%</div>
                <h3 className="font-semibold text-sm">Average ROI</h3>
              </div>
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold mb-1">3.5x</div>
                <h3 className="font-semibold text-sm">Lead Increase</h3>
              </div>
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold mb-1">85%</div>
                <h3 className="font-semibold text-sm">Brand Awareness</h3>
              </div>
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold mb-1">12</div>
                <h3 className="font-semibold text-sm">Months Average</h3>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-12 mb-12">
          <div className="bg-background rounded-lg shadow-md overflow-hidden">
            <div className="h-64 bg-gradient-to-r from-blue-400 to-purple-500"></div>
            <div className="p-8">
              <div className="flex items-center space-x-4 mb-4">
                <span className="bg-accent-primary/10 text-blue-800 text-sm px-3 py-1 rounded">Platinum Sponsor</span>
                <span className="text-neutral-500">•</span>
                <span className="text-neutral-600">Travel Tech Summit 2024</span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Luxury Airlines Alliance</h2>
              <p className="text-neutral-700 mb-6">
                As a platinum sponsor of our Travel Tech Summit, Luxury Airlines Alliance achieved
                remarkable results in brand awareness and lead generation.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Key Achievements</h3>
                  <ul className="space-y-2 text-neutral-600">
                    <li>• 340% increase in qualified leads</li>
                    <li>• 2.1 million social media impressions</li>
                    <li>• 45% boost in brand consideration</li>
                    <li>• $2.3M in attributed revenue</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Campaign Highlights</h3>
                  <ul className="space-y-2 text-neutral-600">
                    <li>• Keynote presentation at summit</li>
                    <li>• Exclusive VIP networking dinner</li>
                    <li>• Branded lounge experience</li>
                    <li>• Multi-channel digital campaign</li>
                  </ul>
                </div>
              </div>

              <blockquote className="border-l-4 border-accent-primary pl-4 italic text-neutral-700">
                &quot;The sponsorship exceeded our expectations. Not only did we generate significant leads,
                but we also positioned our brand as an innovator in the travel technology space.&quot;
                <footer className="mt-2 font-medium text-neutral-900">- Maria Rodriguez, CMO, Luxury Airlines Alliance</footer>
              </blockquote>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden">
            <div className="h-64 bg-gradient-to-r from-green-400 to-teal-500"></div>
            <div className="p-8">
              <div className="flex items-center space-x-4 mb-4">
                <span className="bg-semantic-success/10 text-green-800 text-sm px-3 py-1 rounded">Gold Sponsor</span>
                <span className="text-neutral-500">•</span>
                <span className="text-neutral-600">Adventure Travel Expo 2024</span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Adventure Gear Pro</h2>
              <p className="text-neutral-700 mb-6">
                Adventure Gear Pro&apos;s gold sponsorship of our Adventure Travel Expo resulted in
                significant sales growth and market expansion.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Business Impact</h3>
                  <ul className="space-y-2 text-neutral-600">
                    <li>• 95% increase in online sales</li>
                    <li>• 150 new retail partnerships</li>
                    <li>• 78% improvement in brand perception</li>
                    <li>• $890K in direct revenue</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Engagement Metrics</h3>
                  <ul className="space-y-2 text-neutral-600">
                    <li>• 500K+ event attendees reached</li>
                    <li>• 25K product demo requests</li>
                    <li>• 15K social media followers gained</li>
                    <li>• 92% positive sentiment increase</li>
                  </ul>
                </div>
              </div>

              <blockquote className="border-l-4 border-semantic-success pl-4 italic text-neutral-700">
                &quot;The expo sponsorship was a game-changer for our brand. We connected with our target
                audience in meaningful ways and saw immediate impact on our sales and partnerships.&quot;
                <footer className="mt-2 font-medium text-neutral-900">- David Chen, CEO, Adventure Gear Pro</footer>
              </blockquote>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md overflow-hidden">
            <div className="h-64 bg-gradient-to-r from-purple-400 to-pink-500"></div>
            <div className="p-8">
              <div className="flex items-center space-x-4 mb-4">
                <span className="bg-accent-primary/10 text-purple-800 text-sm px-3 py-1 rounded">Silver Sponsor</span>
                <span className="text-neutral-500">•</span>
                <span className="text-neutral-600">Digital Campaign 2024</span>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">Wellness Retreats International</h2>
              <p className="text-neutral-700 mb-6">
                Through our digital sponsorship program, Wellness Retreats International achieved
                impressive growth in their premium retreat bookings.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Digital Performance</h3>
                  <ul className="space-y-2 text-neutral-600">
                    <li>• 400% increase in website traffic</li>
                    <li>• 65% improvement in conversion rate</li>
                    <li>• 120% growth in email subscribers</li>
                    <li>• $450K in booking revenue</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-3">Content Impact</h3>
                  <ul className="space-y-2 text-neutral-600">
                    <li>• 2.8M newsletter impressions</li>
                    <li>• 45K social media engagements</li>
                    <li>• 18K content shares</li>
                    <li>• Featured in 25+ publications</li>
                  </ul>
                </div>
              </div>

              <blockquote className="border-l-4 border-purple-500 pl-4 italic text-neutral-700">
                &quot;The digital sponsorship gave us incredible reach and credibility. Our brand was
                associated with premium travel content, which resonated perfectly with our audience.&quot;
                <footer className="mt-2 font-medium text-neutral-900">- Sarah Johnson, Marketing Director, Wellness Retreats International</footer>
              </blockquote>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">ROI Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-neutral-300">
              <thead>
                <tr className="bg-neutral-100">
                  <th className="border border-neutral-300 px-4 py-3 text-left font-semibold text-neutral-900">Sponsor</th>
                  <th className="border border-neutral-300 px-4 py-3 text-center font-semibold text-neutral-900">Investment</th>
                  <th className="border border-neutral-300 px-4 py-3 text-center font-semibold text-neutral-900">Revenue Generated</th>
                  <th className="border border-neutral-300 px-4 py-3 text-center font-semibold text-neutral-900">ROI</th>
                  <th className="border border-neutral-300 px-4 py-3 text-center font-semibold text-neutral-900">Payback Period</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-neutral-300 px-4 py-3 font-medium">Luxury Airlines Alliance</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">$75,000</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">$2,300,000</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center font-bold text-semantic-success">3,067%</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">2 weeks</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-neutral-300 px-4 py-3 font-medium">Adventure Gear Pro</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">$35,000</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">$890,000</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center font-bold text-semantic-success">2,543%</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">1 week</td>
                </tr>
                <tr>
                  <td className="border border-neutral-300 px-4 py-3 font-medium">Wellness Retreats International</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">$18,000</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">$450,000</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center font-bold text-semantic-success">2,500%</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">3 days</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-neutral-500 mt-4">*ROI calculated over 12-month period including all attributed revenue</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Industry Recognition</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-blue-900 mb-1">Best Sponsorship ROI</h3>
              <p className="text-sm text-blue-800">Travel Marketing Awards 2024</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="font-medium text-blue-900 mb-1">Most Innovative Partnership</h3>
              <p className="text-sm text-blue-800">Brand Partnership Excellence 2024</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-blue-900 mb-1">Digital Campaign of the Year</h3>
              <p className="text-sm text-blue-800">Interactive Marketing Awards 2024</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Ready to Create Your Success Story?</h2>
          <p className="text-neutral-600 mb-6">Join our successful sponsors and achieve measurable results</p>
          <div className="flex justify-center gap-4">
            <Link href="/sponsors/opportunities" className="bg-semantic-warning text-primary-foreground px-6 py-3 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-semantic-warning focus:ring-offset-2">
              Explore Opportunities
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
