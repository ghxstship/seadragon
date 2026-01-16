'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function BecomePartnerClient() {
  const [partnershipType, setPartnershipType] = useState('')
  const [businessType, setBusinessType] = useState('')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Become a Partner</h1>
          <p className="text-lg text-neutral-600">Join our exclusive network and unlock new opportunities</p>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-primary-foreground mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Partner With Us</h2>
            <p className="text-xl mb-6">Grow your business with premium travel partnerships</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Vendor Partnership</h2>
            <p className="text-neutral-600 mb-4">
              Join our network of trusted service providers and reach premium travelers worldwide.
            </p>
            <ul className="text-sm text-neutral-600 space-y-2 mb-6">
              <li> Featured listings on our platform</li>
              <li> Direct booking integration</li>
              <li> Marketing and promotional support</li>
              <li> Performance analytics and insights</li>
              <li> Dedicated account management</li>
            </ul>
            <Button className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Apply as Vendor
            </Button>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Affiliate Partnership</h2>
            <p className="text-neutral-600 mb-4">
              Earn commissions by promoting our travel experiences to your audience.
            </p>
            <ul className="text-sm text-neutral-600 space-y-2 mb-6">
              <li> Up to 10% commission on bookings</li>
              <li> Real-time tracking dashboard</li>
              <li> Marketing materials and resources</li>
              <li> Monthly payouts</li>
              <li> Dedicated affiliate support</li>
            </ul>
            <Button className="w-full bg-semantic-success text-primary-foreground py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-semantic-success focus:ring-offset-2">
              Apply as Affiliate
            </Button>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Sponsorship Opportunities</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-yellow-300 transition-colors">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Event Sponsorship</h3>
              <p className="text-sm text-neutral-600">Sponsor our exclusive travel events</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-yellow-300 transition-colors">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Content Sponsorship</h3>
              <p className="text-sm text-neutral-600">Brand integration in our content</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-yellow-300 transition-colors">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Destination Sponsorship</h3>
              <p className="text-sm text-neutral-600">Co-brand destination experiences</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <a href="/sponsors/opportunities" className="inline-block bg-semantic-warning text-primary-foreground px-6 py-3 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-semantic-warning focus:ring-offset-2">
              Explore Sponsorship Options
            </a>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Partnership Application</h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-2">
                  First Name
                </label>
                <Input
                  type="text"
                  id="firstName"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  required/>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-2">
                  Last Name
                </label>
                <Input
                  type="text"
                  id="lastName"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  required/>
              </div>
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-neutral-700 mb-2">
                Company Name
              </label>
              <Input
                type="text"
                id="company"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                required/>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  required/>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  id="phone"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"/>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="partnershipType" className="block text-sm font-medium text-neutral-700 mb-2">
                Partnership Type
              </label>
              <Select
                value={partnershipType}
                onValueChange={setPartnershipType}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select partnership type"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendor">Vendor Partnership</SelectItem>
                  <SelectItem value="affiliate">Affiliate Partnership</SelectItem>
                  <SelectItem value="sponsor">Sponsorship</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="businessType" className="block text-sm font-medium text-neutral-700 mb-2">
                Business Type
              </label>
              <Select
                value={businessType}
                onValueChange={setBusinessType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business type"/>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hospitality">Hospitality (Hotels/Resorts)</SelectItem>
                  <SelectItem value="dining">Dining/Restaurants</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="experiences">Experiences/Activities</SelectItem>
                  <SelectItem value="retail">Retail/Shopping</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-neutral-700 mb-2">
                Website URL
              </label>
              <Input
                type="url"
                id="website"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="https://yourwebsite.com"/>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                Tell us about your business
              </label>
              <Textarea
                id="message"
                rows={4}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="Describe your services, target audience, and why you'd like to partner with us..."
                required/>
            </div>

            <div className="flex items-start">
              <Input
                type="checkbox"
                id="terms"
                className="mt-1 mr-3"
                required/>
              <label htmlFor="terms" className="text-sm text-neutral-600">
                I agree to the <a href="/legal/terms" className="text-accent-secondary hover:text-blue-800">Terms of Service</a> and
                understand that partnership approval is at the discretion of ATLVS + GVTEWAY.
              </label>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-accent-primary text-primary-foreground py-3 px-6 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 font-medium"
              >
                Submit Partnership Application
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">What Happens Next?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-accent-secondary">1</span>
              </div>
              <h3 className="font-medium text-blue-900 mb-1">Application Review</h3>
              <p className="text-sm text-blue-800">We review your application within 5-7 business days</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-accent-secondary">2</span>
              </div>
              <h3 className="font-medium text-blue-900 mb-1">Discussion & Planning</h3>
              <p className="text-sm text-blue-800">We discuss partnership details and create a customized plan</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-accent-secondary">3</span>
              </div>
              <h3 className="font-medium text-blue-900 mb-1">Launch & Growth</h3>
              <p className="text-sm text-blue-800">Partnership goes live with ongoing support and optimization</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
