
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: 'Live Streams | ATLVS + GVTEWAY',
  description: 'Watch live streams from our destinations and join real-time travel experiences.',
}

export default function LivePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Live Streams</h1>
          <p className="text-lg text-neutral-600">Join real-time experiences from destinations around the world</p>
        </div>

        <div className="bg-semantic-error text-primary-foreground rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2"> LIVE NOW</h2>
              <h3 className="text-xl font-semibold mb-1">Sunset Yoga in Bali</h3>
              <p className="text-red-100">Join us for a peaceful evening yoga session overlooking the Indian Ocean</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold mb-1">247</div>
              <div className="text-sm text-red-100">watching</div>
            </div>
          </div>
          <div className="mt-4">
            <Button className="bg-background text-semantic-error px-6 py-3 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-500 font-semibold">
              Watch Live
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Upcoming live streams */}
          {[
            {
              title: "Tokyo Street Food Tour",
              time: "Today 6:00 PM EST",
              duration: "2 hours",
              viewers: "1.2K expected",
              description: "Explore Shibuya's best street food with our local guide"
            },
            {
              title: "Swiss Alps Hiking Adventure",
              time: "Tomorrow 8:00 AM EST",
              duration: "4 hours",
              viewers: "850 expected",
              description: "Join us for a scenic hike with stunning mountain views"
            },
            {
              title: "Santorini Wine Tasting",
              time: "Friday 4:00 PM EST",
              duration: "1.5 hours",
              viewers: "650 expected",
              description: "Taste local wines while overlooking the caldera"
            },
            {
              title: "Machu Picchu Sunrise",
              time: "Saturday 5:30 AM EST",
              duration: "3 hours",
              viewers: "2.1K expected",
              description: "Watch the sunrise over the ancient Incan citadel"
            },
            {
              title: "Moroccan Cooking Class",
              time: "Sunday 11:00 AM EST",
              duration: "2 hours",
              viewers: "780 expected",
              description: "Learn to make traditional tagine with a local chef"
            },
            {
              title: "Dubai Desert Safari",
              time: "Next Week 3:00 PM EST",
              duration: "5 hours",
              viewers: "1.5K expected",
              description: "Experience dune bashing and traditional Bedouin camp"
            }
          ].map((stream, index) => (
            <div key={index} className="bg-background rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gradient-to-br from-green-400 to-blue-500 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-primary-foreground text-3xl"></span>
                </div>
                <div className="absolute top-3 left-3 bg-semantic-error text-primary-foreground px-2 py-1 rounded text-xs font-medium">
                  LIVE
                </div>
                <div className="absolute bottom-3 left-3 bg-neutral-900 bg-opacity-75 text-primary-foreground px-2 py-1 rounded text-xs">
                  {stream.time}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">{stream.title}</h3>
                <p className="text-sm text-neutral-600 mb-3">{stream.description}</p>
                <div className="flex justify-between text-xs text-neutral-500 mb-3">
                  <span>⏱️ {stream.duration}</span>
                  <span>️ {stream.viewers}</span>
                </div>
                <Button className="w-full bg-semantic-success text-primary-foreground py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-semantic-success focus:ring-offset-2 text-sm">
                  Set Reminder
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-background rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Live Stream Categories</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Sunrise & Sunset</h3>
              <p className="text-sm text-neutral-600">12 streams</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block">️</span>
              <h3 className="font-medium text-neutral-900 mb-1">Adventure</h3>
              <p className="text-sm text-neutral-600">18 streams</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block">‍</span>
              <h3 className="font-medium text-neutral-900 mb-1">Cooking Classes</h3>
              <p className="text-sm text-neutral-600">9 streams</p>
            </div>
            <div className="text-center p-4 border border-neutral-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-colors cursor-pointer">
              <span className="text-3xl mb-2 block"></span>
              <h3 className="font-medium text-neutral-900 mb-1">Cultural Experiences</h3>
              <p className="text-sm text-neutral-600">15 streams</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Interactive Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Live Chat</h3>
              <p className="text-neutral-600 mb-3">
                Interact with hosts and other viewers in real-time during live streams.
              </p>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Ask questions about destinations</li>
                <li>• Share travel tips</li>
                <li>• Connect with fellow travelers</li>
                <li>• Get instant recommendations</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-neutral-900 mb-3">Q&A Sessions</h3>
              <p className="text-neutral-600 mb-3">
                Join dedicated Q&A segments with travel experts and local guides.
              </p>
              <ul className="text-sm text-neutral-600 space-y-1">
                <li>• Expert travel advice</li>
                <li>• Local insider knowledge</li>
                <li>• Destination planning tips</li>
                <li>• Safety and logistics info</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-green-900 mb-4">Past Live Streams</h2>
          <p className="text-green-800 mb-4">
            Missed a live stream? Catch up on our most popular past broadcasts.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Northern Lights in Iceland", views: "3.2K", duration: "2:15:30" },
              { title: "Great Barrier Reef Dive", views: "4.1K", duration: "1:45:22" },
              { title: "Venice Carnival Experience", views: "2.8K", duration: "3:02:18" }
            ].map((stream, index) => (
              <div key={index} className="bg-background rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="aspect-video bg-neutral-200 rounded mb-3 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-neutral-600 text-2xl">▶️</span>
                  </div>
                </div>
                <h3 className="font-medium text-neutral-900 mb-1">{stream.title}</h3>
                <div className="flex justify-between text-sm text-neutral-600">
                  <span>️ {stream.views}</span>
                  <span>⏱️ {stream.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Host Your Own Live Stream</h2>
          <p className="text-blue-800 mb-4">
            Are you a travel creator or local expert? Share your experiences with our global audience.
          </p>
          <div className="flex gap-4">
            <Button className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
              Apply to Host
            </Button>
            <Button className="bg-background text-accent-secondary border border-blue-600 px-6 py-3 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2">
              Creator Guidelines
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
