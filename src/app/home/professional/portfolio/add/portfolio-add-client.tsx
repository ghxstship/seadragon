'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export function PortfolioAddClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Add Portfolio Item</h1>
          <p className="text-neutral-600">Showcase your work to potential clients</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Project Type
              </label>
              <Select defaultValue="photography">
                <SelectTrigger className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photography">Photography</SelectItem>
                  <SelectItem value="videography">Videography</SelectItem>
                  <SelectItem value="content-creation">Content Creation</SelectItem>
                  <SelectItem value="event-coverage">Event Coverage</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
                Project Title
              </label>
              <Input
                type="text"
                id="title"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="Give your project a descriptive title"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
                Project Description
              </label>
              <Textarea
                id="description"
                rows={4}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="Describe the project, your role, and the results..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="client" className="block text-sm font-medium text-neutral-700 mb-2">
                  Client/Brand
                </label>
                <Input type="text" id="client" placeholder="Who was this for?" />
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-neutral-700 mb-2">
                  Completion Date
                </label>
                <Input type="date" id="date" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Media Upload
              </label>
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                <Input type="file" multiple accept="image/*,video/*" className="hidden" id="media-upload" />
                <label htmlFor="media-upload" className="cursor-pointer">
                  <div className="text-4xl text-neutral-400 mb-2"></div>
                  <p className="text-neutral-600 mb-1">Click to upload photos or videos</p>
                  <p className="text-sm text-neutral-500">PNG, JPG, GIF, MP4 up to 50MB each</p>
                </label>
              </div>
              <p className="text-xs text-neutral-500 mt-2">
                Upload high-quality images or videos showcasing your work
              </p>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-neutral-700 mb-2">
                Tags
              </label>
              <Input
                type="text"
                id="tags"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                placeholder="travel, photography, adventure, commercial..."
              />
              <p className="text-xs text-neutral-500 mt-1">Separate tags with commas</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Visibility Settings
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <Input type="radio" name="visibility" className="mr-3" defaultChecked />
                  <div>
                    <div className="font-medium text-sm">Public</div>
                    <div className="text-xs text-neutral-600">Visible to all visitors</div>
                  </div>
                </label>
                <label className="flex items-center">
                  <Input type="radio" name="visibility" className="mr-3" />
                  <div>
                    <div className="font-medium text-sm">Unlisted</div>
                    <div className="text-xs text-neutral-600">Only accessible via direct link</div>
                  </div>
                </label>
                <label className="flex items-center">
                  <Input type="radio" name="visibility" className="mr-3" />
                  <div>
                    <div className="font-medium text-sm">Private</div>
                    <div className="text-xs text-neutral-600">Only you can see this</div>
                  </div>
                </label>
              </div>
            </div>

            <div className="flex items-center">
              <Input type="checkbox" id="featured" className="mr-3" />
              <label htmlFor="featured" className="text-sm">
                Mark as featured work
              </label>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                className="flex-1 bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
              >
                Add to Portfolio
              </Button>
              <Button
                type="button"
                className="flex-1 bg-background text-neutral-700 border border-neutral-300 py-2 px-4 rounded-md hover:bg-gray-50"
              >
                Save as Draft
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-neutral-900 mb-2">Portfolio Tips</h3>
          <ul className="text-sm text-neutral-600 space-y-1">
            <li>• Include before/after shots or process photos</li>
            <li>• Write detailed descriptions of your work</li>
            <li>• Use relevant tags to improve discoverability</li>
            <li>• Feature your best work prominently</li>
            <li>• Keep descriptions clear and professional</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
