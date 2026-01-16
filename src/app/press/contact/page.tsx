
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export const metadata: Metadata = {
  title: 'Press Contact | ATLVS + GVTEWAY',
  description: 'Get in touch with our press team for media inquiries, interviews, and press releases.',
}

export default function PressContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Press Contact</h1>
          <p className="text-lg text-neutral-600">Connect with our communications team</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Primary Contacts</h2>
            <div className="space-y-6">
              <div className="border-l-4 border-accent-primary pl-4">
                <h3 className="font-medium text-neutral-900 mb-1">Jennifer Walsh</h3>
                <p className="text-sm text-neutral-600 mb-1">Director of Communications</p>
                <p className="text-sm text-accent-secondary">press@atlvs.com</p>
                <p className="text-sm text-neutral-500">+1 (555) 123-4567</p>
                <p className="text-xs text-neutral-500 mt-1">Available for major announcements and executive interviews</p>
              </div>
              <div className="border-l-4 border-semantic-success pl-4">
                <h3 className="font-medium text-neutral-900 mb-1">Marcus Chen</h3>
                <p className="text-sm text-neutral-600 mb-1">Senior Public Relations Manager</p>
                <p className="text-sm text-accent-secondary">marcus.chen@atlvs.com</p>
                <p className="text-sm text-neutral-500">+1 (555) 123-4568</p>
                <p className="text-xs text-neutral-500 mt-1">Handles media relations and press events</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-medium text-neutral-900 mb-1">Sarah Rodriguez</h3>
                <p className="text-sm text-neutral-600 mb-1">Digital Media Specialist</p>
                <p className="text-sm text-accent-secondary">sarah.rodriguez@atlvs.com</p>
                <p className="text-sm text-neutral-500">+1 (555) 123-4569</p>
                <p className="text-xs text-neutral-500 mt-1">Social media and digital content inquiries</p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">Regional Contacts</h2>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-neutral-900 mb-2">Europe</h4>
                <p className="text-sm text-neutral-600">Anna Schmidt</p>
                <p className="text-sm text-accent-secondary">anna.schmidt@atlvs.com</p>
                <p className="text-sm text-neutral-500">Based in Berlin, Germany</p>
              </div>
              <div>
                <h4 className="font-medium text-neutral-900 mb-2">Asia Pacific</h4>
                <p className="text-sm text-neutral-600">Hiroshi Tanaka</p>
                <p className="text-sm text-accent-secondary">hiroshi.tanaka@atlvs.com</p>
                <p className="text-sm text-neutral-500">Based in Tokyo, Japan</p>
              </div>
              <div>
                <h4 className="font-medium text-neutral-900 mb-2">Middle East & Africa</h4>
                <p className="text-sm text-neutral-600">Fatima Al-Zahra</p>
                <p className="text-sm text-accent-secondary">fatima.alzahra@atlvs.com</p>
                <p className="text-sm text-neutral-500">Based in Dubai, UAE</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Contact Form</h2>
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

            <div>
              <label htmlFor="publication" className="block text-sm font-medium text-neutral-700 mb-2">
                Publication/Media Outlet
              </label>
              <Input
                type="text"
                id="publication"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                required/>
            </div>

            <div>
              <label htmlFor="inquiryType" className="block text-sm font-medium text-neutral-700 mb-2">
                Inquiry Type
              </label>
              <Select
                required
              >
                <SelectItem value="">Select inquiry type</SelectItem>
                <SelectItem value="interview">Interview Request</SelectItem>
                <SelectItem value="press-release">Press Release Information</SelectItem>
                <SelectItem value="media-assets">Media Assets Request</SelectItem>
                <SelectItem value="event-coverage">Event Coverage</SelectItem>
                <SelectItem value="credentials">Media Credentials</SelectItem>
                <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </Select>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-2">
                Subject
              </label>
              <Input
                type="text"
                id="subject"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="Brief description of your inquiry"
                required/>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                Message
              </label>
              <Textarea
                id="message"
                rows={6}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="Please provide details about your inquiry, including preferred contact method and timeline..."
                required/>
            </div>

            <div>
              <label htmlFor="deadline" className="block text-sm font-medium text-neutral-700 mb-2">
                Deadline (if applicable)
              </label>
              <Input
                type="date"
                id="deadline"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"/>
            </div>

            <div className="flex items-start">
              <Input
                type="checkbox"
                id="newsletter"
                className="mt-1 mr-3"/>
              <label htmlFor="newsletter" className="text-sm text-neutral-600">
                I&apos;d like to receive press releases and media updates from ATLVS + GVTEWAY.
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
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Response Times</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Urgent Inquiries</h3>
              <p className="text-sm text-neutral-600">Response within 2 hours during business hours</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Standard Inquiries</h3>
              <p className="text-sm text-neutral-600">Response within 24 hours</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg"></span>
              </div>
              <h3 className="font-medium text-neutral-900 mb-1">Interview Requests</h3>
              <p className="text-sm text-neutral-600">Response within 48 hours with availability</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Office Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Headquarters</h3>
              <p className="text-blue-800 text-sm">
                123 Innovation Drive<br/>
                New York, NY 10001<br/>
                United States
              </p>
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Business Hours</h3>
              <p className="text-blue-800 text-sm">
                Monday - Friday: 9:00 AM - 6:00 PM EST<br/>
                Emergency Contact: 24/7<br/>
                Response Time: Within 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
