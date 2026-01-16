
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: 'Add Profile Photo | ATLVS + GVTEWAY',
  description: 'Upload a profile photo to personalize your ATLVS + GVTEWAY account.',
}

export default function OnboardingProfilePhotoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl"></span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Add a Profile Photo</h1>
          <p className="text-neutral-600">Help others recognize you</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <div className="text-center">
            <div className="w-32 h-32 bg-neutral-200 rounded-full mx-auto mb-6 flex items-center justify-center relative">
              <span className="text-4xl"></span>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-accent-secondary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground text-sm">+</span>
              </div>
            </div>

            <div className="space-y-4">
              <Button className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
                Upload Photo
              </Button>

              <div className="text-sm text-neutral-500">
                or
              </div>

              <Button className="w-full bg-background text-neutral-700 border border-neutral-300 py-2 px-4 rounded-md hover:bg-gray-50">
                Choose from Avatar Library
              </Button>
            </div>

            <p className="text-xs text-neutral-500 mt-4">
              Recommended: Square image, at least 400x400px. Max file size: 5MB
            </p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-neutral-900 mb-2">Privacy Settings</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <Input type="radio" name="privacy" className="mr-3" defaultChecked />
              <div>
                <div className="font-medium text-sm">Public</div>
                <div className="text-xs text-neutral-600">Anyone can see your photo</div>
              </div>
            </label>
            <label className="flex items-center">
              <Input type="radio" name="privacy" className="mr-3" />
              <div>
                <div className="font-medium text-sm">Connections Only</div>
                <div className="text-xs text-neutral-600">Only your connections can see</div>
              </div>
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <Button className="flex-1 bg-background text-neutral-700 border border-neutral-300 py-2 px-4 rounded-md hover:bg-gray-50">
            Skip for now
          </Button>
          <Button className="flex-1 bg-semantic-success text-primary-foreground py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-semantic-success focus:ring-offset-2">
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
