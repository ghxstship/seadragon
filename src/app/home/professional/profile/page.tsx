
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export const metadata: Metadata = {
  title: 'Professional Profile | ATLVS + GVTEWAY',
  description: 'Edit your professional profile and showcase your expertise to clients and collaborators.',
}

export default function HomeProfessionalProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Professional Profile</h1>
          <p className="text-neutral-600">Showcase your expertise and attract opportunities</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-background rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Basic Information</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="professionalTitle" className="block text-sm font-medium text-neutral-700 mb-2">
                    Professional Title
                  </label>
                  <Input
                    type="text"
                    id="professionalTitle"
                    defaultValue="Travel Photographer & Content Creator"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  />
                </div>

                <div>
                  <label htmlFor="specialties" className="block text-sm font-medium text-neutral-700 mb-2">
                    Specialties & Services
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      'Photography', 'Videography', 'Content Creation', 'Social Media',
                      'Event Planning', 'Tour Guiding', 'Culinary Arts', 'Wellness'
                    ].map((specialty) => (
                      <label key={specialty} className="flex items-center">
                        <Input type="checkbox" className="mr-2" defaultChecked={['Photography', 'Content Creation', 'Social Media'].includes(specialty)} />
                        <span className="text-sm">{specialty}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-neutral-700 mb-2">
                    Years of Experience
                  </label>
                  <Select className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                    <SelectItem value="0-2-years">0-2 years</SelectItem>
                    <SelectItem value="3-5-years">3-5 years</SelectItem>
                    <SelectItem value="6-10-years">6-10 years</SelectItem>
                    <SelectItem value="10-years">10+ years</SelectItem>
                  </Select>
                </div>

                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-neutral-700 mb-2">
                    Professional Bio
                  </label>
                  <Textarea
                    id="bio"
                    rows={6}
                    defaultValue="Passionate travel photographer with 8+ years of experience capturing the world's most beautiful destinations. Specializing in adventure and cultural photography for brands and publications worldwide."
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    placeholder="Describe your professional background, expertise, and what you offer..."/>
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-neutral-700 mb-2">
                    Service Location
                  </label>
                  <Input
                    type="text"
                    id="location"
                    defaultValue="Available worldwide, based in New York"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    placeholder="Where are you available to work?"
                  />
                </div>

                <div>
                  <label htmlFor="languages" className="block text-sm font-medium text-neutral-700 mb-2">
                    Languages Spoken
                  </label>
                  <Input
                    type="text"
                    id="languages"
                    defaultValue="English (Native), Spanish (Conversational), French (Basic)"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    placeholder="Languages you speak professionally"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
                >
                  Save Professional Profile
                </Button>
              </form>
            </div>
          </div>

          <div>
            <div className="bg-background rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Profile Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-700">Profile Completion</span>
                  <span className="text-sm font-medium text-semantic-success">85%</span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2">
                  <div className="bg-semantic-success h-2 rounded-full w-[85%]"></div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <span className="text-semantic-success mr-2"></span>
                    <span className="text-neutral-700">Basic information</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-semantic-success mr-2"></span>
                    <span className="text-neutral-700">Portfolio added</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-semantic-warning mr-2">○</span>
                    <span className="text-neutral-700">Certifications</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-semantic-warning mr-2">○</span>
                    <span className="text-neutral-700">Availability set</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <a href="/home/professional/portfolio/add" className="block w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded">
                  Add Portfolio Item
                </a>
                <a href="/home/professional/certifications/add" className="block w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded">
                  Add Certification
                </a>
                <a href="/home/professional/availability" className="block w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded">
                  Set Availability
                </a>
                <a href="/home/professional/rates" className="block w-full text-left px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded">
                  Update Rates
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
