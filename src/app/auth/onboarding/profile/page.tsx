
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export const metadata: Metadata = {
  title: 'Create Profile | ATLVS + GVTEWAY',
  description: 'Set up your basic profile information to get started with ATLVS + GVTEWAY.',
}

export default function OnboardingProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl"></span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Create Your Profile</h1>
          <p className="text-neutral-600">Tell us a bit about yourself</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <form className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-neutral-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl"></span>
              </div>
              <Button type="button" className="text-accent-secondary hover:text-blue-800 text-sm">
                Add profile photo
              </Button>
            </div>

            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-neutral-700 mb-2">
                Display Name
              </label>
              <Input
                type="text"
                id="displayName"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="How you'd like to be known"
                required
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-neutral-700 mb-2">
                Bio (Optional)
              </label>
              <Textarea
                id="bio"
                rows={3}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="Tell others about yourself..."/>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-neutral-700 mb-2">
                Location
              </label>
              <Input
                type="text"
                id="location"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="City, Country"
              />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-neutral-700 mb-2">
                Website (Optional)
              </label>
              <Input
                type="url"
                id="website"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="https://yourwebsite.com"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
            >
              Continue
            </Button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-sm text-neutral-600">
            Skip for now?{' '}
            <Button className="text-accent-secondary hover:text-blue-800">
              Complete later
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}
