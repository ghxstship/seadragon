
'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function HomeProfessionalRatesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Service Rates & Pricing</h1>
          <p className="text-neutral-600">Set competitive rates that reflect your expertise</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Service Packages</h2>
            <div className="space-y-4">
              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-neutral-900">Photography Session</h3>
                    <p className="text-sm text-neutral-600">2-hour session + edited photos</p>
                  </div>
                  <div className="text-right">
                    <Input
                      type="number"
                      defaultValue="350"
                      className="w-20 px-2 py-1 border border-neutral-300 rounded text-right"
                    />
                    <span className="text-sm text-neutral-600 ml-1">USD</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-neutral-600">
                  <span> 50+ photos</span>
                  <span>⏱️ 2 hours</span>
                  <span> Edited delivery</span>
                </div>
              </div>

              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-neutral-900">Content Creation Package</h3>
                    <p className="text-sm text-neutral-600">Social media content for 1 month</p>
                  </div>
                  <div className="text-right">
                    <Input
                      type="number"
                      defaultValue="1200"
                      className="w-20 px-2 py-1 border border-neutral-300 rounded text-right"
                    />
                    <span className="text-sm text-neutral-600 ml-1">USD</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-neutral-600">
                  <span> 48 posts</span>
                  <span> Custom graphics</span>
                  <span> Analytics report</span>
                </div>
              </div>

              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-neutral-900">Event Coverage</h3>
                    <p className="text-sm text-neutral-600">Full event photography/videography</p>
                  </div>
                  <div className="text-right">
                    <Input
                      type="number"
                      defaultValue="800"
                      className="w-20 px-2 py-1 border border-neutral-300 rounded text-right"
                    />
                    <span className="text-sm text-neutral-600 ml-1">USD</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-neutral-600">
                  <span> Video highlights</span>
                  <span> Photo gallery</span>
                  <span>️ Raw files</span>
                </div>
              </div>
            </div>
            <Button className="w-full mt-4 bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Add New Package
            </Button>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Pricing Strategy</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Rate Type
                </label>
                <Select className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                  <SelectItem value="fixed-rate-per-project">Fixed Rate per Project</SelectItem>
                  <SelectItem value="hourly-rate">Hourly Rate</SelectItem>
                  <SelectItem value="daily-rate">Daily Rate</SelectItem>
                  <SelectItem value="retainer-basis">Retainer Basis</SelectItem>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Currency
                </label>
                <Select className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                  <SelectItem value="usd">USD ($)</SelectItem>
                  <SelectItem value="eur">EUR (€)</SelectItem>
                  <SelectItem value="gbp">GBP (£)</SelectItem>
                  <SelectItem value="cad-c">CAD (C$)</SelectItem>
                  <SelectItem value="aud-a">AUD (A$)</SelectItem>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Minimum Project Size
                </label>
                <Input
                  type="number"
                  defaultValue="500"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
                <p className="text-xs text-neutral-500 mt-1">Minimum amount for new projects</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Travel Expenses
                </label>
                <Select className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                  <SelectItem value="included-in-rate">Included in rate</SelectItem>
                  <SelectItem value="billed-separately">Billed separately</SelectItem>
                  <SelectItem value="client-covers-all">Client covers all</SelectItem>
                </Select>
              </div>

              <div className="flex items-center">
                <Input type="checkbox" id="negotiable" className="mr-3" defaultChecked />
                <label htmlFor="negotiable" className="text-sm">
                  Rates are negotiable
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Payment Terms</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Deposit Requirements</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <Input type="radio" name="deposit" className="mr-3" defaultChecked />
                  <span className="text-sm">50% deposit required</span>
                </label>
                <label className="flex items-center">
                  <Input type="radio" name="deposit" className="mr-3" />
                  <span className="text-sm">No deposit required</span>
                </label>
                <label className="flex items-center">
                  <Input type="radio" name="deposit" className="mr-3" />
                  <span className="text-sm">Custom deposit amount</span>
                </label>
              </div>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Payment Methods</h3>
              <div className="space-y-2">
                <label className="flex items-center">
                  <Input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-sm">Credit/Debit Cards</span>
                </label>
                <label className="flex items-center">
                  <Input type="checkbox" className="mr-3" defaultChecked />
                  <span className="text-sm">Bank Transfer</span>
                </label>
                <label className="flex items-center">
                  <Input type="checkbox" className="mr-3" />
                  <span className="text-sm">PayPal</span>
                </label>
                <label className="flex items-center">
                  <Input type="checkbox" className="mr-3" />
                  <span className="text-sm">Cryptocurrency</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Rate Optimization Tips</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Market Research</h3>
              <p className="text-sm text-neutral-600">
                Research competitor rates and local market conditions to set competitive pricing.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Value-Based Pricing</h3>
              <p className="text-sm text-neutral-600">
                Price based on the value you provide, not just time spent on the project.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">Package Deals</h3>
              <p className="text-sm text-neutral-600">
                Offer bundled services at a discount to encourage larger bookings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
