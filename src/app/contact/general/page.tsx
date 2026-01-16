
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export const metadata: Metadata = {
  title: 'General Inquiries | ATLVS + GVTEWAY',
  description: 'Contact us for general questions about ATLVS + GVTEWAY, our services, and how we can help you.',
}

export default function GeneralContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">General Inquiries</h1>
          <p className="text-lg text-neutral-600">Have a question? We&apos;re here to help.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-2xl mr-3"></span>
                <div>
                  <p className="font-medium text-neutral-900">Email</p>
                  <p className="text-neutral-600">hello@atlvs.com</p>
                  <p className="text-sm text-neutral-500">For general questions and feedback</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3"></span>
                <div>
                  <p className="font-medium text-neutral-900">Phone</p>
                  <p className="text-neutral-600">+1 (555) 123-4567</p>
                  <p className="text-sm text-neutral-500">Mon-Fri 9AM-6PM EST</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3"></span>
                <div>
                  <p className="font-medium text-neutral-900">Live Chat</p>
                  <p className="text-neutral-600">Available on our website</p>
                  <p className="text-sm text-neutral-500">24/7 instant support</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3"></span>
                <div>
                  <p className="font-medium text-neutral-900">Address</p>
                  <p className="text-neutral-600">123 Innovation Drive<br/>New York, NY 10001<br/>United States</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Response Times</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                <span className="text-neutral-900">Email Inquiries</span>
                <span className="font-medium text-accent-secondary">Within 24 hours</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span className="text-neutral-900">Phone Calls</span>
                <span className="font-medium text-semantic-success">Immediate</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                <span className="text-neutral-900">Live Chat</span>
                <span className="font-medium text-accent-primary">Instant</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                <span className="text-neutral-900">Business Hours</span>
                <span className="font-medium text-semantic-warning">Mon-Fri 9AM-6PM EST</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Send us a Message</h2>
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
              <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-2">
                Subject *
              </label>
              <Select
                id="subject"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                required
              >
                <SelectItem value="">Select a subject</SelectItem>
                <SelectItem value="general">General Question</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
                <SelectItem value="suggestion">Suggestion</SelectItem>
                <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </Select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                Message *
              </label>
              <Textarea
                id="message"
                rows={6}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="Tell us how we can help you..."
                required/>
            </div>

            <div className="flex items-start">
              <Input
                type="checkbox"
                id="newsletter"
                className="mt-1 mr-3"
              />
              <label htmlFor="newsletter" className="text-sm text-neutral-600">
                I&apos;d like to receive updates and news from ATLVS + GVTEWAY.
              </label>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-accent-secondary text-primary-foreground py-3 px-6 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 font-medium"
              >
                Send Message
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Common Questions</h2>
          <div className="space-y-4">
            <div className="border-b border-neutral-200 pb-4">
              <h3 className="font-medium text-neutral-900 mb-2">How do I get started with ATLVS + GVTEWAY?</h3>
              <p className="text-neutral-600">Visit our homepage and click "Get Started" to create your account and begin exploring our services.</p>
            </div>
            <div className="border-b border-neutral-200 pb-4">
              <h3 className="font-medium text-neutral-900 mb-2">Do you offer tours or demos?</h3>
              <p className="text-neutral-600">Yes! We offer personalized demos and virtual tours. Contact us to schedule one.</p>
            </div>
            <div className="border-b border-neutral-200 pb-4">
              <h3 className="font-medium text-neutral-900 mb-2">What&apos;s your refund policy?</h3>
              <p className="text-neutral-600">We offer a 30-day money-back guarantee on all our services. See our terms for full details.</p>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">How can I update my account information?</h3>
              <p className="text-neutral-600">Log into your account and go to Settings, or contact our support team for assistance.</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Still Need Help?</h2>
          <p className="text-blue-800 mb-4">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help with any questions.
          </p>
          <div className="flex gap-4">
            <a href="/contact/support" className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Customer Support
            </a>
            <a href="/faq" className="bg-background text-accent-secondary border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              FAQ
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
