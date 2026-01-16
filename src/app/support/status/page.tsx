
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: 'System Status | ATLVS + GVTEWAY',
  description: 'Check the current status of ATLVS + GVTEWAY services and systems.',
}

export default function StatusPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">System Status</h1>
          <p className="text-lg text-neutral-600">Real-time status of our services and systems</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-neutral-900">Overall Status</h2>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-semantic-success rounded-full"></div>
              <span className="text-semantic-success font-medium">All Systems Operational</span>
            </div>
          </div>

          <p className="text-neutral-600 mb-6">
            All ATLVS + GVTEWAY services are currently operating normally. We&apos;re monitoring our systems
            24/7 to ensure optimal performance for our users.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-3 h-3 bg-semantic-success rounded-full"></div>
                <span className="font-medium text-green-900">Uptime This Month</span>
              </div>
              <p className="text-2xl font-bold text-semantic-success">99.9%</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-3 h-3 bg-accent-primary rounded-full"></div>
                <span className="font-medium text-blue-900">Active Monitoring</span>
              </div>
              <p className="text-2xl font-bold text-accent-secondary">24/7</p>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Service Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-semantic-success rounded-full"></div>
                <div>
                  <h3 className="font-medium text-neutral-900">Website & Web App</h3>
                  <p className="text-sm text-neutral-600">atlvs.com and web application</p>
                </div>
              </div>
              <span className="text-semantic-success font-medium">Operational</span>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-semantic-success rounded-full"></div>
                <div>
                  <h3 className="font-medium text-neutral-900">Mobile App</h3>
                  <p className="text-sm text-neutral-600">iOS and Android applications</p>
                </div>
              </div>
              <span className="text-semantic-success font-medium">Operational</span>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-semantic-success rounded-full"></div>
                <div>
                  <h3 className="font-medium text-neutral-900">Booking System</h3>
                  <p className="text-sm text-neutral-600">Experience reservations and payments</p>
                </div>
              </div>
              <span className="text-semantic-success font-medium">Operational</span>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-semantic-warning rounded-full"></div>
                <div>
                  <h3 className="font-medium text-neutral-900">API Services</h3>
                  <p className="text-sm text-neutral-600">Third-party integrations and APIs</p>
                </div>
              </div>
              <span className="text-semantic-warning font-medium">Minor Issues</span>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-semantic-success rounded-full"></div>
                <div>
                  <h3 className="font-medium text-neutral-900">Customer Support</h3>
                  <p className="text-sm text-neutral-600">Live chat, email, and phone support</p>
                </div>
              </div>
              <span className="text-semantic-success font-medium">Operational</span>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 bg-semantic-success rounded-full"></div>
                <div>
                  <h3 className="font-medium text-neutral-900">Trip Planning Tools</h3>
                  <p className="text-sm text-neutral-600">AI planner and itinerary builder</p>
                </div>
              </div>
              <span className="text-semantic-success font-medium">Operational</span>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <span className="text-semantic-warning text-xl mr-3">️</span>
            <div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">API Services - Minor Issues</h3>
              <p className="text-yellow-800 mb-3">
                We&apos;re experiencing minor delays with some third-party API integrations. This may affect
                real-time pricing updates for certain experiences. Our team is actively working to resolve this.
              </p>
              <div className="text-sm text-semantic-warning">
                <p><strong>Started:</strong> March 15, 2024 at 2:30 PM EST</p>
                <p><strong>Estimated Resolution:</strong> March 15, 2024 at 6:00 PM EST</p>
                <p><strong>Impact:</strong> Minimal - only affects real-time pricing for select partners</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Incident History</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-semantic-success pl-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-neutral-900">API Services Restored</h3>
                <span className="text-xs text-neutral-500">March 12, 2024</span>
              </div>
              <p className="text-sm text-neutral-600 mb-2">
                API services have been fully restored. All integrations are functioning normally.
              </p>
              <p className="text-xs text-neutral-500">Duration: 2 hours 15 minutes</p>
            </div>

            <div className="border-l-4 border-accent-primary pl-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-neutral-900">Scheduled Maintenance</h3>
                <span className="text-xs text-neutral-500">March 8, 2024</span>
              </div>
              <p className="text-sm text-neutral-600 mb-2">
                Completed routine maintenance on our booking infrastructure. No service disruption.
              </p>
              <p className="text-xs text-neutral-500">Duration: 45 minutes</p>
            </div>

            <div className="border-l-4 border-semantic-error pl-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-neutral-900">Mobile App Update</h3>
                <span className="text-xs text-neutral-500">March 1, 2024</span>
              </div>
              <p className="text-sm text-neutral-600 mb-2">
                Deployed critical security update. Users were temporarily unable to access the app.
              </p>
              <p className="text-xs text-neutral-500">Duration: 15 minutes</p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <a href="#" className="text-accent-secondary hover:text-blue-800 text-sm">View Complete Incident History →</a>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Subscribe to Updates</h2>
          <p className="text-neutral-600 mb-4">
            Get notified about service status changes and maintenance windows via email or RSS.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"/>
            <Button className="bg-accent-secondary text-primary-foreground px-6 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Subscribe
            </Button>
          </div>
          <div className="mt-4 flex gap-4">
            <a href="#" className="text-accent-secondary hover:text-blue-800 text-sm">RSS Feed</a>
            <a href="#" className="text-accent-secondary hover:text-blue-800 text-sm">JSON API</a>
            <a href="#" className="text-accent-secondary hover:text-blue-800 text-sm">Webhook</a>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Performance Metrics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Response Time</h3>
              <p className="text-sm text-neutral-600">Average: 245ms</p>
              <p className="text-xs text-semantic-success">Excellent</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Throughput</h3>
              <p className="text-sm text-neutral-600">10,000+ req/min</p>
              <p className="text-xs text-accent-secondary">High</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Security</h3>
              <p className="text-sm text-neutral-600">99.9% uptime</p>
              <p className="text-xs text-accent-primary">Secure</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-semantic-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Global Reach</h3>
              <p className="text-sm text-neutral-600">50+ countries</p>
              <p className="text-xs text-semantic-warning">Worldwide</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-4">Questions About Status?</h2>
          <p className="text-neutral-600 mb-6">Contact our support team if you need assistance or have concerns about service availability.</p>
          <div className="flex justify-center gap-4">
            <a href="/support/contact" className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Contact Support
            </a>
            <a href="/support" className="bg-background text-accent-secondary border border-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Back to Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
