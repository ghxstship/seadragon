'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ProfileEditClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Edit Profile</h1>
          <p className="text-neutral-600">Update your personal information and preferences</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <form className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-neutral-200 rounded-full mx-auto mb-4 relative">
                <span className="text-3xl absolute inset-0 flex items-center justify-center"></span>
                <Button
                  type="button"
                  className="absolute bottom-0 right-0 w-8 h-8 bg-accent-secondary rounded-full flex items-center justify-center text-primary-foreground"
                >
                  <span className="text-sm">+</span>
                </Button>
              </div>
              <Button type="button" className="text-accent-secondary hover:text-blue-800 text-sm">
                Change profile photo
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-neutral-700 mb-2">
                  First Name
                </label>
                <Input type="text" id="firstName" defaultValue="John" />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-neutral-700 mb-2">
                  Last Name
                </label>
                <Input type="text" id="lastName" defaultValue="Doe" />
              </div>
            </div>

            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-neutral-700 mb-2">
                Display Name
              </label>
              <Input type="text" id="displayName" defaultValue="John D." />
              <p className="text-xs text-neutral-500 mt-1">This is how you&apos;ll appear to other users</p>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Email Address
              </label>
              <Input type="email" id="email" defaultValue="john.doe@example.com" />
              <p className="text-xs text-neutral-500 mt-1">
                <a href="/auth/verify-email" className="text-accent-secondary hover:text-blue-800">Verify your email</a> for account security
              </p>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                Phone Number
              </label>
              <Input type="tel" id="phone" defaultValue="+1 (555) 123-4567" />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-neutral-700 mb-2">
                Bio
              </label>
              <Textarea
                id="bio"
                rows={4}
                defaultValue="Passionate traveler and adventure seeker. Always looking for the next great experience!"
                placeholder="Tell others about yourself..."
              />
              <p className="text-xs text-neutral-500 mt-1">Maximum 500 characters</p>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-neutral-700 mb-2">
                Location
              </label>
              <Input type="text" id="location" defaultValue="New York, NY" placeholder="City, Country" />
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-neutral-700 mb-2">
                Website
              </label>
              <Input type="url" id="website" placeholder="https://yourwebsite.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Travel Preferences
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <Input type="checkbox" id="adventure" className="mr-3" defaultChecked />
                  <span className="text-sm">Adventure & Outdoor Activities</span>
                </label>
                <label className="flex items-center">
                  <Input type="checkbox" id="cultural" className="mr-3" defaultChecked />
                  <span className="text-sm">Cultural Experiences</span>
                </label>
                <label className="flex items-center">
                  <Input type="checkbox" id="relaxation" className="mr-3" />
                  <span className="text-sm">Relaxation & Wellness</span>
                </label>
                <label className="flex items-center">
                  <Input type="checkbox" id="food" className="mr-3" defaultChecked />
                  <span className="text-sm">Food & Culinary</span>
                </label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1 bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
              >
                Save Changes
              </Button>
              <Button
                type="button"
                className="flex-1 bg-background text-neutral-700 border border-neutral-300 py-2 px-4 rounded-md hover:bg-gray-50"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-neutral-900 mb-2">Privacy Settings</h3>
          <p className="text-sm text-neutral-600 mb-3">
            Control who can see your profile information and activity.
          </p>
          <a href="/home/settings/privacy" className="text-accent-secondary hover:text-blue-800 text-sm">
            Manage privacy settings →
          </a>
        </div>
      </div>
    </div>
  )
}
