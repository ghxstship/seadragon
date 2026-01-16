
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export const metadata: Metadata = {
  title: 'Opportunities | ATLVS + GVTEWAY',
  description: 'Discover new professional opportunities and job matches tailored to your skills and experience.',
}

export default function HomeProfessionalOpportunitiesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Professional Opportunities</h1>
          <p className="text-neutral-600">Discover projects and collaborations that match your expertise</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="bg-background rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Recommended Opportunities</h2>
              <div className="space-y-4">
                <div className="border border-neutral-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-1">Destination Wedding Photography</h3>
                      <p className="text-neutral-600 mb-2">Capture a romantic beach wedding in Bali for a high-profile couple</p>
                      <div className="flex items-center space-x-4 text-sm text-neutral-600">
                        <span> Bali, Indonesia</span>
                        <span> April 15-17, 2024</span>
                        <span> $5,000</span>
                      </div>
                    </div>
                    <span className="bg-semantic-success/10 text-green-800 text-xs px-2 py-1 rounded">98% Match</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-neutral-200 rounded-full"></div>
                      <span className="text-sm text-neutral-700">Sarah & Michael Johnson</span>
                    </div>
                    <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-accent-tertiary">
                      Express Interest
                    </Button>
                  </div>
                </div>

                <div className="border border-neutral-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-1">Corporate Event Coverage</h3>
                      <p className="text-neutral-600 mb-2">Document a tech conference keynote and networking sessions</p>
                      <div className="flex items-center space-x-4 text-sm text-neutral-600">
                        <span> San Francisco, CA</span>
                        <span> May 8-10, 2024</span>
                        <span> $3,200</span>
                      </div>
                    </div>
                    <span className="bg-semantic-success/10 text-green-800 text-xs px-2 py-1 rounded">94% Match</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-neutral-200 rounded-full"></div>
                      <span className="text-sm text-neutral-700">TechCorp Events</span>
                    </div>
                    <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-accent-tertiary">
                      Express Interest
                    </Button>
                  </div>
                </div>

                <div className="border border-neutral-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-1">Travel Blog Collaboration</h3>
                      <p className="text-neutral-600 mb-2">Create content for a luxury travel blog featuring your photography</p>
                      <div className="flex items-center space-x-4 text-sm text-neutral-600">
                        <span> Remote</span>
                        <span> Ongoing</span>
                        <span> $800/month</span>
                      </div>
                    </div>
                    <span className="bg-accent-primary/10 text-blue-800 text-xs px-2 py-1 rounded">89% Match</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-neutral-200 rounded-full"></div>
                      <span className="text-sm text-neutral-700">Luxury Travel Magazine</span>
                    </div>
                    <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-accent-tertiary">
                      Express Interest
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-semantic-success rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-neutral-900">You viewed the Bali wedding opportunity</p>
                    <p className="text-xs text-neutral-600">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent-primary rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-neutral-900">Your portfolio was viewed by Sarah Johnson</p>
                    <p className="text-xs text-neutral-600">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent-primary rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-neutral-900">New opportunity matched to your skills</p>
                    <p className="text-xs text-neutral-600">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-background rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Opportunity Stats</h2>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent-secondary mb-1">23</div>
                  <div className="text-sm text-neutral-600">New Matches This Week</div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-neutral-700">Photography</span>
                      <span className="text-sm text-neutral-600">12</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-accent-secondary h-2 rounded-full w-[52%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-neutral-700">Videography</span>
                      <span className="text-sm text-neutral-600">6</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-semantic-success h-2 rounded-full w-[26%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-neutral-700">Content Creation</span>
                      <span className="text-sm text-neutral-600">5</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div className="bg-accent-primary h-2 rounded-full w-[22%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Matching Preferences</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Location Preferences
                  </label>
                  <Select className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary text-sm">
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="north-america">North America</SelectItem>
                    <SelectItem value="europe">Europe</SelectItem>
                    <SelectItem value="asia">Asia</SelectItem>
                    <SelectItem value="local-only-50-miles">Local Only (50 miles)</SelectItem>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Project Types
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <Input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm">Commercial Work</span>
                    </label>
                    <label className="flex items-center">
                      <Input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm">Weddings</span>
                    </label>
                    <label className="flex items-center">
                      <Input type="checkbox" className="mr-2" />
                      <span className="text-sm">Corporate Events</span>
                    </label>
                    <label className="flex items-center">
                      <Input type="checkbox" className="mr-2" defaultChecked />
                      <span className="text-sm">Travel Content</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Minimum Rate
                  </label>
                  <Input
                    type="number"
                    defaultValue="500"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  />
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">Pro Tips</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Update your skills regularly</li>
                <li>• Set competitive rates</li>
                <li>• Respond quickly to inquiries</li>
                <li>• Build your portfolio</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
