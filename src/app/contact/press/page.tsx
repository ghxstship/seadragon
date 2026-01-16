
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export const metadata: Metadata = {
  title: 'Press Inquiries | ATLVS + GVTEWAY',
  description: 'Contact our press team for media inquiries, interviews, and press-related questions.',
}

export default function PressContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-4">Press Inquiries</h1>
          <p className="text-lg text-neutral-600">Connect with our communications team for media and press relations.</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-6">Press Contacts</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-l-4 border-accent-primary pl-4">
              <h3 className="font-medium text-neutral-900 mb-1">Jennifer Walsh</h3>
              <p className="text-sm text-neutral-600 mb-1">Director of Communications</p>
              <p className="text-sm text-accent-secondary">press@atlvs.com</p>
              <p className="text-sm text-neutral-500">+1 (555) 123-4567</p>
              <p className="text-xs text-neutral-500 mt-1">Major announcements, executive interviews, strategic partnerships</p>
            </div>
            <div className="border-l-4 border-semantic-success pl-4">
              <h3 className="font-medium text-neutral-900 mb-1">Marcus Chen</h3>
              <p className="text-sm text-neutral-600 mb-1">Senior Public Relations Manager</p>
              <p className="text-sm text-accent-secondary">marcus.chen@atlvs.com</p>
              <p className="text-sm text-neutral-500">+1 (555) 123-4568</p>
              <p className="text-xs text-neutral-500 mt-1">Media relations, event coverage, product launches</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-medium text-neutral-900 mb-1">Sarah Rodriguez</h3>
              <p className="text-sm text-neutral-600 mb-1">Digital Media Specialist</p>
              <p className="text-sm text-accent-secondary">sarah.rodriguez@atlvs.com</p>
              <p className="text-sm text-neutral-500">+1 (555) 123-4569</p>
              <p className="text-xs text-neutral-500 mt-1">Social media, digital content, influencer partnerships</p>
            </div>
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="font-medium text-neutral-900 mb-1">Press Office</h3>
              <p className="text-sm text-neutral-600 mb-1">General Press Inquiries</p>
              <p className="text-sm text-accent-secondary">press@atlvs.com</p>
              <p className="text-sm text-neutral-500">Available 24/7 for urgent matters</p>
              <p className="text-xs text-neutral-500 mt-1">News tips, story ideas, general media questions</p>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Press Inquiry Form</h2>
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

            <div className="grid md:grid-cols-2 gap-6">
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
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  id="phone"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="publication" className="block text-sm font-medium text-neutral-700 mb-2">
                Publication/Media Outlet *
              </label>
              <Input
                type="text"
                id="publication"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="e.g., The New York Times, CNN Travel, Travel Weekly"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-neutral-700 mb-2">
                  Job Title *
                </label>
                <Input
                  type="text"
                  id="position"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  placeholder="e.g., Travel Editor, Journalist"
                  required
                />
              </div>
              <div>
                <label htmlFor="deadline" className="block text-sm font-medium text-neutral-700 mb-2">
                  Deadline
                </label>
                <Input
                  type="date"
                  id="deadline"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="inquiryType" className="block text-sm font-medium text-neutral-700 mb-2">
                Inquiry Type *
              </label>
              <Select
                id="inquiryType"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                required
              >
                <SelectItem value="">Select inquiry type</SelectItem>
                <SelectItem value="interview">Interview Request</SelectItem>
                <SelectItem value="press-release">Press Release Follow-up</SelectItem>
                <SelectItem value="media-assets">Media Assets Request</SelectItem>
                <SelectItem value="event-coverage">Event Coverage</SelectItem>
                <SelectItem value="fact-check">Fact Checking</SelectItem>
                <SelectItem value="story-pitch">Story Pitch</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </Select>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-2">
                Subject/Headline *
              </label>
              <Input
                type="text"
                id="subject"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="Brief description of your inquiry or story"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                Message Details *
              </label>
              <Textarea
                id="message"
                rows={6}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="Please provide details about your story, the angle you're pursuing, specific questions, or what information you need..."
                required/>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-neutral-900 mb-2">Press Guidelines</h3>
              <div className="text-sm text-neutral-600 space-y-1">
                <p>• Please allow 24-48 hours for response during business days</p>
                <p>• For urgent breaking news, call our press line directly</p>
                <p>• All press materials must credit ATLVS + GVTEWAY appropriately</p>
                <p>• Embargoed information must be respected until release time</p>
              </div>
            </div>

            <div className="flex items-start">
              <Input
                type="checkbox"
                id="terms"
                className="mt-1 mr-3"
                required
              />
              <label htmlFor="terms" className="text-sm text-neutral-600">
                I confirm that I am a legitimate member of the media and will use any provided information
                responsibly and in accordance with journalistic standards. *
              </label>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-accent-secondary text-primary-foreground py-3 px-6 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 font-medium"
              >
                Submit Press Inquiry
              </Button>
            </div>
          </form>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Media Resources</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="w-8 h-8 bg-accent-primary/10 text-blue-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Press Kit</h3>
                  <p className="text-sm text-neutral-600">Complete media kit with logos, photos, and company info</p>
                  <a href="/press/media-kit" className="text-accent-secondary text-sm hover:text-blue-800">Download →</a>
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-8 h-8 bg-semantic-success/10 text-green-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Photo Library</h3>
                  <p className="text-sm text-neutral-600">High-resolution images for editorial use</p>
                  <a href="/gallery/press" className="text-accent-secondary text-sm hover:text-blue-800">Browse →</a>
                </div>
              </div>
              <div className="flex items-start">
                <span className="w-8 h-8 bg-accent-primary/10 text-purple-800 rounded-full flex items-center justify-center font-bold text-sm mr-3 mt-0.5"></span>
                <div>
                  <h3 className="font-medium text-neutral-900">Press Releases</h3>
                  <p className="text-sm text-neutral-600">Official announcements and news</p>
                  <a href="/press/releases" className="text-accent-secondary text-sm hover:text-blue-800">View All →</a>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Response Times</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                <span className="text-neutral-900">Breaking News</span>
                <span className="font-medium text-semantic-error">Immediate</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                <span className="text-neutral-900">Time-Sensitive Stories</span>
                <span className="font-medium text-semantic-warning">Within 2 hours</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded">
                <span className="text-neutral-900">Interview Requests</span>
                <span className="font-medium text-semantic-warning">Within 24 hours</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                <span className="text-neutral-900">General Inquiries</span>
                <span className="font-medium text-semantic-success">Within 48 hours</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Media Credentials</h2>
          <p className="text-blue-800 mb-4">
            Accredited journalists can access exclusive events and resources. Apply for media credentials
            to get priority access to our team and events.
          </p>
          <a href="/press/credentials" className="inline-block bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
            Apply for Credentials
          </a>
        </div>
      </div>
    </div>
  )
}
