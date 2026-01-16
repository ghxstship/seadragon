
import { Metadata } from 'next'
import { Button } from "@/components/ui/button"

interface GuidePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `${slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Travel Guide | ATLVS + GVTEWAY`,
    description: `Comprehensive travel guide for ${slug.replace(/-/g, ' ')} with local insights and recommendations.`,
  }
}

export default async function GuideDetailPage({ params }: GuidePageProps) {
  const { slug } = await params
  const guideName = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-4 text-sm text-neutral-600 mb-4">
            <span className="bg-accent-primary/10 text-blue-800 px-2 py-1 rounded">Food & Dining</span>
            <span>•</span>
            <span>12 min read</span>
            <span>•</span>
            <span>Updated 2 weeks ago</span>
          </div>
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">{guideName}</h1>
          <p className="text-xl text-neutral-700 mb-6">
            Discover the vibrant food scene of {guideName} with our comprehensive guide to local specialties,
            hidden gems, and culinary experiences that will tantalize your taste buds.
          </p>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-neutral-300 rounded-full"></div>
            <div>
              <p className="font-medium text-neutral-900">Maria Rodriguez</p>
              <p className="text-sm text-neutral-600">Food Writer & Local Expert</p>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-lg shadow-md overflow-hidden mb-8">
          <div className="h-64 bg-gradient-to-r from-orange-400 to-red-500"></div>
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-neutral-900 mb-6">Essential Food Experiences</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium text-neutral-900 mb-3">Must-Try Local Specialties</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border border-neutral-200 rounded-lg p-4">
                    <h4 className="font-medium text-neutral-900 mb-2">Traditional Dish Name</h4>
                    <p className="text-sm text-neutral-600 mb-2">
                      A beloved local specialty made with fresh ingredients and traditional cooking methods.
                    </p>
                    <p className="text-sm font-medium text-semantic-warning">$12-18 per serving</p>
                  </div>
                  <div className="border border-neutral-200 rounded-lg p-4">
                    <h4 className="font-medium text-neutral-900 mb-2">Street Food Favorite</h4>
                    <p className="text-sm text-neutral-600 mb-2">
                      Popular street food that&apos;s cheap, delicious, and authentic to the local culture.
                    </p>
                    <p className="text-sm font-medium text-semantic-warning">$3-6 per serving</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-neutral-900 mb-3">Recommended Restaurants</h3>
                <div className="space-y-4">
                  {[
                    { name: "Local Favorite", rating: 4.8, price: "$$$", type: "Fine Dining", note: "Romantic atmosphere" },
                    { name: "Hidden Gem", rating: 4.6, price: "$$", type: "Casual", note: "Authentic local cuisine" },
                    { name: "Street Food Market", rating: 4.4, price: "$", type: "Street Food", note: "Vibrant atmosphere" }
                  ].map((restaurant, index) => (
                    <div key={index} className="border border-neutral-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-neutral-900">{restaurant.name}</h4>
                        <div className="text-right">
                          <div className="flex items-center">
                            <span className="text-yellow-400">{''.repeat(Math.floor(restaurant.rating))}</span>
                            <span className="text-sm text-neutral-600 ml-1">{restaurant.rating}</span>
                          </div>
                          <span className="text-sm text-neutral-500">{restaurant.price}</span>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-600 mb-2">{restaurant.type} • {restaurant.note}</p>
                      <Button className="text-sm text-accent-secondary hover:text-blue-800">View on map →</Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium text-neutral-900 mb-3">Food Markets & Shopping</h3>
                <p className="text-neutral-700 mb-4">
                  Don&apos;t miss these vibrant markets where you can experience the local food culture firsthand
                  and pick up unique ingredients to take home.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-neutral-900 mb-2">Central Market</h4>
                    <p className="text-sm text-neutral-600 mb-2">Historic market with local vendors</p>
                    <p className="text-sm text-semantic-success">Open daily 6am-6pm</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-neutral-900 mb-2">Night Market</h4>
                    <p className="text-sm text-neutral-600 mb-2">Evening street food paradise</p>
                    <p className="text-sm text-semantic-success">Open Wed-Sun 5pm-11pm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Dining Etiquette</h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>• Wait for the host to start eating</li>
              <li>• Use chopsticks properly if provided</li>
              <li>• Try to finish everything on your plate</li>
              <li>• Tipping customs vary by establishment</li>
              <li>• Learn basic phrases in local language</li>
            </ul>
          </div>

          <div className="bg-background rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Dietary Considerations</h3>
            <ul className="space-y-2 text-sm text-neutral-600">
              <li>• Common allergens: shellfish, nuts</li>
              <li>• Vegetarian options available at most places</li>
              <li>• Halal certification at select restaurants</li>
              <li>• Gluten-free alternatives becoming more common</li>
              <li>• Spice levels can be adjusted upon request</li>
            </ul>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Cooking Class Recommendation</h3>
          <p className="text-blue-800 mb-4">
            Take your culinary journey further with a hands-on cooking class. Learn to prepare traditional
            dishes with local ingredients and techniques passed down through generations.
          </p>
          <Button className="bg-accent-secondary text-primary-foreground px-6 py-3 rounded-md hover:bg-accent-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 font-medium">
            Find Cooking Classes
          </Button>
        </div>
      </div>
    </div>
  )
}
