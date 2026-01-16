
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export const metadata: Metadata = {
  title: 'Media Credentials | ATLVS + GVTEWAY',
  description: 'Apply for press credentials to access exclusive events and premium media resources.',
}

export default function CredentialsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Media Credentials</h1>
          <p className="text-lg text-neutral-600">Access exclusive events and premium media resources</p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-lg p-8 text-primary-foreground mb-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">VIP Media Access</h2>
            <p className="text-xl mb-6">Get priority access to our events, interviews, and exclusive content</p>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Credential Benefits</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Event Access</h3>
              <ul className="space-y-2 text-neutral-600">
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <span>Priority registration for all press events</span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <span>VIP seating and networking opportunities</span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <span>Exclusive press conferences and briefings</span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <span>Behind-the-scenes access and tours</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Content Resources</h3>
              <ul className="space-y-2 text-neutral-600">
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-accent-primary/10 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <span>High-resolution photo and video access</span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-accent-primary/10 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <span>Embargoed content and advanced copies</span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-accent-primary/10 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <span>Executive interview arrangements</span>
                </li>
                <li className="flex items-start">
                  <span className="w-5 h-5 bg-accent-primary/10 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5"></span>
                  <span>Custom content and story ideas</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Credential Application</h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-2">
                  First Name
                </label>
                <Input
                  type="text"
                  id="firstName"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semantic-success"
                  required/>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-2">
                  Last Name
                </label>
                <Input
                  type="text"
                  id="lastName"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semantic-success"
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
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semantic-success"
                  required/>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  id="phone"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semantic-success"/>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="publication" className="block text-sm font-medium text-neutral-700 mb-2">
                  Publication/Media Outlet
                </label>
                <Input
                  type="text"
                  id="publication"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semantic-success"
                  required/>
              </div>
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-neutral-700 mb-2">
                  Job Title
                </label>
                <Input
                  type="text"
                  id="position"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semantic-success"
                  required/>
              </div>
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-neutral-700 mb-2">
                Publication Website
              </label>
                <Input
                  type="url"
                  id="website"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semantic-success"
                  placeholder="https://yourpublication.com"/>
            </div>

            <div>
              <label htmlFor="mediaType" className="block text-sm font-medium text-neutral-700 mb-2">
                Media Type
              </label>
              <Select
                required
              >
                <SelectItem value="">Select media type</SelectItem>
                <SelectItem value="print">Print Publication</SelectItem>
                <SelectItem value="online">Online Publication</SelectItem>
                <SelectItem value="broadcast">Broadcast (TV/Radio)</SelectItem>
                <SelectItem value="digital">Digital Media</SelectItem>
                <SelectItem value="social">Social Media Influencer</SelectItem>
                <SelectItem value="blog">Blog/Podcast</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </Select>
            </div>

            <div>
              <label htmlFor="coverage" className="block text-sm font-medium text-neutral-700 mb-2">
                Planned Coverage Topics
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                {[
                  'Travel Technology',
                  'Luxury Travel',
                  'Sustainable Tourism',
                  'Adventure Travel',
                  'Business Travel',
                  'Cultural Tourism',
                  'Events & Festivals',
                  'Food & Wine',
                  'Wellness Travel'
                ].map((topic) => (
                  <label key={topic} className="flex items-center">
                    <Input
                      type="checkbox"
                      className="rounded border-neutral-300 text-semantic-success focus:ring-semantic-success"/>
                    <span className="ml-2 text-sm text-neutral-700">{topic}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-neutral-700 mb-2">
                Media Experience
              </label>
              <Textarea
                id="experience"
                rows={3}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semantic-success"
                placeholder="Briefly describe your media experience and any notable coverage you've done..."
                required/>
            </div>

            <div>
              <label htmlFor="references" className="block text-sm font-medium text-neutral-700 mb-2">
                References or Portfolio
              </label>
              <Textarea
                id="references"
                rows={2}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semantic-success"
                placeholder="Links to your work, portfolio, or references..."/>
            </div>

            <div>
              <label htmlFor="specialNeeds" className="block text-sm font-medium text-neutral-700 mb-2">
                Special Access Needs
              </label>
              <Textarea
                id="specialNeeds"
                rows={2}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-semantic-success"
                placeholder="Any special accommodations or access requirements..."/>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-neutral-900 mb-2">Credential Terms</h3>
              <div className="text-sm text-neutral-600 space-y-1">
                <p>• Credentials are valid for one year from approval date</p>
                <p>• All press materials must credit ATLVS + GVTEWAY appropriately</p>
                <p>• Photo and video usage guidelines must be followed</p>
                <p>• Credentials may be revoked for misuse or unethical behavior</p>
              </div>
            </div>

            <div className="flex items-start">
              <Input
                type="checkbox"
                id="terms"
                className="mt-1 mr-3"
                required/>
              <label htmlFor="terms" className="text-sm text-neutral-600">
                I agree to the <a href="/legal/terms" className="text-accent-secondary hover:text-blue-800">Terms of Service</a> and
                <a href="/press/media-kit" className="text-accent-secondary hover:text-blue-800"> Media Usage Guidelines</a>.
                I certify that all information provided is accurate and that I am a legitimate member of the media.
              </label>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-semantic-success text-primary-foreground py-3 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-semantic-success focus:ring-offset-2 font-medium"
              >
                Submit Credential Application
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Application Process</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-accent-secondary">1</span>
              </div>
              <h3 className="font-medium text-blue-900 mb-1">Submit Application</h3>
              <p className="text-sm text-blue-800">Complete the form above with your credentials</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-accent-secondary">2</span>
              </div>
              <h3 className="font-medium text-blue-900 mb-1">Review Process</h3>
              <p className="text-sm text-blue-800">Our team reviews applications within 5-7 business days</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-accent-secondary">3</span>
              </div>
              <h3 className="font-medium text-blue-900 mb-1">Credential Issuance</h3>
              <p className="text-sm text-blue-800">Approved applicants receive digital credentials via email</p>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Questions?</h2>
          <p className="text-neutral-600 mb-4">
            Need help with your application or have questions about media credentials?
            Contact our press team for assistance.
          </p>
          <div className="flex gap-4">
            <a href="/press/contact" className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Contact Press Team
            </a>
            <a href="mailto:press@atlvs.com" className="bg-neutral-600 text-primary-foreground px-4 py-2 rounded-md hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2">
              Email Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
