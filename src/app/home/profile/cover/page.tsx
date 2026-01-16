
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: 'Cover Photo | ATLVS + GVTEWAY',
  description: 'Upload and manage your profile cover photo to customize your ATLVS + GVTEWAY profile.',
}

export default function HomeProfileCoverPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-semantic-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">️</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Cover Photo</h1>
          <p className="text-neutral-600">Add a banner to your profile</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <div className="mb-6">
            <div className="aspect-video bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg mb-4 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-4xl"></span>
              </div>
              <div className="absolute bottom-2 right-2 bg-background bg-opacity-90 rounded px-2 py-1">
                <span className="text-xs text-neutral-600">Current cover</span>
              </div>
            </div>
            <p className="text-sm text-neutral-600 text-center">Recommended size: 1200x400px</p>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Upload New Cover</h3>
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="cover-upload"
                />
                <label htmlFor="cover-upload" className="cursor-pointer">
                  <div className="text-4xl text-neutral-400 mb-2"></div>
                  <p className="text-neutral-600 mb-1">Click to upload or drag and drop</p>
                  <p className="text-sm text-neutral-500">PNG, JPG, GIF up to 15MB</p>
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Choose from Templates</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="aspect-video bg-gradient-to-r from-blue-400 to-blue-600 rounded cursor-pointer border-2 border-transparent hover:border-accent-primary transition-colors"></div>
                <div className="aspect-video bg-gradient-to-r from-green-400 to-green-600 rounded cursor-pointer border-2 border-transparent hover:border-semantic-success transition-colors"></div>
                <div className="aspect-video bg-gradient-to-r from-purple-400 to-purple-600 rounded cursor-pointer border-2 border-transparent hover:border-purple-500 transition-colors"></div>
                <div className="aspect-video bg-gradient-to-r from-orange-400 to-orange-600 rounded cursor-pointer border-2 border-transparent hover:border-orange-500 transition-colors"></div>
              </div>
              <p className="text-sm text-neutral-600 mt-2">Or use a gradient background</p>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1 bg-semantic-warning text-primary-foreground py-2 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
                Save Cover
              </Button>
              <Button className="flex-1 bg-background text-neutral-700 border border-neutral-300 py-2 px-4 rounded-md hover:bg-gray-50">
                Remove Cover
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-neutral-900 mb-2">Cover Photo Tips</h3>
          <ul className="text-sm text-neutral-600 space-y-1">
            <li>• Use high-resolution images for best quality</li>
            <li>• Landscapes work well for cover photos</li>
            <li>• Consider your personal brand or travel theme</li>
            <li>• Avoid text-heavy images as they may not display well</li>
            <li>• File size should not exceed 15MB</li>
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
