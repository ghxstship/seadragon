
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface ApplyPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ApplyPageProps): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `Apply for ${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} | ATLVS + GVTEWAY`,
    description: `Submit your application for the ${slug.replace(/-/g, ' ')} position at ATLVS + GVTEWAY.`,
  }
}

export default async function ApplyPage({ params }: ApplyPageProps) {
  const { slug } = await params
  const jobTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <nav className="text-sm text-neutral-600 mb-4">
            <a href="/careers" className="hover:text-accent-secondary">Careers</a>
            <span className="mx-2">/</span>
            <a href={`/careers/job/${slug}`} className="hover:text-accent-secondary">{jobTitle}</a>
            <span className="mx-2">/</span>
            <span className="text-neutral-900">Apply</span>
          </nav>
        </div>

        <div className="bg-background rounded-lg shadow-md p-8 mb-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Apply for {jobTitle}</h1>
            <p className="text-lg text-neutral-600">We&apos;re excited to learn more about you!</p>
          </div>

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

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-neutral-700 mb-2">
                  Current Location
                </label>
                <Input
                  type="text"
                  id="location"
                  placeholder="City, State/Country"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
              </div>
              <div>
                <label htmlFor="linkedin" className="block text-sm font-medium text-neutral-700 mb-2">
                  LinkedIn Profile
                </label>
                <Input
                  type="url"
                  id="linkedin"
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="portfolio" className="block text-sm font-medium text-neutral-700 mb-2">
                Portfolio/Website
              </label>
              <Input
                type="url"
                id="portfolio"
                placeholder="https://yourportfolio.com"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-neutral-700 mb-2">
                Years of Experience
              </label>
              <Select
                id="experience"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
              >
                <SelectItem value="">Select experience level</SelectItem>
                <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
                <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                <SelectItem value="senior">Senior Level (6-10 years)</SelectItem>
                <SelectItem value="expert">Expert Level (10+ years)</SelectItem>
              </Select>
            </div>

            <div>
              <label htmlFor="salary" className="block text-sm font-medium text-neutral-700 mb-2">
                Salary Expectations
              </label>
              <Input
                type="text"
                id="salary"
                placeholder="e.g., $120,000 - $150,000"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>

            <div>
              <label htmlFor="availability" className="block text-sm font-medium text-neutral-700 mb-2">
                When can you start?
              </label>
              <Select
                id="availability"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
              >
                <SelectItem value="">Select availability</SelectItem>
                <SelectItem value="immediate">Immediately</SelectItem>
                <SelectItem value="2weeks">Within 2 weeks</SelectItem>
                <SelectItem value="1month">Within 1 month</SelectItem>
                <SelectItem value="2months">Within 2 months</SelectItem>
                <SelectItem value="negotiable">Negotiable</SelectItem>
              </Select>
            </div>

            <div>
              <label htmlFor="coverLetter" className="block text-sm font-medium text-neutral-700 mb-2">
                Cover Letter
              </label>
              <Textarea
                id="coverLetter"
                rows={6}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="Tell us why you're interested in this position and what makes you a great fit..."/>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Resume/CV *
              </label>
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                <Input
                  type="file"
                  id="resume"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  required
                />
                <label htmlFor="resume" className="cursor-pointer">
                  <div className="text-4xl text-neutral-400 mb-2"></div>
                  <p className="text-neutral-600 mb-1">Click to upload your resume</p>
                  <p className="text-sm text-neutral-500">PDF, DOC, DOCX up to 10MB</p>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Portfolio/Additional Documents
              </label>
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                <Input
                  type="file"
                  id="portfolio"
                  accept=".pdf,.doc,.docx,.zip"
                  multiple
                  className="hidden"
                />
                <label htmlFor="portfolio" className="cursor-pointer">
                  <div className="text-4xl text-neutral-400 mb-2"></div>
                  <p className="text-neutral-600 mb-1">Click to upload additional files</p>
                  <p className="text-sm text-neutral-500">Portfolio, certificates, etc.</p>
                </label>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-medium text-neutral-900 mb-2">Equal Employment Opportunity</h3>
              <p className="text-sm text-neutral-600 mb-3">
                ATLVS + GVTEWAY is an equal opportunity employer. We celebrate diversity and are committed to
                creating an inclusive environment for all employees.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="gender" className="block text-xs text-neutral-600 mb-1">
                    Gender (Optional)
                  </label>
                  <Select id="gender" className="w-full px-2 py-1 text-sm border border-neutral-300 rounded">
                    <SelectItem value="">Prefer not to say</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </Select>
                </div>
                <div>
                  <label htmlFor="veteran" className="block text-xs text-neutral-600 mb-1">
                    Veteran Status (Optional)
                  </label>
                  <Select id="veteran" className="w-full px-2 py-1 text-sm border border-neutral-300 rounded">
                    <SelectItem value="">Prefer not to say</SelectItem>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                  </Select>
                </div>
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
                I certify that the information provided is true and complete. I understand that any false statements
                may result in disqualification from employment. *
              </label>
            </div>

            <div className="flex items-start">
              <Input
                type="checkbox"
                id="communications"
                className="mt-1 mr-3"
              />
              <label htmlFor="communications" className="text-sm text-neutral-600">
                I agree to receive communications from ATLVS + GVTEWAY regarding my application and future opportunities.
              </label>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-accent-secondary text-primary-foreground py-3 px-6 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 font-medium"
              >
                Submit Application
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
              <p className="text-sm text-blue-800">We review applications within 5 business days</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-accent-secondary">2</span>
              </div>
              <h3 className="font-medium text-blue-900 mb-1">Initial Screening</h3>
              <p className="text-sm text-blue-800">Phone or video screening with our team</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-lg font-bold text-accent-secondary">3</span>
              </div>
              <h3 className="font-medium text-blue-900 mb-1">Final Interview</h3>
              <p className="text-sm text-blue-800">Meet with hiring manager and team members</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-blue-800">
              Have questions? Contact our recruiting team at <a href="mailto:careers@atlvs.com" className="text-accent-secondary hover:text-blue-800">careers@atlvs.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
