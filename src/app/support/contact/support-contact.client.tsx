'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function SupportContactClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Contact Support</h1>
          <p className="text-lg text-neutral-600">Get help from our dedicated support team</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Contact Methods</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-2xl mr-3"></span>
                <div>
                  <p className="font-medium text-neutral-900">Live Chat</p>
                  <p className="text-neutral-600">Available 24/7 for instant help</p>
                  <p className="text-sm text-neutral-500">Average response: 30 seconds</p>
                  <Button className="mt-2 bg-semantic-success text-primary-foreground px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-semantic-success focus:ring-offset-2 text-sm">
                    Start Chat
                  </Button>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3"></span>
                <div>
                  <p className="font-medium text-neutral-900">Email Support</p>
                  <p className="text-neutral-600">support@atlvs.com</p>
                  <p className="text-sm text-neutral-500">Response within 24 hours</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3"></span>
                <div>
                  <p className="font-medium text-neutral-900">Phone Support</p>
                  <p className="text-neutral-600">+1 (555) 123-4567</p>
                  <p className="text-sm text-neutral-500">Mon-Fri 9AM-6PM EST</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3"></span>
                <div>
                  <p className="font-medium text-neutral-900">Community Forum</p>
                  <p className="text-neutral-600">Ask other travelers</p>
                  <p className="text-sm text-neutral-500">Peer-to-peer support</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Support Hours</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                <span className="text-neutral-900">Live Chat</span>
                <span className="font-medium text-accent-secondary">24/7</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span className="text-neutral-900">Email Support</span>
                <span className="font-medium text-semantic-success">24/7</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                <span className="text-neutral-900">Phone Support</span>
                <span className="font-medium text-accent-primary">Mon-Fri 9AM-6PM EST</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                <span className="text-neutral-900">Emergency Support</span>
                <span className="font-medium text-semantic-warning">24/7</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Submit a Support Request</h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-2">
                  First Name *
                </label>
                <Input
                  type="text"
                  id="firstName"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  required/>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-2">
                  Last Name *
                </label>
                <Input
                  type="text"
                  id="lastName"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  required/>
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address *
              </label>
              <Input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                required/>
            </div>

            <div>
              <label htmlFor="memberId" className="block text-sm font-medium text-neutral-700 mb-2">
                Membership ID (if applicable)
              </label>
              <Input
                type="text"
                id="memberId"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="DB-XXXXXXX"/>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-2">
                Support Category *
              </label>
              <Select required>
                <SelectTrigger className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bookings">Bookings & Reservations</SelectItem>
                  <SelectItem value="account">Account & Membership</SelectItem>
                  <SelectItem value="planning">Travel Planning</SelectItem>
                  <SelectItem value="billing">Billing & Payments</SelectItem>
                  <SelectItem value="technical">Technical Support</SelectItem>
                  <SelectItem value="feedback">Feedback & Suggestions</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-neutral-700 mb-2">
                Priority Level
              </label>
              <Select defaultValue="normal">
                <SelectTrigger className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal - Standard response time</SelectItem>
                  <SelectItem value="high">High - Urgent issue affecting travel</SelectItem>
                  <SelectItem value="critical">Critical - Emergency or safety concern</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-2">
                Subject *
              </label>
              <Input
                type="text"
                id="subject"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="Brief description of your issue"
                required/>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
                Description *
              </label>
              <Textarea
                id="description"
                rows={6}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="Please provide as much detail as possible about your issue, including any error messages, steps you've taken, and what you were trying to accomplish..."
                required
              ></Textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Attachments (optional)
              </label>
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                <Input
                  type="file"
                  id="attachments"
                  multiple
                  className="hidden"/>
                <label htmlFor="attachments" className="cursor-pointer">
                  <div className="text-4xl text-neutral-400 mb-2"></div>
                  <p className="text-neutral-600 mb-1">Click to attach files</p>
                  <p className="text-sm text-neutral-500">Screenshots, booking confirmations, etc.</p>
                </label>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-neutral-900 mb-2">Response Times</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="font-medium text-neutral-900">Live Chat</p>
                  <p className="text-neutral-600">Instant - 24/7</p>
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Phone</p>
                  <p className="text-neutral-600">Immediate during business hours</p>
                </div>
                <div>
                  <p className="font-medium text-neutral-900">Email</p>
                  <p className="text-neutral-600">Within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="flex items-start">
              <Input
                type="checkbox"
                id="updates"
                className="mt-1 mr-3"/>
              <label htmlFor="updates" className="text-sm text-neutral-600">
                Send me updates about my support request via email
              </label>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-accent-secondary text-primary-foreground py-3 px-6 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 font-medium"
              >
                Submit Request
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Helpful Resources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 border border-neutral-200 rounded-lg">
              <h3 className="font-medium text-neutral-900 mb-2">Knowledge Base</h3>
              <p className="text-neutral-600 mb-3">Browse articles on account setup, booking policies, and troubleshooting.</p>
              <Button variant="outline" className="text-sm">View Articles</Button>
            </div>
            <div className="p-4 border border-neutral-200 rounded-lg">
              <h3 className="font-medium text-neutral-900 mb-2">System Status</h3>
              <p className="text-neutral-600 mb-3">Check real-time service availability and incident updates.</p>
              <Button variant="outline" className="text-sm">View Status</Button>
            </div>
            <div className="p-4 border border-neutral-200 rounded-lg">
              <h3 className="font-medium text-neutral-900 mb-2">Community Forum</h3>
              <p className="text-neutral-600 mb-3">Get answers from other travelers and share your experiences.</p>
              <Button variant="outline" className="text-sm">Visit Forum</Button>
            </div>
            <div className="p-4 border border-neutral-200 rounded-lg">
              <h3 className="font-medium text-neutral-900 mb-2">Travel Advisories</h3>
              <p className="text-neutral-600 mb-3">Stay informed about destination-specific alerts and guidelines.</p>
              <Button variant="outline" className="text-sm">View Advisories</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
