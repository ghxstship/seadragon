
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface MessagePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: MessagePageProps): Promise<Metadata> {
  return {
    title: `Conversation | ATLVS + GVTEWAY`,
    description: 'View and continue your conversation with fellow travelers.',
  }
}

export default async function HomeCommunityMessagesIdPage({ params }: MessagePageProps) {
  const { id } = await params
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-background rounded-lg shadow-md p-4">
              <div className="flex items-center mb-4">
                <Button className="mr-3 text-neutral-600 hover:text-neutral-800">
                  ← Back to Messages
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center p-3 bg-blue-50 rounded-lg cursor-pointer">
                  <div className="relative mr-3">
                    <div className="w-10 h-10 bg-accent-primary/10 rounded-full flex items-center justify-center text-accent-secondary font-semibold">
                      SC
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-semantic-success rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">Sarah Chen</p>
                    <p className="text-sm text-neutral-600 truncate">Hey! Are you planning any trips soon?</p>
                  </div>
                  <span className="text-xs text-neutral-500">2m</span>
                </div>

                <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="relative mr-3">
                    <div className="w-10 h-10 bg-semantic-success/10 rounded-full flex items-center justify-center text-semantic-success font-semibold">
                      MR
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-neutral-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">Marcus Rodriguez</p>
                    <p className="text-sm text-neutral-600 truncate">Thanks for the Kyoto recommendations!</p>
                  </div>
                  <span className="text-xs text-neutral-500">1h</span>
                </div>

                <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                  <div className="relative mr-3">
                    <div className="w-10 h-10 bg-accent-primary/10 rounded-full flex items-center justify-center text-accent-primary font-semibold">
                      ET
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-neutral-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">Emma Thompson</p>
                    <p className="text-sm text-neutral-600 truncate">The photos from Santorini are amazing!</p>
                  </div>
                  <span className="text-xs text-neutral-500">2h</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-background rounded-lg shadow-md h-96 flex flex-col">
              <div className="p-4 border-b border-neutral-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="relative mr-3">
                      <div className="w-10 h-10 bg-accent-primary/10 rounded-full flex items-center justify-center text-accent-secondary font-semibold">
                        SC
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-semantic-success rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <h3 className="font-medium text-neutral-900">Sarah Chen</h3>
                      <p className="text-sm text-neutral-600">Active 2 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button className="text-neutral-600 hover:text-neutral-800">
                      <span className="text-sm">⋯</span>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                  <div className="text-center text-sm text-neutral-500 py-4">
                    Conversation started March 10, 2024
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-neutral-100 rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-neutral-900">Hi! I saw your post about your upcoming trip to Japan. I'm heading there too next month!</p>
                      <p className="text-xs text-neutral-500 mt-1">March 10, 2024 • 10:30 AM</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-accent-secondary rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-primary-foreground">That's awesome! Which cities are you visiting?</p>
                      <p className="text-xs text-blue-100 mt-1">March 10, 2024 • 10:32 AM</p>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-neutral-100 rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-neutral-900">Tokyo, Kyoto, and Osaka. I have about 10 days. Any must-see recommendations?</p>
                      <p className="text-xs text-neutral-500 mt-1">March 10, 2024 • 10:33 AM</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-accent-secondary rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-primary-foreground">Definitely visit Fushimi Inari Shrine in Kyoto - it's incredible! And don't miss the food scene in Osaka.</p>
                      <p className="text-xs text-blue-100 mt-1">March 10, 2024 • 10:35 AM</p>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-neutral-100 rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-neutral-900">Thanks! I'm also interested in traditional tea ceremonies. Any good places to experience that?</p>
                      <p className="text-xs text-neutral-500 mt-1">March 10, 2024 • 2:15 PM</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-accent-secondary rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-primary-foreground">I did one at En in Kyoto and it was amazing. Very authentic experience. I can send you the details!</p>
                      <p className="text-xs text-blue-100 mt-1">March 10, 2024 • 2:18 PM</p>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-neutral-100 rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-neutral-900">That would be perfect! Are you free to meet up while we're both there?</p>
                      <p className="text-xs text-neutral-500 mt-1">March 10, 2024 • 2:20 PM</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-accent-secondary rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-primary-foreground">Absolutely! I'd love to connect. Let's exchange travel dates and coordinate.</p>
                      <p className="text-xs text-blue-100 mt-1">March 10, 2024 • 2:22 PM</p>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-neutral-100 rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-neutral-900">Perfect! I'll be there March 15-25. Looking forward to it!</p>
                      <p className="text-xs text-neutral-500 mt-1">March 10, 2024 • 2:25 PM</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-accent-secondary rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-primary-foreground">Same dates! This is going to be great. I'll send you that tea ceremony info now.</p>
                      <p className="text-xs text-blue-100 mt-1">March 10, 2024 • 2:26 PM</p>
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="bg-neutral-100 rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-neutral-900">Thanks so much! Can't wait to explore Japan together.</p>
                      <p className="text-xs text-neutral-500 mt-1">March 10, 2024 • 2:28 PM</p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-accent-secondary rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-primary-foreground">Me too! Safe travels until then. ️</p>
                      <p className="text-xs text-blue-100 mt-1">March 10, 2024 • 2:30 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-neutral-200">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  />
                  <Button className="bg-accent-secondary text-primary-foreground px-4 py-2 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2">
                    Send
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex space-x-2">
                    <Button className="text-neutral-600 hover:text-accent-secondary text-sm">
                       Attach
                    </Button>
                    <Button className="text-neutral-600 hover:text-accent-secondary text-sm">
                       Emoji
                    </Button>
                  </div>
                  <span className="text-xs text-neutral-500">Sarah is typing...</span>
                </div>
              </div>
            </div>

            <div className="bg-background rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Travel Details</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-neutral-900 mb-2">Your Trip</h3>
                  <div className="text-sm text-neutral-600 space-y-1">
                    <p><strong>Dates:</strong> March 15-25, 2024</p>
                    <p><strong>Destinations:</strong> Tokyo, Kyoto, Osaka</p>
                    <p><strong>Interests:</strong> Culture, Food, Photography</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900 mb-2">Sarah's Trip</h3>
                  <div className="text-sm text-neutral-600 space-y-1">
                    <p><strong>Dates:</strong> March 15-25, 2024</p>
                    <p><strong>Destinations:</strong> Tokyo, Kyoto, Osaka</p>
                    <p><strong>Interests:</strong> Culture, Food, Adventure</p>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <Button className="bg-semantic-success text-primary-foreground px-4 py-2 rounded hover:bg-green-700">
                  Suggest Meeting Point
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
