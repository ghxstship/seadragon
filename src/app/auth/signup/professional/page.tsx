
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const metadata: Metadata = {
  title: 'Join as Professional | ATLVS + GVTEWAY',
  description: 'Create your professional account and join the ATLVS + GVTEWAY network of creators and service providers.',
}

export default function ProfessionalSignupPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Join as a Professional</h1>
          <p className="text-neutral-600">Build your business on our platform</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-2">
                  First Name
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
                  Last Name
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
                Business Email
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
                required
              />
            </div>

            <div>
              <label htmlFor="profession" className="block text-sm font-medium text-neutral-700 mb-2">
                Profession/Service Type
              </label>
              <Select
                defaultValue=""
              >
                <SelectItem value="">Select your profession</SelectItem>
                <SelectItem value="photographer">Photographer</SelectItem>
                <SelectItem value="videographer">Videographer</SelectItem>
                <SelectItem value="tour-guide">Tour Guide</SelectItem>
                <SelectItem value="chef">Chef/Cooking Instructor</SelectItem>
                <SelectItem value="artist">Artist/Artisan</SelectItem>
                <SelectItem value="instructor">Fitness/Meditation Instructor</SelectItem>
                <SelectItem value="consultant">Travel Consultant</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </Select>
            </div>

            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-neutral-700 mb-2">
                Business Name (Optional)
              </label>
              <Input
                type="text"
                id="businessName"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="Your business or studio name"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <Input
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                required
              />
              <p className="text-xs text-neutral-500 mt-1">
                Must be at least 8 characters with numbers and symbols
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-2">
                Confirm Password
              </label>
              <Input
                type="password"
                id="confirmPassword"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                required
              />
            </div>

            <div className="flex items-start">
              <Input
                type="checkbox"
                id="terms"
                className="mt-1 mr-3"
                required
              />
              <label htmlFor="terms" className="text-sm text-neutral-600">
                I agree to the{' '}
                <a href="/legal/terms" className="text-accent-secondary hover:text-blue-800">
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="/legal/privacy" className="text-accent-secondary hover:text-blue-800">
                  Privacy Policy
                </a>
              </label>
            </div>

            <div className="flex items-start">
              <Input
                type="checkbox"
                id="marketing"
                className="mt-1 mr-3"
              />
              <label htmlFor="marketing" className="text-sm text-neutral-600">
                Send me updates about platform features and business opportunities
              </label>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
            >
              Create Professional Account
            </Button>
          </form>
        </div>

        <div className="text-center space-y-4">
          <div className="flex items-center">
            <div className="flex-1 border-t border-neutral-300"></div>
            <span className="px-4 text-sm text-neutral-500">or</span>
            <div className="flex-1 border-t border-neutral-300"></div>
          </div>

          <div className="space-y-2">
            <Button className="w-full bg-background text-neutral-700 border border-neutral-300 py-2 px-4 rounded-md hover:bg-gray-50">
              Continue with LinkedIn
            </Button>
            <Button className="w-full bg-background text-neutral-700 border border-neutral-300 py-2 px-4 rounded-md hover:bg-gray-50">
              Continue with Google
            </Button>
          </div>

          <p className="text-sm text-neutral-600">
            Already have an account?{' '}
            <a href="/auth/login" className="text-accent-secondary hover:text-blue-800">
              Sign in
            </a>
          </p>

          <p className="text-sm text-neutral-600">
            Looking to join as a{' '}
            <a href="/auth/signup/consumer" className="text-semantic-success hover:text-green-800">
              member
            </a>
            {' '}or{' '}
            <a href="/auth/signup/organization" className="text-accent-primary hover:text-purple-800">
              organization
            </a>
            ?
          </p>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Professional Benefits</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Showcase your work and services</li>
            <li>• Connect with clients and collaborators</li>
            <li>• Access to business tools and analytics</li>
            <li>• Professional development resources</li>
            <li>• Revenue sharing and commission programs</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
