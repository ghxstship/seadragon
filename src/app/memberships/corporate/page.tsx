
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Corporate Memberships | ATLVS + GVTEWAY',
  description: 'Enterprise travel solutions and corporate membership programs for businesses.',
}

export default function MembershipCorporatePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Corporate Memberships</h1>
          <p className="text-lg text-neutral-600">Enterprise travel solutions for modern businesses</p>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-primary-foreground mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Elevate Your Business Travel</h2>
            <p className="text-xl mb-6">Streamline corporate travel with exclusive benefits and dedicated support</p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-background bg-opacity-10 rounded-lg p-4">
                <span className="text-3xl"></span>
                <h3 className="font-semibold mt-2">Business Focused</h3>
                <p className="text-sm">Tailored for corporate travel needs</p>
              </div>
              <div className="bg-background bg-opacity-10 rounded-lg p-4">
                <span className="text-3xl"></span>
                <h3 className="font-semibold mt-2">Streamlined</h3>
                <p className="text-sm">Efficient booking and management</p>
              </div>
              <div className="bg-background bg-opacity-10 rounded-lg p-4">
                <span className="text-3xl"></span>
                <h3 className="font-semibold mt-2">Cost Effective</h3>
                <p className="text-sm">Significant savings on travel expenses</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Starter Plan</h3>
              <div className="text-3xl font-bold text-neutral-900 mb-2">$49<span className="text-lg text-neutral-600">/user/month</span></div>
              <p className="text-sm text-neutral-600">Perfect for small teams</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Up to 10 users
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                10% booking discount
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Basic reporting
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Email support
              </li>
            </ul>
            <Button className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Get Started
            </Button>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6 border-2 border-green-300 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-semantic-success text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
              Most Popular
            </div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Professional</h3>
              <div className="text-3xl font-bold text-neutral-900 mb-2">$99<span className="text-lg text-neutral-600">/user/month</span></div>
              <p className="text-sm text-neutral-600">Ideal for growing companies</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Up to 50 users
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                15% booking discount
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Advanced reporting
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Priority support
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                API access
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Custom integrations
              </li>
            </ul>
            <Button className="w-full bg-semantic-success text-primary-foreground py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-semantic-success focus:ring-offset-2">
              Get Started
            </Button>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6 border-2 border-purple-300">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-neutral-900 mb-2">Enterprise</h3>
              <div className="text-3xl font-bold text-neutral-900 mb-2">Custom<span className="text-lg text-neutral-600"> pricing</span></div>
              <p className="text-sm text-neutral-600">For large organizations</p>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Unlimited users
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                20% booking discount
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Enterprise reporting
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Dedicated account manager
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                Custom integrations
              </li>
              <li className="flex items-center text-sm">
                <span className="w-4 h-4 bg-semantic-success rounded-full mr-3"></span>
                White-label options
              </li>
            </ul>
            <Button className="w-full bg-accent-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
              Contact Sales
            </Button>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h3 className="text-xl font-semibold text-neutral-900 mb-6">Corporate Benefits</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-neutral-900 mb-4">Cost Savings</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>• Significant discounts on all travel bookings</li>
                <li>• Volume pricing for large travel programs</li>
                <li>• Reduced administrative costs</li>
                <li>• Consolidated billing and reporting</li>
                <li>• Tax-advantaged travel benefits</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-neutral-900 mb-4">Efficiency</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>• Streamlined booking process</li>
                <li>• Automated expense reporting</li>
                <li>• Real-time travel policy compliance</li>
                <li>• Integrated HR and accounting systems</li>
                <li>• 24/7 global support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-neutral-900 mb-4">Employee Experience</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>• Premium travel options and upgrades</li>
                <li>• Priority booking and support</li>
                <li>• Exclusive business travel lounges</li>
                <li>• Personalized concierge services</li>
                <li>• Enhanced travel insurance coverage</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-neutral-900 mb-4">Risk Management</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>• Comprehensive travel insurance</li>
                <li>• 24/7 emergency assistance</li>
                <li>• Duty of care monitoring</li>
                <li>• Crisis management support</li>
                <li>• Travel risk assessments</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Enterprise Features</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h4 className="font-medium text-neutral-900 mb-2">Advanced Analytics</h4>
              <p className="text-sm text-neutral-600">Comprehensive reporting and insights</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h4 className="font-medium text-neutral-900 mb-2">Custom Integrations</h4>
              <p className="text-sm text-neutral-600">Seamless connection with your systems</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h4 className="font-medium text-neutral-900 mb-2">Dedicated Support</h4>
              <p className="text-sm text-neutral-600">Personal account management team</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Ready to Transform Your Business Travel?</h3>
          <p className="text-blue-800 mb-6">
            Join leading companies who trust us with their corporate travel needs.
            Our enterprise solutions deliver measurable ROI and exceptional employee experiences.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Schedule Demo
            </Button>
            <Button className="bg-background text-accent-secondary border border-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Download Brochure
            </Button>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Trusted by Industry Leaders</h2>
          <div className="flex justify-center items-center space-x-8 opacity-60">
            <div className="text-lg font-bold text-neutral-400">COMPANY A</div>
            <div className="text-lg font-bold text-neutral-400">COMPANY B</div>
            <div className="text-lg font-bold text-neutral-400">COMPANY C</div>
            <div className="text-lg font-bold text-neutral-400">COMPANY D</div>
          </div>
        </div>
      </div>
    </div>
  )
}
