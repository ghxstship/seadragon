
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: 'Social Links | ATLVS + GVTEWAY',
  description: 'Connect your social media accounts and add links to your profile.',
}

export default function HomeProfileSocialPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl"></span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Social Links</h1>
          <p className="text-neutral-600">Connect your social media and online presence</p>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-6">
          <form className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Social Media Accounts</h3>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent-secondary rounded flex items-center justify-center text-primary-foreground">
                    <span className="text-sm">f</span>
                  </div>
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Facebook username or profile URL"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    />
                  </div>
                  <Input type="checkbox" className="ml-2" defaultChecked />
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-sky-500 rounded flex items-center justify-center text-primary-foreground">
                    <span className="text-sm">t</span>
                  </div>
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Twitter handle or profile URL"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    />
                  </div>
                  <Input type="checkbox" className="ml-2" defaultChecked />
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-pink-600 rounded flex items-center justify-center text-primary-foreground">
                    <span className="text-sm">i</span>
                  </div>
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="Instagram username or profile URL"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    />
                  </div>
                  <Input type="checkbox" className="ml-2" />
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-semantic-error rounded flex items-center justify-center text-primary-foreground">
                    <span className="text-sm">y</span>
                  </div>
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="YouTube channel URL"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    />
                  </div>
                  <Input type="checkbox" className="ml-2" />
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent-tertiary rounded flex items-center justify-center text-primary-foreground">
                    <span className="text-sm">l</span>
                  </div>
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder="LinkedIn profile URL"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                    />
                  </div>
                  <Input type="checkbox" className="ml-2" />
                </div>
              </div>

              <p className="text-xs text-neutral-500 mt-2">
                Check the boxes to display these links on your public profile
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-neutral-900 mb-4">Other Links</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Personal Website
                  </label>
                  <Input
                    type="url"
                    placeholder="https://yourwebsite.com"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Blog or Portfolio
                  </label>
                  <Input
                    type="url"
                    placeholder="https://yourblog.com"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Other Links
                  </label>
                  <Input
                    type="url"
                    placeholder="Additional website or profile"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent-secondary text-primary-foreground py-2 px-4 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2"
            >
              Save Social Links
            </Button>
          </form>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-neutral-900 mb-2">Privacy Note</h3>
          <p className="text-sm text-neutral-600">
            Only checked links will be visible on your public profile. You can change your privacy settings
            at any time in your account preferences.
          </p>
        </div>

        <div className="text-center mt-4">
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
