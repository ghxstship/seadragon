'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function BillingClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Billing Settings</h1>
          <p className="text-neutral-600">Manage your subscription and payment information</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Current Plan</h2>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-primary-foreground mb-4">
              <h3 className="text-xl font-bold mb-1">Premium Membership</h3>
              <p className="text-blue-100 mb-3">$29.99/month</p>
              <ul className="text-sm space-y-1">
                <li>• Unlimited bookings</li>
                <li>• Priority support</li>
                <li>• Exclusive experiences</li>
                <li>• Travel credits</li>
              </ul>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Next billing date</span>
                <span className="text-sm font-medium">April 15, 2024</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Payment method</span>
                <span className="text-sm font-medium">•••• •••• •••• 4567</span>
              </div>
              <Button className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
                Upgrade Plan
              </Button>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Payment Methods</h2>
            <div className="space-y-4">
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-accent-secondary rounded flex items-center justify-center text-primary-foreground mr-3">
                      <span className="text-xs"></span>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">•••• •••• •••• 4567</p>
                      <p className="text-sm text-neutral-600">Expires 12/26</p>
                    </div>
                  </div>
                  <span className="text-semantic-success text-xs bg-semantic-success/10 px-2 py-1 rounded">Primary</span>
                </div>
                <div className="flex space-x-2 mt-3">
                  <Button className="text-accent-secondary hover:text-blue-800 text-sm">Edit</Button>
                  <Button className="text-semantic-error hover:text-red-800 text-sm">Remove</Button>
                </div>
              </div>

              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-semantic-success rounded flex items-center justify-center text-primary-foreground mr-3">
                      <span className="text-xs"></span>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-900">•••• •••• •••• 8901</p>
                      <p className="text-sm text-neutral-600">Expires 08/25</p>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2 mt-3">
                  <Button className="text-accent-secondary hover:text-blue-800 text-sm">Edit</Button>
                  <Button className="text-semantic-error hover:text-red-800 text-sm">Remove</Button>
                  <Button className="text-semantic-success hover:text-green-800 text-sm">Make Primary</Button>
                </div>
              </div>

              <Button className="w-full border-2 border-dashed border-neutral-300 text-neutral-600 py-3 px-4 rounded-md hover:border-neutral-400 hover:text-neutral-800">
                + Add Payment Method
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Billing History</h2>
          <div className="space-y-4">
            {[
              { title: 'Premium Membership - March 2024', date: 'March 15, 2024 • Visa **** 4567', amount: '$29.99' },
              { title: 'Premium Membership - February 2024', date: 'February 15, 2024 • Visa **** 4567', amount: '$29.99' },
              { title: 'Tokyo Flight Booking', date: 'February 10, 2024 • Visa **** 4567', amount: '$450.00' },
              { title: 'Travel Credits Purchase', date: 'January 28, 2024 • Visa **** 4567', amount: '$50.00' },
            ].map((item) => (
              <div key={item.title} className="flex items-center justify-between p-4 border border-neutral-200 rounded">
                <div>
                  <h3 className="font-medium text-neutral-900">{item.title}</h3>
                  <p className="text-sm text-neutral-600">{item.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-neutral-900">{item.amount}</p>
                  <a href="#" className="text-accent-secondary hover:text-blue-800 text-sm">Download Receipt</a>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button className="text-accent-secondary hover:text-blue-800">
              View All Billing History →
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Billing Address</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Full Name</label>
                <Input type="text" defaultValue="John Doe" className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Address Line 1</label>
                <Input type="text" defaultValue="123 Main Street" className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Address Line 2</label>
                <Input type="text" placeholder="Apartment, suite, etc." className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">City</label>
                  <Input type="text" defaultValue="New York" className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">ZIP Code</label>
                  <Input type="text" defaultValue="10001" className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Country</label>
                <Select defaultValue="united-states">
                  <SelectTrigger className="w-full border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="united-states">United States</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                    <SelectItem value="united-kingdom">United Kingdom</SelectItem>
                    <SelectItem value="australia">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
                Update Billing Address
              </Button>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Tax Information</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-neutral-900 mb-2">Tax ID Status</h3>
                <p className="text-sm text-neutral-600 mb-3">
                  Your tax information is not on file. Adding it helps us comply with tax regulations and may reduce withholding on payments.
                </p>
                <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-accent-tertiary">
                  Add Tax Information
                </Button>
              </div>

              <div>
                <h3 className="font-medium text-neutral-900 mb-3">Invoice Settings</h3>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <Input type="checkbox" className="mr-3" defaultChecked />
                    <span className="text-sm">Email invoices automatically</span>
                  </label>
                  <label className="flex items-center">
                    <Input type="checkbox" className="mr-3" />
                    <span className="text-sm">Include detailed itemization</span>
                  </label>
                  <label className="flex items-center">
                    <Input type="checkbox" className="mr-3" defaultChecked />
                    <span className="text-sm">Send payment reminders</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-neutral-900 mb-3">Currency Settings</h3>
                <Select defaultValue="usd-us-dollar">
                  <SelectTrigger className="w-full border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usd-us-dollar">USD - US Dollar ($)</SelectItem>
                    <SelectItem value="eur-euro">EUR - Euro (€)</SelectItem>
                    <SelectItem value="gbp-british-pound">GBP - British Pound (£)</SelectItem>
                    <SelectItem value="cad-canadian-dollar-c">CAD - Canadian Dollar (C$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Billing Support</h2>
          <p className="text-neutral-600 mb-4">
            Need help with billing or have questions about your account? Our support team is here to help.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded hover:bg-accent-tertiary">
              Contact Billing Support
            </Button>
            <Button className="bg-background text-accent-secondary border border-blue-600 px-4 py-2 rounded hover:bg-blue-50">
              View Help Center
            </Button>
            <Button className="bg-background text-neutral-700 border border-neutral-300 px-4 py-2 rounded hover:bg-gray-50">
              Download Tax Documents
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
