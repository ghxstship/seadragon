
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Page title is set in layout or via document.title in useEffect

export default function SupportContactPage() {
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState('normal')

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Customer Support</h1>
          <p className="text-lg text-neutral-600">We&apos;re here to help with your bookings, account, and travel needs.</p>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-8 text-primary-foreground mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">How Can We Help?</h2>
            <p className="text-xl mb-6">Get the support you need, when you need it</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl mb-2 block"></span>
                <h3 className="font-semibold">Phone Support</h3>
                <p className="text-sm">Speak to an agent directly</p>
              </div>
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl mb-2 block"></span>
                <h3 className="font-semibold">Live Chat</h3>
                <p className="text-sm">Instant messaging support</p>
              </div>
              <div className="bg-background bg-opacity-20 rounded-lg p-4">
                <span className="text-3xl mb-2 block"></span>
                <h3 className="font-semibold">Email Support</h3>
                <p className="text-sm">Detailed written responses</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Support Options</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-2xl mr-3"></span>
                <div>
                  <p className="font-medium text-neutral-900">Phone Support</p>
                  <p className="text-neutral-600">+1 (555) 123-4567</p>
                  <p className="text-sm text-neutral-500">Mon-Fri 9AM-6PM EST</p>
                  <p className="text-sm text-neutral-500">Priority support for members</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3"></span>
                <div>
                  <p className="font-medium text-neutral-900">Live Chat</p>
                  <p className="text-neutral-600">Available on website</p>
                  <p className="text-sm text-neutral-500">24/7 instant support</p>
                  <p className="text-sm text-neutral-500">Average response: 30 seconds</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3"></span>
                <div>
                  <p className="font-medium text-neutral-900">Email Support</p>
                  <p className="text-neutral-600">support@atlvs.com</p>
                  <p className="text-sm text-neutral-500">Detailed written responses</p>
                  <p className="text-sm text-neutral-500">Response within 24 hours</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3"></span>
                <div>
                  <p className="font-medium text-neutral-900">Mobile App</p>
                  <p className="text-neutral-600">In-app support chat</p>
                  <p className="text-sm text-neutral-500">Quick access to help</p>
                  <p className="text-sm text-neutral-500">Available 24/7</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Support Categories</h2>
            <div className="space-y-4">
              <div className="p-3 border border-neutral-200 rounded hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium text-neutral-900">Bookings & Reservations</h3>
                <p className="text-sm text-neutral-600">Help with creating, modifying, or canceling bookings</p>
              </div>
              <div className="p-3 border border-neutral-200 rounded hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium text-neutral-900">Account & Membership</h3>
                <p className="text-sm text-neutral-600">Login issues, profile updates, membership questions</p>
              </div>
              <div className="p-3 border border-neutral-200 rounded hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium text-neutral-900">Travel Planning</h3>
                <p className="text-sm text-neutral-600">Itinerary help, destination advice, travel tips</p>
              </div>
              <div className="p-3 border border-neutral-200 rounded hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium text-neutral-900">Billing & Payments</h3>
                <p className="text-sm text-neutral-600">Payment issues, refunds, billing questions</p>
              </div>
              <div className="p-3 border border-neutral-200 rounded hover:bg-gray-50 cursor-pointer">
                <h3 className="font-medium text-neutral-900">Technical Support</h3>
                <p className="text-sm text-neutral-600">Website/app issues, login problems, bugs</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Contact Support</h2>
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
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  required
                />
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
                required
              />
            </div>

            <div>
              <label htmlFor="memberId" className="block text-sm font-medium text-neutral-700 mb-2">
                Membership ID (if applicable)
              </label>
              <Input
                type="text"
                id="memberId"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="DB-XXXXXXX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Support Category *
              </label>
              <Select
                value={category}
                onValueChange={setCategory}
              >
                <SelectTrigger className="w-full border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
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
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Priority Level
              </label>
              <Select
                value={priority}
                onValueChange={setPriority}
              >
                <SelectTrigger className="w-full border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                  <SelectValue placeholder="Choose priority" />
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
                required
              />
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
                required/>
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
                  className="hidden"
                />
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
                className="mt-1 mr-3"
              />
              <label htmlFor="updates" className="text-sm text-neutral-600">
                Send me updates about my support request via email
              </label>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-accent-secondary text-primary-foreground py-3 px-6 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 font-medium"
              >
                Submit Support Request
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Self-Service Resources</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Help Center</h3>
              <p className="text-sm text-neutral-600">Browse FAQs and guides</p>
              <a href="/help" className="text-accent-secondary text-sm hover:text-blue-800">Visit →</a>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Video Tutorials</h3>
              <p className="text-sm text-neutral-600">Step-by-step video guides</p>
              <a href="/tutorials" className="text-accent-secondary text-sm hover:text-blue-800">Watch →</a>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Mobile App</h3>
              <p className="text-sm text-neutral-600">Get help in the app</p>
              <a href="/app" className="text-accent-secondary text-sm hover:text-blue-800">Download →</a>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-semantic-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Community</h3>
              <p className="text-sm text-neutral-600">Ask other travelers</p>
              <a href="/community" className="text-accent-secondary text-sm hover:text-blue-800">Join →</a>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Member Support</h2>
          <p className="text-blue-800 mb-4">
            As a ATLVS + GVTEWAY member, you have access to priority support including dedicated
            account managers and expedited response times.
          </p>
          <div className="flex gap-4">
            <a href="/memberships" className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Become a Member
            </a>
            <a href="/support" className="bg-background text-accent-secondary border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Member Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
