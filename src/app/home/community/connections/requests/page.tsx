
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export const metadata: Metadata = {
  title: 'Connection Requests | ATLVS + GVTEWAY',
  description: 'Manage incoming and outgoing connection requests from fellow travelers.',
}

export default function HomeCommunityConnectionsRequestsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Connection Requests</h1>
          <p className="text-neutral-600">Manage your network connections and requests</p>
        </div>

        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <Button className="text-accent-secondary font-medium">Received (3)</Button>
            <Button className="text-neutral-600 hover:text-neutral-900">Sent</Button>
          </div>
        </div>

        <div className="space-y-6 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="relative mr-4">
                  <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-accent-secondary font-semibold">SC</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-semantic-success rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1">Sarah Chen</h3>
                  <p className="text-neutral-600 mb-2">Travel photographer • New York, NY</p>
                  <p className="text-sm text-neutral-700 mb-3">
                    &quot;Hi! I saw your Kyoto posts and loved your perspective on Japanese culture.
                    Would love to connect and share travel tips!&quot;
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-neutral-600">
                    <span>2 mutual connections</span>
                    <span>Sent 2 hours ago</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-accent-tertiary">
                  Accept
                </Button>
                <Button className="bg-background text-neutral-700 border border-neutral-300 px-4 py-2 rounded text-sm hover:bg-gray-50">
                  Decline
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="relative mr-4">
                  <div className="w-16 h-16 bg-semantic-success/10 rounded-full flex items-center justify-center">
                    <span className="text-semantic-success font-semibold">MR</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-semantic-warning rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-1">Marcus Rodriguez</h3>
                  <p className="text-neutral-600 mb-2">Adventure guide • Los Angeles, CA</p>
                  <p className="text-sm text-neutral-700 mb-3">
                    &quot;Love your Patagonia photos! I'm planning a similar trip next month.
                    Would appreciate any recommendations for hiking trails.&quot;
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-neutral-600">
                    <span>1 mutual connection</span>
                    <span>Sent 1 day ago</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-accent-tertiary">
                  Accept
                </Button>
                <Button className="bg-background text-neutral-700 border border-neutral-300 px-4 py-2 rounded text-sm hover:bg-gray-50">
                  Decline
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="relative mr-4">
                  <div className="w-16 h-16 bg-accent-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-accent-primary font-semibold">DK</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-neutral-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-1">David Kim</h3>
                <p className="text-neutral-600 mb-2">Food blogger • Seoul, South Korea</p>
                <p className="text-sm text-neutral-700 mb-3">
                    &quot;Your food photography is incredible! I'm always looking for inspiration
                    for my own travel food blog. Let's connect!&quot;
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-neutral-600">
                    <span>3 mutual connections</span>
                    <span>Sent 3 days ago</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded text-sm hover:bg-accent-tertiary">
                  Accept
                </Button>
                <Button className="bg-background text-neutral-700 border border-neutral-300 px-4 py-2 rounded text-sm hover:bg-gray-50">
                  Decline
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Sent Requests</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-semantic-warning/10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-semantic-warning font-semibold">LW</span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Lisa Wang</h3>
                  <p className="text-sm text-neutral-600">Shanghai, China • Sent 1 week ago</p>
                </div>
              </div>
              <span className="text-sm text-semantic-warning bg-semantic-warning/10 px-2 py-1 rounded">Pending</span>
            </div>

            <div className="flex items-center justify-between p-4 border border-neutral-200 rounded">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-semantic-error/10 rounded-full flex items-center justify-center mr-3">
                  <span className="text-semantic-error font-semibold">AJ</span>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Alex Johnson</h3>
                  <p className="text-sm text-neutral-600">Sydney, Australia • Sent 5 days ago</p>
                </div>
              </div>
              <span className="text-sm text-semantic-warning bg-semantic-warning/10 px-2 py-1 rounded">Pending</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Connection Guidelines</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">When to Accept</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Shared travel interests or destinations</li>
                <li>• Professional connections in travel industry</li>
                <li>• Mutual friends or connections</li>
                <li>• Genuine interest in connecting</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-2">When to Decline</h3>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• No shared interests or connections</li>
                <li>• Suspicious or inappropriate requests</li>
                <li>• Too many connection requests at once</li>
                <li>• Not aligned with your travel goals</li>
              </ul>
            </div>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <h3 className="font-medium text-blue-900 mb-1">Auto-Accept Settings</h3>
                <p className="text-sm text-blue-800">
                  Automatically accept requests from people with 3+ mutual connections
                </p>
              </div>
              <Input type="checkbox" className="ml-3" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
