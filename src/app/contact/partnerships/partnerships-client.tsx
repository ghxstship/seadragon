'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function PartnershipsClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Partnership Inquiries</h1>
          <p className="text-lg text-neutral-600">
            Explore collaboration opportunities and business partnerships with ATLVS + GVTEWAY.
          </p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-8 text-primary-foreground mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Let&apos;s Build Something Together</h2>
            <p className="text-xl mb-6">
              We&apos;re always looking for strategic partners who share our vision for transforming travel.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Partnership Types</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-accent-primary pl-4">
                <h3 className="font-medium text-neutral-900 mb-1">Vendor Partnerships</h3>
                <p className="text-sm text-neutral-600">Service providers and suppliers</p>
              </div>
              <div className="border-l-4 border-semantic-success pl-4">
                <h3 className="font-medium text-neutral-900 mb-1">Affiliate Programs</h3>
                <p className="text-sm text-neutral-600">Marketing and referral partners</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-medium text-neutral-900 mb-1">Strategic Alliances</h3>
                <p className="text-sm text-neutral-600">Technology and platform integrations</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-medium text-neutral-900 mb-1">Content Partnerships</h3>
                <p className="text-sm text-neutral-600">Media and content collaborations</p>
              </div>
              <div className="border-l-4 border-semantic-error pl-4">
                <h3 className="font-medium text-neutral-900 mb-1">Sponsorships</h3>
                <p className="text-sm text-neutral-600">Event and brand sponsorships</p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-2xl mr-3"></span>
                <div>
                  <p className="font-medium text-neutral-900">Business Development</p>
                  <p className="text-neutral-600">partnerships@atlvs.com</p>
                  <p className="text-sm text-neutral-500">For strategic partnerships and alliances</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3"></span>
                <div>
                  <p className="font-medium text-neutral-900">Vendor Relations</p>
                  <p className="text-neutral-600">vendors@atlvs.com</p>
                  <p className="text-sm text-neutral-500">For supplier and vendor partnerships</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3"></span>
                <div>
                  <p className="font-medium text-neutral-900">Affiliate Program</p>
                  <p className="text-neutral-600">affiliates@atlvs.com</p>
                  <p className="text-sm text-neutral-500">For affiliate and referral programs</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3"></span>
                <div>
                  <p className="font-medium text-neutral-900">Business Phone</p>
                  <p className="text-neutral-600">+1 (555) 123-4570</p>
                  <p className="text-sm text-neutral-500">Mon-Fri 9AM-6PM EST</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Partnership Application</h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-2">
                  First Name *
                </label>
                <Input
                  type="text"
                  id="firstName"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semantic-success"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-2">
                  Last Name *
                </label>
                <Input
                  type="text"
                  id="lastName"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semantic-success"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-neutral-700 mb-2">
                  Company Name *
                </label>
                <Input
                  type="text"
                  id="company"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semantic-success"
                  required
                />
              </div>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
                  Job Title *
                </label>
                <Input
                  type="text"
                  id="title"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semantic-success"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semantic-success"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  id="phone"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semantic-success"
                />
              </div>
            </div>

            <div>
              <label htmlFor="partnershipType" className="block text-sm font-medium text-neutral-700 mb-2">
                Partnership Type *
              </label>
              <Select defaultValue="">
                <SelectTrigger className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semantic-success">
                  <SelectValue placeholder="Select partnership type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendor">Vendor Partnership</SelectItem>
                  <SelectItem value="affiliate">Affiliate Partnership</SelectItem>
                  <SelectItem value="strategic">Strategic Alliance</SelectItem>
                  <SelectItem value="content">Content Partnership</SelectItem>
                  <SelectItem value="sponsorship">Sponsorship</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-neutral-700 mb-2">
                Industry *
              </label>
              <Select defaultValue="">
                <SelectTrigger className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semantic-success">
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hospitality">Hospitality &amp; Tourism</SelectItem>
                  <SelectItem value="technology">Technology &amp; SaaS</SelectItem>
                  <SelectItem value="travel-services">Travel Services</SelectItem>
                  <SelectItem value="media">Media &amp; Content</SelectItem>
                  <SelectItem value="finance">Financial Services</SelectItem>
                  <SelectItem value="retail">Retail &amp; E-commerce</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="companySize" className="block text-sm font-medium text-neutral-700 mb-2">
                Company Size
              </label>
              <Select defaultValue="">
                <SelectTrigger className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semantic-success">
                  <SelectValue placeholder="Select company size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="startup">Startup (1-10 employees)</SelectItem>
                  <SelectItem value="small">Small (11-50 employees)</SelectItem>
                  <SelectItem value="medium">Medium (51-200 employees)</SelectItem>
                  <SelectItem value="large">Large (201-1000 employees)</SelectItem>
                  <SelectItem value="enterprise">Enterprise (1000+ employees)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-neutral-700 mb-2">
                Company Website
              </label>
              <Input
                type="url"
                id="website"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semantic-success"
                placeholder="https://yourcompany.com"
              />
            </div>

            <div>
              <label htmlFor="proposal" className="block text-sm font-medium text-neutral-700 mb-2">
                Partnership Proposal *
              </label>
              <Textarea
                id="proposal"
                rows={6}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semantic-success"
                placeholder="Describe your company, the partnership opportunity you're proposing, potential benefits for both parties, and how you envision the collaboration working..."
                required
              />
            </div>

            <div>
              <label htmlFor="goals" className="block text-sm font-medium text-neutral-700 mb-2">
                Partnership Goals
              </label>
              <Textarea
                id="goals"
                rows={3}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semantic-success"
                placeholder="What do you hope to achieve through this partnership? (e.g., market expansion, new customers, technology integration, etc.)"
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-neutral-900 mb-2">Confidentiality Notice</h3>
              <p className="text-sm text-neutral-600 mb-3">
                All partnership inquiries are treated with strict confidentiality. We will not share your proposal or company information without your explicit permission.
              </p>
              <div className="flex items-start">
                <Input type="checkbox" id="nda" className="mt-1 mr-3" />
                <label htmlFor="nda" className="text-sm text-neutral-600">
                  I would like to discuss this partnership under NDA terms
                </label>
              </div>
            </div>

            <div className="flex items-start">
              <Input type="checkbox" id="terms" className="mt-1 mr-3" required />
              <label htmlFor="terms" className="text-sm text-neutral-600">
                I confirm that the information provided is accurate and that I have authority to discuss partnership opportunities on behalf of my company. *
              </label>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-semantic-success text-primary-foreground py-3 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-semantic-success focus:ring-offset-2 font-medium"
              >
                Submit Partnership Inquiry
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Why Partner With Us?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Global Reach</h3>
              <p className="text-sm text-neutral-600">Access to millions of travelers worldwide</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Growth Potential</h3>
              <p className="text-sm text-neutral-600">Rapidly expanding travel technology market</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Strong Relationships</h3>
              <p className="text-sm text-neutral-600">Long-term partnerships with industry leaders</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-semantic-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Innovation Focus</h3>
              <p className="text-sm text-neutral-600">Cutting-edge technology and solutions</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Next Steps</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-accent-secondary">1</span>
              </div>
              <h3 className="font-medium text-blue-900 mb-1">Review</h3>
              <p className="text-sm text-blue-800">We review your proposal within 5 business days</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-accent-secondary">2</span>
              </div>
              <h3 className="font-medium text-blue-900 mb-1">Discussion</h3>
              <p className="text-sm text-blue-800">Schedule a call to discuss partnership details</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-accent-secondary">3</span>
              </div>
              <h3 className="font-medium text-blue-900 mb-1">Launch</h3>
              <p className="text-sm text-blue-800">Begin partnership implementation and execution</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
