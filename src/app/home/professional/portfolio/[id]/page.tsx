
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

interface PortfolioEditPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PortfolioEditPageProps): Promise<Metadata> {
  return {
    title: `Edit Portfolio Item | ATLVS + GVTEWAY`,
    description: 'Edit your portfolio item details and media.',
  }
}

export default async function HomeProfessionalPortfolioEditPage({ params }: PortfolioEditPageProps) {
  const { id } = await params
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Edit Portfolio Item</h1>
          <p className="text-neutral-600">Update your work details and media</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <form className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-neutral-700 mb-2">
                Project Title
              </label>
              <Input
                type="text"
                id="title"
                defaultValue="Santorini Sunset Photography"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
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
                defaultValue="Captured stunning sunset views over the iconic Santorini caldera. This commercial shoot for a luxury travel brand featured golden hour lighting and traditional architecture."
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                required/>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-neutral-700 mb-2">
                  Category
                </label>
                <Select className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary">
                  <SelectItem value="photography">Photography</SelectItem>
                  <SelectItem value="videography">Videography</SelectItem>
                  <SelectItem value="content-creation">Content Creation</SelectItem>
                  <SelectItem value="event-coverage">Event Coverage</SelectItem>
                </Select>
              </div>
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-neutral-700 mb-2">
                  Completion Date
                </label>
                <Input
                  type="date"
                  id="date"
                  defaultValue="2024-01-15"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="client" className="block text-sm font-medium text-neutral-700 mb-2">
                Client/Brand (Optional)
              </label>
              <Input
                type="text"
                id="client"
                defaultValue="Luxury Travel Magazine"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Current Media
              </label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="aspect-video bg-neutral-200 rounded flex items-center justify-center">
                  <span className="text-2xl">️</span>
                </div>
                <div className="aspect-video bg-neutral-200 rounded flex items-center justify-center">
                  <span className="text-2xl"></span>
                </div>
                <div className="aspect-video bg-neutral-200 rounded flex items-center justify-center">
                  <span className="text-2xl"></span>
                </div>
              </div>
              <p className="text-sm text-neutral-600">3 files uploaded</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Add More Media (Optional)
              </label>
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center">
                <Input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                  id="media-upload"
                />
                <label htmlFor="media-upload" className="cursor-pointer">
                  <div className="text-4xl text-neutral-400 mb-2"></div>
                  <p className="text-neutral-600 mb-1">Click to add more photos or videos</p>
                  <p className="text-sm text-neutral-500">PNG, JPG, GIF, MP4 up to 50MB each</p>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-neutral-700 mb-2">
                Tags
              </label>
              <Input
                type="text"
                id="tags"
                defaultValue="travel, photography, santorini, sunset, luxury, commercial"
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
              />
              <p className="text-xs text-neutral-500 mt-1">Separate tags with commas</p>
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

        <div className="bg-red-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-red-900 mb-2">Danger Zone</h3>
          <p className="text-sm text-red-800 mb-3">
            Deleting this portfolio item cannot be undone. All associated media and data will be permanently removed.
          </p>
          <Button className="bg-semantic-error text-primary-foreground px-4 py-2 rounded text-sm hover:bg-red-700">
            Delete Portfolio Item
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-neutral-600">
            <a href="/home/professional/portfolio" className="text-accent-secondary hover:text-blue-800">
              ← Back to portfolio
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
