
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: 'Support Center | ATLVS + GVTEWAY',
  description: 'Find answers, get help, and contact support for all your travel planning and booking needs.',
}

export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Support Center</h1>
          <p className="text-lg text-neutral-600">Find answers, get help, and connect with our support team</p>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-8 text-primary-foreground mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">How Can We Help?</h2>
            <p className="text-xl mb-6">Get the support you need, when you need it</p>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl mb-2 block"></span>
                <h3 className="font-semibold">FAQ</h3>
                <p className="text-sm">Quick answers to common questions</p>
              </div>
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl mb-2 block"></span>
                <h3 className="font-semibold">Guides</h3>
                <p className="text-sm">Step-by-step tutorials</p>
              </div>
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl mb-2 block"></span>
                <h3 className="font-semibold">Tutorials</h3>
                <p className="text-sm">Video walkthroughs</p>
              </div>
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl mb-2 block"></span>
                <h3 className="font-semibold">Contact</h3>
                <p className="text-sm">Speak with our team</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <a href="/support/faq" className="group">
            <div className="bg-background rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <span className="text-4xl mb-4 block"></span>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">FAQ</h3>
              <p className="text-neutral-600">Frequently asked questions</p>
            </div>
          </a>

          <a href="/support/guides" className="group">
            <div className="bg-background rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <span className="text-4xl mb-4 block"></span>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">User Guides</h3>
              <p className="text-neutral-600">Step-by-step instructions</p>
            </div>
          </a>

          <a href="/support/tutorials" className="group">
            <div className="bg-background rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <span className="text-4xl mb-4 block"></span>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Video Tutorials</h3>
              <p className="text-neutral-600">Visual learning guides</p>
            </div>
          </a>

          <a href="/support/contact" className="group">
            <div className="bg-background rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <span className="text-4xl mb-4 block"></span>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">Contact Support</h3>
              <p className="text-neutral-600">Get in touch with our team</p>
            </div>
          </a>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Popular Topics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-neutral-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
              <h3 className="font-medium text-neutral-900 mb-2">Getting Started</h3>
              <p className="text-sm text-neutral-600 mb-3">How to create an account and start planning your trip</p>
              <span className="text-accent-secondary text-sm hover:text-blue-800">Learn more →</span>
            </div>
            <div className="border border-neutral-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
              <h3 className="font-medium text-neutral-900 mb-2">Booking & Payments</h3>
              <p className="text-sm text-neutral-600 mb-3">How to book experiences and manage payments</p>
              <span className="text-accent-secondary text-sm hover:text-blue-800">Learn more →</span>
            </div>
            <div className="border border-neutral-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
              <h3 className="font-medium text-neutral-900 mb-2">Account Management</h3>
              <p className="text-sm text-neutral-600 mb-3">Update your profile and manage preferences</p>
              <span className="text-accent-secondary text-sm hover:text-blue-800">Learn more →</span>
            </div>
            <div className="border border-neutral-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
              <h3 className="font-medium text-neutral-900 mb-2">Travel Planning</h3>
              <p className="text-sm text-neutral-600 mb-3">Use our tools to plan the perfect trip</p>
              <span className="text-accent-secondary text-sm hover:text-blue-800">Learn more →</span>
            </div>
            <div className="border border-neutral-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
              <h3 className="font-medium text-neutral-900 mb-2">Membership Benefits</h3>
              <p className="text-sm text-neutral-600 mb-3">Make the most of your membership perks</p>
              <span className="text-accent-secondary text-sm hover:text-blue-800">Learn more →</span>
            </div>
            <div className="border border-neutral-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
              <h3 className="font-medium text-neutral-900 mb-2">Troubleshooting</h3>
              <p className="text-sm text-neutral-600 mb-3">Common issues and how to resolve them</p>
              <span className="text-accent-secondary text-sm hover:text-blue-800">Learn more →</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Quick Search</h2>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Search for help..."
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-primary"/>
              <div className="flex flex-wrap gap-2">
                {[
                  'Booking help',
                  'Payment issues',
                  'Account login',
                  'Cancel booking',
                  'Membership',
                  'Travel planning'
                ].map((tag) => (
                  <Button
                    key={tag}
                    className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm hover:bg-neutral-200 transition-colors"
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">System Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                <span className="text-neutral-900">Website</span>
                <span className="text-semantic-success font-medium">Operational</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                <span className="text-neutral-900">Mobile App</span>
                <span className="text-semantic-success font-medium">Operational</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                <span className="text-neutral-900">Booking System</span>
                <span className="text-semantic-success font-medium">Operational</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded">
                <span className="text-neutral-900">API Services</span>
                <span className="text-semantic-warning font-medium">Minor Issues</span>
              </div>
              <a href="/support/status" className="text-accent-secondary text-sm hover:text-blue-800">
                View detailed status →
              </a>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Contact Options</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Live Chat</h3>
              <p className="text-sm text-neutral-600 mb-3">Instant help 24/7</p>
              <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 text-sm">
                Start Chat
              </Button>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Email Support</h3>
              <p className="text-sm text-neutral-600 mb-3">Detailed responses within 24 hours</p>
              <a href="mailto:support@atlvs.com" className="bg-semantic-success text-primary-foreground px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-semantic-success focus:ring-offset-2 text-sm inline-block">
                Send Email
              </a>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-2">Phone Support</h3>
              <p className="text-sm text-neutral-600 mb-3">Speak with an agent</p>
              <a href="tel:+15551234567" className="bg-accent-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 text-sm inline-block">
                Call Now
              </a>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Can&apos;t Find What You Need?</h2>
          <p className="text-neutral-600 mb-6">Our support team is always ready to help</p>
          <div className="flex justify-center gap-4">
            <a href="/contact" className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Contact Us
            </a>
            <a href="/community" className="bg-background text-accent-secondary border border-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Community Forum
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
