
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Benefits | ATLVS + GVTEWAY Careers',
  description: 'Explore comprehensive employee benefits and perks at ATLVS + GVTEWAY.',
}

export default function BenefitsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Benefits & Perks</h1>
          <p className="text-lg text-neutral-600">Comprehensive benefits designed to support your well-being and growth</p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-lg p-8 text-primary-foreground mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">More Than Just a Job</h2>
            <p className="text-xl mb-6">We invest in your health, happiness, and future</p>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl mb-2 block"></span>
                <h3 className="font-semibold">Health First</h3>
                <p className="text-sm">Comprehensive healthcare</p>
              </div>
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl mb-2 block">️</span>
                <h3 className="font-semibold">Work-Life Balance</h3>
                <p className="text-sm">Flexible time off</p>
              </div>
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl mb-2 block"></span>
                <h3 className="font-semibold">Growth</h3>
                <p className="text-sm">Learning opportunities</p>
              </div>
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl mb-2 block">️</span>
                <h3 className="font-semibold">Travel Perks</h3>
                <p className="text-sm">Exclusive discounts</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-4xl"></span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Health & Wellness</h3>
            <ul className="text-sm text-neutral-600 space-y-2">
              <li>• Comprehensive medical, dental, vision</li>
              <li>• Mental health support & counseling</li>
              <li>• Fitness center memberships</li>
              <li>• Wellness stipend ($500/year)</li>
              <li>• Ergonomic home office setup</li>
              <li>• Annual health screenings</li>
            </ul>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-4xl"></span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Financial Security</h3>
            <ul className="text-sm text-neutral-600 space-y-2">
              <li>• Competitive salary & equity</li>
              <li>• 401(k) with 4% company match</li>
              <li>• Annual bonus program</li>
              <li>• Employee stock purchase plan</li>
              <li>• Financial planning assistance</li>
              <li>• Commuter benefits</li>
            </ul>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-4xl">️</span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Time Off & Flexibility</h3>
            <ul className="text-sm text-neutral-600 space-y-2">
              <li>• Unlimited PTO policy</li>
              <li>• 12 paid holidays</li>
              <li>• Flexible work hours</li>
              <li>• Remote work options</li>
              <li>• Sabbatical program (after 5 years)</li>
              <li>• Paid parental leave (16 weeks)</li>
            </ul>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-4xl"></span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Learning & Development</h3>
            <ul className="text-sm text-neutral-600 space-y-2">
              <li>• Annual learning stipend ($2,000)</li>
              <li>• Conference attendance budget</li>
              <li>• Online course subscriptions</li>
              <li>• Internal training programs</li>
              <li>• Leadership development</li>
              <li>• Career coaching</li>
            </ul>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-4xl">‍‍‍</span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Family Support</h3>
            <ul className="text-sm text-neutral-600 space-y-2">
              <li>• Backup childcare ($5,000/year)</li>
              <li>• Elder care assistance</li>
              <li>• Adoption assistance ($5,000)</li>
              <li>• Fertility treatment coverage</li>
              <li>• Family leave top-up pay</li>
              <li>• School tuition assistance</li>
            </ul>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-4">
              <span className="text-4xl">️</span>
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-3">Travel Benefits</h3>
            <ul className="text-sm text-neutral-600 space-y-2">
              <li>• Employee travel credits ($1,000/year)</li>
              <li>• Family travel discounts</li>
              <li>• Hotel & rental car partnerships</li>
              <li>• Airport lounge access</li>
              <li>• Travel insurance</li>
              <li>• Company retreats & trips</li>
            </ul>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Benefits by Location</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-neutral-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-neutral-300 px-4 py-3 text-left font-semibold text-neutral-900">Benefit</th>
                  <th className="border border-neutral-300 px-4 py-3 text-center font-semibold text-neutral-900">US</th>
                  <th className="border border-neutral-300 px-4 py-3 text-center font-semibold text-neutral-900">UK</th>
                  <th className="border border-neutral-300 px-4 py-3 text-center font-semibold text-neutral-900">Germany</th>
                  <th className="border border-neutral-300 px-4 py-3 text-center font-semibold text-neutral-900">Remote</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-neutral-300 px-4 py-3 font-medium">Health Insurance</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center"></td>
                  <td className="border border-neutral-300 px-4 py-3 text-center"></td>
                  <td className="border border-neutral-300 px-4 py-3 text-center"></td>
                  <td className="border border-neutral-300 px-4 py-3 text-center"></td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-neutral-300 px-4 py-3 font-medium">Unlimited PTO</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center"></td>
                  <td className="border border-neutral-300 px-4 py-3 text-center"></td>
                  <td className="border border-neutral-300 px-4 py-3 text-center"></td>
                  <td className="border border-neutral-300 px-4 py-3 text-center"></td>
                </tr>
                <tr>
                  <td className="border border-neutral-300 px-4 py-3 font-medium">Learning Stipend</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">$2,000</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">£1,500</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">€1,800</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">$2,000</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-neutral-300 px-4 py-3 font-medium">Travel Credits</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">$1,000</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">£750</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">€900</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">$1,000</td>
                </tr>
                <tr>
                  <td className="border border-neutral-300 px-4 py-3 font-medium">Parental Leave</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">16 weeks</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">12 months</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">14 months</td>
                  <td className="border border-neutral-300 px-4 py-3 text-center">16 weeks</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Employee Testimonials</h2>
            <div className="space-y-6">
              <div>
                <blockquote className="text-neutral-700 italic mb-3">
                  "The benefits package is incredible. Between the unlimited PTO, learning stipend,
                  and travel credits, I feel truly supported in both my professional and personal growth."
                </blockquote>
                <p className="text-sm font-medium text-neutral-900">- Alex Johnson, Software Engineer</p>
              </div>
              <div>
                <blockquote className="text-neutral-700 italic mb-3">
                  "As a parent, the family benefits have been a game-changer. The backup childcare
                  and parental leave policies made it possible for me to balance work and family."
                </blockquote>
                <p className="text-sm font-medium text-neutral-900">- Maria Garcia, Product Manager</p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Wellness Programs</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="w-8 h-8 bg-accent-primary/10 text-blue-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Mindfulness & Wellness</h3>
                  <p className="text-sm text-neutral-600">Weekly meditation sessions and wellness workshops</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-8 h-8 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Fitness Challenges</h3>
                  <p className="text-sm text-neutral-600">Company-wide fitness challenges with prizes</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-8 h-8 bg-accent-primary/10 text-purple-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Healthy Living</h3>
                  <p className="text-sm text-neutral-600">Nutrition counseling and healthy snack programs</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-8 h-8 bg-semantic-warning/10 text-orange-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Spa & Relaxation</h3>
                  <p className="text-sm text-neutral-600">Massage credits and relaxation room access</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Equity & Ownership</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Employee Stock Options</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Competitive equity packages</li>
                <li>• Vesting over 4 years</li>
                <li>• Early exercise options</li>
                <li>• Tax-advantaged RSUs</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Ownership Culture</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Transparent financials</li>
                <li>• Regular all-hands updates</li>
                <li>• Employee input on decisions</li>
                <li>• Profit-sharing programs</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Questions About Benefits?</h2>
          <p className="text-neutral-600 mb-6">Our benefits are designed to support every aspect of your life</p>
          <div className="flex justify-center gap-4">
            <a href="/careers/openings" className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              View Open Positions
            </a>
            <a href="/contact" className="bg-background text-accent-secondary border border-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Contact HR
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
