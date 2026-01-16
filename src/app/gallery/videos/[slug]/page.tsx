
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

interface VideoPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `${slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())} | ATLVS + GVTEWAY Video`,
    description: `Watch our travel video: ${slug.replace(/-/g, ' ')} - cinematic footage showcasing amazing destinations and experiences.`,
  }
}

export default async function VideoPage({ params }: VideoPageProps) {
  const { slug } = await params
  const videoName = slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <nav className="text-sm text-neutral-600 mb-4">
            <a href="/gallery" className="hover:text-semantic-error">Gallery</a>
            <span className="mx-2">/</span>
            <a href="/gallery/videos" className="hover:text-semantic-error">Videos</a>
            <span className="mx-2">/</span>
            <span className="text-neutral-900">{videoName}</span>
          </nav>
        </div>

        <div className="bg-background rounded-lg shadow-md overflow-hidden mb-8">
          <div className="aspect-video bg-gradient-to-br from-red-400 to-pink-500 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <Button className="bg-background bg-opacity-90 hover:bg-opacity-100 rounded-full p-4 transition-all">
                <span className="text-semantic-error text-3xl">▶️</span>
              </Button>
            </div>
            <div className="absolute bottom-4 right-4 bg-neutral-900 bg-opacity-75 text-primary-foreground px-3 py-1 rounded text-sm">
              12:34 / 15:47
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-neutral-900 mb-2">{videoName}</h1>
                <p className="text-neutral-600 mb-3">
                  Experience the breathtaking beauty of {videoName.toLowerCase()} through this cinematic journey.
                  From stunning landscapes to vibrant local culture, discover what makes this destination unforgettable.
                </p>
                <div className="flex items-center space-x-4 text-sm text-neutral-500">
                  <span>️ 24.5K views</span>
                  <span>•</span>
                  <span> 1.2K likes</span>
                  <span>•</span>
                  <span> 2 weeks ago</span>
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <Button className="bg-semantic-error text-primary-foreground px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-semantic-error focus:ring-offset-2">
                   Like
                </Button>
                <Button className="bg-neutral-600 text-primary-foreground px-4 py-2 rounded-md hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2">
                   Share
                </Button>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-neutral-300 rounded-full"></div>
                <div>
                  <p className="font-medium text-neutral-900">ATLVS + GVTEWAY</p>
                  <p className="text-sm text-neutral-600">Travel Video Producer</p>
                </div>
                <Button className="ml-auto bg-semantic-error text-primary-foreground px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-semantic-error focus:ring-offset-2 text-sm">
                  Subscribe
                </Button>
              </div>
              <p className="text-neutral-700">
                This video was filmed over three weeks in {videoName.toLowerCase()}, capturing the raw beauty and authentic experiences
                that make this destination so special. From sunrise hikes to sunset beach dinners, we aimed to showcase
                the true essence of travel.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Video Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-600">Duration:</span>
                <span className="font-medium">15:47</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Location:</span>
                <span className="font-medium">{videoName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Category:</span>
                <span className="font-medium">Destination</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Filmed:</span>
                <span className="font-medium">March 2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Resolution:</span>
                <span className="font-medium">4K</span>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-4">Chapters</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <span className="text-sm text-neutral-500">0:00</span>
                <div>
                  <p className="font-medium text-neutral-900">Arrival & First Impressions</p>
                  <p className="text-sm text-neutral-600">Welcome to paradise</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <span className="text-sm text-neutral-500">3:15</span>
                <div>
                  <p className="font-medium text-neutral-900">Local Culture</p>
                  <p className="text-sm text-neutral-600">Traditional ceremonies and customs</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <span className="text-sm text-neutral-500">7:42</span>
                <div>
                  <p className="font-medium text-neutral-900">Natural Wonders</p>
                  <p className="text-sm text-neutral-600">Exploring the landscape</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <span className="text-sm text-neutral-500">12:18</span>
                <div>
                  <p className="font-medium text-neutral-900">Culinary Journey</p>
                  <p className="text-sm text-neutral-600">Local food and dining experiences</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">Related Videos</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Hidden Gems of Bali", duration: "11:23", views: "18.3K" },
              { title: "Tokyo Street Food Tour", duration: "14:15", views: "32.1K" },
              { title: "Swiss Alps Adventure", duration: "16:42", views: "15.7K" }
            ].map((video, index) => (
              <div key={index} className="bg-background rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <div className="aspect-video bg-gradient-to-br from-red-400 to-pink-500 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-primary-foreground text-2xl">▶️</span>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-neutral-900 bg-opacity-75 text-primary-foreground px-2 py-1 rounded text-xs">
                    {video.duration}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-neutral-900 mb-1 text-sm">{video.title}</h3>
                  <p className="text-xs text-neutral-600">{video.views} views</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-red-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-900 mb-4">Download & Sharing</h2>
          <p className="text-red-800 mb-4">
            This video is available for personal use. Share with friends or download for offline viewing.
          </p>
          <div className="flex gap-4">
            <Button className="bg-semantic-error text-primary-foreground px-6 py-3 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-semantic-error focus:ring-offset-2">
              Download Video
            </Button>
            <Button className="bg-background text-semantic-error border border-red-600 px-6 py-3 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2">
              Share Link
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
