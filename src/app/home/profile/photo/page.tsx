
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: 'Profile Photo | ATLVS + GVTEWAY',
  description: 'Upload and manage your profile photo to personalize your ATLVS + GVTEWAY account.',
}

export default function HomeProfilePhotoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-semantic-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl"></span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Profile Photo</h1>
          <p className="text-neutral-600">Add a photo to personalize your profile</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <div className="text-center mb-6">
            <div className="w-32 h-32 bg-neutral-200 rounded-full mx-auto mb-4 relative">
              <span className="text-4xl absolute inset-0 flex items-center justify-center"></span>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-accent-secondary rounded-full flex items-center justify-center text-primary-foreground">
                <span className="text-sm">+</span>
              </div>
            </div>
            <p className="text-sm text-neutral-600">Current profile photo</p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Upload New Photo</h3>
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  <div className="text-4xl text-neutral-400 mb-2"></div>
                  <p className="text-neutral-600 mb-1">Click to upload or drag and drop</p>
                  <p className="text-sm text-neutral-500">PNG, JPG, GIF up to 10MB</p>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Choose from Library</h3>
              <div className="grid grid-cols-4 gap-2">
                {['', '', '', '', '', '️', '', ''].map((emoji, index) => (
                  <Button
                    key={index}
                    className="w-16 h-16 border border-neutral-200 rounded-lg hover:border-blue-300 transition-colors flex items-center justify-center text-2xl"
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-neutral-600 mt-2">Or use an avatar from our collection</p>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1 bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
                Save Photo
              </Button>
              <Button className="flex-1 bg-background text-neutral-700 border border-neutral-300 py-2 px-4 rounded-md hover:bg-gray-50">
                Remove Photo
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-neutral-900 mb-2">Photo Guidelines</h3>
          <ul className="text-sm text-neutral-600 space-y-1">
            <li>• Use a clear, high-quality image</li>
            <li>• Face should be clearly visible</li>
            <li>• Avoid group photos or images with others</li>
            <li>• Keep it appropriate and professional</li>
            <li>• File size should not exceed 10MB</li>
          </ul>
        </div>

        <div className="text-center">
          <p className="text-sm text-neutral-600">
            <a href="/home/profile/edit" className="text-accent-secondary hover:text-blue-800">
              ← Back to edit profile
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
