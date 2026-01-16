
'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function OnboardingProfileDetailsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl"></span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Profile Details</h1>
          <p className="text-neutral-600">Add more information about yourself</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <form className="space-y-6">
            <div>
              <label htmlFor="interests" className="block text-sm font-medium text-neutral-700 mb-2">
                Interests & Hobbies
              </label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select your interests" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="travel">Travel</SelectItem>
                  <SelectItem value="photography">Photography</SelectItem>
                  <SelectItem value="food">Food & Dining</SelectItem>
                  <SelectItem value="adventure">Adventure Sports</SelectItem>
                  <SelectItem value="cultural">Cultural Experiences</SelectItem>
                  <SelectItem value="wellness">Wellness</SelectItem>
                  <SelectItem value="nature">Nature</SelectItem>
                  <SelectItem value="arts">Arts & Music</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-neutral-500 mt-1">
                Select your primary interest
              </p>
            </div>

            <div>
              <label htmlFor="travelStyle" className="block text-sm font-medium text-neutral-700 mb-2">
                Travel Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="flex items-center">
                  <Input type="checkbox" className="mr-2" />
                  <span className="text-sm">Luxury</span>
                </label>
                <label className="flex items-center">
                  <Input type="checkbox" className="mr-2" />
                  <span className="text-sm">Budget</span>
                </label>
                <label className="flex items-center">
                  <Input type="checkbox" className="mr-2" />
                  <span className="text-sm">Adventure</span>
                </label>
                <label className="flex items-center">
                  <Input type="checkbox" className="mr-2" />
                  <span className="text-sm">Relaxation</span>
                </label>
                <label className="flex items-center">
                  <Input type="checkbox" className="mr-2" />
                  <span className="text-sm">Cultural</span>
                </label>
                <label className="flex items-center">
                  <Input type="checkbox" className="mr-2" />
                  <span className="text-sm">Family</span>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="languages" className="block text-sm font-medium text-neutral-700 mb-2">
                Languages Spoken
              </label>
              <Input
                type="text"
                id="languages"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="English, Spanish, French..."
              />
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-neutral-700 mb-2">
                Travel Experience Level
              </label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="first-time">First-time traveler</SelectItem>
                  <SelectItem value="occasional">Occasional traveler</SelectItem>
                  <SelectItem value="frequent">Frequent traveler</SelectItem>
                  <SelectItem value="seasoned">Seasoned traveler</SelectItem>
                  <SelectItem value="professional">Professional traveler</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="frequentDestinations" className="block text-sm font-medium text-neutral-700 mb-2">
                Frequent Destinations
              </label>
              <Input
                type="text"
                id="frequentDestinations"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Paris, Tokyo, Bali..."
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-accent-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Save & Continue
            </Button>
          </form>
        </div>

        <div className="text-center">
          <p className="text-sm text-neutral-600">
            You can always update these details later in your profile settings
          </p>
        </div>
      </div>
    </div>
  )
}
